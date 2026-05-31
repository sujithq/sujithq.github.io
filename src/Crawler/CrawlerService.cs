using Crawler.Llm;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Net;
using System.Security.Cryptography;
using System.ServiceModel.Syndication;
using System.Text;
using System.Text.Json;
using System.Globalization;
using System.Xml;

namespace Crawler;

public class CrawlerService
{
  private readonly ILogger<CrawlerService> _logger;
  private readonly AppConfig _app;
  private readonly IHtmlTextExtractor _extractor;
  private readonly ILlmClient _llm;
  private readonly LlmProviderConfig _llmProvider;
  private readonly HttpClient _http;

  public CrawlerService(
      ILogger<CrawlerService> logger,
      IOptions<AppConfig> appOptions,
      IHtmlTextExtractor extractor,
      ILlmClient llm,
      LlmProviderConfig llmProviderConfig,
      IHttpClientFactory httpClientFactory)
  {
    _logger = logger;
    _app = appOptions.Value;
    _extractor = extractor;
    _llm = llm;
    _llmProvider = llmProviderConfig;
    _http = httpClientFactory.CreateClient("crawler");
  }

  public async Task<int> RunAsync(bool verbose)
  {
    _logger.LogInformation("Crawler start. provider={Provider} timeframe={Timeframe}", _app.llm.provider, _app.timeframe);

    string ResolvePath(string baseDir, string path)
        => Path.IsPathRooted(path) ? path : Path.Combine(baseDir, path);

    var baseDir = AppContext.BaseDirectory;
    var dataFile = ResolvePath(baseDir, _app.output.dataFile);
    var processedFile = ResolvePath(baseDir, _app.state.processedFile);
    var contentDir = ResolvePath(baseDir, _app.output.contentDir);
    var feedsFile = ResolvePath(baseDir, _app.feeds.dataFile);


    _logger.LogDebug("Resolved paths: dataFile={Data} processedFile={Processed} contentDir={Content} feedsFile={Feeds}", dataFile, processedFile, contentDir, feedsFile);

    var feeds = await LoadFeeds(feedsFile);
    _logger.LogDebug("Loaded {Count} feeds", feeds.Count);

    var state = await LoadState(processedFile);

    var maxCalls = _llmProvider.maxCallsPerRun > 0 ? _llmProvider.maxCallsPerRun : _app.llm.maxCallsPerRun;
    _logger.LogDebug("LLM client ready. provider={Provider} maxCallsPerRun={Max} delay={Delay}s (providerOverride={Override})",
      _app.llm.provider, maxCalls, _llmProvider.initialDelaySeconds, _llmProvider.maxCallsPerRun > 0);

    var newRows = new List<DataRow>();
  int llmCalls = 0;

    var initialDelay = TimeSpan.FromSeconds(Math.Max(0, _llmProvider.initialDelaySeconds));

    if (initialDelay > TimeSpan.Zero)
    {
      _logger.LogDebug("Initial delay {Delay}s before LLM calls", initialDelay.TotalSeconds);
      await Task.Delay(initialDelay);
    }

    foreach (var f in feeds)
    {


      _logger.LogInformation("Processing feed: {Url}", f.Url);
      List<SyndicationItem> feedItems;
      try
      {
        feedItems = await LoadFeedItemsAsync(f);
      }
      catch (HttpRequestException e)
      {
        if (e.StatusCode == HttpStatusCode.TooManyRequests)
        {
          _logger.LogWarning("Too many requests for: {Url}", f.Url);
          continue;
        }
        if (e.StatusCode == HttpStatusCode.Forbidden)
        {
          _logger.LogWarning("Forbidden (403) for: {Url}", f.Url);
          continue;
        }
        throw;
      }
      catch (InvalidDataException e)
      {
        _logger.LogWarning(e, "Skipping unparseable feed: {Url}", f.Url);
        continue;
      }
      catch (XmlException e)
      {
        _logger.LogWarning(e, "Skipping invalid XML feed payload: {Url}", f.Url);
        continue;
      }
      catch (JsonException e)
      {
        _logger.LogWarning(e, "Skipping invalid JSON feed payload: {Url}", f.Url);
        continue;
      }

      if (feedItems.Count == 0)
      {
        _logger.LogWarning("Feed returned no items: {Url}", f.Url);
        continue;
      }

      var cutoff = DateTimeOffset.UtcNow.AddDays(-Math.Abs(_app.fetch.maxAgeDays));
      var items = feedItems.Where(i => (i.PublishDate != default && i.PublishDate >= cutoff) ||
                                       (i.LastUpdatedTime != default && i.LastUpdatedTime >= cutoff))
                           .OrderByDescending(i => i.PublishDate != default ? i.PublishDate : i.LastUpdatedTime);
      foreach (var item in items)
      {
        _logger.LogDebug("Item candidate: {Title} ({Link})", item.Title?.Text, item.Links.FirstOrDefault()?.Uri?.ToString());
        var id = CanonicalId(item, f);
        if (state.SeenIds.Contains(id)) continue;

        var title = item.Title?.Text?.Trim() ?? "(untitled)";
        var link = item.Links.FirstOrDefault()?.Uri?.ToString() ?? "";
        var published = item.PublishDate != default ? item.PublishDate : item.LastUpdatedTime;

        var raw = item.Summary?.Text?? (item.Content as TextSyndicationContent)?.Text;
        string text;
        if (!string.IsNullOrWhiteSpace(raw))
          text = _extractor.StripHtml(raw!);
        else if (!string.IsNullOrWhiteSpace(link))
          text = await _extractor.FetchAndExtractAsync(link);
        else
          text = "";

        var contentHash = Hash(text);

        if (state.ContentHashById.TryGetValue(id, out var oldHash) && oldHash == contentHash)
        {
          _logger.LogDebug("Skip unchanged: {Id}", id);
          state.SeenIds.Add(id);
          continue;
        }

        LlmOutput llmOut;
        int calls = 0;
  if (llmCalls >= maxCalls)
        {
          _logger.LogDebug("Budget skip LLM (calls so far: {Calls})", llmCalls);
          //llmOut = new LlmOutput(
          //    Summary: text.Length == 0 ? "(no content)" : (text.Length > 280 ? text[..280] + "..." : text),
          //    Bullets: new() { "short item", "low-content or budget-skipped" },
          //    Tags: new() { f.Category.ToLowerInvariant() }
          //);
          break;
        }
        else
        {
          (llmOut, calls) = await _llm.SummarizeAsync(title, link, text);
          _logger.LogDebug("LLM summarized: {Id}", id);
          llmCalls += calls;
        }

        var tfKey = MarkdownBuilder.TimeframeKey(published == default ? DateTimeOffset.UtcNow : published, _app.timeframe);

        var row = new DataRow(
            id, title, link, f.Name, f.Category, tfKey, published, contentHash, llmOut
        );

        await AppendJsonl(dataFile, row);
        newRows.Add(row);

        state.SeenIds.Add(id);
        state.ContentHashById[id] = contentHash;
        Thread.Sleep(1000);
      }
    }

    //var all = await ReadJsonl(dataFile);
    //var groups = all.GroupBy(r => (r.category, r.timeframeKey));
    //foreach (var g in groups)
    //{
    //  var (category, tfKey) = g.Key;
    //  var dir = Path.Combine(contentDir, category.ToLowerInvariant());
    //  Directory.CreateDirectory(dir);
    //  var file = Path.Combine(dir, $"{tfKey}.md");
    //  var md = MarkdownBuilder.BuildCategoryPage(category, tfKey, g);
    //  await File.WriteAllTextAsync(file, md, Encoding.UTF8);
    //  _logger.LogInformation("Wrote markdown: {File}", file);
    //}

    await SaveState(processedFile, state);
    _logger.LogInformation("Done. New rows: {Count} Total LLM calls: {Calls}", newRows.Count, llmCalls);
    return 0;
  }

  static string CanonicalId(SyndicationItem item, FeedEntry f)
  {
    var baseId = item.Id;
    if (string.IsNullOrWhiteSpace(baseId))
      baseId = item.Links.FirstOrDefault()?.Uri?.ToString() ?? (item.Title?.Text ?? Guid.NewGuid().ToString());
    var s = $"{f.Name}|{f.Url}|{baseId}".ToLowerInvariant();
    return Hash(s);
  }

  static string Hash(string s)
  {
    using var sha = SHA256.Create();
    var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(s));
    return Convert.ToHexString(bytes);
  }

  static async Task AppendJsonl(string path, DataRow row)
  {
    var json = JsonSerializer.Serialize(row);
    await File.AppendAllTextAsync(path, json + Environment.NewLine, Encoding.UTF8);
  }

  static async Task<List<DataRow>> ReadJsonl(string path)
  {
    var list = new List<DataRow>();
    if (!File.Exists(path)) return list;
    foreach (var line in await File.ReadAllLinesAsync(path))
    {
      if (string.IsNullOrWhiteSpace(line)) continue;
      var r = JsonSerializer.Deserialize<DataRow>(line);
      if (r != null) list.Add(r);
    }
    return list;
  }

  static async Task<ProcessedState> LoadState(string path)
  {
    if (!File.Exists(path)) return ProcessedState.Empty();
    var json = await File.ReadAllTextAsync(path);
    return JsonSerializer.Deserialize<ProcessedState>(json) ?? ProcessedState.Empty();
  }

  static async Task<List<FeedEntry>> LoadFeeds(string path)
  {
    if (!File.Exists(path)) return [];
    var json = await File.ReadAllTextAsync(path);
    return JsonSerializer.Deserialize<List<FeedEntry>>(json) ?? [];
  }

  static async Task SaveState(string path, ProcessedState st)
  {
    var json = JsonSerializer.Serialize(st, new JsonSerializerOptions { WriteIndented = true });
    await File.WriteAllTextAsync(path, json, Encoding.UTF8);
  }

  async Task<List<SyndicationItem>> LoadFeedItemsAsync(FeedEntry feedEntry)
  {
    using var response = await _http.GetAsync(feedEntry.Url);
    response.EnsureSuccessStatusCode();

    var payload = await response.Content.ReadAsStringAsync();
    if (string.IsNullOrWhiteSpace(payload))
      return [];

    if (LooksLikeJson(payload))
      return ParseJsonFeed(payload, feedEntry.Url);

    return ParseXmlFeed(payload, feedEntry.Url);
  }

  static bool LooksLikeJson(string payload)
  {
    var trimmed = payload.AsSpan().TrimStart();
    if (trimmed.IsEmpty) return false;
    return trimmed[0] == '{' || trimmed[0] == '[';
  }

  static List<SyndicationItem> ParseXmlFeed(string payload, string feedUrl)
  {
    using var stringReader = new StringReader(payload);
    using var reader = XmlReader.Create(stringReader);
    var feed = SyndicationFeed.Load(reader);
    if (feed == null)
    {
      throw new InvalidDataException($"Unable to parse feed payload as XML: {feedUrl}");
    }
    return feed.Items.ToList();
  }

  static List<SyndicationItem> ParseJsonFeed(string payload, string feedUrl)
  {
    using var doc = JsonDocument.Parse(payload);
    var root = doc.RootElement;
    if (root.ValueKind != JsonValueKind.Object ||
        !root.TryGetProperty("items", out var itemsElement) ||
        itemsElement.ValueKind != JsonValueKind.Array)
    {
      throw new InvalidDataException($"Unable to parse feed payload as JSON Feed: {feedUrl}");
    }

    var items = new List<SyndicationItem>();
    foreach (var itemElement in itemsElement.EnumerateArray())
    {
      if (itemElement.ValueKind != JsonValueKind.Object) continue;

      var title = TryGetString(itemElement, "title") ?? "(untitled)";
      var link = TryGetString(itemElement, "url") ?? TryGetString(itemElement, "external_url");
      var id = TryGetString(itemElement, "id");
      var datePublished = ParseDate(TryGetString(itemElement, "date_published"));
      var dateModified = ParseDate(TryGetString(itemElement, "date_modified"));

      var summaryHtml = TryGetString(itemElement, "content_html");
      var summaryText = TryGetString(itemElement, "content_text") ?? TryGetString(itemElement, "summary");
      var summary = summaryHtml ?? summaryText ?? string.Empty;

      Uri? uri = null;
      if (!string.IsNullOrWhiteSpace(link) && Uri.TryCreate(link, UriKind.Absolute, out var parsed))
      {
        uri = parsed;
      }

      var item = new SyndicationItem(title, summary, uri);
      if (!string.IsNullOrWhiteSpace(id)) item.Id = id;
      if (datePublished != default) item.PublishDate = datePublished;
      if (dateModified != default) item.LastUpdatedTime = dateModified;
      if (!string.IsNullOrWhiteSpace(summary))
      {
        item.Summary = summaryHtml != null
          ? SyndicationContent.CreateHtmlContent(summary)
          : SyndicationContent.CreatePlaintextContent(summary);
      }

      items.Add(item);
    }

    return items;
  }

  static string? TryGetString(JsonElement element, string propertyName)
  {
    if (!element.TryGetProperty(propertyName, out var value)) return null;
    return value.ValueKind == JsonValueKind.String ? value.GetString() : null;
  }

  static DateTimeOffset ParseDate(string? dateValue)
  {
    if (string.IsNullOrWhiteSpace(dateValue)) return default;
    return DateTimeOffset.TryParse(dateValue, CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind, out var parsed)
      ? parsed
      : default;
  }
}
