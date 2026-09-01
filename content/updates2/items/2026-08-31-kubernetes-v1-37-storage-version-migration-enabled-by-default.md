---
title: "k8s: Kubernetes v1.37: Storage Version Migration Enabled by Default"
date: 2026-08-31T18:30:00.000Z
slug: kubernetes-v1-37-storage-version-migration-enabled-by-default
update_categories: ["k8s"]
update_tags: ["kubernetes", "v1.37", "storage-version-migration", "ga", "crd", "storage", "api-machinery"]
update_bullets: ["A new in-tree StorageVersionMigrator controller watches StorageVersionMigration objects and migrates existing resources to the default storage version for the API.", "This helps with CRD version deprecation, stale stored versions, and operational tasks like encryption-at-rest key rotation.", "Migrations are started by creating a StorageVersionMigration object that specifies the API group and resource to migrate.", "Progress and completion are reported in the object's status conditions; a successful run sets Succeeded=True.", "For CRDs, after migration the CRD's .status.storedVersions should only include the preferred version; if it does not, the CRD changed during migration and the migration should be retried.", "CRD upgrades can include the CRD update and the migration object in the same manifest."]
timeframes: ["2026-08"]
link: "https://kubernetes.io/blog/2026/08/31/kubernetes-v1-37-storage-version-migration-ga/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-08"
id: "0FA77FEEE2FF8768391FE57FB611A0F75B70532ACE299CB5F4A726C9A67E2D56"
contentHash: "4C8994CE228B399017E121EB1E515D8703EB43ABEDFEF1432421FD2894D79CC2"
draft: false
type: "updates2"
llmSummary: "Kubernetes v1.37 makes built-in StorageVersionMigration (storagemigration.k8s.io/v1) GA and enabled by default in all clusters. It lets administrators and CRD authors declaratively rewrite stored objects to the current storage version, replacing manual re-write scripts or the out-of-tree migrator."
---

Kubernetes v1.37 makes built-in StorageVersionMigration (storagemigration.k8s.io/v1) GA and enabled by default in all clusters. It lets administrators and CRD authors declaratively rewrite stored objects to the current storage version, replacing manual re-write scripts or the out-of-tree migrator.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/08/31/kubernetes-v1-37-storage-version-migration-ga/)
