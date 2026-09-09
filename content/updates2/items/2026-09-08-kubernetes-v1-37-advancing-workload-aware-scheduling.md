---
title: "k8s: Kubernetes v1.37: Advancing Workload-Aware Scheduling"
date: 2026-09-08T18:30:00.000Z
slug: kubernetes-v1-37-advancing-workload-aware-scheduling
update_categories: ["k8s"]
update_tags: ["kubernetes", "release-notes", "v1.37", "scheduling", "gang-scheduling", "preemption", "topology-aware-scheduling", "compositepodgroup", "job-controller", "dra"]
update_bullets: ["Workload and PodGroup APIs move to v1beta1; v1alpha2 is replaced by v1alpha3, with breaking changes around disruptionMode naming.", "PodGroup queueing changes so only the top-level PodGroup is queued, not each member Pod.", "minCount becomes mutable, allowing elastic gang sizing.", "Workload-aware preemption is merged into GenericWorkload; default preemption now respects PodGroup disruptionMode and supports PodGroup preemptionPolicy behind a feature gate.", "CompositePodGroup is introduced as Alpha to model hierarchical scheduling trees with parent/child group relationships and all-or-nothing scheduling across the hierarchy.", "Multi-level topology-aware scheduling is added as Alpha, allowing topology constraints at different levels of the workload hierarchy and top-down constraint resolution.", "Single-level topology-aware scheduling gets performance improvements, but remains Alpha.", "New controller integration APIs and the workloadbuilder library provide standard types for expressing schedulingPolicy, constraints, disruption modes, and shared ResourceClaims in controller APIs.", "The native Job controller gains an explicit .spec.scheduling field, supporting basic or gang scheduling, topology constraints, disruption mode, and shared ResourceClaims; .spec.scheduling is immutable except for gang.minCount.", "DRAWorkloadResourceClaims graduates to Beta; when the feature gate is disabled, no ResourceClaim is created in the shared-claim scenario, avoiding unintended per-Pod claim creation.", "For v1.38, the roadmap calls for GA of Workload/PodGroup APIs, Beta for TAS and CompositePodGroup, and Beta for controller integration building blocks."]
timeframes: ["2026-09"]
link: "https://kubernetes.io/blog/2026/09/08/kubernetes-v1-37-advancing-workload-aware-scheduling/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-09"
id: "D2E91568C0DC82C1F0B4838EC1F2B826057DF53FB2A9666060E599AB11AE06F1"
contentHash: "9B4DCD8DB02C4DEA94C2DBBF86038EB86AB5F9E67D1A7300243CC1AA9F460478"
draft: false
type: "updates2"
llmSummary: "Kubernetes v1.37 advances Workload-Aware Scheduling: Workload and PodGroup APIs, gang scheduling, workload-aware preemption, and shared DRA ResourceClaims graduate to Beta. It also introduces Alpha support for CompositePodGroup and multi-level topology-aware scheduling, plus new controller integration APIs and Job controller integration for explicit WAS configuration."
---

Kubernetes v1.37 advances Workload-Aware Scheduling: Workload and PodGroup APIs, gang scheduling, workload-aware preemption, and shared DRA ResourceClaims graduate to Beta. It also introduces Alpha support for CompositePodGroup and multi-level topology-aware scheduling, plus new controller integration APIs and Job controller integration for explicit WAS configuration.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/09/08/kubernetes-v1-37-advancing-workload-aware-scheduling/)
