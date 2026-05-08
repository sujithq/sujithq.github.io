---
title: "k8s: Kubernetes v1.36: More Drivers, New Features, and the Next Era of DRA"
date: 2026-05-07T18:35:00.000Z
slug: kubernetes-v1-36-more-drivers-new-features-and-the-next-era-of-dra
update_categories: ["k8s"]
update_tags: ["kubernetes", "v1.36", "DRA", "resource-management", "scheduler", "beta", "alpha", "stable"]
update_bullets: ["Prioritized list graduated to stable for ordered fallback device selection.", "Extended resource support, partitionable devices, device taints, device binding conditions, and resource health status graduated to beta.", "New alpha support for ResourceClaims with PodGroups/workloads to reduce manual claim management and scaling limits.", "New alpha node allocatable resources feature applies DRA APIs to CPU and memory.", "New alpha resource pool status API exposes total, allocated, available, and unavailable device counts.", "List-type attribute handling changed: matchAttribute uses non-empty intersection, distinctAttribute uses pairwise disjoint values; includes() added for CEL in DRA contexts.", "Scheduler now uses deterministic lexicographic ordering over resource pool and ResourceSlice names.", "Device metadata lets drivers expose versioned JSON metadata to containers through well-known paths.", "Release notes state the roadmap continues toward beta/stable maturation, better topology-aware scheduling, and migration from device plugins to DRA."]
timeframes: ["2026-05"]
link: "https://kubernetes.io/blog/2026/05/07/kubernetes-v1-36-dra-136-updates/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-05"
id: "098F8F78E52ED263B2F9B2146429A8CDEF633B33FEB7A0472EA2D83F7D056241"
contentHash: "DD820CC9864906029AB2F0EA1221551CC0D1D5EDE6F96B37DA41E952047702EF"
draft: false
type: "updates2"
llmSummary: "Kubernetes v1.36 adds multiple DRA graduations and new alpha features, including support for ResourceClaims in PodGroups, node allocatable resources, and device metadata discovery in containers. It also improves scheduling, health reporting, and resource visibility, while continuing the migration path from device plugins to DRA."
---

Kubernetes v1.36 adds multiple DRA graduations and new alpha features, including support for ResourceClaims in PodGroups, node allocatable resources, and device metadata discovery in containers. It also improves scheduling, health reporting, and resource visibility, while continuing the migration path from device plugins to DRA.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/05/07/kubernetes-v1-36-dra-136-updates/)
