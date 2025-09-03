using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

class Program
{
    static async Task<int> Main(string[] args)
    {
        var verbose = args.Any(a => string.Equals(a, "--verbose", StringComparison.OrdinalIgnoreCase) || a == "-v");

        var builder = Host.CreateApplicationBuilder(args);

        // Logging
        builder.Logging.ClearProviders();
        builder.Logging.AddSimpleConsole(o => { o.SingleLine = true; o.TimestampFormat = "HH:mm:ss "; });
        builder.Logging.SetMinimumLevel(verbose ? LogLevel.Debug : LogLevel.Information);

        // Configuration: appsettings.json (in output), user secrets, env vars
        builder.Configuration
            .AddJsonFile("appsettings.json", optional: true, reloadOnChange: false)
            .AddUserSecrets<Program>(optional: true)
            .AddEnvironmentVariables();

        // Options binding
        builder.Services.AddOptions<AppConfig>()
            .Bind(builder.Configuration)
            .ValidateOnStart();

        // Http clients
        builder.Services.AddHttpClient("crawler");
        builder.Services.AddHttpClient("github-models", c =>
        {
            c.BaseAddress = new Uri("https://models.github.ai/inference/");
        });
        builder.Services.AddHttpClient("openai", c =>
        {
            c.BaseAddress = new Uri("https://api.openai.com/v1/");
        });

        // App services
        builder.Services.AddSingleton<CrawlerService>();

        using var host = builder.Build();
        var svc = host.Services.GetRequiredService<CrawlerService>();
        try
        {
            return await svc.RunAsync(verbose);
        }
        catch (Exception ex)
        {
            var logger = host.Services.GetRequiredService<ILogger<Program>>();
            logger.LogError(ex, "Crawler failed");
            return 1;
        }
    }
}
