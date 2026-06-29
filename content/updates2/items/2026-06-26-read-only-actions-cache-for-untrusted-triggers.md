---
title: "github: Read-only Actions cache for untrusted triggers"
date: 2026-06-26T18:31:43.000Z
slug: read-only-actions-cache-for-untrusted-triggers
update_categories: ["github"]
update_tags: ["github-actions", "cache", "security", "least-privilege", "untrusted-triggers"]
update_bullets: ["Default-branch workflows triggered by events possible without write access now receive read-only Actions cache tokens.", "The change is intended to reduce cache write capability for untrusted triggers.", "Applies to GitHub Actions cache access, not general repository permissions."]
timeframes: ["2026-06"]
link: "https://github.blog/changelog/2026-06-26-read-only-actions-cache-for-untrusted-triggers"
source: "GitHub"
timeframeKey: "2026-06"
id: "FD356D1313CB481B16106747DB2331DB48A6B50A56FB4A4102E93E0D6481C208"
contentHash: "D4CDA315242408C7A031BD48199577D7AA9181A4DC9758271AD14321A0B0DD85"
draft: false
type: "updates2"
llmSummary: "GitHub Actions now uses read-only cache tokens on the default branch for workflow events that can be triggered without repository write permissions. This narrows cache access for untrusted triggers by applying least privilege."
---

GitHub Actions now uses read-only cache tokens on the default branch for workflow events that can be triggered without repository write permissions. This narrows cache access for untrusted triggers by applying least privilege.

- **Source:** [GitHub](https://github.blog/changelog/2026-06-26-read-only-actions-cache-for-untrusted-triggers)
