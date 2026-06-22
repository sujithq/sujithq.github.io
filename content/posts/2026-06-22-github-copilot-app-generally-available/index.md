+++
title = '🖥️ GitHub Copilot App is Generally Available'
slug = 'github-copilot-app-generally-available'
date = '2026-06-22 09:00:00Z'
lastmod = '2026-06-22 09:00:00Z'
draft = false
tags = [
  "GitHub",
  "GitHub Copilot",
  "AI",
  "Agent Mode",
  "Developer Productivity",
  "Desktop App",
  "Platform Engineering"
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
    cover_prompt = '''A clean, modern technical illustration showing the GitHub Copilot desktop app enabling parallel agent-driven development.
    Feature a split-view composition with multiple isolated agent session cards running simultaneously, each connected to a distinct branch in a git graph.
    Include a central workflow hub linking issues, pull requests, and CI check results to session workspaces via directional arrows.
    Show session mode controls labelled Interactive, Plan, and Autopilot as selectable nodes on the workflow diagram.
    Use a dark graphite background with deep blue, purple, and teal accents, geometric network lines, and minimal iconography.
    Add subtle circuit-line texture and cloud sandbox icons to convey isolation and scalability.
    Keep the composition enterprise-ready and uncluttered, appealing to developers and platform engineers.
    No people, no real logos, no text overlays.'''

description = "GitHub Copilot app is now GA. Run parallel agent sessions, manage issues and PRs, and automate recurring tasks from one desktop app."
+++

GitHub has announced that the **GitHub Copilot app is now generally available** on macOS, Windows, and Linux.
Previously available as a technical preview for paid Copilot subscribers, the app is now open to all paid
Copilot plans without restrictions.

## What is the GitHub Copilot app

The GitHub Copilot app is a native desktop application purpose-built for agent-driven development. Unlike
IDE extensions that augment a text editor, this app is a standalone environment where you direct AI agents
across your full development lifecycle: from triaging an issue through to merging the resulting pull request,
without switching between a terminal, browser, and IDE.

The app is built on GitHub Copilot CLI and connects natively to GitHub, so repositories, branches, issues,
and CI pipelines work out of the box with no extra configuration.

## Key capabilities

### Parallel agent sessions

Each session in the app runs in its own isolated workspace with a dedicated git worktree and branch. You can
run multiple sessions simultaneously, making progress on several tasks without conflicts. Sessions also support
**cloud sandboxes** (currently in public preview), which are fully isolated environments hosted by GitHub.

### Session modes

For each session you choose how much autonomy to give the agent:

- **Interactive**: You and the agent collaborate step by step. The agent suggests changes and waits for your
  input before proceeding.
- **Plan**: The agent creates a written plan first. You review and approve the plan before execution begins.
- **Autopilot**: The agent works fully autonomously, writing code, running tests, and iterating until the task
  is done.

You can switch modes at any point during a session and also choose the underlying model and reasoning effort
per session.

### GitHub integration

The **My work** sidebar view gives you a unified inbox for your issues and pull requests. From there you can:

- Start a session directly from an issue, with the issue context pre-loaded.
- Review a pull request inside a session, leave inline comments, and ask the agent to address feedback.
- Check CI status and merge pull requests without leaving the app.
- Search across your repositories.

### Automations

Automations let you save recurring agent tasks and trigger them on a schedule or on demand. Example use cases:

- Daily issue triage runs.
- Scheduled checks on open pull requests for stale reviews.
- Recurring dependency update assessments.

The app supports both **local automations** (running from your machine) and **cloud automations** (running in
a GitHub-hosted environment).

### Quick chats

Quick chats are lightweight conversation sessions without a dedicated branch or workspace. They are useful for
brainstorming, asking questions about a repository, or exploring an idea before committing to a full session.

### Customisation and extensibility

- **MCP servers**: Your repository's MCP servers sync automatically. You can also add custom MCP servers via
  local or HTTP configuration.
- **Agent skills**: Custom repository and Copilot skills sync across sessions automatically.
- **Global instructions**: Configure shared instructions that apply across all sessions.
- **Canvas extensions**: Open custom agent-driven artefacts and interactive interfaces built for collaborative
  work between people and agents.

## Supported platforms and prerequisites

The GitHub Copilot app runs on:

- macOS
- Windows
- Linux

**Requirements before installing:**

- Git installed on your machine.
- An active paid Copilot plan (Pro, Pro+, Business, Enterprise, or Max).
- For Copilot Business and Enterprise: your administrator must enable the **Copilot CLI** policy. See
  [Managing policies for GitHub Copilot in your organisation](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-policies).

## Getting started

### Install the app

Download the app from the official download page at [gh.io/app](https://gh.io/app).

### Sign in and onboard

1. Open the GitHub Copilot app.
2. Click **Sign in to GitHub** and follow the authentication prompts. GitHub Enterprise Server users should
   choose **Use GitHub Enterprise** and enter their server address.
3. During onboarding, select repositories based on your recent GitHub activity, or choose a sample project.
   You can also skip this and add repositories later.
4. Choose a theme and complete onboarding.

### Connect a repository

If you skipped repository setup during onboarding, or want to add more:

1. Click **+** next to "Sessions" in the sidebar.
2. Under **Add project from**, choose:
   - **Local folder or repository**: select a folder already on your machine.
   - **GitHub repository**: browse and clone a repository from GitHub.
   - **Repository URL**: clone from any Git URL.

### Start your first session

1. Click **My work** in the sidebar.
2. Find an issue and click it to view its details.
3. Click **New session**. The app creates a session with the issue context loaded.
4. Select a session mode, model, and reasoning effort from the dropdowns.
5. Describe the task and let the agent begin.

You can also start a quick chat by clicking **+** next to "Quick chats" in the sidebar for a no-branch
exploration session.

## Plan availability

The GitHub Copilot app requires an active paid Copilot subscription. Key plan differences:

| Plan | Monthly credits | Notable inclusions |
|---|---|---|
| Pro | $15 | Cloud agent, unlimited completions, third-party agents |
| Pro+ | $70 | Premium models, audit logs, 4× usage vs Pro |
| Max | $200 | Priority model access, 2.9×+ usage vs Pro+ |

The free Copilot plan does not include access to the GitHub Copilot app.

For Business and Enterprise plans, pricing is based on per-seat licensing. Cloud agent usage incurs
additional GitHub Actions charges.

## References

- [GitHub Copilot app generally available](https://github.blog/changelog/2026-06-17-github-copilot-app-generally-available/)
- [GitHub Copilot app feature overview](https://github.com/features/ai/github-app)
- [Getting started with the GitHub Copilot app](https://docs.github.com/en/copilot/how-tos/github-copilot-app/getting-started)
- [About the GitHub Copilot app](https://docs.github.com/en/copilot/concepts/agents/github-copilot-app)
- [Working with agent sessions](https://docs.github.com/en/copilot/how-tos/github-copilot-app/agent-sessions)
- [Managing issues and pull requests](https://docs.github.com/en/copilot/how-tos/github-copilot-app/managing-issues-and-pull-requests)
- [Using automations](https://docs.github.com/en/copilot/how-tos/github-copilot-app/using-automations)
- [About cloud and local sandboxes](https://docs.github.com/en/copilot/concepts/about-cloud-and-local-sandboxes)

## Recap

The GitHub Copilot app moves agent-driven development out of IDE extensions and into a purpose-built desktop
environment. Parallel isolated sessions, native GitHub integration, flexible session modes, and automations
make it a practical tool for developers who want to delegate more of the mechanical work of shipping code.
For teams on Business or Enterprise plans, the first step is enabling the Copilot CLI policy so users can
download and start using the app.
