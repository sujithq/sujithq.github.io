namespace Crawler.Llm;

public class OpenAiClient : ILlmClient
{
  private readonly string _model;
  private readonly string? _apiKey;

  public OpenAiClient(string model, string? apiKey)
  {
    _model = model;
    _apiKey = apiKey;
  }

  public Task<(LlmOutput, int)> SummarizeAsync(string title, string url, string plainText)
  {
    // Intentionally not implemented yet. Wire-up exists for future support.
    throw new NotImplementedException("OpenAiClient is not implemented yet.");
  }
}
