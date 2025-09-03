using Azure;
using Azure.AI.OpenAI;
using Azure.AI.OpenAI.Chat;
using OpenAI.Chat;
using System.ClientModel;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using static System.Net.WebRequestMethods;

public class OpenAiClient : ILlmClient
{
  private readonly string _model;

  public OpenAiClient(string model, string? apiKey)
  {
    throw new NotImplementedException();
  }

  public async Task<LlmOutput> SummarizeAsync(string title, string url, string plainText)
  {
    throw new NotImplementedException();
  }

  //private static LlmOutput ParseStrictJson(string content)
  //{
  //  using var doc = JsonDocument.Parse(content);
  //  var root = doc.RootElement;
  //  var summary = root.GetProperty("summary").GetString() ?? "";
  //  var bullets = root.GetProperty("bullets").EnumerateArray().Select(e => e.GetString() ?? "").ToList();
  //  var tags = root.GetProperty("tags").EnumerateArray().Select(e => e.GetString() ?? "").ToList();
  //  return new LlmOutput(summary, bullets, tags);
  //}
}


public enum ChatResponseFormatEnum
{
  JsonSchemaFormat,
  JsonObjectFormat
}
