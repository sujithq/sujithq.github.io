---
title: "k8s: Kubernetes v1.35 Sneak Peek"
date: 2025-11-26T00:00:00.000Z
slug: kubernetes-v1-35-sneak-peek
update_categories: ["k8s"]
update_tags: ["kubernetes", "v1.35", "deprecations", "cgroup-v2", "containerd-2.0", "kube-proxy", "node-declared-features", "in-place-updates", "pod-certificates", "image-volumes"]
update_bullets: ["Deprecations/removals to prepare for: migrate nodes to Linux distributions with cgroup v2 enabled (kubelet will fail on cgroup v1-only systems).", "Replace containerd v1.x with containerd 2.0+ before upgrading past v1.35; monitor kubelet_cri_losing_support metric to find affected nodes.", "Move away from kube-proxy ipvs mode (deprecated); use nftables mode on Linux nodes to stay supported and reduce technical debt.", "Test and consider enabling node declared features (alpha) to let Nodes report supported Kubernetes features for safer scheduling and API validation.", "Plan for in-place Pod resource updates now GA: vertical resource changes (cpu/memory) can be made without restarting Pods—validate runtimes and CRI support.", "Evaluate pod certificates (targeting beta) to provide native, short-lived workload TLS certificates via kubelet projected volumes for mTLS use cases.", "Use numeric taint operators (Gt/Lt) to implement SLA or numeric-threshold scheduling and eviction policies instead of workarounds.", "Continue testing user namespaces (beta) to achieve rootless container isolation by remapping container root to unprivileged host UIDs.", "Consider adopting image volumes (OCI image -> volume) to decouple data/binaries from container images; expect it to be enabled by default.", "Watch the v1.35 CHANGELOG and release notes for final details and compatibility requirements; planned release date is Dec 17, 2025.", "Engage with SIGs and community channels (weekly meetings, Slack, Discuss) for implementation guidance, migration help, and to follow KEP progress."]
timeframes: ["2025-11"]
link: "https://kubernetes.io/blog/2025/11/26/kubernetes-v1-35-sneak-peek/"
source: "Kubernetes Official Blog"
timeframeKey: "2025-11"
id: "686DD4DB30BE54BEB00B078D9A292718C684EE9B730407E0C534DE4B36A95985"
contentHash: "C591D4B5AFD4A265D312EBE5C8D80B0B9F9E9B9E2F6A7494948B7D095FFD7D4B"
draft: false
type: "updates2"
llmSummary: "Kubernetes v1.35 (planned 2025-12-17) introduces several deprecations and new/advanced features. Major removals/deprecations include cgroup v1 support removal, deprecation of kube-proxy ipvs mode, and final support for containerd v1.x (users must move to containerd 2.0+). Notable enhancements likely in v1.35 include node declared features (alpha), in-place Pod resource updates (GA), pod certificates (beta), numeric taint comparisons, continued progress on user namespaces, and image volumes becoming default."
---

Kubernetes v1.35 (planned 2025-12-17) introduces several deprecations and new/advanced features. Major removals/deprecations include cgroup v1 support removal, deprecation of kube-proxy ipvs mode, and final support for containerd v1.x (users must move to containerd 2.0+). Notable enhancements likely in v1.35 include node declared features (alpha), in-place Pod resource updates (GA), pod certificates (beta), numeric taint comparisons, continued progress on user namespaces, and image volumes becoming default.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2025/11/26/kubernetes-v1-35-sneak-peek/)
