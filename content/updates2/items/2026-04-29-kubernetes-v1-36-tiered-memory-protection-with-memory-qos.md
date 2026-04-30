---
title: "k8s: Kubernetes v1.36: Tiered Memory Protection with Memory QoS"
date: 2026-04-29T18:35:00.000Z
slug: kubernetes-v1-36-tiered-memory-protection-with-memory-qos
update_categories: ["k8s"]
update_tags: ["kubernetes", "v1.36", "memory-qos", "cgroup-v2", "kubelet", "sig-node", "alpha"]
update_bullets: ["Memory QoS now has a separate kubelet setting, memoryReservationPolicy, so memory.high throttling can be enabled without writing memory.min or memory.low.", "New TieredReservation mode maps Guaranteed Pods to memory.min, Burstable Pods to memory.low, and BestEffort Pods to no reservation.", "Compared with v1.27, Burstable Pod requests no longer become hard memory.min reservations by default, reducing the risk of locking too much node memory.", "Two alpha kubelet metrics were added: kubelet_memory_qos_node_memory_min_bytes and kubelet_memory_qos_node_memory_low_bytes.", "When MemoryQoS is enabled, kubelet warns at startup if the kernel is older than 5.9 because memory.high throttling can hit a known livelock issue on older kernels.", "Kubernetes continues to use memory.max for limits; with TieredReservation, memory.min is set only for Guaranteed Pods and memory.low only for Burstable Pods.", "The kubelet sets protection on pod-level and QoS-class cgroups, while container-level cgroups are handled by the runtime.", "Requirements: Kubernetes v1.36+, Linux cgroup v2, and a cgroup v2-capable runtime such as containerd 1.6+ or CRI-O 1.22+."]
timeframes: ["2026-04"]
link: "https://kubernetes.io/blog/2026/04/29/kubernetes-v1-36-memory-qos-tiered-protection/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-04"
id: "6E8941E7D1298E92CB9DF40C5B6F0F4C99C558428FB43A9E42B2B7B581175867"
contentHash: "FEDB387E3CFC69A29B4526D6427654DEF5C8F89B0F1A3AAC5A28A92B381FDC40"
draft: false
type: "updates2"
llmSummary: "Kubernetes v1.36 updates the alpha Memory QoS feature to separate throttling from reservation, add tiered memory protection by Pod QoS class, expose kubelet metrics, and warn on kernels older than 5.9. With the new policy, Guaranteed Pods get memory.min, Burstable Pods get memory.low, and BestEffort Pods get no protection; throttling via memory.high still applies."
---

Kubernetes v1.36 updates the alpha Memory QoS feature to separate throttling from reservation, add tiered memory protection by Pod QoS class, expose kubelet metrics, and warn on kernels older than 5.9. With the new policy, Guaranteed Pods get memory.min, Burstable Pods get memory.low, and BestEffort Pods get no protection; throttling via memory.high still applies.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/04/29/kubernetes-v1-36-memory-qos-tiered-protection/)
