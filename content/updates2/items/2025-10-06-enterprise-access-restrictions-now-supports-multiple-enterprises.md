---
title: "github: Enterprise access restrictions now supports multiple enterprises"
date: 2025-10-06T23:52:41.000Z
slug: enterprise-access-restrictions-now-supports-multiple-enterprises
update_categories: ["github"]
update_tags: ["github", "enterprise", "security", "access-restrictions", "EMU", "changelog"]
update_bullets: ["What changed: Enterprise access restrictions now accept multiple enterprises via a single proxy header.", "Who it affects: Organizations using GitHub Enterprise Cloud with multiple Enterprise Managed Users (EMU) accounts.", "Benefit: Simplifies proxy/network configuration by allowing one header to cover multiple enterprises instead of managing separate restrictions per enterprise.", "Previous behavior: Access restrictions were effectively limited to a single enterprise, requiring more complex setups for multi-enterprise customers.", "Action for admins: Update proxy headers and access restriction settings to include all relevant enterprise identifiers to enforce outbound restrictions to github.com.", "Source: GitHub changelog announcement (2025-10-06)."]
timeframes: ["2025-10"]
link: "https://github.blog/changelog/2025-10-06-enterprise-access-restrictions-now-supports-multiple-enterprises"
source: "GitHub"
timeframeKey: "2025-10"
id: "91FA505C42E20CBD8D6FF3E552E6C7B086A3D9875F677386A4BF8FFDFA950C39"
contentHash: "15F47FABFAB0FFDF4DB3743F547A01E479188CE94F573BEDC814C3903410D8F9"
draft: false
type: "updates2"
llmSummary: "GitHub Enterprise Cloud customers with multiple Enterprise Managed Users (EMU) accounts can now use a single proxy header to block traffic to github.com that originates outside any of their enterprises. This update lifts the prior limitation that tied enterprise access restrictions to a single enterprise, simplifying network configuration for organizations with multiple EMU accounts."
---

GitHub Enterprise Cloud customers with multiple Enterprise Managed Users (EMU) accounts can now use a single proxy header to block traffic to github.com that originates outside any of their enterprises. This update lifts the prior limitation that tied enterprise access restrictions to a single enterprise, simplifying network configuration for organizations with multiple EMU accounts.

- **Source:** [GitHub](https://github.blog/changelog/2025-10-06-enterprise-access-restrictions-now-supports-multiple-enterprises)
