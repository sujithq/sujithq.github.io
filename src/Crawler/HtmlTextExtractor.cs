using System.Net.Http;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

public interface IHtmlTextExtractor
{
    string StripHtml(string html);
    Task<string> FetchAndExtractAsync(string url);
}

public class HtmlTextExtractor : IHtmlTextExtractor
{
    private readonly HttpClient _http;

    public HtmlTextExtractor(HttpClient http)
    {
        _http = http;
    }
    // ultra-light extractor that strips tags; replace with AngleSharp if you want richer parsing
    private static readonly Regex Tag = new("<.*?>", RegexOptions.Singleline | RegexOptions.Compiled);

    public string StripHtml(string html)
    {
        if (string.IsNullOrWhiteSpace(html)) return string.Empty;
        var text = Tag.Replace(html, " ");
        text = System.Net.WebUtility.HtmlDecode(text);
        return Regex.Replace(text, @"\s+", " ").Trim();
    }

    public async Task<string> FetchAndExtractAsync(string url)
    {
        using var resp = await _http.GetAsync(url);
        resp.EnsureSuccessStatusCode();
        var html = await resp.Content.ReadAsStringAsync();
        return StripHtml(html);
    }
}
