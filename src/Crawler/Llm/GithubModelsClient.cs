using System.Net.Http;
using System.Text;
using System.Text.Json;

public class GithubModelsClient : ILlmClient
{
    private readonly string _model;
    private readonly HttpClient _http;

    public GithubModelsClient(string model, HttpClient http, string? token)
    {
        _model = model;
        _http = http;
        _http.BaseAddress = new Uri("https://models.github.ai/inference/");
        _http.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token ?? "");
        _http.DefaultRequestHeaders.Add("Accept", "application/vnd.github+json");
        _http.DefaultRequestHeaders.Add("X-GitHub-Api-Version", "2022-11-28");
    }

    public async Task<LlmOutput> SummarizeAsync(string title, string url, string plainText)
    {
        // 1) Try JSON Schema first
        var schemaBody = BuildSchemaBody(title, url, plainText);
        var (ok, text, status, error) = await PostAsync(schemaBody);

        // 2) If schema isn't supported (400), fallback to JSON mode + strict instruction
        if (!ok && status == 400 && IsSchemaUnsupported(error))
        {
            var jsonBody = BuildJsonModeBody(title, url, plainText);
            (ok, text, status, error) = await PostAsync(jsonBody);
        }

        if (!ok)
            throw new HttpRequestException($"GitHub Models API error {status}: {error}");

        using var doc = JsonDocument.Parse(text);
        var contentStr = doc.RootElement
            .GetProperty("choices")[0]
            .GetProperty("message")
            .GetProperty("content")
            .GetString();

        return ParseStrictJson(contentStr ?? "{}");
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

    private async Task<(bool ok, string text, int status, string error)> PostAsync(object body)
    {
        var json = JsonSerializer.Serialize(body);
        using var content = new StringContent(json, Encoding.UTF8, "application/json");
        var resp = await _http.PostAsync("chat/completions", content);
        var text = await resp.Content.ReadAsStringAsync();
        if (resp.IsSuccessStatusCode) return (true, text, (int)resp.StatusCode, "");
        return (false, text, (int)resp.StatusCode, ExtractError(text));
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
