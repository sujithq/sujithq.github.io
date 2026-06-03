+++
title = '🗑️ GPT-4.1 Deprecated in GitHub Copilot'
slug = 'gpt-4-1-deprecated-github-copilot'
date = '2026-06-03 09:00:00Z'
lastmod = '2026-06-03 09:00:00Z'
draft = true
tags = [
  "GitHub",
  "GitHub Copilot",
  "AI",
  "GPT",
  "Model Selection",
  "Developer Productivity"
]
categories = [
  "GitHub",
  "AI",
  "Updates"
]
series = [
  "GitHub Updates"
]

layout = "single"
[params]
    cover = true
    author = "sujith"
    cover_prompt = '''A clean, modern technical illustration for a blog post about the deprecation of GPT-4.1 in GitHub Copilot.
    Show a faded, greyed-out model card with a generic AI chip icon and a diagonal deprecation stripe, sitting alongside three active model cards representing newer alternatives.
    Include a horizontal migration flow with arrows pointing from the deprecated card to the active options.
    Use a dark navy background with teal, white, and amber accents, subtle geometric grid lines, and a professional enterprise aesthetic.
    No people, no real logos, no text overlays.'''

description = "GitHub has deprecated GPT-4.1 in Copilot Chat. Here is what changes, which models to use instead, and how to update your configuration."
+++

GitHub has announced the deprecation of **GPT-4.1** across GitHub Copilot surfaces, effective from the changelog post on 2 June 2026. If GPT-4.1 is your selected model in any Copilot client, now is the time to review and update your configuration.

## What is changing

GPT-4.1 is being removed from the list of selectable models in GitHub Copilot. This covers:

- Copilot Chat in VS Code, JetBrains, Visual Studio, and other supported editors
- Copilot Chat on GitHub.com
- GitHub Copilot CLI when configured with the `--model` flag or via `/model`
- BYOK configurations pointing at a GPT-4.1 deployment name

Any session or configuration with GPT-4.1 set as an explicit model choice will need to be updated. Sessions left on a now-unavailable model will typically fall back to the default, but making the switch intentionally keeps the behaviour predictable.

## Why models get deprecated in Copilot

GitHub and OpenAI maintain a rolling lifecycle for models available through Copilot. As newer models become available and usage concentrates on more capable successors, older models are retired to reduce infrastructure overhead and simplify the support matrix. This follows the same pattern that saw GPT-4o deprecated in August 2025 when GPT-5 became generally available.

GPT-4.1 has been available since its OpenAI release in April 2025 and served as a strong mid-tier option between GPT-4.1 mini and the full GPT-5 tier. With the GPT-5 series now stable and GPT-4.1 mini covering the cost-efficient segment effectively, GPT-4.1 itself has reached end of availability.

## Recommended alternatives

The right replacement depends on your use case:

| If you used GPT-4.1 for | Switch to |
|---|---|
| Balanced everyday coding tasks | **GPT-4.1 mini** (lower cost, strong at routine completions) |
| Complex reasoning and architecture | **GPT-5** or **o4-mini** (stronger reasoning, higher multiplier) |
| Multimodal tasks (code and images) | **GPT-5** |
| Cost-sensitive bulk operations | **GPT-4.1 mini** or enable **Auto** model selection |

If you have not yet settled on a replacement, enabling **Auto** model selection is the simplest path. Copilot will route each request to the best available model at the right cost tier. Auto selection also qualifies for a 10 percent discount on premium request multipliers for paid plans.

## How to switch models

### Copilot Chat in VS Code

Open the model picker in the Copilot Chat panel (the model name shown in the input bar) and select a replacement from the dropdown. The selection persists across sessions.

### Copilot Chat on GitHub.com

In any Copilot Chat session on github.com, use the model picker at the bottom of the chat input. Select your preferred replacement and the change takes effect immediately.

### GitHub Copilot CLI

For interactive sessions, switch with the `/model` command once inside a session:

```bash
copilot
# then inside the session:
/model
```

To set a default for all CLI sessions, update your Copilot CLI configuration:

```bash
# View current model setting
copilot config get model

# Set GPT-4.1 mini as the default
copilot config set model gpt-4.1-mini

# Or set Auto selection
copilot config set model auto
```

### BYOK configurations

If you are using Bring Your Own Key with an Azure OpenAI or direct OpenAI deployment, update the model name in your configuration profile.

For raw environment variables:

```bash
# Replace the deprecated GPT-4.1 deployment name with your updated deployment
export COPILOT_MODEL=gpt-4.1-mini
export COPILOT_PROVIDER_BASE_URL=https://your-resource.openai.azure.com/openai/deployments/gpt-4.1-mini
```

For profiles managed with the [`gh-copilot-byok`](https://github.com/sujithq/gh-copilot-cli-model-switcher) tool, run the interactive editor to update the model field in any profile that referenced GPT-4.1.

## Impact on premium request budgets

GPT-4.1 carried a 1x premium request multiplier. Moving to GPT-4.1 mini will reduce the multiplier, which is good for budget efficiency. Moving to GPT-5 may increase it depending on the specific tier. Check the current multiplier table in the [Supported models documentation](https://docs.github.com/en/copilot/reference/ai-models/supported-models) before finalising your choice.

For enterprise and organisation admins, review any model allow-lists or restrictions in Copilot settings to ensure GPT-4.1 is removed and your preferred replacements are permitted.

## Auditing active configurations

To catch remaining GPT-4.1 references across your team, check:

- VS Code `settings.json` files in shared dev container definitions or workspace configs
- `.copilot` configuration files in repositories
- CI or scripted Copilot CLI invocations that pass `--model gpt-4.1` explicitly
- BYOK profile files stored in dotfiles repositories

In GitHub Actions workflows that invoke Copilot CLI, update any `--model` flag:

```yaml
- name: Run Copilot CLI task
  run: copilot --model gpt-4.1-mini "summarise changes in this PR"
```

## Recap

GPT-4.1 is deprecated in GitHub Copilot from 2 June 2026. For most everyday tasks, **GPT-4.1 mini** is a cost-efficient drop-in replacement. For complex reasoning, move to **GPT-5** or **o4-mini**. Enabling **Auto** model selection removes the need to manage this manually going forward.

## References

- [GPT-4.1 deprecated - GitHub Changelog](https://github.blog/changelog/2026-06-02-gpt-4-1-deprecated/)
- [Supported AI models in GitHub Copilot](https://docs.github.com/en/copilot/reference/ai-models/supported-models)
- [About Copilot auto model selection](https://docs.github.com/copilot/concepts/auto-model-selection)
- [Which AI model to use with GitHub Copilot]({{< relref "2025-04-28-which-ai-model-to-use-with-github-copilot" >}})
- [GitHub Copilot CLI auto model selection is GA]({{< relref "2026-04-20-github-copilot-cli-auto-model-selection" >}})
- [Easier BYOK for GitHub Copilot CLI]({{< relref "2026-05-03-copilot-cli-byok-model-switcher" >}})
