---
title: "k8s: Kubernetes v1.35: Introducing Workload Aware Scheduling"
date: 2025-12-29T18:30:00.000Z
slug: kubernetes-v1-35-introducing-workload-aware-scheduling
update_categories: ["k8s"]
update_tags: ["kubernetes", "v1.35", "workload-api", "gang-scheduling", "opportunistic-batching", "scheduling", "feature-gates"]
update_bullets: ["Workload API: a new scheduling.k8s.io/v1alpha1 resource to declare groups of Pods (podGroups) and scheduling policies (e.g., gang with minCount).", "Link Pods to a Workload via spec.workloadRef + podGroup to associate them with a scheduling policy.", "Gang scheduling behavior: scheduler blocks Pods until Workload and podGroup exist and pending count ≥ minCount; uses a Permit gate to ensure whole-group placement; 5-minute timeout rejects partial placements and frees reserved resources.", "Opportunistic batching (Beta): automatically accelerates scheduling for identical Pods by reusing feasibility calculations; requires all scheduler-relevant fields to be identical and may be disabled by some scheduler features.", "Feature gates and enablement: enable GenericWorkload on kube-apiserver and kube-scheduler for the Workload API; enable GangScheduling on kube-scheduler (requires Workload API); OpportunisticBatching is enabled by default in v1.35 and can be disabled with its feature gate.", "Restrictions: batching only works when all scheduler-relevant fields match exactly; review kube-scheduler config as some settings implicitly disable batching.", "Roadmap (north star): planned work includes a workload scheduling phase, workload-level preemption, better multi-node DRA & topology-aware scheduling, autoscaling integration, lifecycle placement management, and multi-workload simulations.", "Getting involved: try the features in test clusters, send feedback via SIG-Scheduling Slack, the workload-aware scheduling tracking issue, or file GitHub issues; read the related KEPs and docs for details."]
timeframes: ["2025-12"]
link: "https://kubernetes.io/blog/2025/12/29/kubernetes-v1-35-introducing-workload-aware-scheduling/"
source: "Kubernetes Official Blog"
timeframeKey: "2025-12"
id: "F7149AB0CED5D41C98C34667800BBDB98F97816DF4F693839A7A4B98DEC517DC"
contentHash: "A6F33581959815945803EC89401CC2507514D9A3C76CA7220E05752B243B9A21"
draft: false
type: "updates2"
llmSummary: "Kubernetes v1.35 introduces workload-aware scheduling with a new Workload API (scheduling.k8s.io/v1alpha1) to describe multi-Pod scheduling requirements, an initial gang scheduling implementation for all-or-nothing placement, and opportunistic batching (Beta) to speed scheduling of identical Pods. Gang scheduling uses podGroups, a workloadRef on Pods, and a Permit gate with a 5-minute timeout; opportunistic batching reuses feasibility checks for identical Pods but has strict identical-field restrictions. The release also outlines a broader roadmap (workload-level preemption, autoscaling integration, topology-aware scheduling) and explains required feature gates and how to test and give feedback."
---

Kubernetes v1.35 introduces workload-aware scheduling with a new Workload API (scheduling.k8s.io/v1alpha1) to describe multi-Pod scheduling requirements, an initial gang scheduling implementation for all-or-nothing placement, and opportunistic batching (Beta) to speed scheduling of identical Pods. Gang scheduling uses podGroups, a workloadRef on Pods, and a Permit gate with a 5-minute timeout; opportunistic batching reuses feasibility checks for identical Pods but has strict identical-field restrictions. The release also outlines a broader roadmap (workload-level preemption, autoscaling integration, topology-aware scheduling) and explains required feature gates and how to test and give feedback.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2025/12/29/kubernetes-v1-35-introducing-workload-aware-scheduling/)
