---
title: "k8s: Kubernetes v1.34: Pod Level Resources Graduated to Beta"
date: 2025-09-22T18:30:00.000Z
slug: kubernetes-v1-34-pod-level-resources-graduated-to-beta
update_categories: ["k8s"]
update_tags: ["Kubernetes", "v1.34", "PodLevelResources", "Beta", "resource-management", "scheduling", "Linux-only", "feature-gate", "limitations"]
update_bullets: ["Feature status: Pod Level Resources is Beta in v1.34 and enabled by default; ensure the PodLevelResources feature gate is active across control plane and nodes.", "What it does: allows specifying cpu, memory and hugepages at the Pod spec level so containers within the Pod can share the Pod's resource budget.", "Precedence: when both pod-level and container-level resources exist, pod-level requests/limits take precedence for scheduling and enforcement.", "Scheduling: if a pod-level request is set, the scheduler uses that value (not the sum of container requests) to place the Pod.", "Runtime enforcement: the pod-level limit is a hard ceiling for aggregate container usage — total consumption cannot exceed it.", "Resource sharing: containers may borrow unused capacity from others in the Pod (bursting) so long as the aggregate stays within pod limits; container requests create intra-pod priority during contention.", "QoS and OOM: pod-level resources influence Pod QoS class and are considered in OOM score adjustments on Linux nodes.", "Limitations: in-place resizing of pod-level resources is not supported in v1.34; only CPU, memory and hugepages are supported at pod-level.", "Platform restrictions: pod-level resources are not supported for Windows pods — API server or Kubelet will reject such Pods depending on how Windows is targeted.", "Compatibility notes: Topology Manager, Memory Manager and CPU Manager do not currently align pods/containers based on pod-level resources.", "Getting started & feedback: requires Kubernetes >= v1.34; test on Linux clusters and report issues via Slack (#sig-node), mailing lists or GitHub issues/PRs."]
timeframes: ["2025-09"]
link: "https://kubernetes.io/blog/2025/09/22/kubernetes-v1-34-pod-level-resources/"
source: "Kubernetes Official Blog"
timeframeKey: "2025-09"
id: "F6C140CCD9E5011E57C76AA6EE9E6760B222B9C3DE0BEB9F0D701B6FFEE56ADD"
contentHash: "EC05A572A68F370939FF1E9C5913A235E2ABD94045D6ED204D39E59E61A5938A"
draft: false
type: "updates2"
llmSummary: "Kubernetes v1.34 graduates Pod Level Resources to Beta and enables it by default. The feature lets you declare CPU, memory and hugepages for an entire Pod (in addition to per-container settings), with pod-level requests used for scheduling and pod-level limits acting as an absolute runtime cap; it improves intra-pod sharing and QoS handling but has several platform and feature limitations."
---

Kubernetes v1.34 graduates Pod Level Resources to Beta and enables it by default. The feature lets you declare CPU, memory and hugepages for an entire Pod (in addition to per-container settings), with pod-level requests used for scheduling and pod-level limits acting as an absolute runtime cap; it improves intra-pod sharing and QoS handling but has several platform and feature limitations.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2025/09/22/kubernetes-v1-34-pod-level-resources/)
