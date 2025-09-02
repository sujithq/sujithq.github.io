using System.Net.Http;
using System.Text;
using System.Text.Json;

public class OpenAiClient : ILlmClient
{
    private readonly string _model;
    private readonly HttpClient _http;
    private readonly string _deploymentName;
    private readonly bool _isAzureOpenAI;

    public OpenAiClient(string model, HttpClient http, string? apiKey, string? endpoint = null, string? deploymentName = null)
    {
        _model = model;
        _http = http;
        _deploymentName = deploymentName ?? model;
        
        // Determine if this is Azure OpenAI based on endpoint
        _isAzureOpenAI = !string.IsNullOrEmpty(endpoint) && endpoint.Contains("cognitiveservices.azure.com");
        
        if (_isAzureOpenAI)
        {
            // Azure OpenAI configuration
            _http.BaseAddress = new Uri(endpoint!.TrimEnd('/') + "/");
            _http.DefaultRequestHeaders.Add("api-key", apiKey ?? "");
        }
        else
        {
            // Standard OpenAI configuration
            _http.BaseAddress = new Uri("https://api.openai.com/v1/");
            _http.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", apiKey ?? "");
        }
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
        
        // Construct the appropriate API path
        string apiPath = _isAzureOpenAI 
            ? $"openai/deployments/{_deploymentName}/chat/completions?api-version=2024-02-15-preview"
            : "chat/completions";
            
        var resp = await _http.PostAsync(apiPath,
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
