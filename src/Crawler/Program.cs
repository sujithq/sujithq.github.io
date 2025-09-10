using Crawler.Llm;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Crawler;

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

    // Configuration: appsettings.json (try CWD and also absolute path to output), user secrets, env vars
    var outputAppSettings = Path.Combine(AppContext.BaseDirectory, "appsettings.json");
    builder.Configuration
      .AddJsonFile("appsettings.json", optional: true, reloadOnChange: false)
      .AddJsonFile("src/Crawler/appsettings.json", optional: true, reloadOnChange: false)
      .AddJsonFile(outputAppSettings, optional: true, reloadOnChange: false)
          .AddUserSecrets<Program>(optional: true)
          .AddEnvironmentVariables();
    // Optional debug log for config base directories
    var cfgLoggerFactory = LoggerFactory.Create(b => b.AddSimpleConsole(o => { o.SingleLine = true; o.TimestampFormat = "HH:mm:ss "; }).SetMinimumLevel(LogLevel.Debug));
    var cfgLogger = cfgLoggerFactory.CreateLogger<Program>();
    cfgLogger.LogDebug("Config probe: cwd={Cwd} output={Out} exists(cwd/appsettings.json)={CwdExists} exists(out/appsettings.json)={OutExists}",
      Directory.GetCurrentDirectory(), AppContext.BaseDirectory, File.Exists(Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json")), File.Exists(outputAppSettings));

    // Options binding
    builder.Services.AddOptions<AppConfig>()
        .Bind(builder.Configuration)
        .ValidateOnStart();

    // Http clients
    builder.Services.AddTransient<HttpLoggingHandler>();
    builder.Services.AddHttpClient("crawler", (sp, c) =>
    {
      var cfg = sp.GetRequiredService<IOptions<AppConfig>>().Value;
      c.Timeout = TimeSpan.FromSeconds(cfg.fetch.timeoutSeconds);
      c.DefaultRequestHeaders.UserAgent.ParseAdd(cfg.fetch.userAgent);
    })
  .AddHttpMessageHandler<HttpLoggingHandler>();

    // throw error if builder.Configuration["llm:provider"] is missing
    if (string.IsNullOrWhiteSpace(builder.Configuration["llm:provider"]))
    {
      throw new InvalidOperationException("Missing configuration 'llm:provider'.");
    }

    // Generic LLM client registration using convention: llm:<provider>:baseUrl
    var provider = builder.Configuration["llm:provider"];
    var baseUrl = builder.Configuration[$"llm:{provider}:baseUrl"]; // e.g., llm:openai:baseUrl
    if (string.IsNullOrWhiteSpace(baseUrl))
    {
      throw new InvalidOperationException($"Missing configuration 'llm:{provider}:baseUrl'.");
    }

    builder.Services.AddHttpClient("llm", c => { c.BaseAddress = new Uri(baseUrl); })
      .AddHttpMessageHandler<HttpLoggingHandler>();
    builder.Services.AddHttpClient<ILlmHttpClient, LlmHttpClient>("llm");

    // App services
    builder.Services.AddHttpClient<IHtmlTextExtractor, HtmlTextExtractor>("crawler");
    // Provide provider-specific throttling config
    builder.Services.AddSingleton<LlmProviderConfig>(sp =>
    {
      var app = sp.GetRequiredService<IOptions<AppConfig>>().Value;
      var cfg = sp.GetRequiredService<IConfiguration>();
      var prov = app.llm.provider.ToLowerInvariant();

      LlmProviderConfig? providerCfg = prov switch
      {
        "openai" => app.llm.openai,
        "github" => app.llm.github,
        "foundry" => app.llm.foundry,
        _ => throw new InvalidOperationException($"Missing configuration 'llm:{provider}'.")
      };

      int delSec;
      if (providerCfg?.initialDelaySeconds is int d1) delSec = d1;
      else if (int.TryParse(cfg["llm:initialDelaySeconds"], out var d2)) delSec = d2;
      else delSec = 2;

  var model = providerCfg?.model ?? cfg[$"llm:{prov}:model"] ?? app.llm.model ?? "";
  var providerBaseUrl = providerCfg?.baseUrl ?? cfg[$"llm:{prov}:baseUrl"]; // Program ensures baseUrl exists earlier
  var tokenKey = string.IsNullOrWhiteSpace(providerCfg?.tokenKey) ? "llm:token" : providerCfg!.tokenKey;
  var maxCallsOverride = providerCfg?.maxCallsPerRun > 0 ? providerCfg!.maxCallsPerRun : 0;
  return new LlmProviderConfig(model, providerBaseUrl, delSec, tokenKey, maxCallsOverride);
    });
    builder.Services.AddSingleton<ILlmClient>(sp =>
    {
      var app = sp.GetRequiredService<IOptions<AppConfig>>().Value;
      var configuration = sp.GetRequiredService<IConfiguration>();
      var http = sp.GetRequiredService<ILlmHttpClient>().Client;
      var ghLogger = sp.GetRequiredService<ILogger<GithubModelsClient>>();

      var cfg = sp.GetRequiredService<LlmProviderConfig>();

      var provider = app.llm.provider.ToLowerInvariant();
      var model = cfg.model;

      var token = configuration[cfg.tokenKey];
      if (string.IsNullOrWhiteSpace(token))
      {
        throw new InvalidOperationException($"Missing API token for provider '{provider}'. Set environment variable '{cfg.tokenKey}' (or override llm:{provider}:tokenKey).");
      }

      return provider switch
      {
        "openai" => new OpenAiClient(model, token ?? string.Empty),
        "github" => new GithubModelsClient(model, http, token),
        "foundry" => new FoundryClient(model, cfg.baseUrl ?? throw new InvalidOperationException("llm baseUrl missing for provider"), token ?? string.Empty),
        _ => throw new InvalidOperationException($"Unsupported llm:provider '{provider}'.")
      };
    });
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
