---
title: "k8s: Kubernetes v1.37: Metrics API graduates to stable"
date: 2026-08-27T18:30:00.000Z
slug: kubernetes-v1-37-metrics-api-graduates-to-stable
update_categories: ["k8s"]
update_tags: ["kubernetes", "release-notes", "metrics-api", "stable-api", "metrics-server", "autoscaling"]
update_bullets: ["metrics.k8s.io/v1 now provides the same NodeMetrics and PodMetrics resources, with the same CPU and memory fields as v1beta1.", "No new fields, renamed fields, or metric semantics changes were introduced; this is a version graduation only.", "kubectl top prefers v1 when available and falls back to v1beta1 on older clusters.", "The HPA controller in v1.37 still supports only v1beta1; discovery-based selection between versions is planned but not yet available.", "No feature gate is required. The cluster’s metrics implementation must serve v1.metrics.k8s.io and register the corresponding APIService.", "Implementations should serve both v1 and v1beta1 during the transition to preserve compatibility with older clients.", "To check served versions, use kubectl get --raw /apis/metrics.k8s.io/ | jq . and kubectl get apiservice v1.metrics.k8s.io."]
timeframes: ["2026-08"]
link: "https://kubernetes.io/blog/2026/08/27/kubernetes-v1-37-metrics-api-ga/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-08"
id: "1EBC9772D16E0A80C3E15C5DCEBF96F08B269634FD0B0B9E017276B6DA49EE4D"
contentHash: "B022C561B087C89189E50E65DC9453AF912E167C88154F748FD5B5E34654F083"
draft: false
type: "updates2"
llmSummary: "Kubernetes v1.37 graduates the Metrics API from v1beta1 to stable v1. The API surface is unchanged, and v1beta1 remains available for compatibility."
---

Kubernetes v1.37 graduates the Metrics API from v1beta1 to stable v1. The API surface is unchanged, and v1beta1 remains available for compatibility.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/08/27/kubernetes-v1-37-metrics-api-ga/)
