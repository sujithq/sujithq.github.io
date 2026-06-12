+++
title = '💬 GitHub CLI Gets Discussions Commands'
slug = 'github-cli-discussions'
date = '2026-06-12 09:00:00Z'
lastmod = '2026-06-12 09:00:00Z'
draft = true
tags = [
  "GitHub",
  "GitHub CLI",
  "GitHub Discussions",
  "Developer Productivity",
  "Terminal Workflows"
]
categories = [
  "GitHub",
  "Developer Tools"
]
series = [
  "GitHub CLI"
]

layout = "single"
[params]
    cover = true
    author = "sujith"
    cover_prompt = '''A clean, modern technical illustration for a blog post about GitHub CLI adding native support for GitHub Discussions.
    Show a terminal window on the left with three commands in sequence: list, view, and create discussions.
    Route those commands through a subtle Git repository workflow diagram into a discussion board panel on the right with cards, threads, and status chips.
    Emphasise practical terminal-first collaboration for maintainers and contributors.
    Use deep blue, graphite, teal, and soft white tones with subtle gradients, neat arrows, and light circuit motifs.
    Keep the composition enterprise-friendly, uncluttered, and suited for technical audiences.
    No people, no logos, no text overlays.'''

description = "GitHub CLI now supports listing, viewing, and creating Discussions directly from the terminal."
+++

GitHub has announced native Discussions support in GitHub CLI, so you can now
list, view, and create repository discussions without leaving the terminal.

For teams that already triage issues and pull requests in CLI workflows, this is
a useful step: community conversations can now sit in the same operational flow.

## What changed

The changelog entry introduces a new `gh discussion` command group for core
Discussions actions:

- `gh discussion list`
- `gh discussion view`
- `gh discussion create`

Source: [GitHub Changelog: List, view, and create discussions in GitHub CLI](https://github.blog/changelog/2026-06-10-list-view-and-create-discussions-in-github-cli/).

## Why this matters

If your engineering workflow is terminal-first, this removes context switching
between browser tabs and shell sessions.

Practical benefits include:

- Faster moderator and maintainer response loops.
- Easier scripting and automation around discussion activity.
- Better parity with existing CLI-first issue and pull request workflows.

## Quick usage examples

Use the repository flag if you are running commands outside the target repo
folder.

```bash
gh discussion list --repo owner/repo
```

```bash
gh discussion view 42 --repo owner/repo
```

```bash
gh discussion create \
  --repo owner/repo \
  --title "RFC: Move release notes to Discussions" \
  --body "Proposing a discussion-led release notes process." \
  --category "Ideas"
```

## Rollout and version checks

If `gh discussion` is not available yet in your environment, update GitHub CLI
and check again:

```bash
gh --version
gh extension list
```

Then review the command manual and changelog updates:

- [GitHub CLI reference](https://cli.github.com/manual/)
- [GitHub Discussions documentation](https://docs.github.com/en/discussions)

## Recap

Discussions support in GitHub CLI closes a workflow gap for maintainers and
platform teams that prefer terminal-first operations. For most teams, the next
step is straightforward: update CLI tooling and standardise discussion handling
in your contributor runbooks.
