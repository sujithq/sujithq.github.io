+++
title = '🤖 Copilot CLI Auto Model Selection is GA'
slug = 'github-copilot-cli-auto-model-selection'
date = '2026-04-20 09:00:00Z'
lastmod = '2026-04-20 09:00:00Z'
draft = false
tags = [
  "GitHub",
  "GitHub Copilot",
  "GitHub CLI",
  "AI",
  "Developer Productivity",
  "Model Selection"
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
    cover_prompt = '''Create a clean, modern technical illustration for a blog post about GitHub Copilot CLI automatic AI model selection. Show a terminal window with Copilot CLI output, surrounded by floating model icons (GPT, Claude, Gemini logos replaced by abstract geometric shapes). Use a dark background with electric blue, green, and purple accents. Include a branching routing diagram showing a single input splitting to multiple model paths with a decision node labelled "Auto". Add subtle circuit-line patterns and a futuristic enterprise aesthetic. Target audience: developers and DevOps engineers.
    '''

description = "Copilot CLI auto model selection is now GA. Let Copilot pick the best model automatically, save premium requests, and stay within policy."
+++

GitHub Copilot CLI now supports **auto model selection**, generally available across all Copilot plans. Instead of choosing a specific model for every session, you can let Copilot route each request to the most efficient model available at that moment.

## The problem with manual model selection

Copilot supports a growing roster of models: GPT-5.4, GPT-5.3-Codex, Claude Sonnet 4.6, Claude Haiku 4.5, and more. Each has different strengths, latency profiles, and premium request multipliers. Picking the right one requires constant context-switching, and even when you do pick correctly, you can hit rate limits on popular models during peak hours.

Auto model selection removes that friction.

## How auto model selection works

When you set the model to **Auto** in Copilot CLI (for example via `/model`), Copilot evaluates real-time system health and model performance, then routes your request to the best available option. The selection respects:

- **Your plan**: Auto only routes to models available in your subscription.
- **Admin policies**: If an administrator has restricted specific models in your organisation or enterprise, Auto will not route to them.
- **Multiplier limits**: Auto exclusively uses models with a 0x to 1x premium request multiplier, keeping costs predictable.

You can see which model handled each response directly in the terminal output, so there are no surprises.

## Models in the auto pool for Copilot CLI

The current pool for Copilot CLI includes (subject to change):

| Model | Provider | Multiplier |
|---|---|---|
| GPT-5.4 | OpenAI | 1x |
| GPT-5.3-Codex | OpenAI | 1x |
| GPT-5.4 mini | OpenAI | 0.33x |
| Claude Sonnet 4.6 | Anthropic | 1x |
| Claude Haiku 4.5 | Anthropic | 0.33x |

Models with multipliers above 1x (such as Claude Opus variants) are never selected by Auto.

## Switching between Auto and a specific model

Auto is not a locked-in mode. You can switch to any specific model at any point during your session. This is useful when you need a particular model's reasoning style or when you are testing prompts across models for comparison.

## Billing: the 10 % discount

For paid Copilot plan subscribers, using Auto qualifies for a **10% multiplier discount** on every request routed through it. In practice:

- A model with a 1x multiplier costs **0.9 premium requests** instead of 1.
- A model with a 0.33x multiplier costs **~0.3 premium requests**.

This discount does not apply to Copilot Free.

Premium requests are billed based on the model actually selected by Auto, not a fixed rate. Because Auto only routes to models with lower multipliers, using it regularly can meaningfully reduce how quickly you exhaust your monthly allowance.

## Plan and policy availability

Auto model selection in Copilot CLI is available to all paid and free Copilot plans. For Copilot Business and Enterprise users, the organisation or enterprise must not have restricted the individual models that form the Auto pool. Administrators can configure which models are available under **Settings > Copilot > Policies**.

A note on Copilot Chat in IDEs: Auto is already generally available in VS Code and JetBrains, and in public preview in Visual Studio, Eclipse, and Xcode. The CLI GA follows the same pattern.

## What is coming next

The GitHub docs include a forward-looking note: Auto will soon select the best model **based on your task**, not just on system health and availability. That would mean lighter models for simple completions and more capable models for complex reasoning, all without any manual input.

## Getting started

Install Copilot CLI using the package manager for your platform:

```bash
# Windows
winget install GitHub.Copilot

# macOS / Linux
brew install copilot-cli

# Cross-platform (requires Node.js 22+)
npm install -g @github/copilot
```

To upgrade an existing install:

```bash
# Windows
winget upgrade GitHub.Copilot

# macOS / Linux
brew upgrade copilot-cli

# npm
npm update -g @github/copilot
```

Once installed:

1. Navigate to your project folder and run `copilot` to start an interactive session.
2. On first run, enter `/login` and follow the prompts to authenticate.
3. Run `/model` and select **Auto** (some environments do not show a picker automatically).
4. Each response shows the model that was used directly in the terminal.

## References

- [GitHub Changelog: Copilot CLI now supports auto model selection](https://github.blog/changelog/2026-04-17-github-copilot-cli-now-supports-copilot-auto-model-selection/)
- [About Copilot auto model selection](https://docs.github.com/copilot/concepts/auto-model-selection)
- [Supported AI models in GitHub Copilot](https://docs.github.com/en/copilot/reference/ai-models/supported-models)
- [Requests in GitHub Copilot](https://docs.github.com/copilot/concepts/billing/copilot-requests)
- [Getting started with GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/cli-getting-started)
- [Using GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/use-copilot-cli)
