+++
title = '💬 Use GitHub Discussions from GitHub CLI'
slug = 'github-cli-discussions'
date = '2026-06-12 14:29:10Z'
lastmod = '2026-06-12 14:29:10Z'
draft = true
tags = [
  "GitHub",
  "GitHub CLI",
  "GitHub Discussions",
  "Developer Productivity",
  "Community"
]
categories = [
  "GitHub",
  "DevOps",
  "Updates"
]
series = [
  "GitHub Updates"
]

layout = "single"
[params]
    cover = true
    author = "sujith"
    cover_prompt = '''Create a clean, modern technical illustration for a blog post about using GitHub Discussions from GitHub CLI.
    Show a developer terminal running gh discussion commands beside a GitHub-style discussion thread panel with category chips, comment bubbles, and a compose form.
    Emphasise command-line community workflows: listing discussions, opening one for review, and starting a new thread without leaving the terminal.
    Use GitHub-inspired dark graphite, soft blue, and subtle purple accents with crisp UI shapes, minimal clutter, and an enterprise engineering aesthetic.
    Keep the composition practical, professional, and focused on maintainers and contributors managing project discussions efficiently from the command line.'''

description = "GitHub CLI now supports discussions. Learn what `gh discussion` adds, where it helps, and which commands to try first."
+++

GitHub CLI now includes a dedicated `gh discussion` command group for GitHub
Discussions. That means you can browse, open, create, and update discussion
threads without switching back to the browser for every step.

If you already use `gh issue` and `gh pr` as part of your daily workflow, this
is a sensible next step. Discussions often sit alongside issues and pull
requests in the same repository, but they have usually required a browser tab
to manage properly. This update closes that gap.

## What changed

GitHub has added first-class discussions support to GitHub CLI.

The changelog highlights four practical capabilities:

- List discussions from a repository.
- View an existing discussion in the terminal.
- Create a new discussion from the command line.
- Update discussions without leaving your CLI workflow.

For maintainers, that means fewer context switches when triaging community
questions, gathering feedback, or opening a proposal thread. For contributors,
it lowers the friction of starting the right conversation before raising an
issue or a pull request.

## Commands to try first

Start with the core commands:

```bash
gh discussion list
gh discussion view
gh discussion create
```

These are the entry points most teams are likely to use first:

- `gh discussion list`: scan recent threads or check whether a topic already
  exists.
- `gh discussion view`: open a discussion when you want the full context before
  replying or linking to it elsewhere.
- `gh discussion create`: start a new thread directly from your terminal when
  you already know the repository and topic.

If your team already standardises on `gh` for repository work, adding
discussions to that same interface keeps the workflow consistent.

## Where this helps most

This feature is especially useful in a few common situations.

### 1. Maintainer triage

When you are reviewing notifications or handling a backlog, it is easier to
stay in one tool. You can inspect open discussions, move between related work,
and decide whether something should remain a discussion or become an issue.

### 2. Community support

If your repository uses Discussions for Q&A, feature ideas, or announcements,
contributors can now start those conversations from the same environment they
use for cloning, branching, and opening pull requests.

### 3. Documentation and release workflows

It is common to capture rollout notes, proposal threads, or community feedback
alongside a release. Being able to create the discussion from the terminal
helps when you are already scripting or automating parts of that release flow.

## Practical rollout advice

If you want to introduce this cleanly across a team:

1. Confirm developers are on a GitHub CLI version that includes
   `gh discussion`.
2. Decide which repositories use Discussions for support, ideation, or
   announcements.
3. Add a lightweight convention for when to open a discussion instead of an
   issue.
4. Update internal onboarding notes so contributors know the command exists.

This is a small feature on paper, but it can improve how quickly teams move
from idea to documented conversation.

## Why it matters

GitHub Discussions works best when it is easy to use at the moment you need it.
If creating or reviewing a thread means breaking your terminal flow, teams are
more likely to postpone that conversation or skip the structure Discussions
provides.

Bringing discussions into GitHub CLI makes community and project communication
feel like a first-class part of repository operations, rather than a separate
web-only task.

## References

- [GitHub Changelog: List, view, and create discussions in GitHub CLI](https://github.blog/changelog/2026-06-10-list-view-and-create-discussions-in-github-cli)
- [GitHub CLI manual](https://cli.github.com/manual/)
- [About GitHub Discussions](https://docs.github.com/en/discussions)

## Recap

`gh discussion` gives GitHub CLI users a more complete repository workflow. If
your team already lives in the terminal, this is an easy improvement to adopt:
list threads, review context, and open new discussions without leaving `gh`.