---
title: "k8s: Kubernetes v1.36: Advancing Workload-Aware Scheduling"
date: 2026-05-13T18:35:00.000Z
slug: kubernetes-v1-36-advancing-workload-aware-scheduling
update_categories: ["k8s"]
update_tags: ["Kubernetes", "v1.36", "scheduling", "gang scheduling", "PodGroup", "Workload API", "topology-aware scheduling", "preemption", "DRA", "Job controller", "alpha"]
update_bullets: ["Workload API is now a static template; PodGroup is the runtime object, replacing the previous v1alpha1 model with scheduling.k8s.io/v1alpha2.", "kube-scheduler adds a PodGroup scheduling cycle that evaluates and binds a whole group atomically rather than Pod-by-Pod.", "Gang scheduling uses the new cycle; if the group cannot meet minCount, none of the Pods are bound and the group retries later.", "Topology-aware scheduling adds placement constraints on PodGroups and uses PlacementGenerate and PlacementScore extension points.", "Workload-aware preemption treats a PodGroup as one preemptor and can preempt Pods across multiple Nodes to make room for the group.", "PodGroup API now includes priority and disruptionMode fields for use by workload-aware preemption.", "DRA support extends ResourceClaimTemplate handling to PodGroups, allowing one claim to be generated for the group and reserved for it.", "Job controller integration can auto-create Workload and PodGroup objects and set schedulingGroup on Pods when WorkloadWithJob is enabled.", "This Job integration currently applies only to Jobs with parallelism > 1, completionMode=Indexed, completions equal to parallelism, and no pre-set schedulingGroup.", "The post lists v1.37 goals: Beta graduation for Workload/PodGroup APIs, minCount mutability, multi-level workload hierarchies, broader advanced scheduling maturation, and a controller integration API."]
timeframes: ["2026-05"]
link: "https://kubernetes.io/blog/2026/05/13/kubernetes-v1-36-advancing-workload-aware-scheduling/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-05"
id: "6964CDF5E0F12E2CF102B86ED203A91FD89D79C9E9FF9ADC1C8F842D0C271496"
contentHash: "8F678E1B488E0EC78D16D7B1804625DCCCB16A90C46CA206E5AF004778FA507D"
draft: false
type: "updates2"
llmSummary: "Kubernetes v1.36 introduces a redesigned workload-aware scheduling model with separate Workload and PodGroup APIs, a dedicated PodGroup scheduling cycle for gang scheduling, topology-aware placement, workload-aware preemption, DRA ResourceClaim support for PodGroups, and initial Job controller integration. All of these features are alpha and require specific feature gates; the Job integration currently applies only to fixed-size, Indexed Jobs."
---

Kubernetes v1.36 introduces a redesigned workload-aware scheduling model with separate Workload and PodGroup APIs, a dedicated PodGroup scheduling cycle for gang scheduling, topology-aware placement, workload-aware preemption, DRA ResourceClaim support for PodGroups, and initial Job controller integration. All of these features are alpha and require specific feature gates; the Job integration currently applies only to fixed-size, Indexed Jobs.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/05/13/kubernetes-v1-36-advancing-workload-aware-scheduling/)
