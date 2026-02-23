---
title: "azure: [Launched] Generally Available: Enabling dedicated connections to backends in Azure Application Gateway"
date: 2025-09-15T16:45:57.000Z
slug: launched-generally-available-enabling-dedicated-connections-to-backends-in-azure-application-gateway
update_categories: ["azure"]
update_tags: ["Azure", "Application Gateway", "Networking", "Dedicated connections", "GA", "Backend"]
update_bullets: ["Feature: Option to enable dedicated (non-reused) connections from Application Gateway to backend servers.", "Default behavior: Application Gateway reuses idle backend connections to optimize TCP resource usage.", "Why use it: Dedicated connections provide isolation and predictable per-connection behavior for backends that require unique connections or have state tied to a connection.", "When to use: Useful for stateful backends, backends requiring per-connection TLS/mTLS, affinity-sensitive applications, or troubleshooting connection-related issues.", "Availability: The capability is now Generally Available (GA) for Application Gateway V2."]
timeframes: ["2025-09"]
link: "https://azure.microsoft.com/updates?id=503398"
source: "Azure Updates"
timeframeKey: "2025-09"
id: "B3CEB60BE8FA2174837E78FC64DBFD055ABEDF3C4C2EC7BF6F4158C25A3C8900"
contentHash: "F1A3583BD1B20E618202D1EBAE9051DC8DD8F44B6583A0792BD039FEB46570E7"
draft: false
type: "updates2"
llmSummary: "Azure Application Gateway V2 now generally available: customers can enable dedicated connections from the gateway to backend servers instead of using the default connection reuse behavior."
---

Azure Application Gateway V2 now generally available: customers can enable dedicated connections from the gateway to backend servers instead of using the default connection reuse behavior.

- **Source:** [Azure Updates](https://azure.microsoft.com/updates?id=503398)
