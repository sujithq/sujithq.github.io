---
title: "k8s: Kubernetes v1.36: Mutable Pod Resources for Suspended Jobs (beta)"
date: 2026-04-27T18:35:00.000Z
slug: kubernetes-v1-36-mutable-pod-resources-for-suspended-jobs-beta
update_categories: ["k8s"]
update_tags: ["kubernetes", "v1.36", "jobs", "beta", "resources", "pods", "batch", "feature-gate"]
update_bullets: ["The feature applies to resources in `spec.template.spec.containers[*]` and `initContainers[*]` requests/limits.", "Resource updates are allowed only while `spec.suspend=true`; if a Job was previously running, all active Pods must terminate first (`status.active=0`).", "Standard validation still applies, including `limits >= requests` and whole-number extended resources where required.", "In v1.36 the `MutablePodResourcesForSuspendedJobs` feature gate is enabled by default; in v1.35 it must be enabled on the kube-apiserver.", "No new API types were added; the existing Job/pod template validation was relaxed for this case.", "Use cases include queue controllers like Kueue adjusting resources based on cluster capacity and letting CronJob instances run with reduced resources instead of failing.", "If a Job uses DRA, `ResourceClaimTemplates` remain immutable and must be recreated separately.", "When suspending a running Job, set `podReplacementPolicy: Failed` if you want replacement Pods to wait until prior Pods fully terminate."]
timeframes: ["2026-04"]
link: "https://kubernetes.io/blog/2026/04/27/kubernetes-v1-36-mutable-pod-resources-for-suspended-jobs/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-04"
id: "EB777AC12CBE08A2107823D07781C95ACD179AF6050F8887465BED83C4F6F33A"
contentHash: "ED46E4592AE5FA052B883368335BBF586824F0C1C29BCDC81AE68275E30C5C54"
draft: false
type: "updates2"
llmSummary: "Kubernetes v1.36 promotes Mutable Pod Resources for Suspended Jobs to beta. It lets controllers change CPU, memory, GPU, and other container resource requests/limits in a suspended Job’s pod template before resuming it, without recreating the Job."
---

Kubernetes v1.36 promotes Mutable Pod Resources for Suspended Jobs to beta. It lets controllers change CPU, memory, GPU, and other container resource requests/limits in a suspended Job’s pod template before resuming it, without recreating the Job.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/04/27/kubernetes-v1-36-mutable-pod-resources-for-suspended-jobs/)
