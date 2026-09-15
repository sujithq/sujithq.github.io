---
title: "k8s: Kubernetes Changed Block Tracking API - Beta Differences"
date: 2026-09-14T18:30:00.000Z
slug: kubernetes-changed-block-tracking-api-beta-differences
update_categories: ["k8s"]
update_tags: ["kubernetes", "csi", "snapshot-metadata", "changed-block-tracking", "beta", "storage"]
update_bullets: ["CBT still applies only to block volumes; file volumes and network file-share changed-list tracking are not included.", "Upgrade from Alpha requires re-applying the v1.0.0 CRD, changing manifests to apiVersion: cbt.storage.k8s.io/v1beta1, and updating any client/controller code that reads the CRD.", "There is no automatic conversion between v1alpha1 and v1beta1.", "Compatibility for Beta: Kubernetes 1.33+, CSI spec 1.10+, and image registry.k8s.io/sig-storage/csi-snapshot-metadata:v1.0.0.", "Getting started steps remain the same: install the CRD, create a SnapshotMetadataService for the driver, then use snapshot-metadata-lister or another client to call GetMetadataAllocated and GetMetadataDelta.", "The hostpath driver example can be used to test the full flow end to end.", "Beta focus is broader CSI driver adoption and operational feedback before GA.", "Reference materials include the CSI developer docs, KEP-3314, the external-snapshot-metadata repo, the gRPC schema, and the snapshot-metadata-lister example client."]
timeframes: ["2026-09"]
link: "https://kubernetes.io/blog/2026/09/14/csi-changed-block-tracking-beta/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-09"
id: "67F88F890D86DF12EDD4ADEC2DB30105E3FB8517FF91DC5DA55A51EC86FC233E"
contentHash: "05268454A33613A45B310E1679766EC95E5C625EE67ADC4ACCF18E3D01220302"
draft: false
type: "updates2"
llmSummary: "Kubernetes changed block tracking for CSI drivers is now Beta with external-snapshot-metadata v1.0.0. The main Beta change is promotion of SnapshotMetadataService from cbt.storage.k8s.io/v1alpha1 to v1beta1, with no schema change but no served v1alpha1 version."
---

Kubernetes changed block tracking for CSI drivers is now Beta with external-snapshot-metadata v1.0.0. The main Beta change is promotion of SnapshotMetadataService from cbt.storage.k8s.io/v1alpha1 to v1beta1, with no schema change but no served v1alpha1 version.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/09/14/csi-changed-block-tracking-beta/)
