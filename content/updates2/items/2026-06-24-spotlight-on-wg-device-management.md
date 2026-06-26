---
title: "k8s: Spotlight on WG Device Management"
date: 2026-06-24T18:00:00.000Z
slug: spotlight-on-wg-device-management
update_categories: ["k8s"]
update_tags: ["kubernetes", "device-management", "dra", "gpu", "ai-ml", "scheduling", "wg"]
update_bullets: ["Legacy Device Plugin API treats devices as opaque integers; DRA adds structured modeling, requesting, scheduling, and actuation.", "DRA uses ResourceSlice for vendor-advertised device capabilities and ResourceClaim for user requests.", "DRA supports more flexible requests such as minimum-memory GPUs, alternative device sets, and shared claims across multiple containers or Pods.", "ResourceSlice work includes overlapping partitions for cases like MIG, plus consumable capacity for platform-mediated sharing such as NIC bandwidth allocation.", "The WG is cross-SIG, coordinating sig-node, sig-scheduling, sig-autoscaling, sig-network, and sig-architecture.", "Current work includes extended resource requests, resource claim status, namespace-controlled admin access, device taints/tolerations, prioritized alternatives, consumable capacity, partitionable devices, resource health status, native resource requests, resource availability visibility, and device binding conditions.", "Open technical problems include better support for gang scheduling, topology-aware placement, multi-node workloads, device failure detection/mitigation, and scheduling optimality under NP-hard constraints.", "NVIDIA donated its DRA GPU driver to the Kubernetes project; the WG is seeking broader community contributions.", "Contributors can join the mailing list, biweekly meetings, or the #wg-device-management Slack channel."]
timeframes: ["2026-06"]
link: "https://kubernetes.io/blog/2026/06/24/wg-device-management-spotlight-2026/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-06"
id: "5087D198903326E7C4A22678E9449AD050188F2DF7FD18188F3B54824BC3842C"
contentHash: "DC75937E9EC8ACB7E38791304A45FC3C2E54966AAB1F890ACE0084518B186C77"
draft: false
type: "updates2"
llmSummary: "The Device Management WG is working on Kubernetes support for GPUs, TPUs, NICs, and other specialized hardware through Dynamic Resource Allocation (DRA), which graduated to GA in Kubernetes 1.34. The group is now expanding DRA and related APIs for sharing, topology-aware scheduling, health monitoring, and multi-node device use."
---

The Device Management WG is working on Kubernetes support for GPUs, TPUs, NICs, and other specialized hardware through Dynamic Resource Allocation (DRA), which graduated to GA in Kubernetes 1.34. The group is now expanding DRA and related APIs for sharing, topology-aware scheduling, health monitoring, and multi-node device use.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/06/24/wg-device-management-spotlight-2026/)
