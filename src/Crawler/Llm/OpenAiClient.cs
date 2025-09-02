using System.Net.Http;
using System.Text;
using System.Text.Json;

public class OpenAiClient : ILlmClient
{
    private readonly string _model;
    private readonly HttpClient _http;

    public OpenAiClient(string model, HttpClient http, string? apiKey)
    {
        _model = model;
        _http = http;
        _http.BaseAddress = new Uri("https://api.openai.com/v1/");
        _http.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", apiKey ?? "");
    }

    public async Task<LlmOutput> SummarizeAsync(string title, string url, string plainText)
    {
        var body = new
        {
            model = _model,
            messages = new object[]
            {
                new { role = "system", content = "You are a helpful assistant." },
                new { role = "user", content = Prompts.Build(title, url, plainText) }
            },
            response_format = new { type = "json_object" },
            temperature = 0.2
        };

        var json = JsonSerializer.Serialize(body);
        var resp = await _http.PostAsync("chat/completions",
            new StringContent(json, Encoding.UTF8, "application/json"));
        resp.EnsureSuccessStatusCode();
        using var doc = JsonDocument.Parse(await resp.Content.ReadAsStringAsync());
        var content = doc.RootElement.GetProperty("choices")[0]
            .GetProperty("message").GetProperty("content").GetString();

        return ParseStrictJson(content!);
    }

    private static LlmOutput ParseStrictJson(string content)
    {
        using var doc = JsonDocument.Parse(content);
        var root = doc.RootElement;
        var summary = root.GetProperty("summary").GetString() ?? "";
        var bullets = root.GetProperty("bullets").EnumerateArray().Select(e => e.GetString() ?? "").ToList();
        var tags = root.GetProperty("tags").EnumerateArray().Select(e => e.GetString() ?? "").ToList();
        return new LlmOutput(summary, bullets, tags);
    }
}
