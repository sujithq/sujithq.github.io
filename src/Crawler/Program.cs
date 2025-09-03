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
    builder.Services.AddHttpClient("crawler", (sp, c) =>
    {
      var cfg = sp.GetRequiredService<IOptions<AppConfig>>().Value;
      c.Timeout = TimeSpan.FromSeconds(cfg.fetch.timeoutSeconds);
      c.DefaultRequestHeaders.UserAgent.ParseAdd(cfg.fetch.userAgent);
    });

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

    builder.Services.AddHttpClient("llm", c => { c.BaseAddress = new Uri(baseUrl); });
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

      int req;
      if (providerCfg?.requestsPerWindow is int r1) req = r1;
      else if (int.TryParse(cfg["llm:requestsPerWindow"], out var r2)) req = r2;
      else req = 3;

      int win;
      if (providerCfg?.windowSeconds is int w1) win = w1;
      else if (int.TryParse(cfg["llm:windowSeconds"], out var w2)) win = w2;
      else win = 60;

      int delSec;
      if (providerCfg?.initialDelaySeconds is int d1) delSec = d1;
      else if (int.TryParse(cfg["llm:initialDelaySeconds"], out var d2)) delSec = d2;
      else delSec = 2;

      var model = providerCfg?.model ?? (cfg[$"llm:{prov}:model"] ?? app.llm.model ?? "");
      var providerBaseUrl = providerCfg?.baseUrl ?? cfg[$"llm:{prov}:baseUrl"]; // Program ensures baseUrl exists earlier
      var tokenKey = string.IsNullOrWhiteSpace(providerCfg?.tokenKey) ? "llm:token" : providerCfg!.tokenKey;
      return new LlmProviderConfig(model, providerBaseUrl, req, win, delSec, tokenKey);
    });
    builder.Services.AddSingleton<ILlmClient>(sp =>
    {
      var app = sp.GetRequiredService<IOptions<AppConfig>>().Value;
      var configuration = sp.GetRequiredService<IConfiguration>();
      var http = sp.GetRequiredService<ILlmHttpClient>().Client;

      var cfg = sp.GetRequiredService<LlmProviderConfig>();

      var provider = app.llm.provider.ToLowerInvariant();
      var model = cfg.model;

      var token = configuration[cfg.tokenKey];

      return provider switch
      {
        "openai" => new OpenAiClient(model, token),
        "github" => new GithubModelsClient(model, http, token),
        "foundry" => new FoundryClient(model, cfg.baseUrl!, token!),
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
