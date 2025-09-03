using Crawler;

namespace Crawler.Llm;

public interface ILlmClient
{
    Task<LlmOutput> SummarizeAsync(string title, string url, string plainText);
}

public static class Prompts
{
    public static string Build(string title, string url, string content) =>
    $@"Article title: {title}
URL: {url}

Content:
""""""
{content}
""""""
";
}
