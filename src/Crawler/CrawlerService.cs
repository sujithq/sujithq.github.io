using Crawler.Llm;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Net;
using System.Security.Cryptography;
using System.ServiceModel.Syndication;
using System.Text;
using System.Text.Json;
using System.Xml;

namespace Crawler;

public class CrawlerService
{
  private readonly ILogger<CrawlerService> _logger;
  private readonly AppConfig _app;
  private readonly IHtmlTextExtractor _extractor;
  private readonly ILlmClient _llm;
  private readonly LlmProviderConfig _llmProvider;

  public CrawlerService(
      ILogger<CrawlerService> logger,
      IOptions<AppConfig> appOptions,
      IHtmlTextExtractor extractor,
      ILlmClient llm,
      LlmProviderConfig llmProviderConfig)
  {
    _logger = logger;
    _app = appOptions.Value;
    _extractor = extractor;
    _llm = llm;
    _llmProvider = llmProviderConfig;
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
    _logger.LogInformation("Loaded {Count} feeds", feeds.Count);

    var state = await LoadState(processedFile);

    _logger.LogInformation("LLM client ready. provider={Provider} maxCallsPerRun={Max} delay={Delay}s",
      _app.llm.provider, _app.llm.maxCallsPerRun, _llmProvider.initialDelaySeconds);

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
      SyndicationFeed? feed;
      try
      {
        using (var reader = XmlReader.Create(f.Url))
          feed = SyndicationFeed.Load(reader);

      }
      catch (HttpRequestException e)
      {
        if (e.StatusCode == HttpStatusCode.TooManyRequests)
        {
          _logger.LogWarning("Too many requests for: {Url}", f.Url);
          break;
        }
        throw;
      }

      if (feed == null)
      {
        _logger.LogWarning("Feed returned null: {Url}", f.Url);
        continue;
      }

      var cutoff = DateTimeOffset.UtcNow.AddDays(-Math.Abs(_app.fetch.maxAgeDays));
      foreach (var item in feed.Items.Where(i =>
          (i.PublishDate != default && i.PublishDate >= cutoff) ||
          (i.PublishDate == default && i.LastUpdatedTime >= cutoff)))
      {
        _logger.LogDebug("Item candidate: {Title} ({Link})", item.Title?.Text, item.Links.FirstOrDefault()?.Uri?.ToString());
        var id = CanonicalId(item, f);
        if (state.SeenIds.Contains(id)) continue;

        var title = item.Title?.Text?.Trim() ?? "(untitled)";
        var link = item.Links.FirstOrDefault()?.Uri?.ToString() ?? "";
        var published = item.PublishDate != default ? item.PublishDate : item.LastUpdatedTime;

        var raw = item.Summary?.Text;
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
        if (llmCalls >= _app.llm.maxCallsPerRun)
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
}
