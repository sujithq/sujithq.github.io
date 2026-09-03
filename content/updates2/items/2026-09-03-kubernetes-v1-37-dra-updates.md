---
title: "k8s: Kubernetes v1.37: DRA Updates"
date: 2026-09-03T18:30:00.000Z
slug: kubernetes-v1-37-dra-updates
update_categories: ["k8s"]
update_tags: ["kubernetes", "kubernetes-1.37", "dra", "dynamic-resource-allocation", "ga", "beta", "alpha", "scheduler", "resourceclaim"]
update_bullets: ["GA: DRA Extended Resource support allows traditional extended resources (for example, example.com/gpu) to be satisfied through DRA without a separate device plugin or workload ResourceClaim.", "Beta: ResourceClaim support for Workloads and PodGroups, gated by DRAWorkloadResourceClaims, lets a single claim be shared across a group of Pods.", "Beta: DRA Device Attributes Downward API writes driver-provided metadata to a mounted JSON file for workloads such as KubeVirt VMs.", "Stable: DRA device taints and tolerations let drivers or admins taint devices, exclude them from scheduling, and evict Pods unless their claims tolerate the taint.", "Stable: resource.kubernetes.io/numaNode is now a standard device attribute name for cross-driver NUMA comparison.", "Beta: DRAFractionalCapacityRange adds fractional values to CapacityRequestPolicyRange for more precise consumable capacity requests.", "Alpha: list-typed device attributes allow multiple values per attribute.", "Alpha: node allocatable resource requests let DRA-managed node resources be accounted for like normal requests.", "Alpha: resource availability visibility provides point-in-time snapshots via ResourcePoolStatusRequest.", "Alpha: optional node operations allow drivers to skip prepare/unprepare when no node setup is needed.", "Alpha: derived attributes use CEL expressions to match devices across differing attribute names or custom topology rules.", "Alpha: device compatibility groups help the scheduler reject incompatible device combinations earlier.", "Alpha: scheduler PreQueueingHint reduces requeue cost for DRA ResourceClaim events by narrowing affected pods instead of scanning all unschedulable pods."]
timeframes: ["2026-09"]
link: "https://kubernetes.io/blog/2026/09/03/kubernetes-v1-37-dra-updates/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-09"
id: "7EEF8793F21C302AD43D78269D00317E786EC9271494BAC6CFBC127BB47B1751"
contentHash: "0946E517F051570905CCEC784E6BE64385812684CB878B5998562C4A0884CD61"
draft: false
type: "updates2"
llmSummary: "Kubernetes 1.37 adds several DRA updates, including GA support for extended resources, stable device taints/tolerations, and stable standardized NUMA node attributes. It also promotes multiple DRA features to Beta or Alpha, with focus areas including workload-level ResourceClaims, device metadata/status, scheduling performance, and fractional consumable capacity."
---

Kubernetes 1.37 adds several DRA updates, including GA support for extended resources, stable device taints/tolerations, and stable standardized NUMA node attributes. It also promotes multiple DRA features to Beta or Alpha, with focus areas including workload-level ResourceClaims, device metadata/status, scheduling performance, and fractional consumable capacity.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/09/03/kubernetes-v1-37-dra-updates/)
