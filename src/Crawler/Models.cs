using System.Text.Json.Serialization;

public record FeedEntry(string Name, string Url, string Category);

public record AppConfig(
    string timeframe,
    OutputConfig output,
    StateConfig state,
    FetchConfig fetch,
    LlmConfig llm,
    FeedsConfig feeds
);
public record OutputConfig(string dataFile, string contentDir);
public record FeedsConfig(string dataFile);
public record StateConfig(string processedFile);
public record FetchConfig(int timeoutSeconds, string userAgent, int maxAgeDays);
public record LlmConfig(
    string provider,
    string model,
    int maxCallsPerRun,
    int minCharsToSummarize,
    int requestsPerWindow,
    int windowSeconds,
    int initialDelaySeconds,
    string? endpoint = null,
    string? deploymentName = null
);

public record ProcessedState(
    HashSet<string> SeenIds,
    Dictionary<string,string> ContentHashById // itemId -> hash(content)
)
{
    public static ProcessedState Empty() => new(new(), new());
}

public record RawItem(
    string Id,
    string Title,
    string Link,
    DateTimeOffset? Published,
    string SourceName,
    string Category,
    string RawDescriptionOrContent
);

public record LlmOutput(
    string Summary,
    List<string> Bullets,
    List<string> Tags
);

public record DataRow(
    string id,
    string title,
    string link,
    string source,
    string category,
    string timeframeKey,           // e.g., "2025-08" for monthly
    DateTimeOffset? published,
    string contentHash,
    LlmOutput llm
);
