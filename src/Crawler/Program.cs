using System.ServiceModel.Syndication;
using System.Xml;
using System.Text;
using System.Text.Json;
using System.Security.Cryptography;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

class Program
{
    static async Task<int> Main(string[] args)
    {
        var verbose = args.Any(a => string.Equals(a, "--verbose", StringComparison.OrdinalIgnoreCase) || a == "-v");
        using var loggerFactory = LoggerFactory.Create(builder =>
        {
            builder
                .SetMinimumLevel(verbose ? LogLevel.Debug : LogLevel.Information)
                .AddSimpleConsole(o => { o.SingleLine = true; o.TimestampFormat = "HH:mm:ss "; });
        });
        var logger = loggerFactory.CreateLogger<Program>();

        var baseDir = AppContext.BaseDirectory; // points to bin/<Config>/<TFM>/
        var appSettingsPath = Path.Combine(baseDir, "appsettings.json");
        if (!File.Exists(appSettingsPath))
            throw new FileNotFoundException($"appsettings.json not found in output directory: {appSettingsPath}");

        var app = JsonSerializer.Deserialize<AppConfig>(
            await File.ReadAllTextAsync(appSettingsPath))
            ?? throw new Exception("Invalid or empty appsettings.json");

        // Build configuration to source secrets in this order: env vars -> user secrets -> appsettings
        var configuration = new ConfigurationBuilder()
            .SetBasePath(baseDir)
            .AddJsonFile("appsettings.json", optional: true, reloadOnChange: false)
            .AddUserSecrets<Program>(optional: true)
            .AddEnvironmentVariables()
            .Build();

        logger.LogInformation("Crawler start. provider={Provider} model={Model} timeframe={Timeframe}", app.llm.provider, app.llm.model, app.timeframe);



        static string ResolvePath(string baseDir, string path)
            => Path.IsPathRooted(path) ? path : Path.Combine(baseDir, path);

        var dataFile = ResolvePath(baseDir, app.output.dataFile);
        var processedFile = ResolvePath(baseDir, app.state.processedFile);
        var contentDir = ResolvePath(baseDir, app.output.contentDir);
        var feedsFile = ResolvePath(baseDir, app.feeds.dataFile);

        logger.LogDebug("Resolved paths: dataFile={Data} processedFile={Processed} contentDir={Content} feedsFile={Feeds}", dataFile, processedFile, contentDir, feedsFile);

        var feeds = await LoadFeeds(feedsFile);
        logger.LogInformation("Loaded {Count} feeds", feeds.Count);

        var state = await LoadState(processedFile);
        var http = new HttpClient
        {
            Timeout = TimeSpan.FromSeconds(app.fetch.timeoutSeconds)
        };
        http.DefaultRequestHeaders.UserAgent.ParseAdd(app.fetch.userAgent);
        logger.LogDebug("HTTP UA set. timeoutSeconds={Timeout}", app.fetch.timeoutSeconds);

        var githubToken = configuration["MODELS_TOKEN"]
            ?? configuration["llm:githubToken"]
            ?? configuration["llm:token"];
        var openAiKey = configuration["OPENAI_API_KEY"]
            ?? configuration["llm:openAiApiKey"]
            ?? configuration["llm:openaiApiKey"];

        ILlmClient llm = app.llm.provider.ToLowerInvariant() switch
        {
            "openai" => new OpenAiClient(app.llm.model, new HttpClient(), openAiKey),
            _ => new GithubModelsClient(app.llm.model, new HttpClient(), githubToken)
        };
        logger.LogInformation("LLM client ready. provider={Provider} maxCallsPerRun={Max} rate={Req}/{Win}s delay={Delay}s",
            app.llm.provider, app.llm.maxCallsPerRun, app.llm.requestsPerWindow, app.llm.windowSeconds, app.llm.initialDelaySeconds);

        var newRows = new List<DataRow>();
        int llmCalls = 0;

        // Rate limiter state
        var recentCalls = new Queue<DateTimeOffset>();
        var maxReq = Math.Max(1, app.llm.requestsPerWindow);
        var window = TimeSpan.FromSeconds(Math.Max(1, app.llm.windowSeconds));
        var initialDelay = TimeSpan.FromSeconds(Math.Max(0, app.llm.initialDelaySeconds));
        if (initialDelay > TimeSpan.Zero)
        {
            logger.LogDebug("Initial delay {Delay}s before LLM calls", initialDelay.TotalSeconds);
            await Task.Delay(initialDelay);
        }

        async Task ThrottleAsync()
        {
            var now = DateTimeOffset.UtcNow;
            // Drop calls outside the window
            while (recentCalls.Count > 0 && now - recentCalls.Peek() >= window)
                recentCalls.Dequeue();
            if (recentCalls.Count >= maxReq)
            {
                var wait = window - (now - recentCalls.Peek());
                if (wait > TimeSpan.Zero)
                {
                    logger.LogDebug("Rate limit reached. Waiting {Seconds}s", Math.Ceiling(wait.TotalSeconds));
                    await Task.Delay(wait);
                }
                // re-evaluate after waiting
                now = DateTimeOffset.UtcNow;
                while (recentCalls.Count > 0 && now - recentCalls.Peek() >= window)
                    recentCalls.Dequeue();
            }
            recentCalls.Enqueue(DateTimeOffset.UtcNow);
        }


        foreach (var f in feeds)
        {
            SyndicationFeed? feed;
            using (var reader = XmlReader.Create(f.Url))
                feed = SyndicationFeed.Load(reader);

            if (feed == null)
            {
                logger.LogWarning("Feed returned null: {Url}", f.Url);
                continue;
            }


            var cutoff = DateTimeOffset.UtcNow.AddDays(-Math.Abs(app.fetch.maxAgeDays));
            foreach (var item in feed.Items.Where(i =>
                (i.PublishDate != default && i.PublishDate >= cutoff) ||
                (i.PublishDate == default && i.LastUpdatedTime >= cutoff)))
            {
                logger.LogDebug("Item candidate: {Title} ({Link})", item.Title?.Text, item.Links.FirstOrDefault()?.Uri?.ToString());
                var id = CanonicalId(item, f);
                if (state.SeenIds.Contains(id)) continue;

                var title = item.Title?.Text?.Trim() ?? "(untitled)";
                var link = item.Links.FirstOrDefault()?.Uri?.ToString() ?? "";
                var published = item.PublishDate != default ? item.PublishDate : item.LastUpdatedTime;

                // Prefer the <description> / summary if present, else fetch article and strip HTML
                var raw = item.Summary?.Text;
                string text;
                if (!string.IsNullOrWhiteSpace(raw))
                    text = HtmlTextExtractor.StripHtml(raw!);
                else if (!string.IsNullOrWhiteSpace(link))
                    text = await HtmlTextExtractor.FetchAndExtractAsync(http, link);
                else
                    text = "";

                var contentHash = Hash(text);

                // If we've seen the same id with identical content hash before, skip
                if (state.ContentHashById.TryGetValue(id, out var oldHash) && oldHash == contentHash)
                {
                    logger.LogDebug("Skip unchanged: {Id}", id);
                    state.SeenIds.Add(id);
                    continue;
                }

                // Guardrails to save tokens
                LlmOutput llmOut;
                if (llmCalls >= app.llm.maxCallsPerRun)
                {
                    logger.LogDebug("Budget skip LLM (calls so far: {Calls})", llmCalls);
                    llmOut = new LlmOutput(
                        Summary: text.Length == 0 ? "(no content)" : (text.Length > 280 ? text[..280] + "..." : text),
                        Bullets: new() { "short item", "low-content or budget-skipped" },
                        Tags: new() { f.Category.ToLowerInvariant() }
                    );
                }
                else
                {
                    await ThrottleAsync();
                    llmOut = await llm.SummarizeAsync(title, link, text);
                    logger.LogDebug("LLM summarized: {Id}", id);
                    llmCalls++;
                }

                var tfKey = MarkdownBuilder.TimeframeKey(published == default ? DateTimeOffset.UtcNow : published, app.timeframe);

                var row = new DataRow(
                    id, title, link, f.Name, f.Category, tfKey, published, contentHash, llmOut
                );

                await AppendJsonl(dataFile, row);
                newRows.Add(row);

                // Update state
                state.SeenIds.Add(id);
                state.ContentHashById[id] = contentHash;
            }
        }

        // Generate per-category + timeframe markdown pages
        //if (newRows.Count > 0)
        {
            var all = await ReadJsonl(dataFile);
            var groups = all.GroupBy(r => (r.category, r.timeframeKey));
            foreach (var g in groups)
            {
                var (category, tfKey) = g.Key;
                var dir = Path.Combine(contentDir, category.ToLowerInvariant());
                Directory.CreateDirectory(dir);
                var file = Path.Combine(dir, $"{tfKey}.md");
                var md = MarkdownBuilder.BuildCategoryPage(category, tfKey, g);
                await File.WriteAllTextAsync(file, md, Encoding.UTF8);
                logger.LogInformation("Wrote markdown: {File}", file);
            }
        }

        await SaveState(processedFile, state);
        logger.LogInformation("Done. New rows: {Count} Total LLM calls: {Calls}", newRows.Count, llmCalls);
        return 0;
    }

    static string CanonicalId(SyndicationItem item, FeedEntry f)
    {
        var baseId = item.Id;
        if (string.IsNullOrWhiteSpace(baseId))
            baseId = item.Links.FirstOrDefault()?.Uri?.ToString() ?? (item.Title?.Text ?? Guid.NewGuid().ToString());

        // include source + normalized link/title to reduce collisions
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
