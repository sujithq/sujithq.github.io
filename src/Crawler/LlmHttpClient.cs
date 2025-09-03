using System.Net.Http;

namespace Crawler.Llm;

public interface ILlmHttpClient
{
    HttpClient Client { get; }
}

public class LlmHttpClient : ILlmHttpClient
{
    public HttpClient Client { get; }
    public LlmHttpClient(HttpClient client)
    {
        Client = client;
    }
}
