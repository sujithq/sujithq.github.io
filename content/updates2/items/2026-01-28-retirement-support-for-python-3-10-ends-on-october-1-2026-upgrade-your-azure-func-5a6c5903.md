---
title: "azure: Retirement: Support for Python 3.10 ends on October 1, 2026 – upgrade your Azure Functions apps to Python 3.13"
date: 2026-01-28T23:15:47.000Z
slug: retirement-support-for-python-3-10-ends-on-october-1-2026-upgrade-your-azure-functions-apps-to-python-3-13
update_categories: ["azure"]
update_tags: ["Azure Functions", "Python 3.10", "Python 3.13", "End of support", "Upgrade", "Security"]
update_bullets: ["End-of-support date: October 1, 2026 — Azure Functions will stop supporting Python 3.10 after this date.", "Impact: Existing apps will continue to run but will no longer receive security fixes, patches, or performance improvements for the Python 3.10 runtime.", "Recommended target: Move to a supported runtime such as Python 3.13 (verify Azure Functions runtime compatibility with 3.13).", "Planning actions: inventory all Function apps using Python 3.10, identify dependencies and native extensions, and check compatibility with Python 3.13.", "Upgrade steps: update local dev environments and CI/CD images to Python 3.13, update requirements.txt/poetry files, rebuild virtual environments, run full test suites, and fix any compatibility issues.", "Deployment: change the Function App runtime/stack settings in Azure to the new Python version, deploy to a staging slot (or test environment), perform validation, then swap to production.", "Post-upgrade checks: verify triggers, bindings, extension bundle versions, logging/monitoring, and performance; monitor for errors and regressions after rollout.", "Timing advice: start migrations well before October 1, 2026 to allow time for testing and dependency updates and to avoid running unsupported runtimes in production."]
timeframes: ["2026-01"]
link: "https://azure.microsoft.com/updates?id=545771"
source: "Azure Updates"
timeframeKey: "2026-01"
id: "C9DBF1D52E30360059AF7B9930E1E8BA8A6C87CA804CD396528F4DEE0BC69806"
contentHash: "E24E1624857AB5D6FBC4E68FB354996CF1E16565E5C18D2485BA130953A3FEF0"
draft: false
type: "updates2"
llmSummary: "Microsoft will end support for Python 3.10 in Azure Functions on October 1, 2026 (in line with community support retirement). Function apps running on Python 3.10 will continue to run after that date but will no longer receive security updates or performance optimizations. Customers should plan and perform an upgrade to a supported Python runtime (Microsoft recommends Python 3.13) before the retirement date."
---

Microsoft will end support for Python 3.10 in Azure Functions on October 1, 2026 (in line with community support retirement). Function apps running on Python 3.10 will continue to run after that date but will no longer receive security updates or performance optimizations. Customers should plan and perform an upgrade to a supported Python runtime (Microsoft recommends Python 3.13) before the retirement date.

- **Source:** [Azure Updates](https://azure.microsoft.com/updates?id=545771)
