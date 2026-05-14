---
title: "k8s: Kubernetes v1.36: PSI Metrics for Kubernetes Graduates to GA"
date: 2026-05-12T18:35:00.000Z
slug: kubernetes-v1-36-psi-metrics-for-kubernetes-graduates-to-ga
update_categories: ["k8s"]
update_tags: ["kubernetes", "v1.36", "psi", "metrics", "ga", "kubelet", "linux", "cgroup-v2", "cadvisor", "summary-api"]
update_bullets: ["PSI metrics are now generally available in Kubernetes v1.36; no feature gate is required.", "Metrics are exposed via the kubelet Summary API and /metrics/cadvisor for Prometheus-compatible scraping.", "PSI requires Linux kernel 4.20+ with cgroup v2 and CONFIG_PSI enabled; it is not available on Windows nodes.", "Kubelet now checks OS-level PSI support before emitting metrics, avoiding misleading zeros when PSI is disabled at the kernel level.", "SIG Node performance testing on high-density workloads found kubelet and kernel PSI overhead to be low, with small CPU deltas under load.", "The feature supports node-, pod-, and container-level pressure data, with moving averages over 10s, 60s, and 300s plus cumulative totals.", "Support was developed from alpha in v1.33 to beta in v1.34 and GA in v1.36."]
timeframes: ["2026-05"]
link: "https://kubernetes.io/blog/2026/05/12/kubernetes-v1-36-psi-metrics-ga/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-05"
id: "CA3CC92DC5CBAB512F7A84316B55564642EE8843AF2EEA715DF20A9D02BD177A"
contentHash: "3A27C387D2A6BD7D4DEC07711314D5AA8D4C47E7D0CA4C705DDCE2FFBA56D58C"
draft: false
type: "updates2"
llmSummary: "Kubernetes v1.36 graduates PSI metrics to GA for observing CPU, memory, and I/O pressure at node, pod, and container levels. The update also improves metric handling by suppressing zero-valued PSI output when the underlying Linux node does not support PSI."
---

Kubernetes v1.36 graduates PSI metrics to GA for observing CPU, memory, and I/O pressure at node, pod, and container levels. The update also improves metric handling by suppressing zero-valued PSI output when the underlying Linux node does not support PSI.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/05/12/kubernetes-v1-36-psi-metrics-ga/)
