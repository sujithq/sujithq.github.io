+++
title = '💬 GitHub CLI Discussions Commands'
slug = 'github-cli-discussions-in-your-terminal'
date = '2026-06-12 14:30:00Z'
lastmod = '2026-06-12 14:30:00Z'
draft = false
tags = [
  "GitHub",
  "GitHub CLI",
  "GitHub Discussions",
  "Automation",
  "Developer Productivity"
]
categories = [
  "GitHub",
  "Developer Tools"
]
series = [
  "GitHub Updates"
]

layout = "single"
[params]
    cover = true
    author = "sujith"
    cover_prompt = '''Create a clean technical illustration for a blog post about the new GitHub CLI Discussions commands.
    Show a terminal with `gh discussion list` and `gh discussion create` commands flowing to a GitHub Discussions board.
    Include visual elements for filtering, templated creation, and automation in CI.
    Use blue, indigo, and graphite colours with subtle glow accents and minimal UI chrome.
    No logos, no people, and no text overlays.'''

description = "Use gh discussion list and gh discussion create to manage GitHub Discussions from your terminal and automation flows."
+++

GitHub CLI now supports Discussions directly through the new `gh discussion` command group. You can list, inspect, create, and update discussions without leaving your terminal.

This update is useful for teams that manage community or internal Q&A workflows through automation.

## What is new

The CLI now includes first-class commands for Discussions:

- `gh discussion list`
- `gh discussion view`
- `gh discussion create`
- `gh discussion edit`

## List discussions quickly

Use `gh discussion list` to review activity in a repository.

```bash
gh discussion list --repo owner/repo --limit 20
```

Filter by category when you only want selected threads:

```bash
gh discussion list \
  --repo owner/repo \
  --category "Announcements" \
  --limit 10
```

For scripting, request JSON output and filter with `jq`:

```bash
gh discussion list \
  --repo owner/repo \
  --json number,title,category,author,createdAt,url \
  --limit 50 | jq '.[] | {number, title, category: .category.name, url}'
```

## Create discussions from the CLI

You can create a discussion with flags in one command:

```bash
gh discussion create \
  --repo owner/repo \
  --category "General" \
  --title "Weekly platform updates" \
  --body "Share updates, blockers, and wins for this week."
```

If the body is long, use a markdown file:

```bash
gh discussion create \
  --repo owner/repo \
  --category "Announcements" \
  --title "Sprint 24 release notes" \
  --body-file ./release-notes.md
```

You can also run interactively:

```bash
gh discussion create --repo owner/repo
```

## Automation pattern

The new commands make scheduled community workflows straightforward. Example: open a weekly discussion from GitHub Actions.

```yaml
name: Weekly Discussion

on:
  schedule:
    - cron: "0 8 * * 1"

jobs:
  create-thread:
    runs-on: ubuntu-latest
    permissions:
      discussions: write
    steps:
      - name: Create weekly thread
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          gh discussion create \
            --repo ${{ github.repository }} \
            --category "General" \
            --title "Weekly check-in: $(date +%Y-%m-%d)" \
            --body "Share priorities, blockers, and questions for this week."
```

## References

- [GitHub changelog: List, view, and create discussions in GitHub CLI](https://github.blog/changelog/2026-06-10-list-view-and-create-discussions-in-github-cli)
- [GitHub CLI manual](https://cli.github.com/manual/)
- [GitHub Discussions documentation](https://docs.github.com/discussions)

## Recap

`gh discussion list` and `gh discussion create` close an important gap for terminal-first workflows. If you already script issues and pull requests with GitHub CLI, Discussions can now be part of the same automation toolchain.
