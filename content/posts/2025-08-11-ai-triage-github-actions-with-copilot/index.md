+++
title = 'Auto-triage CI failures with Copilot'
slug = 'ai-triage-github-actions-with-copilot'
date = '2025-08-11 06:00:00Z'
lastmod = '2025-08-11 06:00:00Z'
draft = false
tags = ["GitHub", "GitHub Actions", "GitHub Copilot", "CI CD", "Dev Productivity"]
categories = ["GitHub", "Automation"]
series = ["GitHub Automation"]

layout = "single"
[params]
    cover = true
    author = "sujith"
    cover_prompt = '''Create a clean, modern technical illustration for a blog post about AI-assisted CI failure triage in GitHub Actions with GitHub Copilot.
    Use GitHub branding colours (black, white, green) with subtle Copilot blue/teal accents.
    Include visual elements representing: failing workflow_run, logs, TRX test results, artifacts, AI/LLM summarisation, issue creation with labels, and Copilot coding agent assignment.
    Use geometric shapes, circuit lines, and network nodes; add small labels like "workflow_run", "artifacts", "AI summary", "issue #", and "labels".
    Keep the style minimalist, futuristic, and enterprise-ready to appeal to cloud engineers and developers.'''
    
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
    workflows: ["*"]
    types: [completed]

permissions:
  actions: read
  contents: read
  issues: write
  checks: write
  models: read

jobs:
  triage:
    if: ${{ github.event.workflow_run.conclusion == 'failure' }}
    runs-on: ubuntu-latest
    env:
      PAT_WITH_ISSUES_WRITE: ${{ secrets.PAT_WITH_ISSUES_WRITE }}

    steps:
      - name: Set variables
        id: vars
        shell: bash
        run: |
          echo "run_id=${{ github.event.workflow_run.id }}" >> "$GITHUB_OUTPUT"
          echo "run_url=${{ github.event.workflow_run.html_url }}" >> "$GITHUB_OUTPUT"
          echo "repo=${{ github.repository }}" >> "$GITHUB_OUTPUT"
          echo "branch=${{ github.event.workflow_run.head_branch }}" >> "$GITHUB_OUTPUT"
          echo "sha=${{ github.event.workflow_run.head_sha }}" >> "$GITHUB_OUTPUT"

      - name: Download workflow logs (zip)
        shell: bash
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          set -euo pipefail
          mkdir -p logs
          # Follow redirect to the actual ZIP download URL
          curl -sSL -H "Authorization: Bearer $GITHUB_TOKEN" \
            "https://api.github.com/repos/${{ steps.vars.outputs.repo }}/actions/runs/${{ steps.vars.outputs.run_id }}/logs" \
            -o logs/run-logs.zip || true
          unzip -q logs/run-logs.zip -d logs || echo "No logs found."

      - name: Download test-results artifact
        uses: dawidd6/action-download-artifact@v11
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          run_id: ${{ steps.vars.outputs.run_id }}
          repo: ${{ steps.vars.outputs.repo }}
          name: test-results
          path: artifacts/test-results
          if_no_artifact_found: ignore

      - name: Summarize TRX test results (check run + outputs)
        id: report
        if: always()
        uses: dorny/test-reporter@v2
        with:
          name: TestSummary
          artifact: test-results
          path: "**/*.trx"
          reporter: dotnet-trx
          only-summary: true
          use-actions-summary: true
          fail-on-error: false
          fail-on-empty: false

      - name: Build AI prompt (TRX summary, artifacts, logs)
        shell: bash
        run: |
          {
            echo "Failure in ${{ steps.vars.outputs.repo }} on branch ${{ steps.vars.outputs.branch }} at ${{ steps.vars.outputs.sha }}"
            echo "Run: ${{ steps.vars.outputs.run_url }}"
            echo
            echo "Goal: Summarize failure cause and propose next steps. Be concise and actionable."
            echo
            echo "=== Test summary (TRX via test-reporter) ==="
            echo "- Passed:  ${{ steps.report.outputs.passed || '0' }}"
            echo "- Failed:  ${{ steps.report.outputs.failed || '0' }}"
            echo "- Skipped: ${{ steps.report.outputs.skipped || '0' }}"
            if [ -n "${{ steps.report.outputs.url_html }}" ]; then
              echo "- Report:  ${{ steps.report.outputs.url_html }}"
            fi
            echo
            echo "=== Artifacts ==="
            find artifacts -type f -maxdepth 3 | sed 's/^/- /' || true
            echo
            echo "=== Logs (head) ==="
            find logs -type f -name '*.txt' | head -n 3 | xargs -r -I{} sh -c 'echo "--- {} ---"; head -n 60 "{}"'
            echo
            echo "=== Logs (tail) ==="
            find logs -type f -name '*.txt' | head -n 3 | xargs -r -I{} sh -c 'echo "--- {} ---"; tail -n 60 "{}"'
          } > prompt.txt

      - name: AI triage summary
        id: ai
        uses: actions/ai-inference@v1
        with:
          model: openai/gpt-4o
          system-prompt: You are a senior CI engineer. Be concise.
          prompt-file: ./prompt.txt

      - name: Ensure labels exist
        uses: actions/github-script@v7
        with:
          script: |
            const owner = context.repo.owner;
            const repo = context.repo.repo;
            const labels = [
              { name: 'ci-failure', color: 'B60205', description: 'CI pipeline failure' },
              { name: 'needs-triage', color: 'D4C5F9', description: 'Requires triage' },
            ];
            for (const l of labels) {
              try {
                await github.rest.issues.getLabel({ owner, repo, name: l.name });
              } catch {
                await github.rest.issues.createLabel({ owner, repo, name: l.name, color: l.color, description: l.description });
              }
            }

      - name: Create issue
        id: issue
        uses: actions/github-script@v7
        env:
          BRANCH: ${{ steps.vars.outputs.branch }}
          RUN_URL: ${{ steps.vars.outputs.run_url }}
          SHA: ${{ steps.vars.outputs.sha }}
          AI: ${{ steps.ai.outputs.response }}
        with:
          script: |
            const owner = context.repo.owner;
            const repo = context.repo.repo;
            const title = `CI failure: ${(context.payload.workflow_run?.name ?? 'CI')} on ${process.env.BRANCH}`;
            const ai = process.env.AI || '';
            const summary = ai.trim() ? ai : 'No AI summary produced';
            const body = `### AI summary\n\n${summary}\n\n---\n\nRun: ${process.env.RUN_URL}\nCommit: ${process.env.SHA}`;
            const res = await github.rest.issues.create({ owner, repo, title, body, labels: ['ci-failure','needs-triage'] });
            core.setOutput('number', res.data.number.toString());

      # Optional: assign to Copilot coding agent with a user PAT that can assign issues
      - name: Assign to Copilot coding agent (optional)
        if: ${{ env.PAT_WITH_ISSUES_WRITE != '' }}
        uses: actions/github-script@v7
        env:
          USER_PAT: ${{ secrets.PAT_WITH_ISSUES_WRITE }}
          ISSUE_NUMBER: ${{ steps.issue.outputs.number }}
        with:
          github-token: ${{ env.USER_PAT }}
          script: |
            const owner = context.repo.owner;
            const repo = context.repo.repo;
            const issue_number = Number(process.env.ISSUE_NUMBER);

            // GraphQL to get suggested actors
            const actorsRes = await github.graphql(
              `query($owner:String!,$name:String!){
                repository(owner:$owner, name:$name) {
                  suggestedActors(capabilities:[CAN_BE_ASSIGNED], first:100) {
                    nodes { login __typename ... on Bot { id } ... on User { id } }
                  }
                }
              }`,
              { owner, name: repo }
            );
            const candidates = ['copilot-swe-agent','copilot-agent','copilot'];
            const nodes = actorsRes?.repository?.suggestedActors?.nodes || [];
            const match = nodes.find(n => candidates.includes(n.login));
            if (!match) {
              core.info('Copilot agent not suggested. Skipping assignment.');
              return;
            }

            // Get issue node id
            const issueRes = await github.graphql(
              `query($owner:String!,$name:String!,$num:Int!){ repository(owner:$owner, name:$name) { issue(number:$num) { id } } }`,
              { owner, name: repo, num: issue_number }
            );
            const issueId = issueRes?.repository?.issue?.id;
            if (!issueId) { core.warning('Issue ID not found'); return; }

            // Assign via GraphQL
            await github.graphql(
              `mutation($id:ID!,$actor:ID!){
                replaceActorsForAssignable(input:{assignableId:$id, actorIds:[$actor]}) {
                  assignable { __typename }
                }
              }`,
              { id: issueId, actor: match.id }
            );
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
