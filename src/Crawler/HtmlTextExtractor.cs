using System.Text.RegularExpressions;
using Microsoft.Extensions.Logging;

namespace Crawler;

public interface IHtmlTextExtractor
{
  string StripHtml(string html);
  Task<string> FetchAndExtractAsync(string url);
}

public class HtmlTextExtractor : IHtmlTextExtractor
{
  private readonly HttpClient _http;
  private readonly ILogger<HtmlTextExtractor> _logger;

  public HtmlTextExtractor(HttpClient http, ILogger<HtmlTextExtractor> logger)
  {
    _http = http;
    _logger = logger;
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
    _logger.LogDebug("Fetch {Url}", url);
    using var resp = await _http.GetAsync(url);
    _logger.LogDebug("Fetched {Url} -> {Status}", url, (int)resp.StatusCode);
    resp.EnsureSuccessStatusCode();
    var html = await resp.Content.ReadAsStringAsync();
    return StripHtml(html);
  }
}
