using Azure;
using Azure.AI.OpenAI;
using OpenAI.Chat;
using System;
using System.ClientModel;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Crawler.Llm
{
  public class FoundryClient : ILlmClient
  {
    private readonly string _model;
    private readonly ChatClient _chatClient;

    public FoundryClient(string model, string endpoint, string? apiKey)
    {
      AzureOpenAIClient azureClient = new(
          new Uri(endpoint),
          new AzureKeyCredential(apiKey));
      _chatClient = azureClient.GetChatClient(model);
    }

    public async Task<LlmOutput> SummarizeAsync(string title, string url, string plainText)
    {



      // 1) Try JSON Schema first
      var (ok, text, status, error) = await PostAsync(ChatResponseFormatEnum.JsonObjectFormat, title, url, plainText);

      // 2) If schema isn't supported (400), fallback to JSON mode + strict instruction
      if (!ok && status == 400 && IsSchemaUnsupported(error))
      {
        var jsonBody = BuildJsonModeBody(title, url, plainText);
        (ok, text, status, error) = await PostAsync(ChatResponseFormatEnum.JsonSchemaFormat, title, url, plainText);
      }

      if (!ok)
        throw new HttpRequestException($"GitHub Models API error {status}: {error}");

      //using var doc = JsonDocument.Parse(text);
      //var contentStr = doc.RootElement
      //    .GetProperty("choices")[0]
      //    .GetProperty("message")
      //    .GetProperty("content")
      //    .GetString();

      return ParseStrictJson(text ?? "{}");
    }

    private object BuildSchemaBody(string title, string url, string plainText)
        => new
        {
          model = _model,
          messages = new object[]
            {
                new { role = "system", content = "You summarize tech release notes and changelogs. Be factual, concise, and specific. No marketing language." },
                new { role = "user", content = Prompts.Build(title, url, plainText) }
            },
          temperature = 0.2,
          max_tokens = 350,
          response_format = new
          {
            type = "json_schema",
            json_schema = new
            {
              name = "summary_schema",
              schema = new
              {
                type = "object",
                additionalProperties = false,
                required = new[] { "summary" },
                properties = new
                {
                  summary = new { type = "string", description = "1–2 sentences, crisp, no hype." },
                  bullets = new { type = "array", maxItems = 4, items = new { type = "string" } },
                  tags = new { type = "array", maxItems = 6, items = new { type = "string" } }
                }
              }
            }
          }
        };

    private object BuildJsonModeBody(string title, string url, string plainText)
        => new
        {
          model = _model,
          messages = new object[]
            {
                new { role = "system", content =
                    "You are a structured output generator. " +
                    "Always respond with a valid JSON object only. " +
                    "The JSON must have exactly this shape: { \"summary\": string, \"bullets\": string[], \"tags\": string[] }. " +
                    "No extra keys and no prose outside the JSON." },
                new { role = "user", content = Prompts.Build(title, url, plainText) }
            },
          //temperature = 0.2,
          //max_tokens = 350,
          response_format = new { type = "json_object" }
        };

    private async Task<(bool ok, string text, int status, string error)> PostAsync(ChatResponseFormatEnum fmt, string title, string url, string plainText)
    {

      // Support for this recently-launched model with MaxOutputTokenCount parameter requires
      // Azure.AI.OpenAI 2.2.0-beta.4 and SetNewMaxCompletionTokensPropertyEnabled
      var requestOptions = new ChatCompletionOptions()
      {
        MaxOutputTokenCount = 10000,
        ResponseFormat = fmt == ChatResponseFormatEnum.JsonObjectFormat ? ChatResponseFormat.CreateJsonObjectFormat() : ChatResponseFormat.CreateJsonSchemaFormat("summary_schema", BinaryData.FromObjectAsJson(new
        {
          type = "object",
          additionalProperties = false,
          required = new[] { "summary", "bullets", "tags" },
          properties = new
          {
            summary = new { type = "string", description = "1–2 sentences, crisp, no hype." },
            bullets = new
            {
              type = "array",
              maxItems = 4,
              items = new { type = "string" }
            },
            tags = new
            {
              type = "array",
              maxItems = 6,
              items = new { type = "string" }
            }
          }
        }))
      };

#pragma warning disable AOAI001
      requestOptions.SetNewMaxCompletionTokensPropertyEnabled(true);
#pragma warning restore AOAI001

      List<ChatMessage> messages = new List<ChatMessage>()
    {
        new SystemChatMessage(fmt == ChatResponseFormatEnum.JsonObjectFormat?"You are a structured output generator. " +
                        "Always respond with a valid JSON object only. " +
                        "The JSON must have exactly this shape: { \"summary\": string, \"bullets\": string[], \"tags\": string[] }. " +
                        "No extra keys and no prose outside the JSON.": "You summarize tech release notes and changelogs. Be factual, concise, and specific. No marketing language."),
        new UserChatMessage(Prompts.Build(title, url, plainText)),
    };

      try
      {
        var response = _chatClient.CompleteChat(messages, requestOptions);
        return (true, response.Value.Content[0].Text, 200, "");
      }
      catch (ClientResultException e)
      {
        return (false, e.ToString(), e.Status, ExtractError(e.Message));
      }

    }

    private static bool IsSchemaUnsupported(string error)
    {
      if (string.IsNullOrWhiteSpace(error)) return false;
      return error.Contains("response_format", StringComparison.OrdinalIgnoreCase)
          || error.Contains("json_schema", StringComparison.OrdinalIgnoreCase)
          || error.Contains("unsupported", StringComparison.OrdinalIgnoreCase)
          || error.Contains("not supported", StringComparison.OrdinalIgnoreCase)
          || error.Contains("Bad Request", StringComparison.OrdinalIgnoreCase);
    }

    private static string ExtractError(string body)
    {
      try
      {
        using var doc = JsonDocument.Parse(body);
        if (doc.RootElement.TryGetProperty("error", out var e))
        {
          if (e.TryGetProperty("message", out var m)) return m.GetString() ?? body;
          return e.ToString();
        }
      }
      catch { /* ignore parse errors */ }
      return body;
    }

    private static LlmOutput ParseStrictJson(string content)
    {
      using var doc = JsonDocument.Parse(string.IsNullOrWhiteSpace(content) ? "{}" : content);
      var root = doc.RootElement;

      string S(string name)
          => root.TryGetProperty(name, out var p) && p.ValueKind == JsonValueKind.String ? p.GetString() ?? "" : "";

      List<string> A(string name)
          => root.TryGetProperty(name, out var p) && p.ValueKind == JsonValueKind.Array
             ? p.EnumerateArray().Select(x => x.GetString() ?? "").ToList()
             : new List<string>();

      return new LlmOutput(S("summary"), A("bullets"), A("tags"));
    }
  }

}
