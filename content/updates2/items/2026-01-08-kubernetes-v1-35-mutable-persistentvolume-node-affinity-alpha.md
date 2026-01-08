---
title: "k8s: Kubernetes v1.35: Mutable PersistentVolume Node Affinity (alpha)"
date: 2026-01-08T18:30:00.000Z
slug: kubernetes-v1-35-mutable-persistentvolume-node-affinity-alpha
update_categories: ["k8s"]
update_tags: ["kubernetes", "v1.35", "mutable-pv", "node-affinity", "alpha", "storage", "CSI", "feature-gate", "sig-storage"]
update_bullets: ["What changed: PV.spec.nodeAffinity is now editable (alpha) in v1.35 when MutablePVNodeAffinity is enabled.", "Why: supports online storage changes (e.g., zonal→regional disks, disk generation upgrades) without PV recreation.", "Important prerequisite: update the underlying volume in the storage provider before changing the PV’s node affinity.", "How to try: enable the MutablePVNodeAffinity feature gate on the API server and ensure you have RBAC to edit PVs (typically admin-only).", "Race condition risk: tightening affinity can lead to a scheduler race where new Pods may be placed on nodes that can no longer access the volume, causing ContainerCreating failures.", "Mitigation under discussion: make kubelet fail Pod startup if the PV node affinity is violated (not implemented yet).", "Current state: alpha and disabled by default; behavior may change.", "Future work: plan to integrate with VolumeAttributesClass and CSI so PVC updates can trigger storage-side changes and update PV node affinity automatically.", "Call to action: SIG Storage requests feedback from users and CSI driver developers via Slack (#sig-storage), the kubernetes-sig-storage mailing list, and the KEP issue."]
timeframes: ["2026-01"]
link: "https://kubernetes.io/blog/2026/01/08/kubernetes-v1-35-mutable-pv-nodeaffinity/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-01"
id: "E26A4C1379DD2EC66FEF59AAD6302DFD686FA7A9C8B57131D80B28C4EF1114E2"
contentHash: "9BFCAC27C4BD406F66146670F50EC54DF50D351366D921E40ACBE3782F28F727"
draft: false
type: "updates2"
llmSummary: "Kubernetes v1.35 (alpha) makes PersistentVolume.spec.nodeAffinity mutable. This allows administrators to update PV node affinity to match changes in underlying storage (for example zonal→regional migrations or disk-generation upgrades) without recreating the PV. The feature is gated (MutablePVNodeAffinity), disabled by default, and requires updating the storage provider first. Be aware of scheduling race conditions when tightening affinity; future kubelet/CSI integration and VolumeAttributesClass automation are planned. Feedback is requested via SIG Storage channels."
---

Kubernetes v1.35 (alpha) makes PersistentVolume.spec.nodeAffinity mutable. This allows administrators to update PV node affinity to match changes in underlying storage (for example zonal→regional migrations or disk-generation upgrades) without recreating the PV. The feature is gated (MutablePVNodeAffinity), disabled by default, and requires updating the storage provider first. Be aware of scheduling race conditions when tightening affinity; future kubelet/CSI integration and VolumeAttributesClass automation are planned. Feedback is requested via SIG Storage channels.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/01/08/kubernetes-v1-35-mutable-pv-nodeaffinity/)
