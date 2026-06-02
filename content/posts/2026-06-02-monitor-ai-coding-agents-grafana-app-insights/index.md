+++
title = '📊 Monitor AI Coding Agents with Grafana'
slug = 'monitor-ai-coding-agents-grafana-app-insights'
date = '2026-06-02 09:00:00Z'
lastmod = '2026-06-02 09:00:00Z'
draft = false
tags = [
  "Azure",
  "Azure Managed Grafana",
  "Application Insights",
  "OpenTelemetry",
  "GitHub Copilot",
  "Claude Code",
  "Observability",
  "Platform Engineering"
]
categories = [
  "Azure",
  "Observability",
  "Platform Engineering",
  "AI"
]
series = [
  "Azure Observability"
]

layout = "single"
[params]
    cover = true
    author = "sujith"
    cover_prompt = '''A clean, modern technical illustration for a blog post about observing AI coding agents with Azure Managed Grafana, OpenTelemetry, and Application Insights.
    Show three abstract coding agent cards on the left feeding OTLP telemetry arrows into a central OpenTelemetry Collector hub, which forwards data into an Application Insights pipeline and a Log Analytics workspace icon.
    On the right, depict a Grafana dashboard panel grid with sparklines, gauges, and small charts representing cost, tokens, sessions, tool calls, and latency.
    Include subtle Azure cloud motifs, tidy workflow arrows, and a horizontal data flow composition.
    Use deep blue, teal, orange accent, graphite, and white tones with subtle gradients and faint circuit traces.
    Keep the composition enterprise-friendly, uncluttered, and suited for platform engineers, SREs, and engineering leaders.
    No people, no logos, no text overlays.'''

description = "Stand up an OpenTelemetry Collector, ship coding agent telemetry to Application Insights, and visualise it in Grafana."
+++

AI coding agents are now a real line item in most engineering budgets. GitHub
Copilot, Claude Code, OpenClaw, and the next thing your team installs all
generate tokens, calls, latency, and cost — but very little of that is visible
unless you wire it up. The Azure Managed Grafana team has now published a
ready-made path to do exactly that, using OpenTelemetry, Application Insights,
and a small set of curated dashboards.

This post walks through the architecture, the pieces you need to deploy, and the
trade-offs worth knowing before you roll it out to a team.

## Why centralise agent telemetry

Adoption of coding agents is the easy part. The harder questions show up after a
few sprints:

- How much are we spending per model, per team, and per task?
- Who is using which agent, and which tools are being invoked?
- Where do sessions stall, error out, or quietly burn tokens?
- Can we audit prompts, tool calls, and model choices for compliance?

Local IDE telemetry answers none of these at an organisation level. You need a
shared backend and a shared dashboard before any of it is actionable.

## How the pipeline fits together

The official guidance keeps the moving parts intentionally small:

- Each coding agent emits OpenTelemetry traces, metrics, and logs to an OTLP
  endpoint.
- An OpenTelemetry Collector (the `contrib` distribution) terminates OTLP and
  forwards everything to Application Insights using the Azure Monitor exporter.
- Grafana queries Application Insights via the Azure Monitor data source and
  renders three purpose-built dashboards.

The collector and the Application Insights pipeline are one-time infrastructure.
After that, onboarding a new agent is just a configuration change pointed at the
same endpoint.

Azure Monitor also supports native OTLP ingestion as an alternative, which
removes the collector hop. The dashboards still work because the data lands in
the same Log Analytics tables — useful if you would rather not run and patch a
collector yourself.

## Prerequisites

Before you start, make sure you have:

- An Application Insights resource backed by a Log Analytics workspace.
- Docker (or any container runtime) for the collector, or a Kubernetes cluster
  if you prefer to host it there.
- Grafana 11.6 or later, with an Azure Monitor data source that can read the
  target Application Insights resource. Azure Managed Grafana is the
  zero-maintenance option here.

Treat the Application Insights connection string as a secret. Anyone with the
string can write telemetry into your workspace and skew the cost panels.

## Step 1: Run the OpenTelemetry Collector

The collector takes OTLP on HTTP and gRPC, then exports to Application Insights.
Save the following as `otel-collector-config.yaml` and replace the connection
string placeholders with values from your Application Insights resource:

```yaml
receivers:
  otlp:
    protocols:
      http:
        endpoint: 0.0.0.0:4318
      grpc:
        endpoint: 0.0.0.0:4317

exporters:
  azuremonitor:
    connection_string: "InstrumentationKey=<YOUR-KEY>;IngestionEndpoint=https://<region>.in.applicationinsights.azure.com/;LiveEndpoint=https://<region>.livediagnostics.monitor.azure.com/"

service:
  pipelines:
    traces:
      receivers: [otlp]
      exporters: [azuremonitor]
    metrics:
      receivers: [otlp]
      exporters: [azuremonitor]
    logs:
      receivers: [otlp]
      exporters: [azuremonitor]
```

Run the collector with the `contrib` image, which already includes the Azure
Monitor exporter:

```bash
docker run -d --name otel-collector \
  -p 4318:4318 -p 4317:4317 \
  -v $(pwd)/otel-collector-config.yaml:/etc/otelcol-contrib/config.yaml \
  otel/opentelemetry-collector-contrib:latest
```

For shared use, host the collector somewhere reachable by every agent (a small
container app, a Kubernetes deployment, or a per-host sidecar). The agents in
this guide all use OTLP/HTTP on port `4318`.

## Step 2: Point each agent at the collector

Each agent has its own switch, but the target is the same: the collector's
OTLP/HTTP endpoint.

### GitHub Copilot (VS Code)

GitHub Copilot emits OpenTelemetry when configured in Visual Studio Code. Add
the following to `settings.json`:

```json
{
  "github.copilot.chat.otel.enabled": true,
  "github.copilot.chat.otel.exporterType": "otlp-http",
  "github.copilot.chat.otel.otlpEndpoint": "http://localhost:4318",
  "github.copilot.chat.otel.captureContent": true
}
```

The Copilot dashboard surfaces operations, input and output tokens, chat
sessions, tool calls, and per-model latency including P50 and P90 time to first
token. That last metric is the one to watch when a model swap silently degrades
the experience.

### GitHub Copilot CLI

The GitHub Copilot CLI runs as a standalone terminal process and reads its
telemetry configuration from environment variables rather than `settings.json`.
Export these before launching the CLI, or add them to your shell profile:

```bash
export OTEL_EXPORTER_OTLP_ENDPOINT="http://localhost:4318"
export OTEL_EXPORTER_OTLP_PROTOCOL="http/protobuf"
export COPILOT_OTEL_ENABLED=true
export COPILOT_OTEL_CAPTURE_CONTENT=true
```

Setting `OTEL_EXPORTER_OTLP_ENDPOINT` alone is enough to turn telemetry on;
`COPILOT_OTEL_ENABLED` just makes the intent explicit. The CLI runtime only
speaks OTLP/HTTP — an `otlp-grpc` setting is silently downgraded to HTTP — so
keep it pointed at the collector's `4318` endpoint.

`COPILOT_OTEL_CAPTURE_CONTENT` stores full prompts, responses, and tool
arguments, mirroring `captureContent` in the VS Code extension. The same
trade-off applies: great for auditability, risky for data classification. Leave
it off in regulated environments.

One thing to know for the KQL checks and dashboards below: terminal CLI sessions
emit under the service name `github-copilot`, not `copilot-chat`, and appear as
independent root traces. Filter on `cloud_RoleName == "github-copilot"` when you
query CLI activity.

### Claude Code

Claude Code reads telemetry config from environment variables. Add this to its
`settings.json`:

```json
{
  "env": {
    "CLAUDE_CODE_ENABLE_TELEMETRY": "1",
    "OTEL_METRICS_EXPORTER": "otlp",
    "OTEL_LOGS_EXPORTER": "otlp",
    "OTEL_EXPORTER_OTLP_PROTOCOL": "http/protobuf",
    "OTEL_EXPORTER_OTLP_ENDPOINT": "http://localhost:4318",
    "OTEL_LOG_USER_PROMPTS": "1",
    "OTEL_LOG_TOOL_DETAILS": "1",
    "OTEL_METRICS_INCLUDE_VERSION": "true"
  }
}
```

`OTEL_LOG_USER_PROMPTS` and `OTEL_LOG_TOOL_DETAILS` enrich the per-user and
tool-usage panels. Drop them in regulated environments where prompt text may
include sensitive content.

### OpenClaw

The OpenClaw gateway publishes OpenTelemetry through its telemetry config:

```json
{
  "enabled": true,
  "endpoint": "http://localhost:4318",
  "protocol": "http/protobuf",
  "serviceName": "openclaw-gateway",
  "traces": true,
  "metrics": true,
  "logs": true,
  "sampleRate": 1,
  "flushIntervalMs": 5000
}
```

`serviceName` must be exactly `openclaw-gateway`, because the dashboard filters
on `cloud_RoleName == "openclaw-gateway"`.

## Step 3: Verify telemetry is landing

Before importing dashboards, confirm the pipeline is healthy. In the Azure
portal, open the Application Insights resource and run these KQL checks against
Logs:

```kusto
// GitHub Copilot
dependencies
| where timestamp > ago(1h)
| where cloud_RoleName == "copilot-chat"
| take 50
```

```kusto
// GitHub Copilot CLI
dependencies
| where timestamp > ago(1h)
| where cloud_RoleName == "github-copilot"
| take 50
```

```kusto
// Claude Code
customMetrics
| where timestamp > ago(1h)
| where name startswith "claude_code"
| take 50
```

```kusto
// OpenClaw
dependencies
| where timestamp > ago(1h)
| where cloud_RoleName == "openclaw-gateway"
| take 50
```

If nothing comes back, the usual suspects are an incorrect connection string,
blocked egress to the Application Insights ingestion endpoint, or a firewalled
collector port.

## Step 4: Import the dashboards

Three dashboards are published and version-controlled, each with its own import
flow and variable reference:

- [GitHub Copilot](https://aka.ms/amg/dash/gh-copilot) — operations, tokens, sessions, tool calls, per-model latency. 
- [Claude Code](https://aka.ms/amg/dash/claude-code) — cost, sessions, daily token trends, model breakdown, top tools. 
- [OpenClaw](https://aka.ms/amg/dash/openclaw) — messages, response time percentiles, cache reads, stuck sessions. 

All three require Grafana 11.6 or later and an Azure Monitor data source bound
to the subscription holding the Application Insights resource. The same
dashboards are also available natively in the Azure portal as Azure Monitor
dashboards with Grafana, with no separate Grafana instance to run.

## Operational considerations

A few things worth deciding up front:

- **Sampling.** A 100% sample rate is fine for a small pilot but will dominate
  Application Insights cost at scale. Drop the sample rate or filter low-value
  spans in the collector before you onboard a large team.
- **Prompt capture.** `captureContent`, `OTEL_LOG_USER_PROMPTS`, and similar
  switches store raw prompts in Application Insights. That is great for
  auditability and terrible for data classification. Decide per environment.
- **Multi-tenant collectors.** A single shared collector works, but if you need
  per-team cost attribution, tag at the agent or run separate collectors that
  export to separate Application Insights resources.
- **Alerting.** Add Application Insights alert rules (or Grafana alerts) on
  daily cost thresholds, sustained API error rates, and stuck-session counts.
  These are the signals that will save you from a surprise invoice.

## Where this leaves you

The pieces here are not new individually — OpenTelemetry, Application Insights,
and Grafana have been around for years. What changed is that the dashboards,
filters, and KQL queries for coding agents are now packaged and supported as a
documented path. That cuts the time from "we should monitor this" to "we have a
single pane of glass" from weeks of dashboard design to an afternoon of wiring.

If you already run Application Insights for other workloads, this slots straight
into the same workspace. If you are starting fresh, this is a reasonable excuse
to stand up Azure Managed Grafana and put it in front of the rest of your
estate too.

## References

- [Monitor AI coding agents with Grafana](https://learn.microsoft.com/en-us/azure/managed-grafana/grafana-opentelemetry-app-insights)
- [Azure Monitor Exporter for the OpenTelemetry Collector](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter/azuremonitorexporter)
- [Ingest OTLP data into Azure Monitor with the OpenTelemetry Collector (Preview)](https://learn.microsoft.com/en-us/azure/azure-monitor/containers/opentelemetry-protocol-ingestion)
- [Use Azure Monitor dashboards with Grafana](https://learn.microsoft.com/en-us/azure/azure-monitor/visualize/visualize-use-grafana-dashboards)
- [Monitoring GitHub Copilot agents](https://code.visualstudio.com/docs/copilot/guides/monitoring-agents)
- [Monitoring Claude Code usage](https://code.claude.com/docs/en/monitoring-usage)
