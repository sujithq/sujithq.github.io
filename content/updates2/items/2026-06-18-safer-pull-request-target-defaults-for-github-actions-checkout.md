---
title: "github: Safer pull_request_target defaults for GitHub Actions checkout"
date: 2026-06-18T14:06:55.000Z
slug: safer-pull-request-target-defaults-for-github-actions-checkout
update_categories: ["github"]
update_tags: ["GitHub Actions", "GitHub Changelog", "Security", "pull_request_target"]
update_bullets: ["`pull_request_target` workflows run with the base repository’s `GITHUB_TOKEN` and secrets, which has been a frequent source of vulnerabilities.", "The update affects the default checkout behavior in GitHub Actions for `pull_request_target` workflows.", "The intent is to make the safer option the default when checking out code in these workflows."]
timeframes: ["2026-06"]
link: "https://github.blog/changelog/2026-06-18-safer-pull_request_target-defaults-for-github-actions-checkout"
source: "GitHub"
timeframeKey: "2026-06"
id: "B5E2E8CCA7AEAC934EF909FD9D2D5F4605A4DB5E0C931CA057E54D42888BFA33"
contentHash: "9863AC2172B9CDD5FC593B4EE74800A2641D549B52258F9F55DB76E1FCE4DABD"
draft: false
type: "updates2"
llmSummary: "GitHub is changing the default behavior of the Actions checkout action for workflows triggered by `pull_request_target` to reduce common security mistakes. The goal is to avoid exposing base-branch credentials or secrets to untrusted pull request code."
---

GitHub is changing the default behavior of the Actions checkout action for workflows triggered by `pull_request_target` to reduce common security mistakes. The goal is to avoid exposing base-branch credentials or secrets to untrusted pull request code.

- **Source:** [GitHub](https://github.blog/changelog/2026-06-18-safer-pull_request_target-defaults-for-github-actions-checkout)
