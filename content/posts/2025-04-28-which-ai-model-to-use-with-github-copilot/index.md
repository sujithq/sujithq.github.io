+++
title = 'Choosing a GitHub Copilot AI Model'
slug = 'which-ai-model-to-use-with-github-copilot'
date = '2025-04-28 08:00:00+02:00'
lastmod = '2026-10-16 14:07:00+02:00'
draft = false
tags = ['AI Models', 'GitHub Copilot', 'Development']
categories = ['AI', 'Development']
series = ['GitHub Copilot Guides']

layout = "single"
audio = false
[params]
  cover = true
  author = "sujith"
  living = true

description = "Choose a GitHub Copilot model by task, quality, speed, availability and cost, with practical guidance for Chat, CLI and the Copilot app."
+++

GitHub Copilot offers models from several providers, and the selection changes
over time. A model that appears in one Copilot product or plan may not be
available in another. Instead of memorising a ranking that will soon be
outdated, choose a model for the work in front of you and check GitHub's live
model comparison when you need current details.

## The short answer

If you're unsure, start with **Auto**. It chooses from the models available to
you, taking task complexity and model availability into account. If you need a
specific capability or want to control cost, latency or behaviour more
directly, select a model yourself and compare it on your real task.

| Your priority | A practical starting point |
| --- | --- |
| Everyday questions and coding | Auto with Balance, where available |
| A quick explanation or small change | Auto with Efficiency, or a lightweight model |
| A difficult bug or design decision | Auto with Intelligence, or a model described for deep reasoning |
| A multi-step coding agent task | A model described for agentic software development |
| A large codebase or long prompt | A model with extended-context support, if your plan and client offer one |
| A screenshot, diagram or other image | A model that explicitly supports image input |
| A constrained plan or organisation | Choose from the models enabled and shown in your Copilot client |

These are starting points, not guarantees. A model label is not a benchmark of
how it will perform on your codebase. Check the
[AI model comparison](https://docs.github.com/en/copilot/reference/ai-models/model-comparison)
and the model picker for current recommendations and availability.

## Last verified

This guide is tracked against the official documentation for Auto model
selection, model access and pricing. The automated workflow checks these pages
for changes; a human reviews proposed updates before publication.

<!-- living-post:verified:start -->
| Source | Scope reviewed | Link | Reviewed on |
| --- | --- | --- | --- |
| GitHub Docs | Auto model selection | [Docs](https://docs.github.com/en/copilot/concepts/models/auto-model-selection) | 2026-10-16 |
| GitHub Docs | Model access | [Docs](https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-access-to-ai-models) | 2026-10-16 |
| GitHub Docs | Models and pricing | [Docs](https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing) | 2026-10-16 |
<!-- living-post:verified:end -->

Does a step no longer match what you see? [Report an outdated step](https://github.com/sujithq/sujithq.github.io/issues/new?template=outdated-post.yml&title=%5Boutdated%5D+which-ai-model-to-use-with-github-copilot&post=https%3A%2F%2Fquintelier.dev%2Fposts%2F2025%2F04%2Fwhich-ai-model-to-use-with-github-copilot%2F).

## How model selection works

GitHub Copilot is an experience that can use different AI models. The models
available to you depend on your Copilot plan, the client you're using, and any
organisation or enterprise policies. The current
[supported models list](https://docs.github.com/en/copilot/reference/ai-models/supported-models)
is the source of truth for names, status and plan availability. Your model
picker shows the choices available in your current context.

Model availability and status change. Models can be added, moved between
preview and general availability, or retired. The model name alone also does
not tell you everything you need to know: context limits, capabilities,
latency, pricing and data handling may differ. Follow the links from GitHub's
model pages for the details that matter to your work.

## When to use Auto

Auto is a good default when you want Copilot to select a suitable model instead
of choosing one for each prompt. GitHub says Auto can account for task
complexity and real-time model availability, and may route different prompts
to different models. You can inspect which model answered in the client, where
that information is available.

In VS Code, Copilot CLI and the GitHub Copilot app, Auto includes **Efficiency**,
**Balance** and **Intelligence** tiers. Efficiency prioritises cost, Balance
weighs cost, quality and latency, and Intelligence prioritises answer quality.
The tier influences routing preferences; it does not lock every prompt to one
model or guarantee that a difficult task will receive a particular model.
Other Copilot clients may offer Auto without these tier controls.

If you are on a paid Copilot plan, GitHub currently applies a 10% discount to
model costs when you use Auto in supported Copilot experiences. Auto does not
make usage free, and the model selected can still affect your usage. See
[About Copilot Auto model selection](https://docs.github.com/en/copilot/concepts/models/auto-model-selection)
for supported experiences, tier details and current terms.

Choose a model directly when you have a repeatable reason to prefer it, such as
a required capability, a known result on your own tasks, or a policy that
requires a particular model. Otherwise, Auto helps avoid making a choice based
on a model's name or a stale online ranking.

## Choose by task

### Quick questions and small changes

For a short explanation, a small function or a routine edit, try Auto with
Efficiency where available, or a lightweight model listed in the current model
comparison. These tasks usually do not need the longest context window or the
most intensive reasoning.

If the answer is incomplete, give Copilot the missing context or ask it to
verify the result. Moving immediately to a larger model may not fix an unclear
request.

### Everyday coding

For normal implementation, tests and code explanations, start with Auto in
Balance or a general-purpose model. Describe the expected behaviour, relevant
files and constraints. A clear task and useful repository context often matter
more than selecting a model with the most impressive description.

### Difficult debugging and design

For an intermittent bug, cross-file change or architecture decision, try Auto
with Intelligence or a model GitHub describes as suited to deep reasoning.
Supply the error, what you expected, what happened, and the evidence you've
already gathered. Ask for a plan before broad edits, and have Copilot explain
assumptions that affect the design.

More reasoning does not replace verification. Run the tests, inspect the diff
and check the relevant behaviour yourself.

### Coding agent tasks

For a task that requires several steps, repository exploration, tool use and
validation, look at models described for agentic software development in the
current comparison. Give the agent a well-bounded outcome and acceptance
criteria, then review its changes and test results. A model that performs well
in a chat exchange may not be the best fit for a long-running agent task.

### Large context and images

If the task includes a large amount of code or documentation, check whether the
model supports an extended context window and whether that capability is
available in your plan and client. A larger context is useful only when the
additional material is relevant; include the files and details needed to solve
the task rather than adding everything indiscriminately.

For screenshots, diagrams or mock-ups, choose a model whose current
documentation explicitly lists image input. Support can change, so don't infer
it from the provider or model family name.

## Compare models on your own work

When you need to choose between specific models, use a small, fair comparison:

1. Pick a representative task with a clear expected result.
2. Start a fresh chat or agent session for each model so earlier answers do
   not influence later attempts.
3. Keep the prompt, files and instructions the same.
4. Compare correctness, completeness, useful reasoning, latency and any usage
   cost shown by your plan.
5. For code changes, run the same tests and review the same diff for every
   result.

Try more than one task before drawing a conclusion. A model that is strongest
for debugging may not be the fastest for routine edits. Keep a preferred model
only when the improvement is repeatable and worth any additional cost or wait.

## Check cost and access before committing to a model

Copilot usage and model costs depend on your plan and the model used. Review
the current [models and pricing documentation](https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing)
before adopting a model for frequent or automated work. Pricing and plan
allowances can change, so avoid relying on a copied table or a multiplier from
an older article.

If a model is missing from the picker, check the supported models page, your
plan, the Copilot client version and your organisation's model policies.
Organisation and enterprise administrators can control which models members
may use. See
[Configuring access to AI models](https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-access-to-ai-models).

For provider hosting and data-handling information, consult GitHub's
[model hosting documentation](https://docs.github.com/en/copilot/reference/ai-models/model-hosting)
and your organisation's policies. Do not assume that changing the model
changes the data controls that apply to your Copilot plan.

## A simple decision checklist

Before picking a model, ask:

- Is Auto available, and does it meet the task's needs?
- Does this task need speed, deeper reasoning, agentic work, image input or
  extended context?
- Is the model available in this Copilot client and under my plan or
  organisation's policies?
- Have I checked its current cost and any usage limits?
- Can I verify its answer with tests, documentation or another source?

If you don't have a specific reason to choose otherwise, start with Auto,
provide the right context, and verify the result. Change models when a real
task shows a clear reason to do so, not just because a newer name appears in
the picker.

## Change log

- 2026-10-16: Rewrote the guide as task-based advice and began tracking the
  official documentation for Auto selection, model access and pricing.

## References

- [Supported AI models in GitHub Copilot](https://docs.github.com/en/copilot/reference/ai-models/supported-models)
- [AI model comparison](https://docs.github.com/en/copilot/reference/ai-models/model-comparison)
- [About Copilot Auto model selection](https://docs.github.com/en/copilot/concepts/models/auto-model-selection)
- [Configuring access to AI models](https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-access-to-ai-models)
- [Models and pricing for GitHub Copilot](https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing)
- [Hosting of models for GitHub Copilot](https://docs.github.com/en/copilot/reference/ai-models/model-hosting)
- [Base and long-term support models](https://docs.github.com/en/copilot/concepts/models/fallback-and-lts-models)
