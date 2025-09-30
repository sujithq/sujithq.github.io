---
title: "k8s: Kubernetes v1.34: Pods Report DRA Resource Health"
date: 2025-09-17T18:30:00.000Z
slug: kubernetes-v1-34-pods-report-dra-resource-health
update_categories: ["k8s"]
update_tags: ["kubernetes", "v1.34", "DRA", "device-health", "kubelet", "gRPC", "alpha-feature", "ResourceHealthStatus", "KEP-4680"]
update_bullets: ["Purpose: expose device health for GPUs/TPUs/FPGAs and other DRA-managed devices directly in Pod status to speed diagnosis of hardware-related failures.", "New gRPC service: dra-health/v1alpha1 defines DRAResourceHealth with a NodeWatchResources server-streaming RPC for drivers to stream device health (Healthy, Unhealthy, Unknown).", "Kubelet integration: DRAPluginManager opens long-lived NodeWatchResources streams, DRA Manager stores updates in a persistent healthInfoCache that survives Kubelet restarts.", "Pod status field: a new allocatedResourcesStatus field was added to v1.ContainerStatus; it lists allocated devices and their current health so kubectl describe pod shows problematic devices.", "Example: a CrashLoopBackOff Pod can now show allocatedResourcesStatus with resourceID and health: \"Unhealthy\", clarifying hardware vs. application issues.", "How to use: enable the ResourceHealthStatus feature gate on kube-apiserver and kubelets and run a DRA driver that implements the v1alpha1 DRAResourceHealth service.", "Driver guidance: DRA driver authors should implement device failure detection and integrate with the health API to improve user experience and debuggability.", "Planned enhancements before Beta: add human-readable health messages, make health timeouts configurable (per-driver), and fix applying health updates to already-terminated pods for better post-mortem diagnostics.", "Background and community: feature builds on KEP-4680; feedback from SIG Node community will guide graduation from Alpha to Beta."]
timeframes: ["2025-09"]
link: "https://kubernetes.io/blog/2025/09/17/kubernetes-v1-34-pods-report-dra-resource-health/"
source: "Kubernetes Official Blog"
timeframeKey: "2025-09"
id: "3B1B0B9C50F8557B4996376A6D24F87C6EA7795944676263686BAF5E37CE384A"
contentHash: "A38093FFB642FC8A34887297769215B2F19770A94BE79C5D2FC4A424618E63BA"
draft: false
type: "updates2"
llmSummary: "Kubernetes v1.34 introduces an alpha feature (ResourceHealthStatus) that lets Dynamic Resource Allocation (DRA) drivers report device health into a Pod's status via a new dra-health/v1alpha1 gRPC service, enabling the Kubelet to surface per-device health in v1.ContainerStatus. This improves debuggability for hardware-backed workloads by showing device health (Healthy/Unhealthy/Unknown) in allocatedResourcesStatus and requires enabling the feature gate and compatible DRA drivers."
---

Kubernetes v1.34 introduces an alpha feature (ResourceHealthStatus) that lets Dynamic Resource Allocation (DRA) drivers report device health into a Pod's status via a new dra-health/v1alpha1 gRPC service, enabling the Kubelet to surface per-device health in v1.ContainerStatus. This improves debuggability for hardware-backed workloads by showing device health (Healthy/Unhealthy/Unknown) in allocatedResourcesStatus and requires enabling the feature gate and compatible DRA drivers.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2025/09/17/kubernetes-v1-34-pods-report-dra-resource-health/)
