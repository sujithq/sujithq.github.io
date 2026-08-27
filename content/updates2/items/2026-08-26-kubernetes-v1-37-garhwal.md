---
title: "k8s: Kubernetes v1.37: Garhwal"
date: 2026-08-26T00:00:00.000Z
slug: kubernetes-v1-37-garhwal
update_categories: ["k8s"]
update_tags: ["Kubernetes", "release-notes", "v1.37", "stable", "beta", "alpha", "deprecation", "DRA", "scheduler", "storage", "node", "observability", "etcd", "admission"]
update_bullets: ["Stable: resilient watchcache initialization is fully enabled, reducing startup etcd pressure and returning HTTP 429 for excess requests.", "Beta: HPA scale-to-zero for object/external metrics is on by default; manifests-based admission control can now load webhooks/CEL policies from disk.", "Alpha: Pod-level checkpoint and restore adds CRI CheckpointPod/RestorePod RPCs, requiring runtime support.", "Stable: metrics.k8s.io API, KYAML, Pod certificates and ClusterTrustBundles, StorageVersionMigrator, Node declared features, SELinuxMount/SELinuxChangePolicy, and several DRA features graduated.", "DRA gains Stable support for device status, extended resource requests via DRA, device taints/tolerations, and a standard numaNode attribute.", "Beta: gang scheduling, native histogram support for Kubernetes metrics, workload-aware preemption, DRA ResourceClaims for workloads, CRI-based container/pod stats, memory QoS on cgroups v2, pod-level resource managers, watch-based route reconciliation, storage capacity scoring for dynamic provisioning, CSI attach-limit-aware autoscaling, PVC unused-since tracking, etcd RangeStream, and concurrent watch object decode.", "Stale controller mitigation expands to the HorizontalPodAutoscaler controller; it adds cache-staleness handling and related metrics.", "Alpha: StatefulSet Recreate strategy, DRA node allocatable requests, derived attributes, device compatibility groups, scheduler preemption for in-place pod resize, resize of memory-backed volumes, and new node lifecycle conditions.", "Deprecations/removals: kube-dns is deprecated, kube-proxy ipvs mode is deprecated, kubectl run --filename/-f is deprecated, and static Pods can no longer reference Secrets or ConfigMaps.", "The release also keeps cgroup v1 on the path to removal; failCgroupV1 remains available as a temporary override."]
timeframes: ["2026-08"]
link: "https://kubernetes.io/blog/2026/08/26/kubernetes-v1-37-release/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-08"
id: "A5A42776C3D02F1C45B23CA3DFD3E41F3A5452717576FDCA63C850379286C82E"
contentHash: "8646D04E218D42F9279FC820454A1BDF35DC15AC6D13E36253C4C9F4E5E12B51"
draft: false
type: "updates2"
llmSummary: "Kubernetes v1.37 ships 67 enhancements: 16 Stable, 23 Beta, 27 Alpha, and 1 deprecation/removal. Key changes include resilient watchcache initialization, HPA scale-to-zero, manifest-based admission config, Pod checkpoint/restore, broader Dynamic Resource Allocation support, and multiple scheduler, storage, node, and observability updates."
---

Kubernetes v1.37 ships 67 enhancements: 16 Stable, 23 Beta, 27 Alpha, and 1 deprecation/removal. Key changes include resilient watchcache initialization, HPA scale-to-zero, manifest-based admission config, Pod checkpoint/restore, broader Dynamic Resource Allocation support, and multiple scheduler, storage, node, and observability updates.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/08/26/kubernetes-v1-37-release/)
