---
title: "k8s: Kubernetes v1.36: Moving Volume Group Snapshots to GA"
date: 2026-05-08T18:35:00.000Z
slug: kubernetes-v1-36-moving-volume-group-snapshots-to-ga
update_categories: ["k8s"]
update_tags: ["kubernetes", "storage", "snapshot", "csi", "ga", "release-notes"]
update_bullets: ["Introduced as Alpha in v1.27, moved to Beta in v1.32, second Beta in v1.34, and GA in v1.36.", "New/updated API kinds: `VolumeGroupSnapshot`, `VolumeGroupSnapshotContent`, and `VolumeGroupSnapshotClass`.", "GA change promotes the API version to `groupsnapshot.storage.k8s.io/v1` and includes stability/bug fixes, including improved `restoreSize` reporting from v1beta2.", "Group snapshots are supported only for CSI volume drivers.", "Snapshot creation groups PVCs by label selector; this enables point-in-time, crash-consistent snapshots across multiple volumes.", "Restore flow is to create new PVCs from the `VolumeSnapshot` objects that belong to the `VolumeGroupSnapshot`.", "CSI driver requirements: implement a group controller service, add `CreateVolumeGroupSnapshot`, `DeleteVolumeGroupSnapshot`, and `GetVolumeGroupSnapshot` RPCs, and advertise `CREATE_DELETE_GET_VOLUME_GROUP_SNAPSHOT`.", "The post links design spec, code repository, and CSI documentation for the feature."]
timeframes: ["2026-05"]
link: "https://kubernetes.io/blog/2026/05/08/kubernetes-v1-36-volume-group-snapshot-ga/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-05"
id: "2ADC05EF1E506399A8854CA17B38ABFF84A587F6515CBB2822EDB932B161F27E"
contentHash: "EA98DE667B1BD67BBC750E543C520C3840C3A11AD37355B852370B8EABE31DA4"
draft: false
type: "updates2"
llmSummary: "Kubernetes v1.36 promotes volume group snapshots to GA, with the API graduating to `groupsnapshot.storage.k8s.io/v1`. The feature lets CSI-backed storage drivers take crash-consistent snapshots across multiple PVCs using label selectors and restore workloads from those grouped snapshots."
---

Kubernetes v1.36 promotes volume group snapshots to GA, with the API graduating to `groupsnapshot.storage.k8s.io/v1`. The feature lets CSI-backed storage drivers take crash-consistent snapshots across multiple PVCs using label selectors and restore workloads from those grouped snapshots.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/05/08/kubernetes-v1-36-volume-group-snapshot-ga/)
