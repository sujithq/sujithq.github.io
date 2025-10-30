---
title: "azure: Retirement: Support for Node.js 20 ends on April 30, 2026 – upgrade your apps to Node.js 22"
date: 2025-10-30T16:00:54.000Z
slug: retirement-support-for-node-js-20-ends-on-april-30-2026-upgrade-your-apps-to-node-js-22
update_categories: ["azure"]
update_tags: ["Azure", "Azure Functions", "Node.js", "Node.js 20", "Node.js 22", "End of support", "Upgrade", "Security"]
update_bullets: ["Support end date: April 30, 2026 — after this date Node.js 20 in Azure Functions receives no security or performance updates.", "Impact: Existing Function apps will keep running but are exposed to unpatched vulnerabilities and missed optimizations.", "Target: Upgrade your Functions apps to Node.js 22 (LTS) before the end-of-support date.", "Inventory: Identify all Function apps using Node.js 20, including dev/test/prod environments and CI/CD pipelines.", "Compatibility check: Review application dependencies and native modules for Node.js 22 compatibility; rebuild native modules where required.", "Code changes: Update package.json (engines field if used), adjust any Node-API or runtime-specific code, and run full test suites locally under Node.js 22.", "Configuration: Change the Function app runtime stack to Node.js 22 in the Azure portal, ARM/Bicep templates, or CI/CD configuration; use a staging slot for validation before swapping.", "Testing & rollout: Perform canary/staged deployments, monitor logs and telemetry for errors or performance regressions, and have a rollback plan.", "CI/CD & tooling: Update build agents, Docker base images, and development tools to use Node.js 22 to keep builds reproducible.", "References: Consult Azure Functions documentation and Node.js 22 release notes for breaking changes, deprecations, and migration guidance."]
timeframes: ["2025-10"]
link: "https://azure.microsoft.com/updates?id=502957"
source: "Azure Updates"
timeframeKey: "2025-10"
id: "E64A9C5DA6135DAB0D7B4A65FF1F0BEC0E1F7D70946F50A63A651FE8CFC8292B"
contentHash: "AEBCFDB4D308D8EA71D16D2BA005ECE71D35FCB29C79418E15D539CC7C199804"
draft: false
type: "updates2"
llmSummary: "Azure Functions will stop supporting Node.js 20 on April 30, 2026. Apps running on Node.js 20 will continue to run, but they will no longer receive security fixes or performance updates; you should plan and perform an upgrade to Node.js 22 beforehand."
---

Azure Functions will stop supporting Node.js 20 on April 30, 2026. Apps running on Node.js 20 will continue to run, but they will no longer receive security fixes or performance updates; you should plan and perform an upgrade to Node.js 22 beforehand.

- **Source:** [Azure Updates](https://azure.microsoft.com/updates?id=502957)
