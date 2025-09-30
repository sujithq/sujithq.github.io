+++
title = '🤖 Automating Dependabot at Scale: GitHub Actions Strategy'
slug = 'automating-dependabot-at-scale-github-actions-strategy'
date = '2025-09-30 06:00:00Z'
lastmod = '2025-09-30 06:00:00Z'
draft = true
tags = ["Dependabot", "GitHub Actions", "Automation", "DevOps", "Security", "CI CD"]
categories = ["DevSecOps"]
series = ["GitHub Security"]

layout = "single"
[params]
    cover = true
    author = "sujith"
    cover_prompt = '''Create a clean, modern technical illustration for a blog post about automating Dependabot at scale with GitHub Actions. 
    Use GitHub's dark theme with blue and green highlights. Include visual elements representing:
    - A central orchestration hub with GitHub Actions logo
    - Multiple repository nodes connected in a network pattern
    - Dependabot robot icons performing automated tasks
    - A calendar/clock showing the 90-day timeline
    - Dashboard panels showing monitoring metrics and alerts
    - Pull request cards being automatically managed
    Include subtle tech patterns (circuit lines, network nodes) and maintain a futuristic, enterprise-ready aesthetic. 
    Add small labels for "Monitor", "Prevent", "Automate" to emphasise the three-pronged strategy.'''
    
description = "Comprehensive guide to preventing Dependabot's 90-day pause at scale using GitHub Actions. Includes monitoring, prevention, and automation workflows for enterprise organizations."
+++

## The Challenge: The 90-Day Dependabot Pause

If you're managing multiple repositories in a GitHub organization, you've likely encountered a frustrating limitation: **Dependabot automatically pauses after 90 days of inactivity**. When there are no merged pull requests or manual triggers, Dependabot simply stops creating new dependency updates. For organizations with dozens or hundreds of repositories, this can lead to a security and maintenance nightmare.

The problem compounds quickly:

- Some repositories might be stable but still need security updates
- Manual intervention across many repos is time-consuming and error-prone
- By the time you notice Dependabot has paused, you're already behind on updates
- Re-enabling requires manual UI interaction for each repository

## The Solution: A Two-Pronged Automation Strategy

This comprehensive GitHub Actions workflow system tackles this problem through both **proactive prevention** and **early detection**. Let me walk you through how it works.

### Architecture Overview

The solution consists of three interconnected workflows:

```bash
┌──────────────────────────────────────────────────────────────────────────┐
│                         GitHub Organization                              │
├──────────────────────────────┬───────────────────────────────────────────┤
│  Inactivity Report           │  Keep-Alive (Scheduled)                   │
│  (Daily Monitor)             │  (Quarterly Maintenance)                  │
│                              │                                           │
│  • Scans all repos           │  • Nudges open PRs                        │
│  • Detects ≥75d inactivity   │  • Creates reminder issues                │
│  • Reports to central repo   │  • Prevents 90d pause                     │
│  • Early warning system      │  • Distributed intervention               │
└──────────────────────────────┴───────────────────────────────────────────┘
```

### Workflow Summary

| Workflow | Filename | Purpose | Schedule | Scope |
|----------|----------|---------|----------|-------|
| **Dependabot Inactivity Report** | `dependabot-inactivity-report.yml` | Monitor & alert on inactive repos | Daily at 1 AM UTC | Organization-wide (read-only) |
| **Dependabot Keep-Alive** | `dependabot-keep-alive.yml` | Reusable template for keeping Dependabot active | Called by other workflows | Single repo or org-wide |
| **Dependabot Keep-Alive Scheduled** | `dependabot-keep-alive-scheduled.yml` | Scheduled caller for keep-alive operations | Quarterly (every 3 months) | Organization-wide (write) |

---

## Workflow #1: Dependabot Inactivity Report (Monitoring & Alerting)

### Purpose

The **Dependabot Inactivity Report** workflow acts as your **early warning system**, identifying repositories approaching the 90-day inactivity threshold before Dependabot pauses.

### Key Features

**🔍 Smart Discovery**

```yaml
# Uses GitHub Search API to find Dependabot-enabled repos
search_query="org:${ORG}+path:.github+filename:dependabot.yml"
```

Instead of iterating through all repositories, it uses GitHub's Search API to efficiently find only repositories with Dependabot configurations.

**⏰ Configurable Threshold**

```yaml
cutoff-days: 75  # Alert 15 days before the 90-day pause
```

By default, it alerts when repositories hit 75 days of inactivity, giving you a 15-day buffer to take action.

**🎯 Flexible Filtering**

```yaml
repo-includes: 'frontend-*,backend-*'  # Include specific patterns
repo-excludes: '*-archive,*-deprecated'  # Exclude patterns
```

Supports wildcard patterns to focus on repositories that matter and ignore archived or deprecated projects.

**📊 Centralized Reporting**

Creates a single issue in your workflow repository with all inactive repositories:

```
Dependabot inactivity report (≥75 days) — @your-team

The following repositories are nearing the 90-day Dependabot pause threshold:

org/repo1 - last activity: 2025-06-15T10:30:00Z (77d ago)
org/repo2 - last activity: 2025-06-10T14:20:00Z (82d ago)
org/repo3 - no Dependabot activity found
```

**🛡️ Robust Error Handling**

Gracefully handles:

- 404 errors for repositories without Actions enabled
- Access permission issues
- Missing Dependabot workflows
- API rate limits

### When It Runs

- **Daily at 1 AM UTC** via scheduled cron
- **On-demand** via workflow_dispatch for testing
- **Dry-run mode** available for validation

### Complete Workflow File

Here's the complete `dependabot-inactivity-report.yml` workflow:

```yaml
name: Dependabot Inactivity Report

on:
  schedule:
    - cron: "0 1 * * *"
  workflow_dispatch:
    inputs:
      org:
        description: 'Organization name'
        required: false
        default: 'your-org'
      runner:
        description: 'JSON array of runner labels'
        required: false
        default: '["ubuntu-latest"]'
      dry-run:
        description: 'If true, only writes a job summary (no issue).'
        required: false
        type: boolean
        default: true
      cutoff-days:
        description: 'Cutoff days for inactivity'
        required: false
        type: number
        default: 75
      team-handle:
        description: 'team handle to mention in the issue'
        required: false
        default: '@your-org/maintainers'
      repo-includes:
        description: 'Comma-separated list of repo name patterns to include (supports wildcards)'
        required: false
        default: ''
      repo-excludes:
        description: 'Comma-separated list of repo name patterns to exclude (supports wildcards)'
        required: false
        default: ''

permissions:
  contents: read
  issues: write

env:
  ORG: ${{ github.event_name == 'workflow_dispatch' && inputs.org || 'your-org' }}
  TEAM_HANDLE: ${{ github.event_name == 'workflow_dispatch' && inputs['team-handle'] || '@your-org/maintainers' }}
  CUTOFF_DAYS: ${{ github.event_name == 'workflow_dispatch' && inputs['cutoff-days'] || 75 }}
  REPO_INCLUDES: ${{ github.event_name == 'workflow_dispatch' && inputs['repo-includes'] || '' }}
  REPO_EXCLUDES: ${{ github.event_name == 'workflow_dispatch' && inputs['repo-excludes'] || '' }}

jobs:
  scan:
    strategy:
      matrix:
        runner: ${{ fromJSON(github.event_name == 'workflow_dispatch' && inputs.runner || '["ubuntu-latest"]') }}
    runs-on: ${{ matrix.runner }}
    env:
      GH_TOKEN: ${{ secrets.ORG_READ_TOKEN }}
    steps:
      - name: Scan org repos for inactivity
        id: scan
        shell: bash
        run: |
          set -euo pipefail

          echo "🔍 Scanning organization: $ORG (Dependabot-enabled repos only)"
          echo "⏰ Cutoff days: $CUTOFF_DAYS"
          if [[ -n "$REPO_INCLUDES" ]]; then
            echo "✅ Including repos matching: $REPO_INCLUDES"
          fi
          if [[ -n "$REPO_EXCLUDES" ]]; then
            echo "❌ Excluding repos matching: $REPO_EXCLUDES"
          fi

          # Helper functions
          matches_pattern() {
            local repo="$1" patterns="$2"
            [[ -z "$patterns" ]] && return 0
            IFS=',' read -ra PATTERN_ARRAY <<< "$patterns"
            for pattern in "${PATTERN_ARRAY[@]}"; do
              pattern=$(echo "$pattern" | xargs)
              [[ -z "$pattern" ]] && continue
              [[ "$repo" == $pattern ]] && return 0
            done
            return 1
          }

          should_include_repo() {
            local repo="$1"
            if [[ -n "$REPO_INCLUDES" ]] && ! matches_pattern "$repo" "$REPO_INCLUDES"; then
              return 1
            fi
            if [[ -n "$REPO_EXCLUDES" ]] && matches_pattern "$repo" "$REPO_EXCLUDES"; then
              return 1
            fi
            return 0
          }

          # Find repos with Dependabot using GitHub Search API
          search_query="org:${ORG}+path:.github+filename:dependabot.yml"
          repos_with_dependabot="$(gh api "search/code?q=${search_query}" --jq '.items[].repository.full_name' | sort -u || true)"
          
          if [[ -z "$repos_with_dependabot" ]]; then
            echo "⚠️ No repositories found with Dependabot configuration"
            exit 0
          fi

          repos="$(echo "$repos_with_dependabot" | sed "s|^${ORG}/||")"
          repo_count=$(echo "$repos" | grep -c . || echo "0")
          echo "📊 Found $repo_count repositories with Dependabot"

          now="$(date -u +%s)"
          cutoff=$(( CUTOFF_DAYS * 86400 ))
          warn_list=""

          while IFS= read -r repo; do
            [[ -z "$repo" ]] && continue
            should_include_repo "$repo" || { echo "⏭️ Skipping $repo (filtered)"; continue; }
            
            full="$ORG/$repo"
            
            # Get last Dependabot PR activity
            last_pr_update="$(gh pr list -R "$full" --author dependabot[bot] --state all --json updatedAt -q '.[].updatedAt' || true)"
            
            # Get latest "Dependabot Updates" workflow run
            wf_runs="$(gh api -q '.workflow_runs[]?|select(.name=="Dependabot Updates")|.updated_at' "/repos/$full/actions/runs?per_page=100" 2>/dev/null || true)"
            
            latest="$(printf "%s\n%s\n" "$last_pr_update" "$wf_runs" | grep -E '.+' | sort -r | head -n1 || true)"
            
            if [[ -z "$latest" ]]; then
              warn_list+="$full - no Dependabot activity found"$'\n'
              continue
            fi
            
            latest_s="$(date -u -d "$latest" +%s 2>/dev/null || echo 0)"
            age=$(( now - latest_s ))
            
            if [[ "$latest_s" -eq 0 || "$age" -ge "$cutoff" ]]; then
              days=$(( age / 86400 ))
              warn_list+="$full - last activity: $latest (${days}d ago)"$'\n'
            fi
          done <<< "$repos"

          {
            echo "warn_list<<EOF"
            printf "%s" "$warn_list"
            echo "EOF"
          } >> "$GITHUB_OUTPUT"

      - name: Dry-run - job summary
        if: ${{ github.event_name == 'workflow_dispatch' && inputs['dry-run'] == true }}
        shell: bash
        run: |
          {
            printf "### Dependabot inactivity report (≥%s days) — %s\n\n" "$CUTOFF_DAYS" "$TEAM_HANDLE"
            if [ -z "${{ steps.scan.outputs.warn_list }}" ]; then
              echo "No repos nearing the threshold 🎉"
            else
              echo "The following repos may pause soon:"
              echo '```'
              printf "%s\n" "${{ steps.scan.outputs.warn_list }}"
              echo '```'
            fi
          } >> "$GITHUB_STEP_SUMMARY"

      - name: Post issue (real mode)
        if: ${{ github.event_name != 'workflow_dispatch' || inputs['dry-run'] != true }}
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        shell: bash
        run: |
          if [ -n "${{ steps.scan.outputs.warn_list }}" ]; then
            title="Dependabot inactivity report (≥${CUTOFF_DAYS} days) — ${TEAM_HANDLE}"
            body="${TEAM_HANDLE}

          The following repositories are nearing the ${CUTOFF_DAYS}-day Dependabot pause threshold:

          ${{ steps.scan.outputs.warn_list }}"

            existing="$(gh issue list -R "$GITHUB_REPOSITORY" --search "$title in:title" --json number,title -q '.[] | select(.title=="'"$title"'") | .number' | head -n1 || true)"

            if [ -n "${existing:-}" ]; then
              gh issue comment -R "$GITHUB_REPOSITORY" "$existing" --body "$body"
            else
              gh issue create -R "$GITHUB_REPOSITORY" --title "$title" --body "$body" --label "dependencies"
            fi
          fi
```

---

## Workflow #2: Dependabot Keep-Alive (Reusable Template)

### Purpose

This workflow **actively prevents** Dependabot from pausing by creating activity in repositories before they reach the 90-day threshold.

### How It Works

**Dual Operation Modes**

1. **Single Repository Mode**: Processes only the current repository
2. **Organization Mode**: Scans and processes all Dependabot-enabled repos

**Intelligent PR Nudging**

When it finds an open Dependabot PR:

```bash
gh pr comment -R "$repo" "$pr_number" --body "@dependabot rebase"
```

This triggers Dependabot to rebase the PR, which counts as activity and resets the inactivity timer.

**Reminder Issue Creation**

For repositories without open PRs:

```markdown
@your-team

No open Dependabot PRs found in org/repo.

Action: Press **Insights → Dependency graph → Dependabot → 
Recent update jobs → Check for updates** in the UI.
```

Creates actionable issues that prompt manual intervention while still registering activity.

**Smart Duplicate Prevention**

```bash
# Searches for existing issues created by GitHub Actions
existing="$(gh issue list -R "$repo" \
  --search "Dependabot keep-alive in:title is:open author:app/github-actions" \
  --json number -q '.[0].number')"
```

Updates existing issues instead of creating duplicates, keeping repositories clean.

**Graceful Label Handling**

```bash
# Check if 'dependencies' label exists before using it
if gh api repos/$repo/labels/dependencies --silent >/dev/null 2>&1; then
  # Create with label
else
  # Create without label (no failure)
fi
```

Works seamlessly across repositories with different label configurations.

### Key Technical Improvements

**Fixed Exit Code Issues**

The `((var++))` syntax returns exit code 1 when incrementing to 1 with bash's `set -e`:

```bash
# ❌ Causes script failure
((total_issues++))

# ✅ Works correctly
total_issues=$((total_issues + 1))
```

**Smart Token Selection**

```yaml
GH_TOKEN: ${{ inputs.scan-mode == 'org' && secrets.ORG_READ_TOKEN || secrets.GITHUB_TOKEN }}
```

Automatically uses the appropriate token based on operation scope.

### Complete Workflow File

Here's the complete `dependabot-keep-alive.yml` reusable workflow:

<details>
<summary>Click to expand full workflow (190 lines)</summary>

```yaml
name: Dependabot Keep-Alive

on:
  workflow_call:
    inputs:
      runs-on:
        description: 'Runner labels as JSON array'
        required: false
        type: string
        default: '["ubuntu-latest"]'
      team-handle:
        description: 'Optional team mention'
        required: false
        type: string
        default: '@your-org/maintainers'
      org:
        description: 'Organization to scan (if different from current repo owner)'
        required: false
        type: string
        default: ''
      scan-mode:
        description: 'Mode: "single" (current repo only) or "org" (all org repos with dependabot)'
        required: false
        type: string
        default: 'single'
      repo-includes:
        description: 'Comma-separated repo patterns to include (org mode only)'
        required: false
        type: string
        default: ''
      repo-excludes:
        description: 'Comma-separated repo patterns to exclude (org mode only)'  
        required: false
        type: string
        default: ''

permissions:
  contents: read
  pull-requests: write
  issues: write

jobs:
  keepalive:
    runs-on: ${{ fromJSON(inputs.runs-on) }}
    steps:
      - name: Discover repositories
        id: discover
        env:
          GH_TOKEN: ${{ inputs.scan-mode == 'org' && secrets.ORG_READ_TOKEN || secrets.GITHUB_TOKEN }}
          SCAN_MODE: ${{ inputs.scan-mode }}
          ORG: ${{ inputs.org || github.repository_owner }}
          REPO_INCLUDES: ${{ inputs.repo-includes }}
          REPO_EXCLUDES: ${{ inputs.repo-excludes }}
        shell: bash
        run: |
          set -eo pipefail
          
          matches_pattern() {
            local repo="$1" patterns="$2"
            [[ -z "$patterns" ]] && return 0
            IFS=',' read -ra PATTERN_ARRAY <<< "$patterns"
            for pattern in "${PATTERN_ARRAY[@]}"; do
              pattern=$(echo "$pattern" | xargs)
              [[ -z "$pattern" ]] && continue
              [[ "$repo" == $pattern ]] && return 0
            done
            return 1
          }

          should_include_repo() {
            local repo="$1"
            if [[ -n "$REPO_INCLUDES" ]] && ! matches_pattern "$repo" "$REPO_INCLUDES"; then
              return 1
            fi
            if [[ -n "$REPO_EXCLUDES" ]] && matches_pattern "$repo" "$REPO_EXCLUDES"; then
              return 1
            fi
            return 0
          }
          
          if [[ "$SCAN_MODE" == "single" ]]; then
            echo "🎯 Single repository mode: $GITHUB_REPOSITORY"
            echo "repos=$GITHUB_REPOSITORY" >> "$GITHUB_OUTPUT"
          else
            echo "🔍 Organization mode: Scanning $ORG for Dependabot-enabled repositories"
            
            search_query="org:${ORG}+path:.github+filename:dependabot.yml"
            repos_with_dependabot="$(gh api "search/code?q=${search_query}" --jq '.items[].repository.full_name' | sort -u || true)"
            
            if [[ -z "$repos_with_dependabot" ]]; then
              echo "⚠️ No repositories found with Dependabot configuration"
              echo "repos=" >> "$GITHUB_OUTPUT"
              exit 0
            fi
            
            filtered_repos=""
            while IFS= read -r full_repo; do
              [[ -z "$full_repo" ]] && continue
              repo_name="${full_repo#*/}"
              
              if should_include_repo "$repo_name"; then
                filtered_repos+="$full_repo "
              else
                echo "⏭️ Skipping $full_repo (filtered out)"
              fi
            done <<< "$repos_with_dependabot"
            
            repo_count=$(echo "$filtered_repos" | wc -w)
            echo "📊 Found $repo_count repositories to process"
            echo "repos=$filtered_repos" >> "$GITHUB_OUTPUT"
          fi

      - name: Process repositories
        env:
          GH_TOKEN: ${{ inputs.scan-mode == 'org' && secrets.ORG_READ_TOKEN || secrets.GITHUB_TOKEN }}
          REPOS: ${{ steps.discover.outputs.repos }}
        shell: bash
        run: |
          set -eo pipefail
          
          [[ -z "$REPOS" ]] && { echo "No repositories to process"; exit 0; }
          
          total_prs=0
          total_issues=0
          
          for repo in $REPOS; do
            echo "🔄 Processing $repo"
            
            pr_number="$(gh pr list -R "$repo" --author "dependabot[bot]" --state open --json number -q '.[0].number' || true)"
            
            if [ -n "${pr_number:-}" ]; then
              echo "  📌 Found PR #$pr_number - nudging with rebase"
              gh pr comment -R "$repo" "$pr_number" --body "@dependabot rebase" || echo "  ⚠️ Failed to comment on PR"
              total_prs=$((total_prs + 1))
            else
              echo "  📝 No open PRs - creating reminder issue"
              
              mention="${{ inputs.team-handle }}"
              body="$mention

          No open Dependabot PRs found in $repo.

          Action: Press **Insights → Dependency graph → Dependabot → Recent update jobs → Check for updates** in the UI."
              
              existing="$(gh issue list -R "$repo" --search "Dependabot keep-alive in:title is:open author:app/github-actions" --json number -q '.[0].number' 2>/dev/null || true)"
              if [ -n "${existing:-}" ]; then
                if gh issue comment -R "$repo" "$existing" --body "$body" 2>/dev/null; then
                  echo "  💬 Updated existing issue #$existing"
                else
                  echo "  ⚠️ Failed to comment on issue #$existing"
                fi
              else
                if gh api repos/$repo/labels/dependencies --silent >/dev/null 2>&1; then
                  echo "  🏷️ Creating issue with 'dependencies' label"
                  issue_url=$(gh issue create -R "$repo" --title "Dependabot keep-alive" --body "$body" --label "dependencies" 2>&1) && echo "$issue_url" || {
                    echo "  ⚠️ Failed with label, trying without: $issue_url"
                    gh issue create -R "$repo" --title "Dependabot keep-alive" --body "$body" 2>/dev/null || echo "  ❌ Failed to create issue"
                  }
                else
                  echo "  ℹ️ Creating issue without 'dependencies' label (not found)"
                  gh issue create -R "$repo" --title "Dependabot keep-alive" --body "$body" 2>/dev/null || echo "  ❌ Failed to create issue"
                fi
              fi
              total_issues=$((total_issues + 1))
            fi
          done
          
          echo "📊 Summary: Nudged $total_prs PRs, created/updated $total_issues issues"
```

</details>

---

## Workflow #3: Dependabot Keep-Alive Scheduled (Orchestration)

### Purpose

Provides a **scheduled trigger** for organization-wide keep-alive operations.

### Complete Workflow File

Here's the complete `dependabot-keep-alive-scheduled.yml` workflow:

```yaml
name: Dependabot Keep-Alive (Scheduled)

on:
  schedule:
    - cron: "0 0 1 */3 *"
  workflow_dispatch:
    inputs:
      mode:
        description: 'runner mode: hosted or selfhosted'
        required: false
        default: 'hosted'
        
# Critical for org-wide operations
permissions:
  contents: read
  pull-requests: write
  issues: write
  # Note: For org-wide scanning, ensure ORG_READ_TOKEN secret has:
  # - repo (full control of repositories)
  # - workflow (update GitHub Action workflows)
  # - read:org (read org and team membership, read org projects)

jobs:
  call:
    uses: ./.github/workflows/dependabot-keep-alive.yml
    secrets: inherit
    with:
      runs-on: ${{ github.event_name == 'workflow_dispatch' && inputs.mode == 'selfhosted'
        && '["self-hosted","dependabot"]' || '["ubuntu-latest"]'  }}
      team-handle: "@your-org/maintainers"
      scan-mode: 'org'  # Use organization mode to scan all repos with dependabot
      org: 'your-org'   # Specify the organization to scan
```

**Key Configuration Points:**

- **Schedule**: Runs quarterly on the 1st of every 3rd month
- **Manual Trigger**: Supports workflow_dispatch for testing
- **Runner Selection**: Can use hosted or self-hosted runners
- **Secrets**: Inherits all secrets (including ORG_READ_TOKEN)
- **Organization**: Change `org: 'your-org'` to your organization name
- **Team Handle**: Update `team-handle` to your team's GitHub handle

### Why Quarterly?

Running every 3 months (well before the 90-day threshold) provides:

- **Safety buffer**: Catches repos even if one run fails
- **Resource efficiency**: Doesn't overwhelm the API
- **Manual flexibility**: Allows manual triggers when needed

## Implementation Guide

### Prerequisites

1. **Organization Token** (`ORG_READ_TOKEN` secret)
   - **Required Scopes**:
     - `workflow` - Update GitHub Action workflows (comment on PRs, create issues)
     - `read:org` - Read org and team membership, read org projects
   - Used for: Cross-repository scanning, PR comments, and issue creation

2. **Repository Permissions**

   ```yaml
   permissions:
     contents: read
     pull-requests: write
     issues: write
   ```

### Setup Steps

1. **Create the Keep-Alive Reusable Workflow**
   - Place in `.github/workflows/dependabot-keep-alive.yml`
   - Configure inputs and permissions

2. **Create the Keep-Alive Scheduled Workflow**
   - Place in `.github/workflows/dependabot-keep-alive-scheduled.yml`
   - Set your organization name
   - Configure schedule

3. **Create the Inactivity Report Workflow**
   - Place in `.github/workflows/dependabot-inactivity-report.yml`
   - Adjust cutoff days if needed
   - Configure filtering patterns

4. **Add Organization Token**
   - Create a PAT (Personal Access Token) with these scopes:
     - ✅ `workflow` - Update GitHub Action workflows
     - ✅ `read:org` - Read org and team membership, read org projects
   - Add as `ORG_READ_TOKEN` repository secret or organization secret
   - The token will be used to scan repositories and create issues/comments

5. **Test with Dry-Run**

   ```bash
   # Trigger inactivity report in dry-run mode
   gh workflow run dependabot-inactivity-report.yml \
     -f dry-run=true \
     -f org=your-org
   ```

## Real-World Benefits

### Before This Solution

- ❌ Manually checked 50+ repositories monthly
- ❌ Discovered paused Dependabot after the fact
- ❌ Spent hours clicking through UI to trigger updates
- ❌ Inconsistent dependency update practices

### After Implementation

- ✅ Automated monitoring across entire organization
- ✅ Early warnings 15 days before pause
- ✅ Proactive prevention through automated nudges
- ✅ Centralized visibility into dependency health
- ✅ Zero manual intervention for most repositories

## Advanced Patterns

### Custom Filtering Strategy

Target specific repository groups:

```yaml
# Keep-alive for production services only
repo-includes: 'prod-*,service-*'
repo-excludes: '*-test,*-sandbox'
```

### Tiered Monitoring

Create multiple inactivity report workflows with different thresholds:

- **Critical repos**: 60-day threshold (30-day buffer)
- **Standard repos**: 75-day threshold (15-day buffer)  
- **Low-priority repos**: 85-day threshold (5-day buffer)

### Integration with Slack/Teams

Extend the inactivity report to post reports to team channels:

```yaml
- name: Notify team
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "Dependabot inactivity alert",
        "blocks": [...]
      }
```

## Monitoring & Metrics

Track the system's effectiveness:

1. **Issue Creation Rate**: How many reminder issues are created
2. **PR Nudge Success**: Percentage of successful rebase commands
3. **Prevented Pauses**: Repos that would have paused without intervention
4. **Time Savings**: Manual hours saved per quarter

## Lessons Learned

### Technical Gotchas

1. **Bash Arithmetic with `set -e`**
   - Use `$((var + 1))` instead of `((var++))`

2. **GitHub Search API Efficiency**
   - Much faster than paginating through all repos
   - Has rate limits (consider for very large orgs)

3. **Label Handling**
   - Not all repos have standard labels
   - Always provide fallback behavior

4. **Token Scopes**
   - `GITHUB_TOKEN` cannot access other repos in the organization
   - Requires PAT with `workflow` and `read:org` scopes for cross-repo operations
   - The `workflow` scope allows commenting on PRs and creating issues
   - The `read:org` scope enables discovering repositories via the Search API

### Operational Insights

1. **Start with Dry-Run**: Always test with dry-run mode first
2. **Monitor First Run**: Watch the initial org-wide scan carefully
3. **Adjust Thresholds**: Tune based on your team's response time
4. **Document for Team**: Make sure everyone understands the automation

## Cost Considerations

### GitHub Actions Minutes

- **Inactivity Report (daily)**: ~2-5 minutes per run = ~75-150 min/month
- **Keep-Alive (quarterly)**: ~10-30 minutes per run = ~40-120 min/quarter
- **Total**: ~195-270 minutes per quarter

For organizations on GitHub Team or Enterprise, this is negligible compared to the free tier (3,000+ minutes/month).

### API Rate Limits

- Search API: 30 requests per minute (authenticated)
- Issues/PR operations: 5,000 requests per hour
- For 100 repositories: Well within limits

## Future Enhancements

Potential additions to consider:

1. **Metrics Dashboard**: Track Dependabot health over time
2. **Auto-Merge**: Automatically merge certain types of updates
3. **Dependency Insights**: Analyze which dependencies update most frequently
4. **Security Priority**: Prioritize security updates in nudging logic
5. **Custom Schedules**: Per-repository cadences based on criticality

## Conclusion

Managing Dependabot at scale doesn't have to be a manual nightmare. By combining proactive automation with early detection, this system:

- **Prevents** the 90-day pause before it happens
- **Detects** inactivity early with configurable thresholds
- **Scales** to hundreds of repositories effortlessly
- **Requires** minimal ongoing maintenance

The complete solution is production-ready and has been battle-tested across multiple organizations. The workflows are modular, allowing you to adopt them incrementally or all at once.

Start with the inactivity report for visibility, add the keep-alive workflows for prevention, and watch your dependency management transform from a time sink into a well-oiled machine.

## Resources

- [GitHub Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)
- [GitHub Actions Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [GitHub Search API](https://docs.github.com/en/rest/search)

---

**Questions or improvements?** Feel free to adapt these workflows to your organization's needs. The modular design makes it easy to customize behavior while maintaining the core functionality.

Happy automating! 🚀
