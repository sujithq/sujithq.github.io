---
title: "github: Actions pull_request_target and environment branch protections changes"
date: 2025-11-07T16:18:15.000Z
slug: actions-pull-request-target-and-environment-branch-protections-changes
update_categories: ["github"]
update_tags: ["github", "github-actions", "security", "pull_request_target", "branch-protection", "environments", "announcement"]
update_bullets: ["What: Evaluation logic for pull_request_target and environment branch protection rules will be updated for pull-request events.", "When: Changes take effect on 2025-12-08 (Dec 8, 2025).", "Why: The update aims to reduce security-critical exposures related to workflows triggered by pull requests.", "Potential impact: Workflows that rely on the current pull_request_target behavior or on environment/branch protection assumptions may see different permission or rule enforcement after the change.", "Recommended actions: Review repositories that use pull_request_target, audit environment and branch protection rules, test workflows before the enforcement date, and update workflows or protections as needed.", "Reference: Full announcement on the GitHub Blog — https://github.blog/changelog/2025-11-07-actions-pull_request_target-and-environment-branch-protections-changes"]
timeframes: ["2025-11"]
link: "https://github.blog/changelog/2025-11-07-actions-pull_request_target-and-environment-branch-protections-changes"
source: "GitHub"
timeframeKey: "2025-11"
id: "00EFBE5FB34B4C3B4C59C7D7CE4CA6BD69ECD93F7899403F6ACC869B85581DEA"
contentHash: "21AA7C244812883422202EBF56DD0842A66A1583AAC9BEA10965A5274BAE44FE"
draft: false
type: "updates2"
llmSummary: "GitHub will change how Actions' pull_request_target and environment branch protection rules are evaluated for pull-request-related events, effective 2025-12-08, to reduce security-critical exposures."
---

GitHub will change how Actions' pull_request_target and environment branch protection rules are evaluated for pull-request-related events, effective 2025-12-08, to reduce security-critical exposures.

- **Source:** [GitHub](https://github.blog/changelog/2025-11-07-actions-pull_request_target-and-environment-branch-protections-changes)
