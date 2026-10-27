+++
title = '🐉 Using HydraFusion Across Copilot Surfaces'
slug = 'hydrafusion-github-copilot-orchestration'
date = '2026-10-16 00:00:00+02:00'
lastmod = '2026-10-27 11:45:00+01:00'
draft = false
tags = [
  "GitHub",
  "GitHub Copilot",
  "HydraFusion",
  "GitHub CLI",
  "VS Code",
  "AI Models",
  "AI Credits",
  "Developer Productivity"
]
categories = [
  "GitHub",
  "AI-Powered Development",
  "Development Tools"
]
series = [
  "GitHub Copilot Mastery"
]

layout = "single"
[params]
    cover = true
    author = "sujith"
    living = true
    cover_prompt = '''A clean, modern technical illustration of multi-model orchestration for AI-assisted coding.
    Show a central orchestrator hub shaped like a geometric multi-headed node that routes a single coding task into three parallel workflow lanes: a single straight path, a cascade path with a quality gate that escalates to a larger model node, and a critique path where one drafting node is reviewed by several smaller reviewer nodes whose feedback merges back into one refined output.
    Place three subtle surface frames at the edges: a terminal window, a code editor panel, and a desktop app window, each connected to the hub by thin glowing lines.
    Use deep navy and graphite background with violet, teal, and soft amber accents, subtle circuit grid texture, and soft glow on the flow paths.
    Enterprise-friendly, minimal, geometric composition for developers and platform engineers.
    No people, no logos, no text overlays.'''

description = "How HydraFusion orchestrates multiple models in GitHub Copilot, and how to enable it in Copilot CLI, VS Code, and the Copilot app."
+++

Picking a model used to be the last decision you made before pressing Enter. Then Auto model selection took that decision away for everyday work. **HydraFusion** goes one step further: instead of picking one model, it picks a whole **workflow**, deciding whether a task needs one model, an escalation to a stronger one, or a draft that other models critique before you see it.

HydraFusion is documented under GitHub's early-access docs and is currently a **research preview**. That means no SLA, behaviour that can change, and a clear statement from GitHub that it is not intended for production workloads. It is still very usable for real coding tasks today, as long as you understand how it spends AI credits and where it is (and is not) available.

This post covers what HydraFusion is, how to enable it on each Copilot surface, and the limitations worth knowing before you hand it a large task.

## Last verified

HydraFusion changes quickly, so this is a living guide. An automated check compares it with the official documentation and the release notes of each tool, and every update is reviewed by a human before it is published. The table shows which versions the steps were last checked against.

<!-- living-post:verified:start -->
| Surface | Version reviewed | Source | Reviewed on |
| --- | --- | --- | --- |
| GitHub Docs | Using HydraFusion (early access) | [Docs](https://docs.github.com/en/early-access/copilot/hydrafusion) | 2026-10-27 |
| GitHub Changelog | Up to 14 October 2026 | [Changelog](https://github.blog/changelog/2026-10-14-hydrafusion-updates-and-new-max-option) | 2026-10-16 |
| VS Code | 1.142 | [Release notes](https://code.visualstudio.com/updates/v1_142) and in-product setting descriptions | 2026-10-16 |
| VS Code Insiders | 1.144 | [Release notes](https://code.visualstudio.com/updates/v1_144) and in-product setting descriptions | 2026-10-27 |
| Copilot CLI | 1.0.104 | [Release notes](https://github.com/github/copilot-cli/releases/tag/v1.0.104) ([1.0.101](https://github.com/github/copilot-cli/releases/tag/v1.0.101) and prerelease [1.0.99-1](https://github.com/github/copilot-cli/releases/tag/v1.0.99-1) also reviewed) | 2026-10-27 |
| Copilot app | No separate release notes | Tracked through the GitHub Changelog | 2026-10-16 |
| Visual Studio | Not supported | [Visual Studio Blog](https://devblogs.microsoft.com/visualstudio/) | 2026-10-16 |
<!-- living-post:verified:end -->

Does a step no longer match what you see in your version? [Report an outdated step](https://github.com/sujithq/sujithq.github.io/issues/new?template=outdated-post.yml&title=%5Boutdated%5D+hydrafusion-github-copilot-orchestration&post=https%3A%2F%2Fquintelier.dev%2Fposts%2F2026%2F10%2Fhydrafusion-github-copilot-orchestration%2F) and include your tool version.

## What HydraFusion is

HydraFusion is a **runtime model orchestrator** in GitHub Copilot. You select it in the model picker, or in recent VS Code builds reach it through the **Ensemble** options, but it is not a model. For each request, it chooses an execution pattern, the reasoning effort for each step, and the models that run it, then returns a single response.

It currently chooses between three execution patterns:

| Execution pattern | What happens |
| --- | --- |
| **Single** | One model completes the task. Behaves much like a normal single-model request. |
| **Cascade** | An efficient model drafts a solution. A judge inspects the draft and either accepts it or escalates to a stronger model. |
| **Critique** | One model drafts a response while multiple models critique it independently and in parallel. Feedback is aggregated and the original model revises once. |

A few behaviours are worth calling out:

- **Per-prompt decisions**: the pattern is chosen for every prompt, so one session can use Single for a first prompt and Critique for a follow-up.
- **Lightweight selection**: choosing the pattern adds little time and does not generate any part of the response.
- **Per-step reasoning**: drafts run with medium reasoning and reviews with high reasoning. **HydraFusion Max** unlocks extra high reasoning.
- **No fixed model list**: the model mix changes as new models arrive and GitHub re-evaluates performance. You cannot choose which models it uses.
- **Final answer only**: you can follow the progress of each step, but intermediate drafts are hidden from the final answer because they may be revised or discarded. In Copilot CLI 1.0.99-1 (prerelease) and later, you can expand passes to read their drafts; see [Using HydraFusion in Copilot CLI](#using-hydrafusion-in-copilot-cli).
- **No context window of its own**: each step runs within the limits of the model running it. The context window shown for HydraFusion is a conservative value based on the smallest limit among its models.

The Critique pattern will feel familiar if you have used the [rubber duck agent](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/rubber-duck) in Copilot CLI, which deliberately runs a critic on a different model from your session model to avoid shared blind spots.

### What the benchmarks say

GitHub's [Project HydraFusion blog post](https://github.blog/ai-and-ml/github-copilot/project-hydrafusion-frontier-quality-via-multi-model-orchestration/) reports controlled offline evaluations of the best tuned configuration against Claude Opus 5:

| Benchmark | Estimated cost vs Opus 5 | Verified quality vs Opus 5 |
| --- | --- | --- |
| TerminalBench 2.1 | 67% lower | +4.9 points |
| DeepSWE | 36% lower | -1.5 points |
| CheckpointBench (internal) | 65% lower | -0.1 points |

GitHub is explicit that these results are specific to the evaluated benchmark revisions, model pool, and pricing assumptions. Treat them as a signal of intent rather than a guarantee for your repository.

The same post describes the operating principles behind the runtime, including isolated, tool-less review steps and **fail-safe application**: no patch is applied when a workflow is cancelled or fails validation.

## HydraFusion vs Auto

Both options make the choice for you, but they choose different things. Auto picks the best **model** per request. HydraFusion picks the best **execution pattern and reasoning effort** per task, possibly using several models.

| Option | Description | When to use it |
| --- | --- | --- |
| **Auto** | Picks one model for each request. | Everyday work. |
| **HydraFusion** | Balanced approach with moderate token savings. | Substantial, well-scoped tasks such as a complex bug fix or a multi-file change, where extra passes are worth the time and AI credits. |
| **HydraFusion Max** | Tuned for frontier capability on demanding tasks while still considering token efficiency. | Tasks needing the deepest reasoning and most thorough analysis. |

The GitHub blog recommends starting with **first-turn, single-prompt coding tasks** that you can hand to Copilot in autopilot mode. Strong multi-turn performance for longer, iterative sessions is what GitHub says it is focusing on next.

## Prerequisites and access

Before you go looking for HydraFusion in a model picker, check the following:

- **A Copilot plan**: the announcement states HydraFusion is available to users on all GitHub Copilot plans.
- **A supported surface**: Copilot CLI, Visual Studio Code, or the GitHub Copilot app.
- **Preview features allowed**: if you get Copilot through an organisation or enterprise, your administrator must allow preview features for you.
- **Model policies**: HydraFusion only uses models available in your plan and allowed by your organisation or enterprise model policies. If none of its models are available, HydraFusion does not appear in the picker.

### Billing

There is no separate HydraFusion charge. You are billed for each model it uses at that model's standard rate, and the Auto model selection discount does **not** apply. Because Cascade and Critique run more than one pass, a single task can consume more AI credits than the same task on one model.

To keep costs reasonable, HydraFusion keeps the main conversation on the same model whenever possible so cached tokens continue to apply, and assisting models such as reviewers receive only the context they need. Per-model rates are in [Models and pricing for GitHub Copilot](https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing), where 1 AI credit equals $0.01 USD.

If you are already tracking Copilot spend, the guidance in [GitHub Copilot FinOps]({{< relref "/posts/2026-09-13-github-copilot-finops" >}}) applies directly here.

## Using HydraFusion in Copilot CLI

Copilot CLI was the first surface to ship HydraFusion and has the richest progress display.

1. Update Copilot CLI to the latest version:

    ```shell
    copilot update
    ```

2. Start Copilot CLI with experimental features turned on:

    ```shell
    copilot --experimental
    ```

    If you are already in a session, enter `/experimental on` and then restart Copilot CLI.

3. Enter `/model` and select **HydraFusion (Research Preview)** or **HydraFusion Max (Research Preview)**.

4. Enter a prompt.

While HydraFusion works, Copilot CLI shows:

- The execution pattern it chose: Single, Cascade, or Critique
- Each planned pass and whether it is done, running, or pending
- What the current pass is doing, such as running tools or receiving output
- How long the task has been running

Press `Esc` to interrupt. When the task completes, the conversation keeps a summary of the execution pattern and its steps, including any warnings.

#### Prerelease: expandable passes (1.0.99-1 and later)

Copilot CLI 1.0.98 behaves as described above, and the 1.0.101 and 1.0.104 release notes do not say whether expandable passes shipped in a stable release. Copilot CLI 1.0.99-1 is a prerelease, which you can install with `/update prerelease`. According to its [release notes](https://github.com/github/copilot-cli/releases/tag/v1.0.99-1), and as reported by the site owner running that build:

- A pass stays expanded while its review runs, so you can read the draft being reviewed.
- Passes that were not kept (discarded drafts) stay expandable after the turn, until you switch sessions or resume the session.
- When you abort a turn with `Esc`, each pass says whether it was kept.

Until this ships in a stable release, treat it as prerelease behaviour. The GitHub Docs page does not describe it yet.

### Non-interactive use

For a single prompt, for example in a script, pass the model with `--model`:

```shell
copilot --experimental --model hydrafusion -p "Fix the flaky retry logic in src/http/client.ts and add a regression test"
```

### Checking usage and collecting logs

Two slash commands are useful during the preview:

- `/usage` shows the AI credits each model consumed in the current session.
- `/collect-debug-logs` creates an archive of debug logs with the execution pattern and models used per step. Attach this when filing a bug report.

## Using HydraFusion in Visual Studio Code

HydraFusion shipped in [VS Code 1.140](https://code.visualstudio.com/updates/v1_140#_hydrafusion-model-orchestration-research-preview) as a research preview. You need **VS Code 1.140 or later**, or VS Code Insiders. Since VS Code 1.142, where you find HydraFusion in the model picker depends on whether **Ensemble** is turned on.

1. Open the Settings editor with `Ctrl+,` on Windows and Linux or `Cmd+,` on macOS.
2. Search for `chat.copilot.hydraFusion.enabled`. In VS Code 1.142 and later this is a dropdown, not a checkbox, and it defaults to `v2`. Leave it on `v2`, or select `true` for the original version. `false` turns HydraFusion off.
3. Open Copilot Chat from the chat icon in the title bar.
4. At the bottom of the chat view, open the model picker. Since VS Code 1.142 the redesigned picker separates Copilot and bring-your-own-key models into tabs, so stay on the **Copilot** tab. Then:
    - **If you see Auto**: HydraFusion is listed after **Auto** as a model of its own. Select it and choose the **Default** or **Max** tier in its details.
    - **If you see Ensemble instead of Auto**: HydraFusion is no longer listed by name. Ensemble offers **Balance**, **High** and **Max** under "Optimize for". **Max** runs HydraFusion Max. **High** runs HydraFusion only when `chat.copilot.ensemble.intelligenceUsesHydraFusion` is on, otherwise it routes like Auto.
5. Enter a prompt. The chat view shows each step of the execution pattern as HydraFusion works.

To see which models HydraFusion used, hover over the footer of a completed response.

### Ensemble: HydraFusion behind the last two options

Ensemble is a newer way of presenting **Auto**. Instead of a single Auto entry, the picker offers Ensemble with three optimisation levels. VS Code describes Ensemble as routing "based on your task and real-time system health and model performance", and the picker shows a discount for models routed through it. The last two levels are where HydraFusion now lives:

| Ensemble option | What runs |
| --- | --- |
| **Balance** | Auto routing that "balances cost/speed and capability based on task complexity" |
| **High** | HydraFusion v2 when `chat.copilot.ensemble.intelligenceUsesHydraFusion` is on, otherwise Auto's Intelligence routing, which "optimizes for capability" |
| **Max** | HydraFusion Max (only shown when HydraFusion is available) |

Three settings control what you see:

| Setting | Default | Effect |
| --- | --- | --- |
| `chat.copilot.hydraFusion.enabled` | `v2` | Makes HydraFusion available. `v2` plans with per-step reasoning effort and a wider set of models. |
| `chat.copilot.ensemble.enabled` | `false` | Presents Auto as Ensemble with Balance, High and Max. |
| `chat.copilot.ensemble.intelligenceUsesHydraFusion` | `false` | With Ensemble on, makes the High option use HydraFusion v2. |

All three are tagged experimental, and GitHub can switch them on or off for you through Copilot experiments. That explains why Ensemble can appear after an update without you changing anything. Changing the Ensemble setting can restart the local Copilot runtime.

If you manage settings as code and want HydraFusion behind both High and Max, use:

```json
{
  "chat.copilot.hydraFusion.enabled": "v2",
  "chat.copilot.ensemble.enabled": true,
  "chat.copilot.ensemble.intelligenceUsesHydraFusion": true
}
```

To keep the classic picker with HydraFusion as a separate entry, set `chat.copilot.ensemble.enabled` to `false`.

Ensemble is not yet covered by the VS Code release notes or the GitHub HydraFusion docs. The details above come from the setting descriptions and model picker text in VS Code 1.142 and VS Code Insiders 1.143, so expect them to change.

## Using HydraFusion in the GitHub Copilot app

The [GitHub Copilot app]({{< relref "/posts/2026-06-22-github-copilot-app-generally-available" >}}) exposes HydraFusion through its experimental settings:

1. Update the Copilot app to the latest version.
2. Open **Settings** and select **Experimental**.
3. Turn on **HydraFusion**.
4. In the model picker, select **HydraFusion** or **HydraFusion Max**.

To see which models HydraFusion used, hover over the response. If the HydraFusion setting is missing, switch to the prerelease channel in the app's settings.

## What about Visual Studio?

At the time of writing, GitHub's HydraFusion documentation lists availability in **Copilot CLI, Visual Studio Code, and the GitHub Copilot app** only. Visual Studio is not listed, and neither the Visual Studio Copilot documentation nor the Visual Studio 2026 release notes mention HydraFusion.

If you work primarily in Visual Studio, the practical options today are:

- Use **Auto** model selection in Visual Studio for everyday work.
- Run larger, well-scoped HydraFusion tasks from **Copilot CLI** in a terminal against the same repository, then review the changes in Visual Studio.

Keep an eye on the HydraFusion docs page, since the availability list is the authoritative source if support expands.

## Comparing the surfaces

| | Copilot CLI | VS Code | Copilot app | Visual Studio |
| --- | --- | --- | --- | --- |
| Available | Yes | Yes | Yes | Not listed |
| Minimum version | Latest (`copilot update`) | 1.140 or Insiders | Latest | Not applicable |
| How to enable | `--experimental` or `/experimental on` | `chat.copilot.hydraFusion.enabled` (defaults to `v2` since 1.142) | Settings > Experimental > HydraFusion | Not applicable |
| How to select | `/model` or `--model hydrafusion` | Model picker: **HydraFusion**, or **Ensemble** > **High** or **Max** | Model picker | Not applicable |
| HydraFusion Max | Yes | Yes | Yes | Not applicable |
| Progress display | Pattern, passes, status, elapsed time. Prerelease 1.0.99-1 and later: passes can also be expanded to read drafts, including discarded ones | Steps of the execution pattern | Not documented | Not applicable |
| See models used | `/usage`, `/collect-debug-logs` | Hover over response footer | Hover over response | Not applicable |
| If missing from picker | Restart, then `/update prerelease` | Check version and setting | Switch to prerelease channel | Not applicable |

## Limitations and tips

The documented limitations are short, but each one matters in practice:

- **No subagents**: HydraFusion works separately from subagents and does not start them.
- **Discarded drafts can leave edits behind**: if HydraFusion discards a draft, file edits that draft already made in your workspace are not undone automatically. Review your working tree before committing.
- **Moving target**: execution patterns and models can change during the research preview.

A few practical tips based on the documentation:

- **Use a clean branch or worktree** for HydraFusion runs so any leftover edits from discarded drafts are easy to spot with `git status` and `git diff`.
- **Reserve it for substantial tasks**. For quick or routine prompts, switch back to **Auto**. Cascade and Critique take longer and cost more.
- **Compact before switching** in long sessions. If your conversation is larger than HydraFusion's conservative context window, you are asked to compact first. See [Managing context in GitHub Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/context-management#compaction).
- **Watch credits early**. Check `/usage` in the CLI or [monitor your AI Credits usage](https://docs.github.com/en/copilot/how-tos/manage-and-track-spending/monitor-ai-usage) on GitHub after the first few runs to calibrate expectations.

## Troubleshooting

### HydraFusion does not appear in the model picker

- **Copilot CLI**: confirm experimental features are on and restart after `/experimental on`. If it is still missing, enter `/update prerelease`. Prereleases may be less stable.
- **VS Code**: confirm you are on 1.140 or later and `chat.copilot.hydraFusion.enabled` is `v2` or `true`. If the picker shows **Ensemble** instead of **Auto**, HydraFusion is behind Ensemble's **Max** option, and behind **High** when `chat.copilot.ensemble.intelligenceUsesHydraFusion` is on.
- **Copilot app**: confirm you are on the latest version and HydraFusion is on in **Settings > Experimental**. Switch to the prerelease channel if the setting is missing.
- **Organisation or enterprise**: ask your administrator whether preview features are enabled, and whether your model policies allow any of the models HydraFusion uses.

### A task is slow or uses more AI credits than expected

Cascade and Critique run multiple passes by design. Use the CLI progress display to see which pattern is running and select **Auto** for routine work.

### You are asked to compact before switching

Your conversation exceeds HydraFusion's conservative context window. Compact the conversation, then switch.

## Recap and next steps

HydraFusion moves Copilot from "choose the best model" to "choose the best way to solve this task". In practice:

- Enable it in **Copilot CLI** with `--experimental`, in **VS Code 1.140+** with `chat.copilot.hydraFusion.enabled`, or in the **Copilot app** under **Settings > Experimental**.
- In VS Code 1.142 and later, look for it behind **Ensemble** > **High** or **Max** if Auto is presented as Ensemble.
- Visual Studio is not currently listed as a supported surface.
- Use it for substantial, well-scoped tasks, and keep **Auto** for everyday prompts.
- Expect higher credit consumption on multi-pass patterns and review your working tree before committing.

Because this is a research preview, GitHub is actively asking for feedback. Share your results, including session IDs or debug logs, in the [HydraFusion feedback discussion](https://github.com/orgs/community/discussions/206492) or through `/feedback` in Copilot CLI.

## Change log

- **2026-10-27**: Reviewed the HydraFusion docs, VS Code Insiders 1.144 and Copilot CLI 1.0.101 and 1.0.104. The docs and the VS Code 1.144 release notes mention no change to the steps in this post. Copilot CLI 1.0.101 says switching to HydraFusion compacts only when the routed model needs it, and 1.0.104 says the managed model "fusion" now starts sessions on Auto and applies `fusionTier` settings. Check `/model` after updating.
- **2026-10-16**: Added the Copilot CLI 1.0.99-1 prerelease behaviour: passes stay expanded during review, discarded passes stay expandable until you switch or resume sessions, and aborted turns show whether each pass was kept. The sources reviewed mention no change to stable 1.0.98 behaviour. Reported in [#543](https://github.com/sujithq/sujithq.github.io/issues/543) and confirmed by the prerelease notes.
- **2026-10-16**: Updated the VS Code steps for 1.142 and Insiders 1.143. `chat.copilot.hydraFusion.enabled` is now a dropdown that defaults to `v2`, the model picker has a Copilot tab, and with Ensemble turned on HydraFusion runs behind Ensemble's High and Max options instead of appearing by name. Reported in [#536](https://github.com/sujithq/sujithq.github.io/issues/536). Copilot CLI 1.0.98 release notes reviewed with no HydraFusion changes.
- **2026-10-16**: First published. Added the "Last verified" table and automated release-note checks.

## References

- [Using HydraFusion](https://docs.github.com/en/early-access/copilot/hydrafusion) (GitHub Docs, early access)
- [Project HydraFusion: frontier quality via multi-model orchestration](https://github.blog/ai-and-ml/github-copilot/project-hydrafusion-frontier-quality-via-multi-model-orchestration/) (GitHub Blog)
- [HydraFusion research preview announcement and FAQ](https://github.com/orgs/community/discussions/206492) (GitHub Community)
- [VS Code 1.140 release notes: HydraFusion model orchestration](https://code.visualstudio.com/updates/v1_140#_hydrafusion-model-orchestration-research-preview)
- [About Copilot auto model selection](https://docs.github.com/en/copilot/concepts/models/auto-model-selection)
- [Getting a second opinion with the rubber duck agent](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/rubber-duck)
- [Models and pricing for GitHub Copilot](https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing)
- [Monitoring your GitHub AI Credits usage](https://docs.github.com/en/copilot/how-tos/manage-and-track-spending/monitor-ai-usage)
- [Managing context in GitHub Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/context-management)
- Related: [Maximising Copilot token efficiency]({{< relref "/posts/2026-06-19-maximising-copilot-token-efficiency" >}})
