---
title: "k8s: Kubernetes v1.34: Moving Volume Group Snapshots to v1beta2"
date: 2025-09-16T18:30:00.000Z
slug: kubernetes-v1-34-moving-volume-group-snapshots-to-v1beta2
update_categories: ["k8s"]
update_tags: ["kubernetes", "v1.34", "volume-group-snapshot", "v1beta2", "CSI", "csi-snapshotter", "storage", "SIG-Storage"]
update_bullets: ["Feature progression: alpha in v1.27, beta in v1.32, now v1beta2 in v1.34.", "Purpose: create crash-consistent snapshots for a group of PVCs (grouped by a label selector) and restore them as a set.", "CSI-only: volume group snapshots require a CSI volume driver.", "Problem addressed: restoreSize was not set for individual VolumeSnapshots/Contents when CSI drivers lack ListSnapshots support.", "API changes in v1beta2: adds VolumeSnapshotInfo struct and replaces VolumeSnapshotHandlePairList with VolumeSnapshotInfoList in VolumeGroupSnapshotContentStatus.", "Population: VolumeSnapshotInfoList is populated by the csi-snapshotter sidecar using the CSI CreateVolumeGroupSnapshotResponse (CreateVolumeGroupSnapshot RPC).", "Migration: existing v1beta1 objects are converted to v1beta2 via a conversion webhook.", "Next steps: adoption and feedback will determine timing for promoting the feature to GA.", "Get involved: design spec, code repo, CSI docs available; SIG Storage and the Data Protection WG welcome contributors."]
timeframes: ["2025-09"]
link: "https://kubernetes.io/blog/2025/09/16/kubernetes-v1-34-volume-group-snapshot-beta-2/"
source: "Kubernetes Official Blog"
timeframeKey: "2025-09"
id: "A8A4D5EAE615A72B2F3932CE2DC256751FAA8F4CDE2A6999E86B4EC906586DBD"
contentHash: "CFEEB2DAA1B09EC2AE01B5E9F181F961A1E686EC40471C02664C410829E1BAFA"
draft: false
type: "updates2"
llmSummary: "Kubernetes v1.34 advances Volume Group Snapshots to v1beta2. The update adds a VolumeSnapshotInfo type and replaces VolumeSnapshotHandlePairList with VolumeSnapshotInfoList to fix restoreSize handling when CSI drivers do not implement ListSnapshots; objects are migrated from v1beta1 via a conversion webhook and the feature remains CSI-only with GA planned later."
---

Kubernetes v1.34 advances Volume Group Snapshots to v1beta2. The update adds a VolumeSnapshotInfo type and replaces VolumeSnapshotHandlePairList with VolumeSnapshotInfoList to fix restoreSize handling when CSI drivers do not implement ListSnapshots; objects are migrated from v1beta1 via a conversion webhook and the feature remains CSI-only with GA planned later.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2025/09/16/kubernetes-v1-34-volume-group-snapshot-beta-2/)
