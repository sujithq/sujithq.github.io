+++
title = '💬 Discussions land in GitHub CLI'
slug = 'github-cli-discussions'
date = '2026-06-12 09:00:00Z'
lastmod = '2026-06-12 09:00:00Z'
draft = true
tags = [
  "GitHub",
  "GitHub CLI",
  "GitHub Discussions",
  "Developer Productivity",
  "Community",
  "Open Source",
  "Collaboration"
]
categories = [
  "GitHub",
  "Developer Tools",
  "Updates"
]
series = [
  "GitHub Updates"
]

layout = "single"
[params]
    cover = true
    author = "sujith"
    cover_prompt = '''Create a clean, modern technical illustration for a blog post about GitHub Discussions support in the GitHub CLI.
    Show a terminal window in the foreground displaying a discussion list command with threaded conversation output.
    In the background, depict speech-bubble icons connected to a CLI prompt, representing community conversations flowing through the command line.
    Include subtle GitHub Octocat silhouette and discussion-thread iconography with branching conversation lines.
    Use a dark background with GitHub-inspired blue, purple, and teal accents. Add geometric connector lines and a minimal chat-bubble motif.
    Keep the composition uncluttered, professional, and appealing to developers who prefer terminal workflows over browser-based interfaces.
    '''

description = "GitHub CLI now supports discussions: list, view, create, and update threads without leaving the terminal."
+++

GitHub has shipped first-class **Discussions** support in the CLI. The new
`gh discussion` command group lets you browse, create, and manage discussion
threads directly from the terminal, removing the need to context-switch to a
browser for community conversations.

The feature was [announced on 10 June 2026](https://github.blog/changelog/2026-06-10-list-view-and-create-discussions-in-github-cli/)
and is available immediately for users running the latest GitHub CLI release.

## Why this matters

Discussions are a key collaboration surface for open-source projects and
internal teams. Until now, working with them required the web UI. If your
workflow already centres on `gh issue`, `gh pr`, and `gh repo`, adding
`gh discussion` means you can stay in the terminal for one more common task.

For maintainers triaging community questions, scripting automation around
discussions, or just preferring keyboard-driven workflows, this is a practical
quality-of-life improvement.

## Core commands

The new command group follows the same pattern as other `gh` resource commands:

```bash
# List discussions in the current repository
gh discussion list

# View a specific discussion by number
gh discussion view 42

# Create a new discussion interactively
gh discussion create

# Create a discussion non-interactively
gh discussion create --title "RFC: new caching layer" \
  --body "Proposal details here..." \
  --category "Ideas"
```

## Listing and filtering

`gh discussion list` supports the filtering options you would expect:

```bash
# Filter by category
gh discussion list --category "Q&A"

# Limit results
gh discussion list --limit 10

# JSON output for scripting
gh discussion list --json number,title,category,author
```

This makes it straightforward to pipe discussion metadata into other tools or
dashboards.

## Creating discussions from the terminal

`gh discussion create` opens an interactive flow that prompts for title, body,
and category. For automation or CI/CD pipelines, the non-interactive flags let
you script discussion creation:

```bash
gh discussion create \
  --title "Weekly standup notes - $(date +%Y-%m-%d)" \
  --body-file standup.md \
  --category "General"
```

This is useful for bots that post release summaries, automated Q&A threads, or
recurring meeting notes.

## Practical use cases

- **Triage automation**: script a cron job that lists unanswered discussions and
  posts a summary to Slack or Teams.
- **Release announcements**: create a discussion thread automatically when a new
  release is tagged.
- **RFC workflows**: open a discussion from a template file as part of a PR
  review process.
- **Offline review**: pull discussion content locally for reading without
  browser access.

## Getting started

Update your GitHub CLI to the latest version:

```bash
gh upgrade
```

Verify the command is available:

```bash
gh discussion --help
```

If you are on an older version, install the latest release from the
[GitHub CLI releases page](https://github.com/cli/cli/releases).

## References

- [List, view and create Discussions in GitHub CLI (changelog)](https://github.blog/changelog/2026-06-10-list-view-and-create-discussions-in-github-cli/)
- [GitHub CLI manual](https://cli.github.com/manual/)
- [GitHub Discussions documentation](https://docs.github.com/en/discussions)

## Recap

`gh discussion` brings Discussions into the same terminal-first workflow as
issues and pull requests. If you already manage your repositories from the
command line, this removes one more reason to open a browser tab.
