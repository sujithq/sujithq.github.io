+++
title = '⚙️ Automated Updates Pipeline'
slug = 'automated-updates-pipeline'
date = '2025-08-13 06:00:00Z'
lastmod = '2025-08-13 06:00:00Z'
draft = false
tags = [
  'Azure',
  'GitHub',
  'Terraform',
  'Automation',
  'DevOps',
  'Platform Engineering'
]
categories = [
  'Cloud Computing',
  'Platform Engineering',
  'Automation'
]
series = [
  'Automation Pipelines'
]
layout = "single"
[params]
    cover = true
    author = "sujith"
    cover_prompt = '''Create a clean, modern technical illustration for a blog post about an automated weekly cloud updates pipeline. Use Azure, GitHub, and Terraform branding accents (Azure blue, GitHub dark, Terraform purple). Visualise a GitHub Actions workflow triggering a PowerShell script that aggregates RSS feeds and release APIs, summarises with AI model pool selection, and publishes Hugo content. Include icons for schedule (cron clock), feeds, summarisation models, markdown generation, and site publishing. Add subtle circuit lines, network nodes, and data flow arrows. Futuristic, enterprise-ready, minimalist aesthetic appealing to platform engineers. Label key stages: Fetch, Summarise, Generate, Commit. '''

description = "Deep dive into a PowerShell + GitHub Actions pipeline that auto-generates weekly Azure, GitHub and Terraform update posts with AI summarisation."
+++

## Why this pipeline exists

Manually curating weekly platform updates (Azure service changes, GitHub changelog entries, Terraform provider releases) is repetitive, time‑sensitive, and error‑prone. This pipeline automates the whole path from data acquisition → AI summarisation → Hugo markdown generation → commit, delivering consistent, timestamped update posts under `content/updates`.

## High‑level architecture

```text
┌───────────────┐   cron 05:15 UTC   ┌───────────────────┐   grouped items  ┌──────────────────┐
│ GitHub Action │ ─────────────────> │ PowerShell Script │ ───────────────> │ AI Summarisation │
└─────┬─────────┘                    └──────────┬────────┘                  └────────┬─────────┘
      │  commit (if changed)                    │ filtered items                     │ summaries
      V                                         V                                    V
  Repo content <────────────── write markdown posts <──────────── assemble front matter
```

## Scheduling & cadence

The workflow runs daily at `05:15 UTC` but per‑source publication cadence is controlled inside the script using a frequency map (`Azure=weekly,GitHub=weekly,Terraform=weekly` by default). The script:

- Computes a base window (week vs rolling period).
- Derives per‑source windows (weekly / biweekly / monthly) without duplicating logic.
- Caps items per source (`MaxAzure`, `MaxGitHub`, `MaxTerraform`) to keep posts readable.

### Window calculation

`Compute-BaseWindow` returns UTC and local (Europe/Brussels) boundaries. `Compute-PerSourceWindows` adjusts start dates biweekly (−7 days) or monthly (month start) per source.

## Data acquisition layer

Fetcher functions isolate network concerns:

- `Get-AzureUpdates` parses an RSS feed with defensive XML handling.
- `Get-GitHubChangelog` mirrors the pattern for GitHub's changelog.
- `Get-TerraformReleases` loops repositories (`hashicorp/terraform`, `hashicorp/terraform-provider-azurerm`) and filters releases in the window.

Each returns plain objects with a common shape (`title`, `url`, `publishedAt`, `raw`, `source`), simplifying later aggregation.

## Summarisation engine

`Summarize-Items`:

- Expands a model pool (defaults: `openai/gpt-4.1`, `openai/gpt-4o`, `openai/gpt-5`, `openai/o1`, `openai/o3` plus `-mini` variants) or uses caller override.
- Normalises + deduplicates model identifiers.
- Iteratively attempts summarisation per item, promoting the first successful model to the front (adaptive ordering).
- Implements exponential backoff with jitter (`SummaryRetryBaseSeconds`) and bounded attempts (`MaxSummaryRetries`).
- Falls back to truncated raw title when all models fail.

Output objects include optional bullet points (`bullets`) and a condensed factual summary.

### Resilience patterns

- Retry loop with model deactivation on repeated failure (429 / transient).
- Cache placeholder (pattern enables future caching without refactor).
- Graceful degradation when token absent (`-DisableSummaries`).

## Markdown emission

`Write-PerTypePost` builds a clean front matter block every run, avoiding `op_Addition` issues seen when concatenating PSCustomObjects. It:

- Creates a dated folder (`content/updates/<slug>/index.md`).
- Generates deterministic title + description from window and type.
- Uses `lastmod` refresh for diff hygiene.
- Ensures UTF‑8 encoding.

Example (trimmed) output block:

```toml
+++
title = 'Azure Weekly – 2025 Week 33'
date = 2025-08-13T12:50:21Z
lastmod = 2025-08-13T12:50:21Z
draft = false
tags = ['updates', 'weekly', 'azure']
description = 'Highlights from Azure between 2025-08-11 and 2025-08-17.'
[params]
    author = 'sujith'
+++
```

Body lines are a bullet list with escaped markdown characters and optional detail indents per item.

## Workflow integration (`update.yml`)

Key steps:

1. Checkout (full history for potential diff logic).
2. Inject a fine‑grained Personal Access Token (PAT) with Models: read permission via `secrets.WEEKLY` and expose it as the environment variable `GITHUB_TOKEN` (the script expects that name). This PAT is required because the default ephemeral Actions token may not always grant Models: read on all repositories / org policies.
3. Run script (PowerShell) which uses that token for release API calls and AI summarisation.
4. Commit changes only when the working tree differs:
   - Prevents empty commits.
   - Enables predictable downstream indexing (e.g., search, sitemap).

Snippet (core commit logic):

```yaml
- name: Commit & push (if changed)
  run: |
    git config user.name "github-actions[bot]"
    git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
    git add -A
    if git diff --staged --quiet; then
      echo "No changes"
      exit 0
    fi
    git commit -m "chore(updates): daily refresh of per-type posts"
    git push
```

### Full workflow file

Below is the complete workflow (`.github/workflows/update.yml`) for reference so you can copy/adapt without switching contexts:

```yaml
name: Updates (Daily Refresh)

on:
  schedule:
    # Run daily at 05:15 UTC (~07:15 Europe/Brussels during DST)
    - cron: '15 5 * * *'
  workflow_dispatch:

permissions:
  contents: write
  models: read

jobs:
  build-weekly:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Run tracker
        shell: pwsh
        env:
          GITHUB_TOKEN: ${{ secrets.WEEKLY }}
        run: |
          pwsh ./.github/scripts/generate-updates.ps1 -RepoRoot . -ContentDir content/updates -MaxAzure 20 -MaxGitHub 12 -MaxTerraform 8 -ShowApiUrls -Frequencies Azure=weekly,GitHub=weekly,Terraform=weekly -ModelPool 'openai/gpt-5','openai/gpt-5-mini','openai/gpt-4.1','openai/gpt-4.1-mini','openai/gpt-4o','openai/gpt-4o-mini'

      - name: Commit & push (if changed)
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
          git add -A
          if git diff --staged --quiet; then
            echo "No changes"
            exit 0
          fi
          git commit -m "chore(updates): daily refresh of per-type posts"
          git push
```

### Script source (generate-updates.ps1)

The full PowerShell script is lengthy (~800 lines) and modular. Expand the section below to view it inline; canonical source lives at `.github/scripts/generate-updates.ps1`.

**Abbreviated listing (top section):**

```powershell
#!/usr/bin/env pwsh
[CmdletBinding()]
param(
  [string]$RepoRoot = (Resolve-Path -LiteralPath .).Path,
  [string]$ContentDir = 'content/updates',
  [ValidateRange(0,200)][int]$MaxAzure = 20,
  [ValidateRange(0,200)][int]$MaxGitHub = 12,
  [ValidateRange(0,200)][int]$MaxTerraform = 8,
  [string]$Frequencies = 'Azure=weekly,GitHub=weekly,Terraform=weekly'
  ,
  [ValidateSet('week','rolling')][string]$WindowType = 'week',
  [int]$RollingDays = 7
  ,
  [switch]$DisableSummaries,
  [int]$MaxSummaryRetries = 4,
  [int]$SummaryRetryBaseSeconds = 2
  ,
  [switch]$ShowApiUrls,
  [switch]$DumpSummaries,
  [switch]$CleanOutput,
  [string[]]$ModelPool = @()
)
# (Truncated commentary for brevity in article)

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$ErrorActionPreference = 'Stop'

function Log { param([string]$Message) Write-Host "[$(Get-Date -Format 'HH:mm:ss')] $Message" }

function Initialize-Environment { param([string]$Token,[switch]$AllowMissingToken) if(-not $Token){ if($AllowMissingToken){ Write-Warning 'GITHUB_TOKEN missing'; return @{ HeadersGitHub = @{} } } else { throw 'GITHUB_TOKEN is required (with models:read, contents:write).' } } return @{ HeadersGitHub = @{ 'Authorization' = "Bearer $Token"; 'Accept'='application/vnd.github+json'; 'X-GitHub-Api-Version'='2022-11-28' } } }

# ... (All helper + fetch + summarisation + write functions unchanged; see repository file for full context)

function Invoke-WeeklyUpdates { <# full body preserved in repo #> }

# Entry point invoking Invoke-WeeklyUpdates with normalisation logic.
# (Full body intentionally omitted here to keep article scannable.)
```

> For the complete, unabridged script (including all functions such as `Compute-BaseWindow`, `Summarize-Items`, `Write-PerTypePost`), view the source directly in the repository to benefit from future updates.

_Note: Full script (including all helper functions) is in `.github/scripts/generate-updates.ps1` in the repository._

## Security considerations

- A fine‑grained PAT stored as `secrets.WEEKLY` (minimum scope: `models: read`; optionally `contents: write` if not already inherited) is mapped to `GITHUB_TOKEN` only for the summarisation step. This tightly scopes access and keeps broader org tokens out of the workflow.
- The default ephemeral `GITHUB_TOKEN` usually works for releases + (in many cases) model inference, but: (a) rate limits for models can be lower, (b) org policy might restrict Models: read, and (c) token rotation / revocation granularity is coarser. Using a fine‑grained PAT improves reliability under higher summarisation volume and gives explicit auditability.
- Principle of least privilege: exclude unneeded scopes (no admin, no workflow write, no repo deletion). Rotate on a regular cadence; label the PAT (e.g. "weekly-updates-pipeline").
- Throttling resilience: higher model rate limits reduce retry pressure and lower the chance of exhausting attempts during summarisation bursts.
- No external secret leakage; feed and release endpoints are public; only summary requests hit the GitHub Models API.
- Summarisation prompt sanitises whitespace, reducing injection surface. Consider future allow‑list validation for model names and a deny‑list for unexpected outbound URLs in model output.

## Performance & efficiency

Applied optimisation patterns:

- Bounded item counts to cap summarisation cost.
- Early exit when limits < 1.
- Single pass aggregation into an array (avoids `+` which can cast to string inadvertently).
- Stopwatch instrumentation around summarisation and Terraform fetch for future telemetry.

## Extensibility roadmap

| Enhancement | Rationale |
|-------------|-----------|
| Add caching layer (file or repo issues) | Avoid re-summarising unchanged releases. |
| Structured JSON artifact output | Enables dashboards / trend analysis. |
| Model latency metrics + ranking | Optimise pool ordering adaptively. |
| Additional sources (Azure DevOps, .NET release notes) | Broader ecosystem coverage. |
| Semantic diff of prior period | Highlight new vs previously reported changes. |
| Optional Slack / Teams notification | Push updates to collaboration channels. |

## Local testing

```powershell
# Run with summaries disabled (fast)
pwsh .\.github\scripts\generate-updates.ps1 -DisableSummaries -ShowApiUrls -ContentDir content/updates -MaxAzure 5 -MaxGitHub 5 -MaxTerraform 3

# Custom rolling 3‑day window
pwsh .\.github\scripts\generate-updates.ps1 -WindowType rolling -RollingDays 3 -DisableSummaries

# Specify custom model pool
pwsh .\.github\scripts\generate-updates.ps1 -ModelPool 'openai/gpt-4.1-mini','openai/gpt-4o-mini'
```

Validate output under `content/updates` then run a local Hugo server to inspect rendering.

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| Empty post folder | No items in time window | Adjust `RollingDays` or verify feeds. |
| Summaries are just titles | All model attempts failed | Check `GITHUB_TOKEN` scopes; reduce model list. |
| Terraform section missing | No releases in window | Increase window or confirm repos. |
| RSS parse warning | Transient or format change | Re-run; add defensive logging if persistent. |
| Timezone mismatch | TZ ID not resolved on runner | Fallback logs warn; acceptable; optionally pin to UTC. |

## Design decisions (WHY, not WHAT)

- Function modularity: Facilitates unit testing and future module extraction.
- Front matter rebuild: Avoids mutation complexity and ensures determinism.
- Adaptive model ordering: Reduces average latency by reusing the last successful model first.
- Explicit limits: Keeps markdown lightweight and scannable for weekly cadence.
- Window abstraction: Allows switching between weekly calendar semantics and rolling ranges.

## When to fork vs reuse

Reuse the script if you only need periodic feed aggregation + AI summaries + Hugo output. Fork (or parameterise) if you require auth-protected APIs, structured JSON export, or per-item diffing.

## Related concepts

- Platform engineering content automation.
- Continuous content delivery patterns.
- AI-assisted summarisation pipelines.

## Next steps

1. Add model performance telemetry.
2. Produce combined weekly digest (across sources) for newsletter distribution.
3. Expose a JSON feed for downstream automation.
4. Integrate Slack notification on new commits.

## References

- Azure Updates RSS: <https://aztty.azurewebsites.net/rss/updates>
- GitHub Changelog RSS: <https://github.blog/changelog/>
- Terraform Releases: <https://github.com/hashicorp/terraform/releases>
- Terraform AzureRM Provider: <https://github.com/hashicorp/terraform-provider-azurerm/releases>
- Hugo Content Organisation: <https://gohugo.io/content-management/organization/>
- GitHub Actions Scheduling: <https://docs.github.com/actions/using-workflows/events-that-trigger-workflows#schedule>

## Conclusion

This pipeline is a compact, extensible pattern for continuous knowledge harvesting. By combining deterministic windowing, modular fetchers, adaptive summarisation, and idempotent markdown generation, it eliminates manual toil and delivers a reliable weekly knowledge artefact for the platform engineering estate.
