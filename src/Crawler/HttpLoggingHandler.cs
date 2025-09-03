using Microsoft.Extensions.Logging;
using System.Diagnostics;
using System.Net.Http;
using System.Text;

namespace Crawler;

public class HttpLoggingHandler : DelegatingHandler
{
    private readonly ILogger<HttpLoggingHandler> _logger;

    public HttpLoggingHandler(ILogger<HttpLoggingHandler> logger)
    {
        _logger = logger;
    }

    protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        var sw = Stopwatch.StartNew();
        var url = request.RequestUri?.ToString() ?? "(null)";
        _logger.LogDebug("HTTP {Method} {Url}", request.Method, url);

        // Never log Authorization header values
        foreach (var h in request.Headers)
        {
            if (string.Equals(h.Key, "Authorization", StringComparison.OrdinalIgnoreCase))
            {
                _logger.LogTrace("  {Header}: ****", h.Key);
            }
            else
            {
                _logger.LogTrace("  {Header}: {Value}", h.Key, string.Join(",", h.Value));
            }
        }

        var response = await base.SendAsync(request, cancellationToken);
        sw.Stop();
        var len = response.Content?.Headers.ContentLength;
        _logger.LogDebug("HTTP {Status} {Method} {Url} in {Ms}ms len={Len}", (int)response.StatusCode, request.Method, url, sw.ElapsedMilliseconds, len);

        return response;
    }
}
