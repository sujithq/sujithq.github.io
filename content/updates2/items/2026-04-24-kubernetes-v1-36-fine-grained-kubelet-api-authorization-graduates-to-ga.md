---
title: "k8s: Kubernetes v1.36: Fine-Grained Kubelet API Authorization Graduates to GA"
date: 2026-04-24T18:35:00.000Z
slug: kubernetes-v1-36-fine-grained-kubelet-api-authorization-graduates-to-ga
update_categories: ["k8s"]
update_tags: ["kubernetes", "kubelet", "rbac", "ga", "security", "authorization", "release-notes"]
update_bullets: ["Introduced in v1.32 as alpha, became beta and default-on in v1.33, and is locked on in v1.36.", "Kubelet now authorizes some paths with dedicated subresources, then falls back to nodes/proxy for backward compatibility.", "Paths with fine-grained handling include /stats/*, /metrics/*, /logs/*, /pods, /runningPods/, /healthz, /configz, /spec/*, and /checkpoint/*.", "This reduces exposure from granting nodes/proxy, which can allow command execution in containers and is considered overly broad for monitoring tools.", "A WebSocket GET to kubelet /exec can be abused when only nodes/proxy GET is granted; the post says this was demonstrated as an RCE risk.", "Existing workloads using nodes/proxy should continue working because the kubelet retries authorization with nodes/proxy if the fine-grained check fails.", "The built-in system:kubelet-api-admin ClusterRole is updated to include the new kubelet subresources.", "Example RBAC for monitoring should use nodes/metrics and nodes/stats instead of nodes/proxy.", "The feature can be verified by querying kubelet /metrics for kubernetes_feature_enabled{name=\"KubeletFineGrainedAuthz\",stage=\"GA\"} 1."]
timeframes: ["2026-04"]
link: "https://kubernetes.io/blog/2026/04/24/kubernetes-v1-36-fine-grained-kubelet-authorization-ga/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-04"
id: "0A57E0D566DD62A70D6342A6DF087DFA31C842AB933ADD9C08050373C9325F1F"
contentHash: "5AA163A226B9B270CAAADAE7636A4F226BB3F15146EEF86CB33E9A7AD9CE66B2"
draft: false
type: "updates2"
llmSummary: "Kubernetes v1.36 makes fine-grained kubelet API authorization GA. KubeletFineGrainedAuthz is now always enabled, allowing RBAC to target specific kubelet subresources like nodes/metrics and nodes/stats instead of the broad nodes/proxy permission."
---

Kubernetes v1.36 makes fine-grained kubelet API authorization GA. KubeletFineGrainedAuthz is now always enabled, allowing RBAC to target specific kubelet subresources like nodes/metrics and nodes/stats instead of the broad nodes/proxy permission.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/04/24/kubernetes-v1-36-fine-grained-kubelet-authorization-ga/)
