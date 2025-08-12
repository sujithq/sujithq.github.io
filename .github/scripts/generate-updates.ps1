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
  [int]$MaxAzure = 20,
  [int]$MaxGitHub = 12,
  [int]$MaxTerraform = 8,

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
  [switch]$ShowApiUrls
)
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# --- Config / env
$ErrorActionPreference = 'Stop'
$GHToken = $env:GITHUB_TOKEN
if (-not $GHToken) { Write-Error 'GITHUB_TOKEN is required (with models:read, contents:write).'; exit 1 }

$HeadersGitHub = @{
  'Authorization' = "Bearer $GHToken"
  'Accept'        = 'application/vnd.github+json'
  'X-GitHub-Api-Version' = '2022-11-28'
}

$TerraformRepos = @("hashicorp/terraform", "hashicorp/terraform-provider-azurerm")

function Log($m){ Write-Host "[$(Get-Date -Format 'HH:mm:ss')] $m" }

# --- Time window setup
$tz = [System.TimeZoneInfo]::FindSystemTimeZoneById('Romance Standard Time') # Brussels
$nowUtc = [DateTime]::UtcNow
if($WindowType -eq 'rolling'){
  if($RollingDays -lt 1){ throw 'RollingDays must be >= 1' }
  $weekEndUtc = $nowUtc
  $weekStartUtc = $nowUtc.Date.AddDays(-$RollingDays)
  $weekStartLocal = [System.TimeZoneInfo]::ConvertTimeFromUtc($weekStartUtc,$tz)
  $weekEndLocal = [System.TimeZoneInfo]::ConvertTimeFromUtc($weekEndUtc,$tz)
} else {
  $nowLocal = [System.TimeZoneInfo]::ConvertTimeFromUtc($nowUtc, $tz)
  $dayOfWeek = [int]$nowLocal.DayOfWeek  # Mon=1 .. Sun=0
  $daysSinceMonday = ($dayOfWeek + 6) % 7
  $weekStartLocal = $nowLocal.Date.AddDays(-$daysSinceMonday)
  $weekEndLocal   = $weekStartLocal.AddDays(7).AddSeconds(-1)
  $weekStartUtc   = [System.TimeZoneInfo]::ConvertTimeToUtc($weekStartLocal, $tz)
  $weekEndUtc     = [System.TimeZoneInfo]::ConvertTimeToUtc($weekEndLocal, $tz)
}

# Parse frequency map early (needed for per-source windows)
$FrequencyMap = @{}
foreach($pair in ($Frequencies -split ',')){
  $p = $pair.Trim(); if(-not $p){ continue }
  $kv = $p -split '='; if($kv.Count -ne 2){ continue }
  $FrequencyMap[$kv[0]] = $kv[1].ToLowerInvariant()
}

# --- TerraformRepos strict validation & logging
if($TerraformRepos -is [bool]){
  throw "TerraformRepos was bound as boolean ($TerraformRepos). Pass one or more 'owner/repo' strings: -TerraformRepos 'hashicorp/terraform','hashicorp/terraform-provider-azurerm'"
}
if(-not $TerraformRepos){
  throw "TerraformRepos is empty. Provide at least one 'owner/repo' string."
}
# Coerce single scalar to array (PowerShell already does for [string[]], but be explicit)
if($TerraformRepos -isnot [System.Array]){ $TerraformRepos = @([string]$TerraformRepos) }

# Detect common invocation mistake where second repo got swallowed as Frequencies (no '=' present)
if($TerraformRepos.Count -eq 1 -and $Frequencies -and $Frequencies -notmatch '='){
  Write-Warning "Frequencies value '$Frequencies' does not contain '='; did you forget a comma between Terraform repos? Use: -TerraformRepos 'org/a','org/b'"
}

<# Removed temporary debug output for TerraformRepos enumeration #>

# Validate pattern
$invalid = @()
foreach($tr in $TerraformRepos)
{
  Log "Validating Terraform repo: $tr"
  if($tr -notmatch '^[^/]+/[^/]+$'){ $invalid += $tr }
}
if($invalid.Count -gt 0){ throw "Invalid TerraformRepos entries (expect owner/repo): $($invalid -join ', ')" }
Log ("TerraformRepos ({0}): {1}" -f $TerraformRepos.Count, ($TerraformRepos -join ', '))

# Per-source window overrides
$AzureWindowStartUtc = $weekStartUtc; $AzureWindowEndUtc = $weekEndUtc

if($FrequencyMap.ContainsKey('GitHub') -and $FrequencyMap['GitHub'] -eq 'biweekly'){
  $GitHubWindowStartUtc = $weekStartUtc.AddDays(-7)
} elseif($FrequencyMap.ContainsKey('GitHub') -and $FrequencyMap['GitHub'] -eq 'monthly'){
  $monthStartLocal = (Get-Date -Date $weekStartLocal).AddDays(1 - $weekStartLocal.Day)
  $GitHubWindowStartUtc = [System.TimeZoneInfo]::ConvertTimeToUtc($monthStartLocal,$tz)
} else { $GitHubWindowStartUtc = $weekStartUtc }
$GitHubWindowEndUtc = $weekEndUtc

if($FrequencyMap.ContainsKey('Terraform') -and $FrequencyMap['Terraform'] -eq 'monthly'){
  $monthStartLocalTf = (Get-Date -Date $weekStartLocal).AddDays(1 - $weekStartLocal.Day)
  $TerraformWindowStartUtc = [System.TimeZoneInfo]::ConvertTimeToUtc($monthStartLocalTf,$tz)
} elseif($FrequencyMap.ContainsKey('Terraform') -and $FrequencyMap['Terraform'] -eq 'biweekly'){
  $TerraformWindowStartUtc = $weekStartUtc.AddDays(-7)
} else { $TerraformWindowStartUtc = $weekStartUtc }
$TerraformWindowEndUtc = $weekEndUtc

# --- GitHub Models (Inference) helper
function Invoke-GitHubModelChat {
  param(
    [Parameter(Mandatory)] [string]$Prompt,
    [string]$Model = 'openai/gpt-4o-mini',
    [decimal]$Temperature = 0.2,
    [int]$MaxTokens = 350,
    [int]$MaxAttempts = $MaxSummaryRetries,
    [int]$BaseDelaySeconds = $SummaryRetryBaseSeconds
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
      # Jitter 0-400ms
      $jitterMs = Get-Random -Minimum 0 -Maximum 400
      Log ("  Model 429/5xx attempt {0}/{1}; waiting {2}s (+{3}ms)" -f $attempt,$MaxAttempts,[int]$delay,$jitterMs)
      Start-Sleep -Seconds $delay
      Start-Sleep -Milliseconds $jitterMs
    }
  }
  throw $lastErr
}

# --- Utilities
function Trunc([string]$s,[int]$n=300){ if(-not $s){return ''}; if($s.Length -le $n){return $s}; return $s.Substring(0,$n).Trim() + '…' }
function MdEscape([string]$s){ if(-not $s){return ''}; $s -replace '\|','\\|' }
function ToBulletMd($arr){ if(-not $arr -or $arr.Count -eq 0){ return '' }; ($arr | ForEach-Object { "  - " + ($_ -replace '\n',' ') }) -join "`n" }

# Wrap bare URLs in <> to avoid markdownlint MD034 (no-bare-urls)
function Format-BareUrls([string]$text){
  if(-not $text){ return $text }
  # Skip if already part of a markdown link [text](url)
  return ($text -replace '(?<!\]\()https?://[\w\-\./%?&#=+:~]+', '<$0>')
}

# Normalize URL for markdown link: remove stray trailing ' link' and wrap in < > when query chars present
function Format-LinkUrl([string]$u){
  if(-not $u){ return '' }
  $clean = $u.Trim()
  $clean = $clean -replace '\s+link$',''  # remove literal trailing word 'link'
  # If already enclosed in <>, leave; else wrap when contains query/ampersand or spaces
  if($clean -notmatch '^<.*>$'){
    if($clean -match '[?&]|%'){ $clean = "<$clean>" }
  }
  return $clean
}

# --- Sources
$AzureRss = 'https://aztty.azurewebsites.net/rss/updates'  # Azure Charts consolidated RSS

function Get-AzureUpdates {
  Log 'Fetch: Azure updates (Azure Charts RSS)'
  if($ShowApiUrls){ Log "URL: $AzureRss" } else { Log "URL: $AzureRss" }
  try {
    $resp = Invoke-WebRequest -Uri $AzureRss -Headers @{ 'User-Agent'='weekly-hugo-tracker' } -UseBasicParsing -ErrorAction Stop
    if(-not $resp.Content){ throw 'Empty response body' }
    try { [xml]$rss = $resp.Content } catch { throw "RSS XML parse failed: $($_.Exception.Message)" }
    if(-not $rss.rss.channel.item){ return @() }
    $items = foreach($i in $rss.rss.channel.item){
      if(-not $i.pubDate){ continue }
      $pub = Get-Date $i.pubDate -ErrorAction SilentlyContinue
      if(-not $pub){ continue }
  if($pub -lt $AzureWindowStartUtc -or $pub -gt $AzureWindowEndUtc){ continue }
      [pscustomobject]@{
        source = 'Azure'
        title = [string]$i.title
        url   = [string]$i.link
        publishedAt = $pub.ToUniversalTime()
        raw   = [string]$i.description
      }
    }
    return ($items | Where-Object { $_ }) | Sort-Object publishedAt -Descending | Select-Object -First $MaxAzure
  } catch { Write-Warning "Azure RSS failed: $($_.Exception.Message)"; return @() }
}

$GitHubChangelogRss = 'https://github.blog/changelog/feed/'
function Get-GitHubChangelog {
  Log 'Fetch: GitHub Changelog RSS'
  if($ShowApiUrls){ Log "URL: $GitHubChangelogRss" } else { Log "URL: $GitHubChangelogRss" }
  try {
    $resp = Invoke-WebRequest -Uri $GitHubChangelogRss -Headers @{ 'User-Agent'='weekly-hugo-tracker' } -UseBasicParsing -ErrorAction Stop
    if(-not $resp.Content){ throw 'Empty response body' }
    try { [xml]$rss = $resp.Content } catch { throw "RSS XML parse failed: $($_.Exception.Message)" }
    if(-not $rss.rss.channel.item){ return @() }
    $items = foreach($i in $rss.rss.channel.item){
      if(-not $i.pubDate){ continue }
      $pub = Get-Date $i.pubDate -ErrorAction SilentlyContinue
      if(-not $pub){ continue }
  if($pub -lt $GitHubWindowStartUtc -or $pub -gt $GitHubWindowEndUtc){ continue }
      [pscustomobject]@{
        source = 'GitHub'
        title  = [string]$i.title
        url    = [string]$i.link
        publishedAt = $pub.ToUniversalTime()
        raw    = Trunc([string]$i.'content:encoded', 2000)
      }
    }
    return ($items | Where-Object { $_ }) | Sort-Object publishedAt -Descending | Select-Object -First $MaxGitHub
  } catch { Write-Warning "GitHub Changelog RSS failed: $($_.Exception.Message)"; return @() }
}

function Get-GitHubReleases([string]$owner,[string]$repo,[int]$limit=8){
  $uri = "https://api.github.com/repos/$owner/$repo/releases?per_page=$limit"
  if($ShowApiUrls){ Log "API: $uri" } else { Log "API: $uri" }
  try { return Invoke-RestMethod -Uri $uri -Headers $HeadersGitHub -Method GET }
  catch { Write-Warning "Releases fetch failed for $owner/$repo $_"; return @() }
}
function Get-TerraformReleases {
  Log 'Fetch: Terraform releases'
  # Robust logging: handle case where -TerraformRepos was passed without values (becomes $true)
  # $repoArray = @()
  # if($TerraformRepos -is [System.Array]){ $repoArray = $TerraformRepos }
  # elseif($TerraformRepos -eq $true){ $repoArray = @() } # switch misuse
  # elseif($TerraformRepos){ $repoArray = @([string]$TerraformRepos) }
  # $repoArray = $repoArray | Where-Object { $_ -and ($_ -is [string]) }
  # $joinedRepos = if($repoArray.Count -gt 0){ $repoArray -join ', ' } else { '(none)' }
  # Log "Terraform repositories: $joinedRepos"
  foreach($rr in $TerraformRepos){
    if($rr -notmatch '^[^/]+/[^/]+$'){ Write-Warning "Repo value '$rr' does not match owner/repo pattern" } }
  $items = @()
  $totalFetched = 0; $totalIncluded = 0; $totalSkippedWindow = 0
  $swTf = [System.Diagnostics.Stopwatch]::StartNew()
  foreach($full in $TerraformRepos){
    $parts = $full.Split('/')
    if($parts.Count -ne 2){ continue }
    $owner=$parts[0]; $repo=$parts[1]
    Log "Repo: $owner/$repo (window $TerraformWindowStartUtc -> $TerraformWindowEndUtc)"
    $rels = Get-GitHubReleases -owner $owner -repo $repo -limit 8
    if(-not $rels -or $rels.Count -eq 0){ Log "  No releases returned"; continue }
    Log ("  Releases returned: {0}" -f $rels.Count)
    foreach($r in $rels){
      if(-not $r.published_at){ continue }
      $pub = [datetime]::Parse($r.published_at).ToUniversalTime()
      if($pub -lt $TerraformWindowStartUtc -or $pub -gt $TerraformWindowEndUtc){
        Log "Skip release $($r.tag_name) ($pub) outside window"
        $totalSkippedWindow++
        continue
      }
      $body = [string]($r.body ?? '')
      $items += [pscustomobject]@{
        source = 'Terraform'
        title  = if($r.name){ [string]$r.name } else { [string]$r.tag_name }
        url    = [string]$r.html_url
        publishedAt = $pub
        raw    = Trunc($body, 4000)
      }
      Log "Include release $($r.tag_name) ($pub)"
      $totalIncluded++
      $totalFetched++
    }
  }
  $swTf.Stop()
  $items = $items | Sort-Object publishedAt -Descending
  $beforeCap = $items.Count
  $capped = $items | Select-Object -First $MaxTerraform
  Log ("Terraform summary: included={0} (pre-cap {1}), skippedWindow={2}, elapsed={3:n1}s" -f $capped.Count,$beforeCap,$totalSkippedWindow,$swTf.Elapsed.TotalSeconds)
  return $capped
}

# --- Collect and summarize
$azure = Get-AzureUpdates
$ghchg = Get-GitHubChangelog
$tf    = Get-TerraformReleases

$all = @($azure + $ghchg + $tf)
Log ("Collected: Azure={0}, GitHub={1}, Terraform={2}" -f $azure.Count, $ghchg.Count, $tf.Count)

function Get-ItemSummary($item){
  $prompt = @"
Summarize the following update for a weekly newsletter. Keep it factual. Mention product/area and any version/flag/region/date specifics.

TITLE: $($item.title)
URL: $($item.url)
DATE: $($item.publishedAt.ToString('yyyy-MM-dd'))
SOURCE: $($item.source)
RAW:\n$([string]$item.raw)
"@
  $out = Invoke-GitHubModelChat -Prompt $prompt
  if(-not $out.summary){ $out = @{ summary = Trunc($item.title, 200) } }
  $cleanSummary = Format-BareUrls (($out.summary -replace '\s+',' ').Trim())
  $cleanBullets = @()
  foreach($b in @($out.bullets)){
  if($b){ $cleanBullets += (Format-BareUrls (($b -replace '\s+',' ').Trim())) }
  }
  return [pscustomobject]@{
    source = $item.source
    title  = $item.title
    url    = $item.url
    date   = $item.publishedAt.ToString('yyyy-MM-dd')
    summary = $cleanSummary
    bullets = $cleanBullets
  }
}

$summaries = @()
$swSumm = [System.Diagnostics.Stopwatch]::StartNew()
if($MaxSummaryRetries -lt 1){ $MaxSummaryRetries = 1 }
$SummaryCache = @{}
if($DisableSummaries){
  Log "Summaries disabled (-DisableSummaries); using raw titles only"
  foreach($i in $all){ if(-not $i){ continue }; $summaries += [pscustomobject]@{ source=$i.source; title=$i.title; url=$i.url; date=$i.publishedAt.ToString('yyyy-MM-dd'); summary=Trunc($i.raw,200); bullets=@() } }
} else {
  Log ("Summarizing {0} items" -f $all.Count)
  for($idx=0; $idx -lt $all.Count; $idx++){
    $i = $all[$idx]
    if(-not $i){ continue }
    $label = Trunc $i.title 70
    Log ("  [{0}/{1}] {2} :: {3}" -f ($idx+1), $all.Count, $i.source, $label)
    $swItem = [System.Diagnostics.Stopwatch]::StartNew()
    $cacheKey = ($i.source + '|' + $i.title + '|' + $i.publishedAt.ToString('u'))
    if($SummaryCache.ContainsKey($cacheKey)){
      Log "    cache hit"
      $summaries += $SummaryCache[$cacheKey]
      $swItem.Stop(); continue
    }
    try {
      $sum = Get-ItemSummary $i
      $summaries += $sum
      $SummaryCache[$cacheKey] = $sum
    }
    catch {
      Write-Warning "Summarize failed for item ($label): $($_.Exception.Message) -- fallback to title/raw trunc"
      $fallback = [pscustomobject]@{ source=$i.source; title=$i.title; url=$i.url; date=$i.publishedAt.ToString('yyyy-MM-dd'); summary=Trunc($i.raw,200); bullets=@() }
      $summaries += $fallback
      $SummaryCache[$cacheKey] = $fallback
    }
    finally { $swItem.Stop(); Log ("    took {0:n1} s" -f ($swItem.Elapsed.TotalSeconds)) }
  }
  Log ("Summarization phase took {0:n1}s" -f $swSumm.Elapsed.TotalSeconds)
}
$bySource = $summaries | Group-Object source | Sort-Object Name

# --- Renderers
function New-FrontMatter([string]$title,[string]$desc,[string[]]$tags){
  $now = [DateTime]::UtcNow.ToString('yyyy-MM-ddTHH:mm:ssZ')
  $safeTitle = ($title -replace '"','\"').Trim()
  $safeDesc  = ($desc -replace '"','\"').Trim()
  # Build list of single-quoted, trimmed tags
  $tagList = ($tags |
    Where-Object { $_ -and $_.Trim() -ne '' } |
    ForEach-Object {
      $t = $_.Trim()
      # Escape any internal single quote by doubling it (TOML single-quoted strings use literal form; doubling is safest here)
      $t = $t -replace "'", "''"
      "'$t'"
    }) -join ', '
  $lines = @(
    '+++',
  "title = '$safeTitle'",
    "date = $now",
    "lastmod = $now",
    'draft = false',
    "tags = [$tagList]",
  "description = '$safeDesc'",
  "[params]",
  "    author = 'sujith'"
    '+++',''
  )
  return $lines -join "`n"
}

function Convert-ItemsToMarkdown($items,$windowStartLocal,$windowEndLocal){
  $lines = @()
  $lines += "## This period at a glance"
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

function Write-PerTypePost($typeName,$baseSlug,$items,$tag,$freq,$winStartUtc,$winEndUtc){
  if(-not $items -or $items.Count -eq 0){ return $null }
  $winStartLocal = [System.TimeZoneInfo]::ConvertTimeFromUtc($winStartUtc,$tz)
  $winEndLocal   = [System.TimeZoneInfo]::ConvertTimeFromUtc($winEndUtc,$tz)
  $cadenceTag = if($freq){ $freq } else { 'weekly' }
  $tagsArr = @('updates', $cadenceTag, $tag) | Select-Object -Unique

  switch($freq){
    'biweekly' {
      $w1 = [System.Globalization.ISOWeek]::GetWeekOfYear($winStartLocal)
      $w2 = [System.Globalization.ISOWeek]::GetWeekOfYear($winEndLocal)
      $y1 = [System.Globalization.ISOWeek]::GetYear($winStartLocal)
      $y2 = [System.Globalization.ISOWeek]::GetYear($winEndLocal)
      $weekSpan = if($w1 -eq $w2){ "Week $w1" } else { "Weeks $w1–$w2" }
      $yearSpan = if($y1 -eq $y2){ $y1 } else { "$y1–$y2" }
      $title = "$typeName Biweekly – $weekSpan $yearSpan"
      if($baseSlug -match 'weekly'){ $slug = ($baseSlug -replace 'weekly','biweekly') } else { $slug = "$baseSlug-biweekly" }
      $folderName = ('{0:0000}-{1:00}-{2}-w{3:D2}-{4:D2}' -f $y1,$winStartLocal.Month,$slug,$w1,$w2)
    }
    'monthly' {
      $monthName = $winStartLocal.ToString('MMMM')
      $yearM = $winStartLocal.Year
      $title = "$typeName Monthly – $monthName $yearM"
      if($baseSlug -match 'weekly'){ $slug = ($baseSlug -replace 'weekly','monthly') } else { $slug = "$baseSlug-monthly" }
      $folderName = ('{0:0000}-{1:00}-{2}' -f $yearM,$winStartLocal.Month,$slug)
    }
    default {
      $w = [System.Globalization.ISOWeek]::GetWeekOfYear($winStartLocal)
      $yw = [System.Globalization.ISOWeek]::GetYear($winStartLocal)
      $title = "$typeName Weekly – $yw Week $w"
      $slug = $baseSlug
      $folderName = ('{0:0000}-{1:00}-{2}-w{3:D2}' -f $yw,$winStartLocal.Month,$slug,$w)
    }
  }

  $desc  = "Highlights from $typeName between $($winStartLocal.ToString('yyyy-MM-dd')) and $($winEndLocal.ToString('yyyy-MM-dd'))."
  $body = Convert-ItemsToMarkdown -items $items -windowStartLocal $winStartLocal -windowEndLocal $winEndLocal

  $targetDir = Join-Path $RepoRoot $ContentDir
  New-Item -ItemType Directory -Force -Path $targetDir | Out-Null
  $folder = Join-Path $targetDir $folderName
  New-Item -ItemType Directory -Force -Path $folder | Out-Null
  $file = Join-Path $folder 'index.md'

  $nowIso = [DateTime]::UtcNow.ToString('yyyy-MM-ddTHH:mm:ssZ')

  if(Test-Path $file){
    # Update lastmod only; preserve original front matter (title/date/tags/description/etc.)
    $existingLines = Get-Content -Path $file
    $openIdx = ($existingLines | Select-String -SimpleMatch '+++' | Select-Object -First 1).LineNumber - 1
    $closeIdx = ($existingLines | Select-String -SimpleMatch '+++' | Select-Object -Skip 1 -First 1).LineNumber - 1
    if($openIdx -ge 0 -and $closeIdx -gt $openIdx){
      for($i = $openIdx+1; $i -lt $closeIdx; $i++){
        if($existingLines[$i] -match '^\s*lastmod\s*='){ $existingLines[$i] = "lastmod = $nowIso" }
      }
      if(-not ($existingLines[$openIdx+1..($closeIdx-1)] -match '^\s*lastmod\s*=')){
        # Insert lastmod before closing delimiter
        $existingLines = @($existingLines[0..($closeIdx-1)] + @("lastmod = $nowIso") + $existingLines[$closeIdx..($existingLines.Count-1)])
        # Recompute closeIdx not needed further
      }
      $frontMatter = $existingLines[0..$closeIdx]
      $newContent = ($frontMatter + '' + $body.TrimEnd())
      Log "Updating existing post (lastmod + body): $file"
      Set-Content -Path $file -Value $newContent -Encoding UTF8
    } else {
      # Fallback: regenerate full front matter if delimiters not found
      $fm = New-FrontMatter -title $title -desc $desc -tags $tagsArr
      Log "Regenerating malformed front matter: $file"
      Set-Content -Path $file -Value ($fm + $body) -Encoding UTF8
    }
  } else {
    $fm = New-FrontMatter -title $title -desc $desc -tags $tagsArr
    Log "Writing new post: $file"
    Set-Content -Path $file -Value ($fm + $body) -Encoding UTF8
  }
  return $file
}

# Map & write
$written = @()
$map = @(
  @{ Name='Azure';     Slug='azure-weekly';     Tag='azure' },
  @{ Name='GitHub';    Slug='github-weekly';    Tag='github' },
  @{ Name='Terraform'; Slug='terraform-weekly'; Tag='terraform' }
)

function Test-EmitSource([string]$sourceName){
  $freq = if($FrequencyMap.ContainsKey($sourceName)){ $FrequencyMap[$sourceName] } else { 'weekly' }
  switch($freq){
  'weekly'   { return $true }
  'biweekly' { return $true }  # always emit; window already spans 2 weeks
  'monthly'  { return $true } # always emit; window already spans full month
    default    { return $true }
  }
}

# Build simple name -> items map (avoid nesting GroupInfo objects)
$groups = @{}
foreach($g in $bySource){ $groups[$g.Name] = $g.Group }

foreach($m in $map){
  $name = $m.Name
  if($groups.ContainsKey($name)){
  if(Test-EmitSource $name){
      $itemsForSource = $groups[$name]
      # Determine window used for this source
      switch($name){
        'Azure'     { $ws=$AzureWindowStartUtc; $we=$AzureWindowEndUtc }
        'GitHub'    { $ws=$GitHubWindowStartUtc; $we=$GitHubWindowEndUtc }
        'Terraform' { $ws=$TerraformWindowStartUtc; $we=$TerraformWindowEndUtc }
        default     { $ws=$weekStartUtc; $we=$weekEndUtc }
      }
      $freq = if($FrequencyMap.ContainsKey($name)){ $FrequencyMap[$name] } else { 'weekly' }
      $path = Write-PerTypePost -typeName $name -baseSlug $m.Slug -items $itemsForSource -tag $m.Tag -freq $freq -winStartUtc $ws -winEndUtc $we
      if($path){ $written += $path }
    } else {
      Log "Skipping $name this week due to frequency cadence"
    }
  }
}

$totalElapsed = (Get-Date) - $nowUtc
Log ("Done. Elapsed ~{0:n1}s. Files written: {1}" -f $totalElapsed.TotalSeconds, $written.Count)
Write-Host "Written files:`n - " + ($written -join "`n - ")
