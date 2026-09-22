---
title: "k8s: Kubernetes v1.37: Tracking When a PersistentVolumeClaim Was Last Used (Beta)"
date: 2026-09-21T18:30:00.000Z
slug: kubernetes-v1-37-tracking-when-a-persistentvolumeclaim-was-last-used-beta
update_categories: ["k8s"]
update_tags: ["kubernetes", "v1.37", "beta", "storage", "persistentvolumeclaim", "pvc", "feature-gate", "conditions"]
update_bullets: ["The PVC protection controller adds an Unused condition to every PVC.", "Condition values: Unused=True with reason NoPodsUsingPVC when no non-terminal pods reference it; Unused=False with reason PodUsingPVC when at least one running or pending pod does.", "Terminated pods do not count; pending pods do count, even if unschedulable.", "lastTransitionTime records when the PVC changed from in-use to unused, which can be used for age-based cleanup queries.", "In v1.36 this feature was Alpha and required the PersistentVolumeClaimUnusedSinceTime gate; in v1.37 it is Beta, enabled by default, and has end-to-end test coverage.", "The article shows kubectl/jq examples for inspecting a PVC and listing PVCs unused for more than 30 days.", "The project says it may graduate to GA in a future release based on feedback and adoption."]
timeframes: ["2026-09"]
link: "https://kubernetes.io/blog/2026/09/21/kubernetes-v1-37-pvc-last-used-time/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-09"
id: "1DF6CEF7D7DD72D22B94682C333B7F5E4C15042BF944D15F49997ED2952EDFD3"
contentHash: "FAA975300A3601BD755C7088AE606BA597E1E429254091C0B634FC8D6F1A4360"
draft: false
type: "updates2"
llmSummary: "Kubernetes v1.37 promotes PersistentVolumeClaimUnusedSinceTime to Beta and enables it by default. PVCs now get an Unused condition in status so you can tell whether any running or pending pod references the claim, and use lastTransitionTime to see when it last became idle."
---

Kubernetes v1.37 promotes PersistentVolumeClaimUnusedSinceTime to Beta and enables it by default. PVCs now get an Unused condition in status so you can tell whether any running or pending pod references the claim, and use lastTransitionTime to see when it last became idle.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/09/21/kubernetes-v1-37-pvc-last-used-time/)
