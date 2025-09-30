---
title: "k8s: Announcing Changed Block Tracking API support (alpha)"
date: 2025-09-25T13:00:00.000Z
slug: announcing-changed-block-tracking-api-support-alpha
update_categories: ["k8s"]
update_tags: ["Kubernetes", "CSI", "changed-block-tracking", "snapshot", "storage", "backup", "alpha", "SnapshotMetadataService"]
update_bullets: ["Feature: Alpha Changed Block Tracking for CSI snapshots lets storage systems report allocated blocks and block-level deltas between snapshots to speed up incremental backups.", "Scope & limitation: Alpha only; supports block volumes only (not file volumes).", "Benefits: reduces backup windows, lowers network/I/O and storage costs by transferring only changed blocks.", "Key components: CSI SnapshotMetadata gRPC API, SnapshotMetadataService Kubernetes CRD, and external-snapshot-metadata sidecar.", "Storage provider responsibilities: implement SnapshotMetadata RPCs (GetMetadataAllocated, GetMetadataDelta) with server-side streaming, ensure backend can track block changes, deploy sidecar, register SnapshotMetadataService CRD, and implement CSI error handling.", "Backup solution responsibilities: authenticate using a Kubernetes ServiceAccount token (with RBAC), implement streaming gRPC clients for the two RPCs, handle large streamed metadata efficiently, and use metadata to transfer only changed blocks. An iterator helper is available in the external-snapshot-metadata repo.", "Getting started: confirm CSI driver snapshot & metadata support, register the CRD, create a SnapshotMetadataService resource, and build authenticated streaming clients.", "Next steps & resources: maintainers may promote to Beta pending feedback; reference docs include CSI developer docs, the KEP, external-snapshot-metadata GitHub repo, schema.proto, example client (snapshot-metadata-lister), and a csi-hostpath end-to-end example.", "Community: developed by SIG Storage contributors; newcomers can join SIG Storage and the Data Protection Working Group to participate."]
timeframes: ["2025-09"]
link: "https://kubernetes.io/blog/2025/09/25/csi-changed-block-tracking/"
source: "Kubernetes Official Blog"
timeframeKey: "2025-09"
id: "540C659A5A32F7EDCAD3A3CFB1E7CB42B84ECFC7350015C2B56AAE540511F73C"
contentHash: "D8622752D692738C8D834DE7AFE6618EF741339D27E7A204D047FEC6359AA490"
draft: false
type: "updates2"
llmSummary: "Kubernetes announces alpha support for a Changed Block Tracking API that lets CSI drivers report allocated and changed blocks between snapshots to enable faster, incremental backups for block volumes. The feature requires a SnapshotMetadataService CRD, an external-snapshot-metadata sidecar, and CSI SnapshotMetadata gRPC RPCs (GetMetadataAllocated and GetMetadataDelta) with streaming responses."
---

Kubernetes announces alpha support for a Changed Block Tracking API that lets CSI drivers report allocated and changed blocks between snapshots to enable faster, incremental backups for block volumes. The feature requires a SnapshotMetadataService CRD, an external-snapshot-metadata sidecar, and CSI SnapshotMetadata gRPC RPCs (GetMetadataAllocated and GetMetadataDelta) with streaming responses.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2025/09/25/csi-changed-block-tracking/)
