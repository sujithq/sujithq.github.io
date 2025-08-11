+++
title = 'Auto-triage CI failures with Copilot'
slug = 'ai-triage-github-actions-with-copilot'
date = '2025-08-11 06:00:00Z'
lastmod = '2025-08-11 06:00:00Z'
draft = true
tags = ["GitHub", "GitHub Actions", "GitHub Copilot", "CI/CD", "Dev Productivity"]
categories = ["GitHub", "Automation"]
series = ["GitHub Automation"]

layout = "single"
[params]
    cover = true
    author = "sujith"
    
description = "Use GitHub Models to summarise failed Actions runs, open an issue with next steps, and optionally assign it to the Copilot coding agent."
+++

Failures happen: the key is shortening time-to-understanding. In this guide, you’ll automate triage when a GitHub Actions workflow fails: pull logs and artifacts, get an AI summary from GitHub Models, open an issue with concrete next steps, and optionally assign it to the Copilot coding agent.

## What you’ll build

- Trigger on failed workflow runs you care about
- Collect logs and artifacts for context
- Call GitHub Models for a concise summary and probable fix
- File a GitHub issue with reproduction hints and links
- Optionally assign the issue to the Copilot coding agent

## Prerequisites

- GitHub Actions enabled in your repo
- GitHub Models access and a token for inference:
  - If you’re using a fine-grained PAT: add `models:read` scope
  - Or use `secrets.GITHUB_TOKEN` in public repos where Models are enabled for the org
- Optional: Copilot coding agent enabled at the org or user level to assign issues to

## Workflow: AI-assisted failure triage

Below is a complete workflow you can drop into `.github/workflows/ai-triage.yml`. It triggers when selected workflows complete and only proceeds if they failed.

```yaml
name: AI triage failed runs

on:
  workflow_run:
    workflows: ["build", "test", "ci"]
    types: [completed]

permissions:
  actions: read
  contents: read
  issues: write

jobs:
  triage:
    if: ${{ github.event.workflow_run.conclusion == 'failure' }}
    runs-on: ubuntu-latest
    steps:
      - name: Install tools
        run: |
          sudo apt-get update
          sudo apt-get install -y jq unzip
      - name: Set vars
        id: vars
        run: |
          echo "run_id=${{ github.event.workflow_run.id }}" >> $GITHUB_OUTPUT
          echo "run_url=${{ github.event.workflow_run.html_url }}" >> $GITHUB_OUTPUT
          echo "repo=${{ github.repository }}" >> $GITHUB_OUTPUT
          echo "branch=${{ github.event.workflow_run.head_branch }}" >> $GITHUB_OUTPUT
          echo "sha=${{ github.event.workflow_run.head_sha }}" >> $GITHUB_OUTPUT
      - name: Download logs (zip)
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          mkdir -p logs
          curl -sSL -H "Authorization: Bearer $GH_TOKEN" \
            -H "Accept: application/vnd.github+json" \
            -H "X-GitHub-Api-Version: 2022-11-28" \
            "https://api.github.com/repos/${{ github.repository }}/actions/runs/${{ steps.vars.outputs.run_id }}/logs" \
            -o logs/run-logs.zip
          unzip -q logs/run-logs.zip -d logs
      - name: Download artifacts
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          mkdir -p artifacts
          gh run download ${{ steps.vars.outputs.run_id }} --repo "${{ github.repository }}" --dir artifacts || echo "No artifacts"
          find artifacts -maxdepth 2 -type f | sed 's/^/- /' > artifacts_index.md || true
      - name: Build AI prompt
        id: prompt
        run: |
          echo "Failure in ${{ steps.vars.outputs.repo }} on branch ${{ steps.vars.outputs.branch }} at ${{ steps.vars.outputs.sha }}" > prompt.txt
          echo "Run: ${{ steps.vars.outputs.run_url }}" >> prompt.txt
          echo "\nGoal: Summarise failure cause and propose next steps. Keep it short." >> prompt.txt
          echo "\nArtifacts (if any):" >> prompt.txt
          cat artifacts_index.md >> prompt.txt || true
          echo "\nLogs (head):" >> prompt.txt
          for f in $(ls logs | head -n 3); do echo "--- $f ---"; head -n 60 "logs/$f"; done >> prompt.txt
          echo "\nLogs (tail):" >> prompt.txt
          for f in $(ls logs | head -n 3); do echo "--- $f ---"; tail -n 60 "logs/$f"; done >> prompt.txt
      - name: Call GitHub Models (chat completions)
        id: ai
        env:
          TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          body=$(jq -n \
            --arg model "openai/gpt-4.1" \
            --rawfile content prompt.txt \
            '{model: $model, messages: [{role:"system", content:"You are a senior CI engineer. Be concise."}, {role:"user", content:$content}]}'
          )
          curl -sS https://models.github.ai/inference/chat/completions \
            -H "Authorization: Bearer $TOKEN" \
            -H "Accept: application/json" \
            -H "Content-Type: application/json" \
            -H "X-GitHub-Api-Version: 2022-11-28" \
            -d "$body" | tee response.json
          jq -r '.choices[0].message.content // empty' response.json > summary.md
          if [ ! -s summary.md ]; then echo "No AI summary produced" > summary.md; fi
      - name: Create issue
        id: issue
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          title="CI failure: ${{ github.event.workflow_run.name }} on ${{ steps.vars.outputs.branch }}"
          body=$(printf "### AI summary\n\n%s\n\n---\n\nRun: %s\nCommit: %s\n\n> Prompt (truncated)\n\n\n" "$(cat summary.md)" "${{ steps.vars.outputs.run_url }}" "${{ steps.vars.outputs.sha }}")
          gh issue create --repo "${{ github.repository }}" --title "$title" --body "$body" --label "ci-failure" --label "needs-triage" --assignee ""
      - name: Optionally assign to Copilot coding agent
        if: ${{ false }} # set to true when Copilot coding agent is available
        env:
          GH_TOKEN: ${{ secrets.PAT_WITH_ISSUES_WRITE || secrets.GITHUB_TOKEN }}
        run: |
          issue_number=$(gh issue list --search "CI failure: ${{ github.event.workflow_run.name }}" --state open --json number --jq '.[0].number')
          # Replace 'github-copilot' with your org/user Copilot actor if different
          gh issue edit "$issue_number" --add-assignee github-copilot || true
```

Notes:

- API host: `models.github.ai` supports org-scoped calls at `/orgs/{org}/inference/chat/completions` if you need attribution.
- Headers: include `Authorization: Bearer <token>`, `Accept: application/json`, `Content-Type: application/json`, and `X-GitHub-Api-Version`.
- Model IDs are `publisher/name` (e.g., `openai/gpt-4.1`). Switch models freely in the body.
- Logs endpoint returns a 302 to a temporary zip URL; using `curl -L` or `-sSL` follows it.
- `gh run download` extracts artifacts by name into subfolders. Use `--name` to filter if needed.

## Troubleshooting

- 401/403 from Models: ensure your token has access to GitHub Models. For fine-grained PATs, add `models:read`.
- Empty AI response: check `.choices[0].message.content`; if null, inspect `response.json` for errors.
- Copilot coding agent assignment fails: verify your plan (Pro+ or Enterprise) and that the agent is enabled for the repo.
- Logs too large: adjust `head`/`tail` counts or filter to failing job logs only.

## Next steps

- Enrich the prompt with structured test failures: parse TRX or JUnit XML and include a concise table of failing tests.
- Attach `summary.md`, the prompt, and key logs as issue attachments or comments.
- Enable the Copilot coding agent for your repo and flip the assignment step to true to let Copilot propose a fix.

## References

- GitHub Models: API announcement (chat completions): [GitHub Models API now available](https://github.blog/changelog/2025-05-15-github-models-api-now-available/)
- GitHub Models: product page and catalog: [GitHub Models](https://github.com/features/models)
- GitHub Actions: Download workflow run logs endpoint: [REST API: Download workflow run logs](https://docs.github.com/en/rest/actions/workflow-runs#download-workflow-run-logs)
- GitHub Actions: Using workflow run logs: [Using workflow run logs](https://docs.github.com/en/actions/monitoring-and-troubleshooting-workflows/using-workflow-run-logs)
- GitHub CLI: gh run download manual: [gh run download](https://cli.github.com/manual/gh_run_download)
- Copilot coding agent: Using Copilot to work on an issue: [Using Copilot to work on an issue](https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/agents/copilot-coding-agent/using-copilot-to-work-on-an-issue)
- Copilot coding agent: Troubleshooting: [Troubleshooting Copilot coding agent](https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/agents/copilot-coding-agent/troubleshooting-copilot-coding-agent)
