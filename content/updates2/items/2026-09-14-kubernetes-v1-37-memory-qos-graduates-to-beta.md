---
title: "k8s: Kubernetes v1.37: Memory QoS Graduates to Beta"
date: 2026-09-14T18:30:00.000Z
slug: kubernetes-v1-37-memory-qos-graduates-to-beta
update_categories: ["k8s"]
update_tags: ["Kubernetes", "v1.37", "Memory QoS", "Beta", "cgroup v2", "kubelet", "resource management"]
update_bullets: ["MemoryQoS is Beta in v1.37 and enabled by default on kubelets.", "On Linux cgroup v2 nodes, the kubelet can manage `memory.high`, `memory.min`, and `memory.low` for container memory control.", "`memoryThrottlingFactor` default changed from `0.9` to `null`; without an explicit value, no `memory.high` is written.", "Set `memoryThrottlingFactor` to enable throttling for Burstable and BestEffort containers.", "Set `memoryReservationPolicy: TieredReservation` to enable tiered reservation via `memory.min` and `memory.low`.", "Upgrades preserve explicit config values; if the field was absent before, v1.37 will stop setting `memory.high` unless you add it back.", "To disable Memory QoS, set `featureGates.MemoryQoS=false` and remove incompatible config fields.", "Limitation: `memoryReservationPolicy` is node-wide; it applies to all pods on the node and cannot be set per pod.", "With tiered reservation, Guaranteed pods get `memory.min` and Burstable pods get `memory.low`; page cache is included in the cgroup charge.", "The next milestone is GA; SIG Node is collecting feedback and issues via kubernetes/kubernetes."]
timeframes: ["2026-09"]
link: "https://kubernetes.io/blog/2026/09/14/kubernetes-v1-37-memory-qos-graduates-to-beta/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-09"
id: "450FB6373190610EFE31A343A3F67FF8FBD50FA442E684460C40131D9690DB16"
contentHash: "A93811B64A17CF20C146EAB1C26ACB90AF670DA8354DBA4CF789B8EFFD84D94E"
draft: false
type: "updates2"
llmSummary: "Kubernetes v1.37 makes Memory QoS Beta and turns it on by default, but it does not change runtime behavior unless you explicitly set throttling or reservation fields. The main config change is that `memoryThrottlingFactor` now defaults to `null`, so existing clusters will not start writing `memory.high` unless they already set it."
---

Kubernetes v1.37 makes Memory QoS Beta and turns it on by default, but it does not change runtime behavior unless you explicitly set throttling or reservation fields. The main config change is that `memoryThrottlingFactor` now defaults to `null`, so existing clusters will not start writing `memory.high` unless they already set it.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/09/14/kubernetes-v1-37-memory-qos-graduates-to-beta/)
