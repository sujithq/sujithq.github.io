---
title: "k8s: Kubernetes v1.38 Sneak Peek"
date: 2026-11-23T16:00:00.000Z
slug: kubernetes-v1-38-sneak-peek
update_categories: ["k8s"]
update_tags: ["Kubernetes", "v1.38", "deprecations", "breaking-changes", "kubectl", "kuberc", "cgroup-v2", "admission-webhooks", "pod-level-resources", "DRA", "eviction"]
update_bullets: ["kubectl will always try WebSockets first; KUBECTL_REMOTE_COMMAND_WEBSOCKETS and KUBECTL_PORT_FORWARD_WEBSOCKETS are removed.", "kuberc stable API will drop the name alias in allowlist entries; use command instead.", "cgroup v1 remains only as a short-term fallback via failCgroupV1: false; migration to cgroup v2 is still pending removal.", "Admission webhooks will no longer receive TokenReview, SelfSubjectReview, SubjectAccessReview, SelfSubjectAccessReview, LocalSubjectAccessReview, or SelfSubjectRulesReview requests by default.", "Container runtimes must report the cgroup driver via CRI RuntimeConfig; kubelet legacy fallback is deprecated and effectively required to be explicitly re-enabled if used.", "kubeadm will stop defaulting cgroupDriver to systemd and will error in preflight if the runtime lacks the needed RPC.", "On Linux cgroup v2 nodes with LimitedSwap, pod-level memory settings will determine swap limits; pods with memory request equal to limit get no swap.", "Expected stable features: kuberc, pod-level resources, and DRA support for partitionable devices.", "New alpha feature: EvictionRequest API for coordinated pod eviction before termination, with fallback to existing eviction and PDB behavior.", "Planned release date stated in the post: 2026-12-16."]
timeframes: ["2026-11"]
link: "https://kubernetes.io/blog/2026/11/23/kubernetes-v1-38-sneak-peek/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-11"
id: "2C71021368A09AE0907CA7FDB6F6E95FF69BA09AF2059B6031FA51E2399359A4"
contentHash: "65CAE309F288C617C6911D585C74F4660A23F6865BE3B235583761C09D92EA92"
draft: false
type: "updates2"
llmSummary: "Kubernetes v1.38 is previewing several removals and behavior changes, including kubectl WebSocket opt-out env var removal, kuberc API cleanup, cgroup v1 phaseout, admission webhook filtering for authn/authz review resources, and stricter cgroup driver discovery from container runtimes. Planned upgrades include kuberc and pod-level resources reaching stable, DRA partitionable devices stabilizing, and a new alpha EvictionRequest API."
---

Kubernetes v1.38 is previewing several removals and behavior changes, including kubectl WebSocket opt-out env var removal, kuberc API cleanup, cgroup v1 phaseout, admission webhook filtering for authn/authz review resources, and stricter cgroup driver discovery from container runtimes. Planned upgrades include kuberc and pod-level resources reaching stable, DRA partitionable devices stabilizing, and a new alpha EvictionRequest API.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/11/23/kubernetes-v1-38-sneak-peek/)
