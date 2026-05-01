---
title: "k8s: Kubernetes v1.36: In-Place Vertical Scaling for Pod-Level Resources Graduates to Beta"
date: 2026-04-30T18:35:00.000Z
slug: kubernetes-v1-36-in-place-vertical-scaling-for-pod-level-resources-graduates-to-beta
update_categories: ["k8s"]
update_tags: ["kubernetes", "v1.36", "beta", "pod-level-resources", "in-place-scaling", "vertical-scaling", "kubelet", "cgroup-v2", "cri", "linux"]
update_bullets: ["Enabled by default via the InPlacePodLevelResourcesVerticalScaling feature gate.", "Allows updating a running Pod’s aggregate resource budget without necessarily restarting containers.", "Containers that inherit Pod-level limits scale with the updated Pod-level budget.", "Kubelet uses per-container resizePolicy: NotRequired for in-place CRI updates, RestartContainer for restart-based updates.", "Pod-level resizePolicy is not supported; decisions are made per container.", "Kubelet checks node allocatable capacity before admitting the resize; if it cannot fit, PodResizePending reflects Deferred or Infeasible.", "Resize sequencing avoids overshoot: expand Pod cgroup before containers when increasing; shrink containers before Pod cgroup when decreasing.", "Pod resize status is tracked with PodResizePending and PodResizeInProgress conditions, plus status.allocatedResources and status.resources.", "Requires Linux, cgroup v2, CRI support for UpdateContainerResources, and feature gates PodLevelResources, InPlacePodVerticalScaling, InPlacePodLevelResourcesVerticalScaling, and NodeDeclaredFeatures.", "Future work mentioned: integration with Vertical Pod Autoscaler to make Pod-level recommendations and apply them in place."]
timeframes: ["2026-04"]
link: "https://kubernetes.io/blog/2026/04/30/kubernetes-v1-36-inplace-pod-level-resources-beta/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-04"
id: "02762742ED1203B9321781E31117F92B956E282E80EE3376E3B4F269F3AA37EB"
contentHash: "D17295642121AF7397A15D71E51544987B20A2EAE6D8DB059969CBBC9AFC04D8"
draft: false
type: "updates2"
llmSummary: "Kubernetes v1.36 graduates in-place vertical scaling for Pod-level resources to Beta. Running Pods can now have their aggregate .spec.resources updated, with Kubelet deciding per-container whether to apply cgroup changes in place or restart containers based on resizePolicy."
---

Kubernetes v1.36 graduates in-place vertical scaling for Pod-level resources to Beta. Running Pods can now have their aggregate .spec.resources updated, with Kubelet deciding per-container whether to apply cgroup changes in place or restart containers based on resizePolicy.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/04/30/kubernetes-v1-36-inplace-pod-level-resources-beta/)
