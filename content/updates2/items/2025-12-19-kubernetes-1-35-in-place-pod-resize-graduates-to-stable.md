---
title: "k8s: Kubernetes 1.35: In-Place Pod Resize Graduates to Stable"
date: 2025-12-19T18:30:00.000Z
slug: kubernetes-1-35-in-place-pod-resize-graduates-to-stable
update_categories: ["k8s"]
update_tags: ["kubernetes", "in-place-pod-resize", "v1.35", "GA", "autoscaling", "vertical-scaling", "VPA", "kubelet"]
update_bullets: ["What it is: CPU and memory requests/limits are now mutable at runtime; spec.containers[*].resources is the desired state and status.containerStatuses[*].resources shows actual applied resources.", "How to use: request resizes by updating the Pod spec via the new resize subresource; documentation includes examples and usage instructions.", "Major benefits: adjust resources without deleting Pods (reduces downtime for stateful/latency-sensitive workloads), enables vertical autoscaling, and supports transient boosts (e.g., CPU startup boost).", "Changes since v1.33 beta: memory limit decreases are now allowed (Kubelet does a best-effort usage check), deferred resizes are retried with priority ordering, Pod Level Resources support added as alpha, and observability improved with new metrics and Pod events.", "Limitations today: not supported with swap, static CPU/Memory Manager, or for resources other than CPU/memory; some runtimes (Java, Python) need restarts to apply memory changes.", "Planned work: integrate with autoscalers (VPA, Ray), graduate VPA InPlaceOrRecreate further, improve runtime support, expand supported features/resources, enable preemption/upsize policies, and fix kubelet-scheduler race conditions.", "Safety notes: memory decreases rely on a best-effort Kubelet check to avoid OOMs; moving checks into runtimes is being explored for safer decreases.", "Feedback: contributors and users are encouraged to share feedback via GitHub issues, mailing lists, and Kubernetes SIG channels (#sig-node, #sig-autoscaling)."]
timeframes: ["2025-12"]
link: "https://kubernetes.io/blog/2025/12/19/kubernetes-v1-35-in-place-pod-resize-ga/"
source: "Kubernetes Official Blog"
timeframeKey: "2025-12"
id: "1F396A6E6365F7A7B6AE841CF9356511863956D73FF69B2EC1737AC4B4F3F5E6"
contentHash: "27CDA50E93CF0C2FF2EF11E4EC56108C3401B4B13C3D7A9ED47AFCBC422DBEC9"
draft: false
type: "updates2"
llmSummary: "Kubernetes 1.35 graduates In-Place Pod Resize (In-Place Pod Vertical Scaling) to stable (GA). The feature makes CPU and memory requests and limits mutable on a running Pod (via a resize subresource), often without restarting containers. This enables non-disruptive resource adjustments, more powerful autoscaling (e.g., VPA InPlaceOrRecreate), transient boosts like CPU startup boost, and better resource efficiency. The release also adds prioritized retries, allows memory limit decreases (best-effort OOM protection), alpha support for Pod Level Resources, and new kubelet metrics/events. Work remains on runtime support, scheduler/kubelet races, expanded feature support, and integrations with autoscalers and other projects."
---

Kubernetes 1.35 graduates In-Place Pod Resize (In-Place Pod Vertical Scaling) to stable (GA). The feature makes CPU and memory requests and limits mutable on a running Pod (via a resize subresource), often without restarting containers. This enables non-disruptive resource adjustments, more powerful autoscaling (e.g., VPA InPlaceOrRecreate), transient boosts like CPU startup boost, and better resource efficiency. The release also adds prioritized retries, allows memory limit decreases (best-effort OOM protection), alpha support for Pod Level Resources, and new kubelet metrics/events. Work remains on runtime support, scheduler/kubelet races, expanded feature support, and integrations with autoscalers and other projects.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2025/12/19/kubernetes-v1-35-in-place-pod-resize-ga/)
