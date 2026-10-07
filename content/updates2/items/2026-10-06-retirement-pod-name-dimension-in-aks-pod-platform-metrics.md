---
title: "azure: Retirement: Pod name dimension in AKS pod platform metrics"
date: 2026-10-06T22:37:54.000Z
slug: retirement-pod-name-dimension-in-aks-pod-platform-metrics
update_categories: ["azure"]
update_tags: ["AKS", "Azure Monitor", "metrics", "retirement", "breaking-change"]
update_bullets: ["Affected metrics include Number of pods by phase (kube_pod_status_phase) and Number of pods in Ready state (text truncated in source).", "After retirement, the pod name dimension will no longer be supported on these platform metrics.", "Users should expect aggregate pod counters rather than pod-level dimensioned metrics.", "Effective date: September 30, 2027."]
timeframes: ["2026-10"]
link: "https://azure.microsoft.com/updates?id=570232"
source: "Azure Updates"
timeframeKey: "2026-10"
id: "8463775FEF304A4AAF2DC097EACF954F8F511C66CBED2C7EA59728087E0C77C8"
contentHash: "F7727145E1CDB5B1EA56B0D280AA30752950F7E1E97FC0B1D98144673A3AA3A4"
draft: false
type: "updates2"
llmSummary: "Azure Monitor is retiring the pod name dimension for certain AKS pod platform metrics starting September 30, 2027. These metrics will move to aggregate pod counters instead."
---

Azure Monitor is retiring the pod name dimension for certain AKS pod platform metrics starting September 30, 2027. These metrics will move to aggregate pod counters instead.

- **Source:** [Azure Updates](https://azure.microsoft.com/updates?id=570232)
