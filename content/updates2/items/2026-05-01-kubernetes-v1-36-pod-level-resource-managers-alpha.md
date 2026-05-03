---
title: "k8s: Kubernetes v1.36: Pod-Level Resource Managers (Alpha)"
date: 2026-05-01T18:35:00.000Z
slug: kubernetes-v1-36-pod-level-resource-managers-alpha
update_categories: ["k8s"]
update_tags: ["kubernetes", "v1.36", "alpha", "pod-level-resources", "resource-management", "cpu-manager", "memory-manager", "topology-manager", "kubelet-metrics"]
update_bullets: ["Requires Kubernetes v1.36+, the PodLevelResources and PodLevelResourceManagers feature gates, a non-none Topology Manager policy, Topology Manager scope set to pod or container, CPU Manager static policy, and Memory Manager Static policy.", "With Topology Manager pod scope, kubelet can allocate one NUMA-aligned budget for the whole pod, then split the pod’s remaining resources into a shared pool for sidecars.", "With container scope, kubelet can assign NUMA-aligned exclusive resources only to the containers that need them, while other containers use the node-wide shared pool.", "Exclusive containers have container-level CPU CFS quota enforcement disabled; containers in the pod shared pool are throttled against the leftover pod budget at the pod level.", "New kubelet metrics include resource_manager_allocations_total, resource_manager_allocation_errors_total, and resource_manager_container_assignments, with labels to distinguish pod vs node allocation source and assignment type.", "The feature is alpha and the post points to the official docs for limitations, compatibility, downgrade guidance, and feedback channels."]
timeframes: ["2026-05"]
link: "https://kubernetes.io/blog/2026/05/01/kubernetes-v1-36-feature-pod-level-resource-managers-alpha/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-05"
id: "2FC1391B1BDAAA14B79A115EA5227960B10E1D1285EC18331A2888C8F702DE10"
contentHash: "1E140B3AC4DE355DAF4701BF0983252066F4CB066A6103B7F69CA00ACF687F13"
draft: false
type: "updates2"
llmSummary: "Kubernetes v1.36 adds Pod-Level Resource Managers as an alpha feature, extending Topology, CPU, and Memory Managers to work from pod-level resource specs instead of only per-container allocations. It is intended for mixed pods that need NUMA-aligned exclusive resources for some containers while keeping lightweight sidecars in a pod-level shared pool."
---

Kubernetes v1.36 adds Pod-Level Resource Managers as an alpha feature, extending Topology, CPU, and Memory Managers to work from pod-level resource specs instead of only per-container allocations. It is intended for mixed pods that need NUMA-aligned exclusive resources for some containers while keeping lightweight sidecars in a pod-level shared pool.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/05/01/kubernetes-v1-36-feature-pod-level-resource-managers-alpha/)
