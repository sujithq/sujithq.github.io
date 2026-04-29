---
title: "k8s: Kubernetes v1.36: Staleness Mitigation and Observability for Controllers"
date: 2026-04-28T18:35:00.000Z
slug: kubernetes-v1-36-staleness-mitigation-and-observability-for-controllers
update_categories: ["k8s"]
update_tags: ["kubernetes", "v1.36", "client-go", "kube-controller-manager", "controllers", "staleness", "observability", "metrics", "feature-gates"]
update_bullets: ["client-go adds AtomicFIFO to handle batched queue operations atomically, reducing inconsistent cache state when events arrive out of order.", "New Store method LastStoreSyncResourceVersion() lets clients inspect the latest resource version seen by a shared informer cache.", "kube-controller-manager enables stale-cache checks by default for DaemonSet, StatefulSet, ReplicaSet, and Job controllers.", "Feature gates named StaleControllerConsistency<API type> can disable the behavior per controller, for example StaleControllerConsistencyDaemonSet.", "When enabled, a controller skips reconciliation if its cache resource version is behind the version it previously wrote to the API server.", "client-go adds ConsistencyStore with WroteAt, EnsureReady, and Clear to help informer authors implement the same staleness checks.", "New alpha metric stale_sync_skips_total records how often a controller skipped sync because the cache was stale.", "client-go also exposes store_resource_version for shared informers, labeled by Group, Version, and Resource.", "The blog says the team plans to extend the approach to more controllers and to controller-runtime."]
timeframes: ["2026-04"]
link: "https://kubernetes.io/blog/2026/04/28/kubernetes-v1-36-staleness-mitigation-for-controllers/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-04"
id: "B41EAF3ED9219ADAD85406DBA4A79BDB79AEE6F74AF4B072348137AC92DD1DA3"
contentHash: "E6F1E8640F94B899A9081DC34DF4E6F5D0D9C9CCF1D9B7C454209FF7FDA970D8"
draft: false
type: "updates2"
llmSummary: "Kubernetes v1.36 adds client-go and kube-controller-manager changes to reduce controller actions based on stale caches, and adds metrics for observing cache freshness. The initial rollout targets DaemonSet, StatefulSet, ReplicaSet, and Job controllers, with feature gates available to disable the behavior."
---

Kubernetes v1.36 adds client-go and kube-controller-manager changes to reduce controller actions based on stale caches, and adds metrics for observing cache freshness. The initial rollout targets DaemonSet, StatefulSet, ReplicaSet, and Job controllers, with feature gates available to disable the behavior.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/04/28/kubernetes-v1-36-staleness-mitigation-for-controllers/)
