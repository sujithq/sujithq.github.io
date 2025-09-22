---
title: "k8s: Kubernetes v1.34: Recovery From Volume Expansion Failure (GA)"
date: 2025-09-19T18:30:00.000Z
slug: kubernetes-v1-34-recovery-from-volume-expansion-failure-ga
update_categories: ["k8s"]
update_tags: ["Kubernetes", "v1.34", "PersistentVolumeClaim", "volume expansion", "storage", "recovery", "GA", "observability", "API", "bugfix"]
update_bullets: ["GA: automated recovery from PVC volume expansion failures is now generally available in v1.34.", "You can recover from a mistaken larger expansion by reducing the PVC request to a smaller size, provided it remains larger than the PV's original .status.capacity; no admin intervention required.", "Any quota temporarily consumed by the failed expansion is automatically returned to the user when corrected.", "New PVC fields and statuses improve observability: check .status.allocatedResourceStatus['storage'] and pvc.status.allocatedResources to see progress.", "Typical expansion state transitions include ControllerResizeInProgress -> NodeResizePending -> NodeResizeInProgress, becoming empty when finished; infeasible states include ControllerResizeInfeasible and NodeResizeInfeasible.", "Errors during expansion are reported persistently as conditions on PVCs (pvc.status.conditions) with keys like ControllerResizeError or NodeResizeError, instead of transient events.", "Kubernetes now retries failed expansions at a slower rate and makes fewer requests to the storage system and apiserver.", "This work fixes long-standing resizing workflow bugs (e.g., issue #115294) and the project asks users to report any regressions to the Kubernetes repo.", "Contributors and community feedback were instrumental in reaching GA (mentions include @msau42, @jsafrane, @xing-yang, @thockin, @liggitt)."]
timeframes: ["2025-09"]
link: "https://kubernetes.io/blog/2025/09/19/kubernetes-v1-34-recover-expansion-failure/"
source: "Kubernetes Official Blog"
timeframeKey: "2025-09"
id: "F1AF489C7495E70721D9DA8B82F89D252FFA570D8B3F9E86E18BBE21E5D65EB8"
contentHash: "E8C8136070FAC7F78B09B68246F03B891256CA5FF80A500C97919447E75D76B5"
draft: false
type: "updates2"
llmSummary: "Kubernetes v1.34 graduates automated recovery from failed persistent volume expansions to GA. Users can correct an over-sized PersistentVolumeClaim (PVC) by reducing the requested size (as long as the new request is still larger than the PV's original capacity) without cluster-admin intervention; consumed quota from a failed expansion is returned automatically. The release also introduces improved observability and error reporting for expansion operations, retries with reduced request rates, and several resizing workflow bug fixes."
---

Kubernetes v1.34 graduates automated recovery from failed persistent volume expansions to GA. Users can correct an over-sized PersistentVolumeClaim (PVC) by reducing the requested size (as long as the new request is still larger than the PV's original capacity) without cluster-admin intervention; consumed quota from a failed expansion is returned automatically. The release also introduces improved observability and error reporting for expansion operations, retries with reduced request rates, and several resizing workflow bug fixes.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2025/09/19/kubernetes-v1-34-recover-expansion-failure/)
