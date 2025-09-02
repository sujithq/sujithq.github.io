using System.Net.Http;
using System.Text;
using System.Text.RegularExpressions;

public static class HtmlTextExtractor
{
    // ultra-light extractor that strips tags; replace with AngleSharp if you want richer parsing
    private static readonly Regex Tag = new("<.*?>", RegexOptions.Singleline | RegexOptions.Compiled);

    public static string StripHtml(string html)
    {
        if (string.IsNullOrWhiteSpace(html)) return string.Empty;
        var text = Tag.Replace(html, " ");
    text = System.Net.WebUtility.HtmlDecode(text);
        return Regex.Replace(text, @"\s+", " ").Trim();
    }

    public static async Task<string> FetchAndExtractAsync(HttpClient http, string url)
    {
        using var resp = await http.GetAsync(url);
        resp.EnsureSuccessStatusCode();
        var html = await resp.Content.ReadAsStringAsync();
        return StripHtml(html);
    }
}
