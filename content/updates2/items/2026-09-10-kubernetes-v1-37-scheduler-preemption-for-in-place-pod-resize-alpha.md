---
title: "k8s: Kubernetes v1.37: Scheduler Preemption for In-Place Pod Resize (Alpha)"
date: 2026-09-10T18:30:00.000Z
slug: kubernetes-v1-37-scheduler-preemption-for-in-place-pod-resize-alpha
update_categories: ["k8s"]
update_tags: ["kubernetes", "v1.37", "scheduler", "preemption", "in-place pod resize", "alpha", "feature-gate", "kube-scheduler", "kubelet"]
update_bullets: ["In-place Pod resize was GA in v1.35, but scale-ups could be left Deferred indefinitely when the node lacked allocatable headroom.", "The new feature lets the scheduler actively preempt lower-priority workloads to make room for higher-priority running Pods that need more CPU or memory.", "Preemption is limited to the Pod’s current node; if evicting eligible victims still does not free enough capacity, the resize remains Deferred.", "The Kubelet’s critical Pod admission path does not handle this case; resize-related preemption is delegated to the scheduler for centralized priority handling.", "The scheduler treats requested resize resources as already consumed to avoid allocation races.", "If a higher-priority resize request arrives during an active preemption cycle, the Kubelet prioritizes the newer request and the scheduler may run another preemption round.", "Node-level disablement is supported via a new spec.podPreemptionPolicy field in Node spec.", "To use it, the cluster must run v1.37 or later on control plane and nodes, with the feature gate enabled on kube-apiserver, kube-scheduler, and kubelet.", "The article includes a kind-based demo showing a high-priority Pod resize from 4 CPU to 6 CPU, preempting a low-priority Pod and moving the resize from ResizeDeferred to ResizeCompleted."]
timeframes: ["2026-09"]
link: "https://kubernetes.io/blog/2026/09/10/kubernetes-v1-37-scheduler-preemption-for-in-place-pod-resize-alpha/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-09"
id: "DFB3498101C4C82A4967C3857C57DDE9B4FA51A419A6AF755120A2834C7985B9"
contentHash: "C29F3B7FC27CA327FDA8AB5D1AEF355325441E45CDF8E873A9B7C657A10E0A9C"
draft: false
type: "updates2"
llmSummary: "Kubernetes v1.37 adds alpha support for scheduler preemption during in-place Pod resize, gated by InPlacePodVerticalScalingSchedulerPreemption. If a running Pod’s resize is Deferred due to lack of node capacity, the scheduler can now preempt lower-priority Pods on the same node so the resize can complete without restarting the Pod."
---

Kubernetes v1.37 adds alpha support for scheduler preemption during in-place Pod resize, gated by InPlacePodVerticalScalingSchedulerPreemption. If a running Pod’s resize is Deferred due to lack of node capacity, the scheduler can now preempt lower-priority Pods on the same node so the resize can complete without restarting the Pod.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/09/10/kubernetes-v1-37-scheduler-preemption-for-in-place-pod-resize-alpha/)
