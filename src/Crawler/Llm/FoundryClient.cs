using Azure.AI.OpenAI;
using Azure.AI.OpenAI.Chat;
using Azure.Core;
using Azure.Identity;
using OpenAI.Chat;
using System.ClientModel;
using System.Text.Json;

namespace Crawler.Llm
{
  public class FoundryClient : ILlmClient
  {
    private readonly ChatClient _chatClient;

    // Keep signature for compatibility; apiKey is no longer used when key auth is disabled.
    public FoundryClient(string model, string endpoint, string apiKey)
      : this(model, endpoint, credential: null)
    {
    }

    // New ctor for explicit credential injection (tests, custom auth, etc.)
    public FoundryClient(string model, string endpoint, TokenCredential? credential)
    {
      TokenCredential cred = new DefaultAzureCredential(new DefaultAzureCredentialOptions
      {
        ExcludeVisualStudioCredential = true,
        ExcludeVisualStudioCodeCredential = true,

        // optional: if you’re in a multi-tenant setup, keep this:
        AdditionallyAllowedTenants = { "*" }
      });

      AzureOpenAIClient azureClient = new(
          new Uri(endpoint),
          cred);

      _chatClient = azureClient.GetChatClient(model);
    }

    public async Task<(LlmOutput, int)> SummarizeAsync(string title, string url, string plainText)
    {
      // 1) Try JSON Schema first
      var (ok, text, status, error) = await PostAsync(ChatResponseFormatEnum.JsonSchemaFormat, title, url, plainText);
      int llmCalls = 1;

      // 2) If schema isn't supported (400), fallback to JSON object mode + strict instruction
      if (!ok && status == 400 && IsSchemaUnsupported(error))
      {
        (ok, text, status, error) = await PostAsync(ChatResponseFormatEnum.JsonObjectFormat, title, url, plainText);
        llmCalls++;
      }

      if (!ok)
        throw new HttpRequestException($"Azure OpenAI API error {status}: {error}");

      return (ParseStrictJson(text ?? "{}"), llmCalls);
    }

    private async Task<(bool ok, string text, int status, string error)> PostAsync(ChatResponseFormatEnum fmt, string title, string url, string plainText)
    {
      // Support for this recently-launched model with MaxOutputTokenCount parameter requires
      // Azure.AI.OpenAI 2.2.0-beta.4 and SetNewMaxCompletionTokensPropertyEnabled
      var requestOptions = new ChatCompletionOptions()
      {
        MaxOutputTokenCount = 10000,
        ResponseFormat = fmt == ChatResponseFormatEnum.JsonObjectFormat
          ? ChatResponseFormat.CreateJsonObjectFormat()
          : ChatResponseFormat.CreateJsonSchemaFormat("summary_schema", BinaryData.FromObjectAsJson(new
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
        new SystemChatMessage(fmt == ChatResponseFormatEnum.JsonObjectFormat
          ? "You are a structured output generator. " +
            "Always respond with a valid JSON object only. " +
            "The JSON must have exactly this shape: { \"summary\": string, \"bullets\": string[], \"tags\": string[] }. " +
            "No extra keys and no prose outside the JSON."
          : "You summarize tech release notes and changelogs. Be factual, concise, and specific. No marketing language."),
        new UserChatMessage(Prompts.Build(title, url, plainText)),
      };

      try
      {
        var response = await _chatClient.CompleteChatAsync(messages, requestOptions);
        return (true, response.Value.Content[0].Text, 200, "");
      }
      catch (ClientResultException e)
      {
        var details = e.ToString();
        return (false, details, e.Status, ExtractError(details));
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
