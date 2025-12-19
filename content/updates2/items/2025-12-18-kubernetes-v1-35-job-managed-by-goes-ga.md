---
title: "k8s: Kubernetes v1.35: Job Managed By Goes GA"
date: 2025-12-18T18:30:00.000Z
slug: kubernetes-v1-35-job-managed-by-goes-ga
update_categories: ["k8s"]
update_tags: ["kubernetes", "v1.35", "jobs", "managedBy", "delegation", "multi-cluster", "multikueue", "controllers", "GA", "batch-scheduling"]
update_bullets: ["GA feature in v1.35: .spec.managedBy allows delegating Job reconciliation to an external controller.", "Two modes: standard (unset or kubernetes.io/job-controller) uses the built-in Job controller; any other value delegates reconcilation and causes the built-in controller to skip that Job.", "Field is immutable to avoid orphaned Pods or leaks — you cannot transfer a running Job between controllers.", "Primary motivation: support multi-cluster architectures like MultiKueue where a Management Cluster dispatches Jobs and Worker Clusters execute them; status is mirrored back so users can observe progress from the Management Cluster.", "Useful when disabling the built-in Job controller is impossible (managed control planes) or when hybrid behavior is needed (some Jobs local, some dispatched).", "External controllers must conform to Job API definitions; Kubernetes introduced extensive Job status validation rules to help enforce conformance.", "Ecosystem adoption: JobSet, Kubeflow Trainer, KubeRay, AppWrapper, Tekton Pipelines and others are adopting .spec.managedBy (or equivalents) to integrate with MultiKueue.", "Not primarily intended to encourage reimplementing Job controllers from scratch — designed to support delegation patterns like MultiKueue.", "Learn more via the Jobs and delegation docs, the Job managed-by KEP (including status validation), the Kueue KEP for MultiKueue, and the MultiKueue task guide.", "Get involved: work sponsored by the Batch WG with SIG Apps and SIG Scheduling — join the Batch WG, SIG Apps meetings, or the WG Batch Slack to contribute."]
timeframes: ["2025-12"]
link: "https://kubernetes.io/blog/2025/12/18/kubernetes-v1-35-job-managedby-for-jobs-goes-ga/"
source: "Kubernetes Official Blog"
timeframeKey: "2025-12"
id: "520CD537125177E1C339CC8AADD3CCDF74B9A101F07D982422D77E1DA399C039"
contentHash: "B629F5053C7B3301A107840BC6E72EC3326C1F4884C2BC459B9DB49C96315606"
draft: false
type: "updates2"
llmSummary: "Kubernetes v1.35 promotes .spec.managedBy for Jobs to GA, enabling external controllers (e.g., MultiKueue) to take full responsibility for Job reconciliation and enabling multi-cluster batch scheduling patterns while leaving built-in Job controller behavior intact for other Jobs."
---

Kubernetes v1.35 promotes .spec.managedBy for Jobs to GA, enabling external controllers (e.g., MultiKueue) to take full responsibility for Job reconciliation and enabling multi-cluster batch scheduling patterns while leaving built-in Job controller behavior intact for other Jobs.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2025/12/18/kubernetes-v1-35-job-managedby-for-jobs-goes-ga/)
