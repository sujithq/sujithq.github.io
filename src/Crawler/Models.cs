using System.Text.Json.Serialization;

namespace Crawler;

// Options-bound models must have parameterless constructors and settable properties
public class AppConfig
{
    public string timeframe { get; set; } = "monthly";
    public OutputConfig output { get; set; } = new();
    public StateConfig state { get; set; } = new();
    public FetchConfig fetch { get; set; } = new();
    public LlmConfig llm { get; set; } = new();
    public FeedsConfig feeds { get; set; } = new();
}

public class OutputConfig
{
    public string dataFile { get; set; } = "data/items.jsonl";
    public string contentDir { get; set; } = "content/updates2";
}

public class StateConfig
{
    public string processedFile { get; set; } = "state/processed.json";
}

public class FetchConfig
{
    public int timeoutSeconds { get; set; } = 20;
    public string userAgent { get; set; } = "rss-crawler/1.0";
    public int maxAgeDays { get; set; } = 7;
}

public class LlmConfig
{
    public string provider { get; set; } = "github";
    public string model { get; set; } = string.Empty;
    public int maxCallsPerRun { get; set; } = 80;
    public int minCharsToSummarize { get; set; } = 500;
    public int initialDelaySeconds { get; set; } = 2;
    public LlmProviderConfig? openai { get; set; }
    public LlmProviderConfig? github { get; set; }
    public LlmProviderConfig? foundry { get; set; }
}

public class LlmProviderConfig
{
    public string model { get; set; } = string.Empty;
    public string tokenKey { get; set; } = string.Empty;
    public string? baseUrl { get; set; }
    public int requestsPerWindow { get; set; } = 3;
    public int windowSeconds { get; set; } = 60;
    public int initialDelaySeconds { get; set; } = 2;

    public LlmProviderConfig() { }
    public LlmProviderConfig(string model, string? baseUrl, int requestsPerWindow, int windowSeconds, int initialDelaySeconds, string tokenKey)
    {
        this.model = model;
        this.baseUrl = baseUrl;
        this.requestsPerWindow = requestsPerWindow;
        this.windowSeconds = windowSeconds;
        this.initialDelaySeconds = initialDelaySeconds;
        this.tokenKey = tokenKey;
  }
}

public class FeedsConfig
{
    public string dataFile { get; set; } = "feed-config/feeds.json";
}

public class ProcessedState
{
    public HashSet<string> SeenIds { get; set; } = new();
    public Dictionary<string, string> ContentHashById { get; set; } = new(); // itemId -> hash(content)

    public static ProcessedState Empty() => new();
}

public class FeedEntry
{
    public string Name { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
}

public class LlmOutput
{
    public string Summary { get; set; } = string.Empty;
    public List<string> Bullets { get; set; } = new();
    public List<string> Tags { get; set; } = new();

    public LlmOutput() { }
    public LlmOutput(string Summary, List<string> Bullets, List<string> Tags)
    {
        this.Summary = Summary;
        this.Bullets = Bullets;
        this.Tags = Tags;
    }
}

public class DataRow
{
    public string id { get; set; } = string.Empty;
    public string title { get; set; } = string.Empty;
    public string link { get; set; } = string.Empty;
    public string source { get; set; } = string.Empty;
    public string category { get; set; } = string.Empty;
    public string timeframeKey { get; set; } = string.Empty;
    public DateTimeOffset? published { get; set; }
    public string contentHash { get; set; } = string.Empty;
    public LlmOutput llm { get; set; } = new();

    public DataRow() { }
    public DataRow(string id, string title, string link, string source, string category, string timeframeKey, DateTimeOffset? published, string contentHash, LlmOutput llm)
    {
        this.id = id;
        this.title = title;
        this.link = link;
        this.source = source;
        this.category = category;
        this.timeframeKey = timeframeKey;
        this.published = published;
        this.contentHash = contentHash;
        this.llm = llm;
    }
}
