---
title: "k8s: Kubernetes v1.37: Pod-Level Resource Managers graduated to Beta"
date: 2026-09-15T18:30:00.000Z
slug: kubernetes-v1-37-pod-level-resource-managers-graduated-to-beta
update_categories: ["k8s"]
update_tags: ["kubernetes", "v1.37", "beta", "resource-management", "pod-level-resources", "kubelet", "topology-manager", "cpu-manager", "memory-manager", "podresources-api"]
update_bullets: ["Feature gate: PodLevelResourceManagers; enabled manually, disabled by default in v1.37.", "Kubelet managers (Topology Manager, CPU Manager, Memory Manager) can consume pod-level resources from .spec.resources for placement decisions.", "Supports hybrid allocation: exclusive NUMA-aligned resources for primary containers, with sidecars using a pod-isolated shared pool.", "Aims to avoid forcing all containers in a Pod to request integer resources just to get exclusive NUMA alignment.", "PodResourcesLister v1 adds top-level cpu_ids and memory fields to PodResources responses.", "This helps monitoring tools and device plugins read pod-level exclusive assignments without double-counting container-level allocations."]
timeframes: ["2026-09"]
link: "https://kubernetes.io/blog/2026/09/15/kubernetes-v1-37-pod-level-resource-managers-beta/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-09"
id: "176A27B9DFA23531BE7F297445643596F24CCD3B41174FE076F22422ECF247FE"
contentHash: "1EA0B26369A910A573792F5D77C9AE1BC39E2E455B6152E68840B9FDE4FE62D4"
draft: false
type: "updates2"
llmSummary: "Kubernetes v1.37 graduates Pod-Level Resource Managers to Beta, disabled by default behind the PodLevelResourceManagers feature gate. Kubelet’s Topology Manager, CPU Manager, and Memory Manager can now use pod-level resource declarations for NUMA-aware placement, and the PodResources API reports top-level CPU and memory assignments."
---

Kubernetes v1.37 graduates Pod-Level Resource Managers to Beta, disabled by default behind the PodLevelResourceManagers feature gate. Kubelet’s Topology Manager, CPU Manager, and Memory Manager can now use pod-level resource declarations for NUMA-aware placement, and the PodResources API reports top-level CPU and memory assignments.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/09/15/kubernetes-v1-37-pod-level-resource-managers-beta/)
