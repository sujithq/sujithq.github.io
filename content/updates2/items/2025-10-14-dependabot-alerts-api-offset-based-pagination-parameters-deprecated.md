---
title: "github: Dependabot alerts API offset-based pagination parameters deprecated"
date: 2025-10-14T14:38:56.000Z
slug: dependabot-alerts-api-offset-based-pagination-parameters-deprecated
update_categories: ["github"]
update_tags: ["dependabot", "github", "rest-api", "pagination", "deprecation", "alerts", "cursor-based"]
update_bullets: ["Deprecated/removed parameters: page, first, last — no longer accepted on Dependabot alerts REST endpoints.", "Supported parameters now: before, after, per_page (cursor-based pagination).", "If your integrations, scripts, or SDK usage rely on offset pagination, update them to use cursor-based pagination with before/after and per_page.", "Verify and update any paginated request handling, tests, client libraries, and documentation to use cursors.", "Monitor SDKs and third-party tools for published updates that implement cursor-based pagination for Dependabot alerts."]
timeframes: ["2025-10"]
link: "https://github.blog/changelog/2025-10-14-dependabot-alerts-api-pagination-parameters-deprecated"
source: "GitHub"
timeframeKey: "2025-10"
id: "11C3FC27CD3410ABC3B18AE8912460A648DCEC1940385759511F2AECB6457E83"
contentHash: "6CC1FDC3F74DC00F94C93868BE92FCD34F73D4317F9DFBAEF06CB82334167416"
draft: false
type: "updates2"
llmSummary: "GitHub has removed offset-based pagination parameters (page, first, last) from all Dependabot alerts REST API endpoints; only cursor-based parameters (before, after, per_page) are supported going forward."
---

GitHub has removed offset-based pagination parameters (page, first, last) from all Dependabot alerts REST API endpoints; only cursor-based parameters (before, after, per_page) are supported going forward.

- **Source:** [GitHub](https://github.blog/changelog/2025-10-14-dependabot-alerts-api-pagination-parameters-deprecated)
