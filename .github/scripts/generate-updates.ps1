#!/usr/bin/env pwsh
[CmdletBinding()]
param(
  # Where to write the markdown (your Hugo repo root)
  # If you actually want the *script folder*, prefer $PSScriptRoot.
  [string]$RepoRoot = (Resolve-Path -LiteralPath .).Path,
  # or: [string]$RepoRoot = (Get-Location).Path
  # or: [string]$RepoRoot = $PSScriptRoot  # if that's your intent

  # Section root (keep this OUT of your mainSections to avoid home pollution)
  [string]$ContentDir = 'content/updates',

  # Max items per source to keep the post readable
  [ValidateRange(0,200)][int]$MaxAzure = 20,
  [ValidateRange(0,200)][int]$MaxGitHub = 12,
  [ValidateRange(0,200)][int]$MaxTerraform = 8,

  # Which Terraform repos to watch (owner/repo)
  # [string[]]$TerraformRepos = @("hashicorp/terraform", "hashicorp/terraform-provider-azurerm"),

  # Per-source publish cadence (weekly|biweekly|monthly), comma-separated key=value
  # Example: Azure=weekly,GitHub=biweekly,Terraform=weekly
  [string]$Frequencies = 'Azure=weekly,GitHub=weekly,Terraform=weekly'
  ,
  # Time window mode: 'week' (Mon-Sun current week) or 'rolling'
  [ValidateSet('week','rolling')][string]$WindowType = 'week',
  # When WindowType=rolling, number of days back (exclusive of future) to include
  [int]$RollingDays = 7
  ,
  # Skip AI summarization (for faster debug); basic title-only summaries will be used
  [switch]$DisableSummaries,
  # Max retry attempts for model summarization on transient errors (e.g. 429)
  [int]$MaxSummaryRetries = 4,
  # Base seconds for exponential backoff (sleep = base * 2^(n-1) + jitter)
  [int]$SummaryRetryBaseSeconds = 2
  ,
  # Always log external feed/API URLs (not only via -Verbose)
  [switch]$ShowApiUrls,
  # Optional: verbose structured dump of computed summaries
  [switch]$DumpSummaries,
  # Remove existing subfolders under the target content directory before generation
  [switch]$CleanOutput,
  # Optional: explicit model pool for summarization (ordered preference). If omitted, defaults (base + -mini variants) are used.
  [string[]]$ModelPool = @()
)
<#
 .SYNOPSIS
  Generate weekly / biweekly / monthly update markdown posts (Azure, GitHub, Terraform) with optional AI summarization.

 .DESCRIPTION
  This script was refactored for maintainability. All operational logic now lives inside dedicated functions with
  a single orchestrator (Invoke-WeeklyUpdates). External side-effects (network calls, file writes) are isolated.
  Feed / release acquisition functions are pure (parameter-driven) to ease unit testing.

  High‑level pipeline:
    1. Initialize context & validate inputs
    2. Compute time windows (global + per-source overrides based on frequency)
    3. Fetch raw items from sources
    4. Summarize items (optionally using GitHub Models)
    5. Render & write per‑source markdown posts
    6. Return / print written file paths

  To integrate as a module, you can dot‑source or extract the functions below into a .psm1 and keep the thin wrapper.

 .NOTES
  Refactor date: 2025-08-13
  Original behaviour preserved; logging verbs and output structure remain compatible.
  New main entry: Invoke-WeeklyUpdates
  Disable summarization via -DisableSummaries for faster local dry runs.
  Set GITHUB_TOKEN (requires models:read, contents:write for summarization + release queries).
#>

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$ErrorActionPreference = 'Stop'

function Log { param([string]$Message) Write-Host "[$(Get-Date -Format 'HH:mm:ss')] $Message" }

function Initialize-Environment {
  param(
    [string]$Token,
    [switch]$AllowMissingToken
  )
  if(-not $Token){
    if($AllowMissingToken){
      Write-Warning 'GITHUB_TOKEN missing: proceeding without authenticated GitHub calls (summaries disabled / public endpoints only).'
      return @{ HeadersGitHub = @{} }
    } else {
      throw 'GITHUB_TOKEN is required (with models:read, contents:write).'
    }
  }
  return @{
    HeadersGitHub = @{
      'Authorization'       = "Bearer $Token"
      'Accept'              = 'application/vnd.github+json'
      'X-GitHub-Api-Version'= '2022-11-28'
    }
  }
}

function Parse-Frequencies {
  param([string]$FreqRaw)
  $map = @{}
  foreach($pair in ($FreqRaw -split ',')){
    $p = $pair.Trim(); if(-not $p){ continue }
    $kv = $p -split '='; if($kv.Count -ne 2){ continue }
    $map[$kv[0]] = $kv[1].ToLowerInvariant()
  }
  return $map
}

function Compute-BaseWindow {
  param(
    [ValidateSet('week','rolling')][string]$WindowType,
    [int]$RollingDays,
    [System.TimeZoneInfo]$TimeZone
  )
  $nowUtc = [DateTime]::UtcNow
  if($WindowType -eq 'rolling'){
    if($RollingDays -lt 1){ throw 'RollingDays must be >= 1' }
    $weekEndUtc   = $nowUtc
    $weekStartUtc = $nowUtc.Date.AddDays(-$RollingDays)
    $weekStartLocal = [System.TimeZoneInfo]::ConvertTimeFromUtc($weekStartUtc,$TimeZone)
    $weekEndLocal   = [System.TimeZoneInfo]::ConvertTimeFromUtc($weekEndUtc,$TimeZone)
  } else {
    $nowLocal = [System.TimeZoneInfo]::ConvertTimeFromUtc($nowUtc,$TimeZone)
    $dayOfWeek = [int]$nowLocal.DayOfWeek
    $daysSinceMonday = ($dayOfWeek + 6) % 7
    $weekStartLocal = $nowLocal.Date.AddDays(-$daysSinceMonday)
    $weekEndLocal   = $weekStartLocal.AddDays(7).AddSeconds(-1)
    $weekStartUtc   = [System.TimeZoneInfo]::ConvertTimeToUtc($weekStartLocal,$TimeZone)
    $weekEndUtc     = [System.TimeZoneInfo]::ConvertTimeToUtc($weekEndLocal,$TimeZone)
  }
  return [pscustomobject]@{
    NowUtc        = $nowUtc
    StartUtc      = $weekStartUtc
    EndUtc        = $weekEndUtc
    StartLocal    = $weekStartLocal
    EndLocal      = $weekEndLocal
  }
}

function Validate-TerraformRepos {
  param([object]$TerraformRepos,[string]$Frequencies)
  if($TerraformRepos -is [bool]){ throw "TerraformRepos was bound as boolean ($TerraformRepos)." }
  if(-not $TerraformRepos){ throw "TerraformRepos is empty. Provide at least one 'owner/repo' string." }
  if($TerraformRepos -isnot [System.Array]){ $TerraformRepos = @([string]$TerraformRepos) }
  if($TerraformRepos.Count -eq 1 -and $Frequencies -and $Frequencies -notmatch '='){
    Write-Warning "Frequencies value '$Frequencies' does not contain '='; did you forget a comma between Terraform repos?"
  }
  $invalid=@()
  foreach($tr in $TerraformRepos){
    Log "Validating Terraform repo: $tr"
    if($tr -notmatch '^[^/]+/[^/]+$'){ $invalid += $tr }
  }
  if($invalid.Count -gt 0){ throw "Invalid TerraformRepos entries (expect owner/repo): $($invalid -join ', ')" }
  Log ("TerraformRepos ({0}): {1}" -f $TerraformRepos.Count, ($TerraformRepos -join ', '))
  return ,$TerraformRepos
}

function Compute-PerSourceWindows {
  param(
    [hashtable]$FrequencyMap,
    [pscustomobject]$BaseWindow,
    [System.TimeZoneInfo]$TimeZone
  )
  $weekStartUtc = $BaseWindow.StartUtc
  $weekEndUtc   = $BaseWindow.EndUtc
  $weekStartLocal = $BaseWindow.StartLocal

  $AzureWindowStartUtc = $weekStartUtc; $AzureWindowEndUtc = $weekEndUtc

  if($FrequencyMap.ContainsKey('GitHub') -and $FrequencyMap['GitHub'] -eq 'biweekly'){
    $GitHubWindowStartUtc = $weekStartUtc.AddDays(-7)
  } elseif($FrequencyMap.ContainsKey('GitHub') -and $FrequencyMap['GitHub'] -eq 'monthly'){
    $monthStartLocal = (Get-Date -Date $weekStartLocal).AddDays(1 - $weekStartLocal.Day)
    $GitHubWindowStartUtc = [System.TimeZoneInfo]::ConvertTimeToUtc($monthStartLocal,$TimeZone)
  } else { $GitHubWindowStartUtc = $weekStartUtc }
  $GitHubWindowEndUtc = $weekEndUtc

  if($FrequencyMap.ContainsKey('Terraform') -and $FrequencyMap['Terraform'] -eq 'monthly'){
    $monthStartLocalTf = (Get-Date -Date $weekStartLocal).AddDays(1 - $weekStartLocal.Day)
    $TerraformWindowStartUtc = [System.TimeZoneInfo]::ConvertTimeToUtc($monthStartLocalTf,$TimeZone)
  } elseif($FrequencyMap.ContainsKey('Terraform') -and $FrequencyMap['Terraform'] -eq 'biweekly'){
    $TerraformWindowStartUtc = $weekStartUtc.AddDays(-7)
  } else { $TerraformWindowStartUtc = $weekStartUtc }
  $TerraformWindowEndUtc = $weekEndUtc

  return [pscustomobject]@{
    AzureStart      = $AzureWindowStartUtc
    AzureEnd        = $AzureWindowEndUtc
    GitHubStart     = $GitHubWindowStartUtc
    GitHubEnd       = $GitHubWindowEndUtc
    TerraformStart  = $TerraformWindowStartUtc
    TerraformEnd    = $TerraformWindowEndUtc
  }
}

# --- GitHub Models (Inference) helper (unchanged core logic) ...existing code re-hosted below
function Invoke-GitHubModelChat {
  param(
    [Parameter(Mandatory)] [string]$Prompt,
    [string]$Model = 'openai/gpt-5-mini',
    [decimal]$Temperature = 0.2,
    [int]$MaxTokens = 350,
    [int]$MaxAttempts = $MaxSummaryRetries,
    [int]$BaseDelaySeconds = $SummaryRetryBaseSeconds,
    [hashtable]$HeadersGitHub
  )
  $body = @{
    model = $Model
    temperature = [double]$Temperature
    max_tokens = $MaxTokens
    response_format = @{ type = 'json_schema'; json_schema = @{
        name = 'summary_schema'
        schema = @{
          type = 'object'
          additionalProperties = $false
          required = @('summary')
          properties = @{
            summary = @{ type = 'string'; description = '1–2 sentences, crisp, no hype.' }
            bullets = @{ type = 'array'; maxItems = 4; items = @{ type = 'string' } }
            tags    = @{ type = 'array'; maxItems = 6; items = @{ type = 'string' } }
          }
        }
    }}
    messages = @(
      @{ role='system'; content='You summarize tech release notes and changelogs. Be factual, concise, and specific. No marketing language.'},
      @{ role='user';   content=$Prompt }
    )
  } | ConvertTo-Json -Depth 8

  $attempt = 0
  $lastErr = $null
  while($attempt -lt [math]::Max(1,$MaxAttempts)){
    $attempt++
    try {
      $res = Invoke-RestMethod -Method POST -Uri 'https://models.github.ai/inference/chat/completions' -Headers $HeadersGitHub -ContentType 'application/json' -Body $body -ErrorAction Stop
      $json = $res.choices[0].message.content
      try { return ($json | ConvertFrom-Json) } catch { return @{ summary = $json } }
    } catch {
      $lastErr = $_
      $status = $null
      try { $status = $_.Exception.Response.StatusCode.Value__ } catch {}
      $isTransient = $false
      if($status -eq 429 -or $status -ge 500){ $isTransient = $true }
      if(-not $isTransient -or $attempt -ge $MaxAttempts){ break }
      $delay = [math]::Min(90, $BaseDelaySeconds * [math]::Pow(2, ($attempt-1)))
      $jitterMs = Get-Random -Minimum 0 -Maximum 400
      Log ("  Model 429/5xx attempt {0}/{1}; waiting {2}s (+{3}ms)" -f $attempt,$MaxAttempts,[int]$delay,$jitterMs)
      Start-Sleep -Seconds $delay
      Start-Sleep -Milliseconds $jitterMs
    }
  }
  throw $lastErr
}

# --- Utilities (moved intact)
function Trunc([string]$s,[int]$n=300){ if(-not $s){return ''}; if($s.Length -le $n){return $s}; return $s.Substring(0,$n).Trim() + '…' }
function MdEscape([string]$s){ if(-not $s){return ''}; $s -replace '\|','\\|' }
function ToBulletMd($arr){ if(-not $arr -or $arr.Count -eq 0){ return '' }; ($arr | ForEach-Object { "  - " + ($_ -replace '\n',' ') }) -join "`n" }
function Format-BareUrls([string]$text){ if(-not $text){ return $text }; return ($text -replace '(?<!\]\()https?://[\w\-\./%?&#=+:~]+', '<$0>') }
function Format-LinkUrl([string]$u){ if(-not $u){ return '' }; $clean = $u.Trim(); $clean = $clean -replace '\s+link$',''; if($clean -notmatch '^<.*>$'){ if($clean -match '[?&]|%'){ $clean = "<$clean>" } }; return $clean }

# --- Source fetchers (parameterized)
$AzureRss = 'https://aztty.azurewebsites.net/rss/updates'
function Get-AzureUpdates {
  param(
    [datetime]$StartUtc,
    [datetime]$EndUtc,
    [Parameter(Mandatory)][int]$Limit,
    [switch]$ShowUrls
  )
  Log 'Fetch: Azure updates (Azure Charts RSS)'
  Log "Azure limit (requested) = $Limit"
  if($ShowUrls){ Log "URL: $AzureRss" }
  try {
    $resp = Invoke-WebRequest -Uri $AzureRss -Headers @{ 'User-Agent'='weekly-hugo-tracker' } -UseBasicParsing -ErrorAction Stop
    if(-not $resp.Content){ throw 'Empty response body' }
    try { [xml]$rss = $resp.Content } catch { throw "RSS XML parse failed: $($_.Exception.Message)" }
    if(-not $rss.rss.channel.item){ return @() }

    $items = foreach($i in $rss.rss.channel.item) {
      # Only take links starting with https://azure.
      if (-not $i.link -or -not ($i.link -like 'https://azure.*')) { continue }
      if (-not $i.pubDate) { continue }
      $pub = Get-Date $i.pubDate -ErrorAction SilentlyContinue
      if (-not $pub) { continue }
      if ($pub -lt $StartUtc -or $pub -gt $EndUtc) { continue }

      [pscustomobject]@{
        source      = 'Azure'
        title       = [string]$i.title
        url         = [string]$i.link
        publishedAt = $pub.ToUniversalTime()
        raw         = [string]$i.description
      }
    }

    if ($Limit -lt 1) {
      Log 'Azure limit <1 -> returning 0 items'
      return @()
    }
    return ($items | Where-Object { $_ }) |
      Sort-Object publishedAt -Descending |
      Select-Object -First $Limit

  } catch {
    Write-Warning "Azure RSS failed: $($_.Exception.Message)"
    return @()
  }
}


$GitHubChangelogRss = 'https://github.blog/changelog/feed/'
function Get-GitHubChangelog { param([datetime]$StartUtc,[datetime]$EndUtc,[Parameter(Mandatory)][int]$Limit,[switch]$ShowUrls)
  Log 'Fetch: GitHub Changelog RSS'
  Log "GitHub changelog limit (requested) = $Limit"
  if($ShowUrls){ Log "URL: $GitHubChangelogRss" }
  try {
    $resp = Invoke-WebRequest -Uri $GitHubChangelogRss -Headers @{ 'User-Agent'='weekly-hugo-tracker' } -UseBasicParsing -ErrorAction Stop
    if(-not $resp.Content){ throw 'Empty response body' }
    try { [xml]$rss = $resp.Content } catch { throw "RSS XML parse failed: $($_.Exception.Message)" }
    if(-not $rss.rss.channel.item){ return @() }
    $items = foreach($i in $rss.rss.channel.item){
      if(-not $i.pubDate){ continue }
      $pub = Get-Date $i.pubDate -ErrorAction SilentlyContinue
      if(-not $pub){ continue }
      if($pub -lt $StartUtc -or $pub -gt $EndUtc){ continue }
      [pscustomobject]@{ source='GitHub'; title=[string]$i.title; url=[string]$i.link; publishedAt=$pub.ToUniversalTime(); raw=Trunc([string]$i.'content:encoded',2000) }
    }
  if($Limit -lt 1){ Log 'GitHub changelog limit <1 -> returning 0 items'; return @() }
  return ($items | Where-Object { $_ }) | Sort-Object publishedAt -Descending | Select-Object -First $Limit
  } catch { Write-Warning "GitHub Changelog RSS failed: $($_.Exception.Message)"; return @() }
}

function Get-GitHubReleases { param([string]$Owner,[string]$Repo,[int]$Limit=8,[hashtable]$HeadersGitHub,[switch]$ShowUrls)
  $uri = "https://api.github.com/repos/$Owner/$Repo/releases?per_page=$Limit"
  if($ShowUrls){ Log "API: $uri" } else { Log "API: $uri" }
  try { return Invoke-RestMethod -Uri $uri -Headers $HeadersGitHub -Method GET } catch { Write-Warning "Releases fetch failed for $Owner/$Repo $_"; return @() }
}

function Get-TerraformReleases { param(
    [string[]]$Repos,
    [datetime]$StartUtc,
    [datetime]$EndUtc,
    [Parameter(Mandatory)][int]$Limit,
    [hashtable]$HeadersGitHub,
    [switch]$ShowUrls
  )
  Log 'Fetch: Terraform releases'
  Log "Terraform limit (requested) = $Limit"
  $items=@(); $totalSkippedWindow=0
  $sw=[System.Diagnostics.Stopwatch]::StartNew()
  foreach($full in $Repos){
    $parts = $full.Split('/')
    if($parts.Count -ne 2){ continue }
    $owner=$parts[0]; $repo=$parts[1]
    Log "Repo: $owner/$repo (window $StartUtc -> $EndUtc)"
    $rels = Get-GitHubReleases -Owner $owner -Repo $repo -Limit 8 -HeadersGitHub $HeadersGitHub -ShowUrls:$ShowUrls
    if(-not $rels){ Log '  No releases returned'; continue }
    Log ("  Releases returned: {0}" -f $rels.Count)
    foreach($r in $rels){
      if(-not $r.published_at){ continue }
      $pub = [datetime]::Parse($r.published_at).ToUniversalTime()
      if($pub -lt $StartUtc -or $pub -gt $EndUtc){ Log "Skip release $($r.tag_name) ($pub) outside window"; $totalSkippedWindow++; continue }
      $body = [string]($r.body ?? '')
      $items += [pscustomobject]@{ source='Terraform'; title= if($r.name){ [string]$r.name } else { [string]$r.tag_name }; url=[string]$r.html_url; publishedAt=$pub; raw=Trunc($body,4000) }
      Log "Include release $($r.tag_name) ($pub)"
    }
  }
  $items = $items | Sort-Object publishedAt -Descending
  $beforeCap = $items.Count
  if($Limit -lt 1){ Log 'Terraform limit <1 -> returning 0 items'; return @() }
  $capped = $items | Select-Object -First $Limit
  $sw.Stop()
  Log ("Terraform summary: included={0} (pre-cap {1}), skippedWindow={2}, elapsed={3:n1}s" -f $capped.Count,$beforeCap,$totalSkippedWindow,$sw.Elapsed.TotalSeconds)
  return $capped
}

function New-FrontMatter([string]$title,[string]$desc,[string[]]$tags){
  $now = [DateTime]::UtcNow.ToString('yyyy-MM-ddTHH:mm:ssZ')
  $safeTitle = ($title -replace '"','\"').Trim()
  $safeDesc  = ($desc -replace '"','\"').Trim()
  $tagList = ($tags | Where-Object { $_ -and $_.Trim() -ne '' } | ForEach-Object { $t=$_.Trim(); $t = $t -replace "'", "''"; "'$t'" }) -join ', '
  $lines = @('+++',"title = '$safeTitle'","date = $now","lastmod = $now",'draft = false',"tags = [$tagList]","description = '$safeDesc'","[params]","    author = 'sujith'",'+++','')
  return $lines -join "`n"
}

function Convert-ItemsToMarkdown($items,$windowStartLocal,$windowEndLocal){
  $lines=@();
  $lines += '## This period at a glance'
  $lines += ''
  $lines += "**Window:** $($windowStartLocal.ToString('yyyy-MM-dd')) → $($windowEndLocal.ToString('yyyy-MM-dd')) (Europe/Brussels)"
  $lines += ''
  foreach($x in ($items | Sort-Object date -Descending)){
    $bul = ToBulletMd $x.bullets
    $fmtUrl = Format-LinkUrl $x.url
    $line = "- **[$([string](MdEscape $x.title))]($fmtUrl)** — $([string](MdEscape $x.summary))"
    if($bul){ $line += "`n$bul" }
    $lines += $line
  }
  return ($lines -join "`n") + "`n"
}

# Rewritten simplified Write-PerTypePost (front matter fully rebuilt each run to avoid op_Addition issues)
function Write-PerTypePost {
  param(
    [string]$TypeName,[string]$BaseSlug,$Items,[string]$Tag,[string]$Freq,
    [datetime]$WinStartUtc,[datetime]$WinEndUtc,
    [string]$RepoRoot,[string]$ContentDir,
    [System.TimeZoneInfo]$TimeZone
  )
  Log "Write-PerTypePost: start Type=$TypeName Items=$([int]($Items?.Count)) Freq=$Freq"
  if(-not $Items -or $Items.Count -eq 0){ Log 'Write-PerTypePost: no items -> skip'; return $null }
  $winStartLocal = [System.TimeZoneInfo]::ConvertTimeFromUtc($WinStartUtc,$TimeZone)
  $winEndLocal   = [System.TimeZoneInfo]::ConvertTimeFromUtc($WinEndUtc,$TimeZone)
  $cadenceTag = if($Freq){ $Freq } else { 'weekly' }
  $tagsArr = @('updates', $cadenceTag, $Tag) | Select-Object -Unique
  try {
  switch($Freq){
    'biweekly' {
      $w1 = [System.Globalization.ISOWeek]::GetWeekOfYear($winStartLocal)
      $w2 = [System.Globalization.ISOWeek]::GetWeekOfYear($winEndLocal)
      $y1 = [System.Globalization.ISOWeek]::GetYear($winStartLocal)
      $y2 = [System.Globalization.ISOWeek]::GetYear($winEndLocal)
      $weekSpan = if($w1 -eq $w2){ "Week $w1" } else { "Weeks $w1–$w2" }
      $yearSpan = if($y1 -eq $y2){ $y1 } else { "$y1–$y2" }
      $title = "$TypeName Biweekly – $weekSpan $yearSpan"
      if($BaseSlug -match 'weekly'){ $slug = ($BaseSlug -replace 'weekly','biweekly') } else { $slug = "$BaseSlug-biweekly" }
      $folderName = ('{0:0000}-{1:00}-{2}-w{3:D2}-{4:D2}' -f $y1,$winStartLocal.Month,$slug,$w1,$w2)
    }
    'monthly' {
      $monthName = $winStartLocal.ToString('MMMM')
      $yearM = $winStartLocal.Year
      $title = "$TypeName Monthly – $monthName $yearM"
      if($BaseSlug -match 'weekly'){ $slug = ($BaseSlug -replace 'weekly','monthly') } else { $slug = "$BaseSlug-monthly" }
      $folderName = ('{0:0000}-{1:00}-{2}' -f $yearM,$winStartLocal.Month,$slug)
    }
    default {
      $w = [System.Globalization.ISOWeek]::GetWeekOfYear($winStartLocal)
      $yw = [System.Globalization.ISOWeek]::GetYear($winStartLocal)
      $title = "$TypeName Weekly – $yw Week $w"
      $slug = $BaseSlug
      $folderName = ('{0:0000}-{1:00}-{2}-w{3:D2}' -f $yw,$winStartLocal.Month,$slug,$w)
    }
  }
  $desc  = "Highlights from $TypeName between $($winStartLocal.ToString('yyyy-MM-dd')) and $($winEndLocal.ToString('yyyy-MM-dd')) — explore updates, new features, bug fixes, and important enhancements for this period."
  $body  = Convert-ItemsToMarkdown -items $Items -windowStartLocal $winStartLocal -windowEndLocal $winEndLocal
  $targetDir = Join-Path $RepoRoot $ContentDir; New-Item -ItemType Directory -Force -Path $targetDir | Out-Null
  $folder = Join-Path $targetDir $folderName; New-Item -ItemType Directory -Force -Path $folder | Out-Null
  $file = Join-Path $folder 'index.md'
  $nowIso = [DateTime]::UtcNow.ToString('yyyy-MM-ddTHH:mm:ssZ')
  $titleToUse = $title; $dateToUse = $nowIso
  if(Test-Path $file){
    try {
      $lines = Get-Content -Path $file -ErrorAction Stop
      $markerIdxs = @(); for($i=0;$i -lt $lines.Count;$i++){ if($lines[$i].Trim() -eq '+++'){ $markerIdxs += $i } }
      if($markerIdxs.Count -ge 2){
        $openIdx=$markerIdxs[0]; $closeIdx=$markerIdxs[1]
        for($i=$openIdx+1;$i -lt $closeIdx;$i++){
          if($lines[$i] -match "^title\s*=\s*'(.*)'"){ $titleToUse = $matches[1] }
          elseif($lines[$i] -match '^date\s*=\s*([0-9TZ:-]+)'){ $dateToUse = $matches[1] }
        }
      }
    } catch { Write-Warning ("Failed to parse existing front matter for {0}: {1}" -f $file,$_.Exception.Message) }
  }
  # Build new front matter always
  $tagList = ($tagsArr | ForEach-Object { "'$_'" }) -join ', '
  $descEscaped = ($desc -replace "'","''")
  $frontMatter = @(
    '+++',
    "title = '$titleToUse'",
  "date = $dateToUse",
  "lastmod = $nowIso",  # always refreshed on each run
    'draft = false',
    "tags = [$tagList]",
    "description = '$descEscaped'",
    '[params]',
    "    author = 'sujith'",
    '+++',''
  ) -join "`n"
  $output = ($frontMatter + $body)
  if(Test-Path $file){ Log "Updating post (lastmod refresh): $file" } else { Log "Writing new post: $file" }
  Set-Content -Path $file -Value $output -Encoding UTF8
  Log "Write-PerTypePost: done file=$file"
  } catch {
    Write-Warning ("Write-PerTypePost failed Type={0} File={1} Err={2}" -f $TypeName,$file,$_.Exception.Message)
    throw
  }
  return $file
}

function Test-EmitSource { param([string]$SourceName,[hashtable]$FrequencyMap)
  $freq = if($FrequencyMap.ContainsKey($SourceName)){ $FrequencyMap[$SourceName] } else { 'weekly' }
  switch($freq){ 'weekly' { $true }; 'biweekly' { $true }; 'monthly' { $true }; default { $true } }
}

function Summarize-Items {
  param(
    [array]$AllItems,
    [switch]$DisableSummaries,
    [int]$MaxSummaryRetries,
    [int]$SummaryRetryBaseSeconds,
    [hashtable]$HeadersGitHub,
  [switch]$DumpSummaries,
  [string[]]$ModelPool
  )
  $summaries = @(); $swSumm = [System.Diagnostics.Stopwatch]::StartNew(); if($MaxSummaryRetries -lt 1){ $MaxSummaryRetries = 1 }
  $SummaryCache = @{}
  # Determine model pool: use caller-provided list or fallback default (base + -mini variants)
  $baseDefaults = @('openai/gpt-4.1','openai/gpt-4o','openai/gpt-5','openai/o1','openai/o3')
  $defaultExpanded = @(); foreach($b in $baseDefaults){ $defaultExpanded += $b; $defaultExpanded += ("$b-mini") }
  if(-not $ModelPool -or $ModelPool.Count -eq 0){
    # No user pool -> use full default expanded list
    $ModelPool = $defaultExpanded
  Log 'ModelPool: no user-specified models; using full default expanded list'
  } else {
    # User supplied pool -> use exactly as provided (no implicit defaults appended)
    $ModelPool = @($ModelPool)
  Log 'ModelPool: using user-specified list only (no defaults appended)'
  }
  # Normalize pool (trim, dedupe, preserve first occurrence order)
  $seen = @{}; $normalized = @()
  foreach($m in $ModelPool){ if(-not $m){ continue }; $trim = $m.Trim(); if($trim -and -not $seen.ContainsKey($trim)){ $seen[$trim] = $true; $normalized += $trim } }
  # Second-pass: remove stray wrapping single or double quotes (manual to avoid regex escaping issues)
  for($qi=0; $qi -lt $normalized.Count; $qi++){
    $x = $normalized[$qi]
    if([string]::IsNullOrEmpty($x)){ continue }
    if($x.Length -gt 1){
      $first = $x[0]; $last = $x[$x.Length-1]
      if( ($first -eq "'" -and $last -eq "'") -or ($first -eq '"' -and $last -eq '"') ){
        $normalized[$qi] = $x.Substring(1,$x.Length-2)
      }
    }
  }
  $ModelPool = $normalized
  $ModelStatus = [ordered]@{}
  foreach($m in $ModelPool){ $ModelStatus[$m] = [pscustomobject]@{ model=$m; had429=$false; failures=0; successes=0; active=$true } }
  $allModelsDeactivated = $false
  if($DisableSummaries){
    Log 'Summaries disabled (-DisableSummaries); using raw titles only'
    foreach($i in $AllItems){ if(-not $i){ continue }; $summaries += [pscustomobject]@{ source=$i.source; title=$i.title; url=$i.url; date=$i.publishedAt.ToString('yyyy-MM-dd'); summary=Trunc($i.raw,200); bullets=@() } }
  } else {
  Log ("Summarizing {0} items (modelPool={1})" -f $AllItems.Count, ($ModelPool -join ', '))
    for($idx=0; $idx -lt $AllItems.Count; $idx++){
      $i = $AllItems[$idx]; if(-not $i){ continue }
      $label = Trunc $i.title 70
      Log ("  [{0}/{1}] {2} :: {3}" -f ($idx+1), $AllItems.Count, $i.source, $label)
      $swItem=[System.Diagnostics.Stopwatch]::StartNew(); $cacheKey = ($i.source + '|' + $i.title + '|' + $i.publishedAt.ToString('u'))
      if($SummaryCache.ContainsKey($cacheKey)){ Log '    cache hit'; $summaries += $SummaryCache[$cacheKey]; $swItem.Stop(); continue }
      if($allModelsDeactivated){
        $fallback = [pscustomobject]@{ source=$i.source; title=$i.title; url=$i.url; date=$i.publishedAt.ToString('yyyy-MM-dd'); summary=Trunc($i.raw,200); bullets=@() }
        $summaries += $fallback; $SummaryCache[$cacheKey] = $fallback
        Log '    all models deactivated -> raw fallback'
        $swItem.Stop(); continue
      }
      $obtained=$false
  foreach($model in $ModelPool){
        $ms = $ModelStatus[$model]
        if(-not $ms.active){ continue }
        Log "    try model: $model"
        try {
          $prompt = @"
Summarize the following update for a weekly newsletter. Keep it factual. Mention product/area and any version/flag/region/date specifics.

TITLE: $($i.title)
URL: $($i.url)
DATE: $($i.publishedAt.ToString('yyyy-MM-dd'))
SOURCE: $($i.source)
RAW:
$([string]$i.raw)
"@
          $out = Invoke-GitHubModelChat -Prompt $prompt -HeadersGitHub $HeadersGitHub -MaxAttempts $MaxSummaryRetries -BaseDelaySeconds $SummaryRetryBaseSeconds -Model $model
          if(-not $out.summary){ $out = @{ summary = Trunc($i.title,200) } }
          $cleanSummary = Format-BareUrls (($out.summary -replace '\s+',' ').Trim())
          $cleanBullets = @(); foreach($b in @($out.bullets)){ if($b){ $cleanBullets += (Format-BareUrls (($b -replace '\s+',' ').Trim())) } }
          $sum = [pscustomobject]@{ source=$i.source; title=$i.title; url=$i.url; date=$i.publishedAt.ToString('yyyy-MM-dd'); summary=$cleanSummary; bullets=$cleanBullets }
          $summaries += $sum; $SummaryCache[$cacheKey] = $sum
          $ms.successes++
          # Reorder pool: promote successful model to front for subsequent items
          $ModelPool = @($model) + (@($ModelPool | Where-Object { $_ -ne $model }))
          $obtained=$true
          break
        } catch {
          $ms.failures++
          $status = $null; try { $status = $_.Exception.Response.StatusCode.Value__ } catch {}
          if($status -eq 429){
            $ms.had429 = $true; $ms.active = $false
            Log "      429 -> deactivate $model (will try next active model)"
            # loop continues
          } else {
            Log ("      model $model failed status={0} msg={1} -> trying next" -f $status,$_.Exception.Message)
            # keep model active for possible transient non-429? (leave as-is)
            # Permanently deactivate clearly non-retryable client errors
            if($status -in 400,401,403,404,415,422){
              $ms.active = $false
              Log "        status $status deemed non-retryable -> deactivate $model"
            }
          }
        }
      }
      if(-not $obtained){
        Log '    no active models succeeded -> raw fallback'
        $fallback = [pscustomobject]@{ source=$i.source; title=$i.title; url=$i.url; date=$i.publishedAt.ToString('yyyy-MM-dd'); summary=Trunc($i.raw,200); bullets=@() }
        $summaries += $fallback; $SummaryCache[$cacheKey] = $fallback
        if(-not ($ModelStatus.Values | Where-Object { $_.active })){
          $allModelsDeactivated = $true
          Log '    all models now deactivated; remaining items raw'
        }
      }
      $swItem.Stop(); Log ("    took {0:n1} s" -f ($swItem.Elapsed.TotalSeconds))
    }
    Log ("Summarization phase took {0:n1}s" -f $swSumm.Elapsed.TotalSeconds)
    foreach($ms in $ModelStatus.Values){ Log ("ModelStatus :: {0} active={1} successes={2} failures={3} had429={4}" -f $ms.model,$ms.active,$ms.successes,$ms.failures,$ms.had429) }
  }
  if($DumpSummaries){
    Log ("DumpSummaries enabled. Total summaries: {0}" -f $summaries.Count)
    $idx=0; foreach($s in $summaries){ $idx++; $t=Trunc $s.title 70; $sumShort=Trunc $s.summary 160; Log ("  [{0}/{1}] {2} :: {3} :: {4}" -f $idx,$summaries.Count,$s.source,$t,$sumShort) }
  }
  # Expose model status for caller diagnostics
  $script:LastModelStatus = $ModelStatus
  return $summaries
}

function Invoke-WeeklyUpdates {
  param(
    [string]$RepoRoot,[string]$ContentDir,[int]$MaxAzure,[int]$MaxGitHub,[int]$MaxTerraform,
    [string]$Frequencies,[ValidateSet('week','rolling')][string]$WindowType,[int]$RollingDays,
    [switch]$DisableSummaries,[int]$MaxSummaryRetries,[int]$SummaryRetryBaseSeconds,
  [switch]$ShowApiUrls,[switch]$DumpSummaries,[switch]$CleanOutput,
    [string[]]$ModelPool
  )
  # Environment variable overrides (only if caller did not bind the parameter explicitly)
  if(-not $PSBoundParameters.ContainsKey('MaxAzure')     -and $env:MAX_AZURE){     $MaxAzure     = [int]$env:MAX_AZURE }
  if(-not $PSBoundParameters.ContainsKey('MaxGitHub')    -and $env:MAX_GITHUB){    $MaxGitHub    = [int]$env:MAX_GITHUB }
  if(-not $PSBoundParameters.ContainsKey('MaxTerraform') -and $env:MAX_TERRAFORM){ $MaxTerraform = [int]$env:MAX_TERRAFORM }
  Log "Invoke-WeeklyUpdates params -> RepoRoot='$RepoRoot' ContentDir='$ContentDir' MaxAzure=$MaxAzure MaxGitHub=$MaxGitHub MaxTerraform=$MaxTerraform Freq='$Frequencies' WindowType=$WindowType RollingDays=$RollingDays DisableSummaries=$DisableSummaries ShowApiUrls=$ShowApiUrls"
  # Cross-platform timezone resolution (Windows vs Linux/WSL)
  $tz = $null
  $tzIds = @('Romance Standard Time','Europe/Brussels','UTC')
  foreach($id in $tzIds){ try { $tz = [System.TimeZoneInfo]::FindSystemTimeZoneById($id); break } catch {} }
  if(-not $tz){ $tz = [System.TimeZoneInfo]::Utc; Write-Warning 'Falling back to UTC timezone.' }
  $envCtx = Initialize-Environment -Token $env:GITHUB_TOKEN -AllowMissingToken:$DisableSummaries
  $HeadersGitHub = $envCtx.HeadersGitHub
  $TerraformRepos = @("hashicorp/terraform", "hashicorp/terraform-provider-azurerm")
  $TerraformRepos = Validate-TerraformRepos -TerraformRepos $TerraformRepos -Frequencies $Frequencies
  $FrequencyMap = Parse-Frequencies -FreqRaw $Frequencies
  $baseWindow = Compute-BaseWindow -WindowType $WindowType -RollingDays $RollingDays -TimeZone $tz
  $per = Compute-PerSourceWindows -FrequencyMap $FrequencyMap -BaseWindow $baseWindow -TimeZone $tz
  # Clean existing output folders if requested
  if($CleanOutput){
    $targetDir = Join-Path $RepoRoot $ContentDir
    try {
      if(Test-Path $targetDir){
        $resolvedRepo = (Resolve-Path -LiteralPath $RepoRoot).Path
        $resolvedTarget = (Resolve-Path -LiteralPath $targetDir).Path
        if($resolvedTarget -notlike "$resolvedRepo*"){ throw "Refusing to clean outside repo root: $resolvedTarget" }
        Log "CleanOutput: removing existing subfolders under $resolvedTarget"
        Get-ChildItem -Path $resolvedTarget -Directory -ErrorAction SilentlyContinue | ForEach-Object {
          try { Remove-Item -LiteralPath $_.FullName -Recurse -Force -ErrorAction Stop; Log "  Removed folder: $($_.Name)" } catch { Write-Warning "  Failed to remove $($_.FullName): $($_.Exception.Message)" }
        }
      } else { Log "CleanOutput: target directory does not exist yet ($targetDir)" }
    } catch { Write-Warning "CleanOutput failed: $($_.Exception.Message)" }
  }
  # Collect
  $azure = Get-AzureUpdates -StartUtc $per.AzureStart -EndUtc $per.AzureEnd -Limit $MaxAzure -ShowUrls:$ShowApiUrls
  $ghchg = Get-GitHubChangelog -StartUtc $per.GitHubStart -EndUtc $per.GitHubEnd -Limit $MaxGitHub -ShowUrls:$ShowApiUrls
  $tf    = Get-TerraformReleases -Repos $TerraformRepos -StartUtc $per.TerraformStart -EndUtc $per.TerraformEnd -Limit $MaxTerraform -HeadersGitHub $HeadersGitHub -ShowUrls:$ShowApiUrls
  if($azure -and $azure -isnot [System.Array]){ $azure = ,$azure }
  if($ghchg -and $ghchg -isnot [System.Array]){ $ghchg = ,$ghchg }
  if($tf -and $tf -isnot [System.Array]){ $tf = ,$tf }
  Log ("Collected: Azure={0}, GitHub={1}, Terraform={2}" -f $azure.Count,$ghchg.Count,$tf.Count)
  # Safely aggregate items; avoid '+' which fails for single PSCustomObject (op_Addition)
  $all = @()
  if($azure){ if($azure -is [System.Array]){ $all += $azure } else { $all += ,$azure } }
  if($ghchg){ if($ghchg -is [System.Array]){ $all += $ghchg } else { $all += ,$ghchg } }
  if($tf){ if($tf -is [System.Array]){ $all += $tf } else { $all += ,$tf } }
  Log ("Aggregated total items: {0}" -f $all.Count)
  $summaries = Summarize-Items -AllItems $all -DisableSummaries:$DisableSummaries -MaxSummaryRetries $MaxSummaryRetries -SummaryRetryBaseSeconds $SummaryRetryBaseSeconds -HeadersGitHub $HeadersGitHub -DumpSummaries:$DumpSummaries -ModelPool $ModelPool
  $bySource = $summaries | Group-Object source | Sort-Object Name
  $groups=@{}; foreach($g in $bySource){ $groups[$g.Name] = $g.Group }
  $map = @(
    @{ Name='Azure';     Slug='azure-weekly';     Tag='azure' },
    @{ Name='GitHub';    Slug='github-weekly';    Tag='github' },
    @{ Name='Terraform'; Slug='terraform-weekly'; Tag='terraform' }
  )
  $written=@()
  foreach($m in $map){
    $name = $m.Name
    if($groups.ContainsKey($name)){
      if(Test-EmitSource -SourceName $name -FrequencyMap $FrequencyMap){
        switch($name){
          'Azure'     { $ws=$per.AzureStart; $we=$per.AzureEnd }
          'GitHub'    { $ws=$per.GitHubStart; $we=$per.GitHubEnd }
          'Terraform' { $ws=$per.TerraformStart; $we=$per.TerraformEnd }
          default     { $ws=$baseWindow.StartUtc; $we=$baseWindow.EndUtc }
        }
        $freq = if($FrequencyMap.ContainsKey($name)){ $FrequencyMap[$name] } else { 'weekly' }
        $path = Write-PerTypePost -TypeName $name -BaseSlug $m.Slug -Items $groups[$name] -Tag $m.Tag -Freq $freq -WinStartUtc $ws -WinEndUtc $we -RepoRoot $RepoRoot -ContentDir $ContentDir -TimeZone $tz
        if($path){ $written += $path }
      } else { Log "Skipping $name this cycle due to frequency cadence" }
    }
  }
  $totalElapsed = ([DateTime]::UtcNow) - $baseWindow.NowUtc
  Log ("Done. Elapsed ~{0:n1}s. Files written: {1}" -f $totalElapsed.TotalSeconds, $written.Count)
  Write-Host "Written files:`n - " + ($written -join "`n - ")
  return $written
}

# --- ENTRYPOINT ------------------------------------------------------------
try {
  # Normalize ModelPool: handle single comma-separated string or proper array
  if($ModelPool){
    if($ModelPool.Count -eq 1 -and $ModelPool[0] -is [string] -and $ModelPool[0] -match ','){
      $ModelPool = $ModelPool[0].Split(',') | ForEach-Object { $_.Trim() } | Where-Object { $_ }
    }
    # Strip wrapping quotes from each entry
    $before = $ModelPool
    $ModelPool = $ModelPool | ForEach-Object { ($_ -replace "^[`"']+|[`"']+$","" ).Trim() } | Where-Object { $_ }
    if($before -ne $ModelPool){ Log 'ModelPool: sanitized entries (removed wrapping quotes)' }
    Log ("ModelPool (post-normalize) -> count={0} :: {1}" -f $ModelPool.Count, ($ModelPool -join ', '))
  } else {
    Log 'ModelPool not supplied; defaults will be expanded inside Summarize-Items'
  }
  Invoke-WeeklyUpdates -RepoRoot $RepoRoot -ContentDir $ContentDir -MaxAzure $MaxAzure -MaxGitHub $MaxGitHub -MaxTerraform $MaxTerraform -Frequencies $Frequencies -WindowType $WindowType -RollingDays $RollingDays -DisableSummaries:$DisableSummaries -MaxSummaryRetries $MaxSummaryRetries -SummaryRetryBaseSeconds $SummaryRetryBaseSeconds -ShowApiUrls:$ShowApiUrls -DumpSummaries:$DumpSummaries -CleanOutput:$CleanOutput -ModelPool $ModelPool | Out-Null
} catch {
  Write-Error $_
  throw
}
