---
title: "k8s: Avoiding Zombie Cluster Members When Upgrading to etcd v3.6"
date: 2025-12-21T00:00:00.000Z
slug: avoiding-zombie-cluster-members-when-upgrading-to-etcd-v3-6
update_categories: ["k8s"]
update_tags: ["etcd", "upgrade", "v3.6", "v3.5.26", "zombie-members", "v2store", "v3store", "kubernetes", "operational-guidance"]
update_bullets: ["Safe upgrade path: 1) Upgrade cluster to etcd v3.5.26 or later; 2) Wait and confirm all members are healthy; 3) Then upgrade to etcd v3.6.", "Why it happens: v3.6 switches membership source-of-truth from v2store to v3store; some older clusters can have inconsistent membership data between v2store and v3store, causing removed nodes to reappear after an upgrade.", "Fix: etcd v3.5.26 includes an automatic sync that repairs affected clusters by copying membership from v2store to v3store before upgrading to v3.6.", "Known triggers: (a) etcdctl snapshot restore bug in older versions (v3.4 and earlier) that didn’t remove old members; (b) --force-new-cluster behavior in v3.5 and earlier (fixed in v3.5.22); (c) --unsafe-no-sync enabled causing WAL/v3store inconsistency.", "If you cannot obtain v3.5.26 from your vendor or package source, delay upgrading to v3.6 — no safe workaround is available.", "Advanced users can manually compare v2store and v3store (reference provided by upstream) but this check is optional; SIG etcd still recommends applying v3.5.26 before v3.6 regardless.", "After a successful upgrade path, v3store becomes the definitive membership source and further v2/v3 inconsistencies are prevented."]
timeframes: ["2025-12"]
link: "https://kubernetes.io/blog/2025/12/21/preventing-etcd-zombies/"
source: "Kubernetes Official Blog"
timeframeKey: "2025-12"
id: "0BAFBAE8B75BA089BAA312F259E9BD2C5506E04EDC407A1C0806B333BEB5DE53"
contentHash: "E9A2FF890CC80CBEBD7A45955551D4D5F631B11E977ED5469A72C8C18CD3AD5D"
draft: false
type: "updates2"
llmSummary: "Upgrade to etcd v3.5.26 or later before moving to v3.6 to let etcd auto-sync membership data (v3store) from the legacy v2store and prevent removed nodes from reappearing as \"zombie\" members that can make the cluster inoperable."
---

Upgrade to etcd v3.5.26 or later before moving to v3.6 to let etcd auto-sync membership data (v3store) from the legacy v2store and prevent removed nodes from reappearing as "zombie" members that can make the cluster inoperable.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2025/12/21/preventing-etcd-zombies/)
