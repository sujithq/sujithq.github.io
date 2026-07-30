---
title: "k8s: How the controller-runtime Cache Actually Works, and Why Your Controller Does Not Crash the API Server"
date: 2026-07-29T18:00:00.000Z
slug: how-the-controller-runtime-cache-actually-works-and-why-your-controller-does-not-crash-the-api-server
update_categories: ["k8s"]
update_tags: ["controller-runtime", "Kubernetes", "cache", "informers", "reconciliation", "APIReader", "indexes", "workqueue"]
update_bullets: ["controller-runtime uses a shared cache built on client-go primitives: Reflector, DeltaFIFO, Indexer, and SharedIndexInformer.", "r.Get and r.List usually read from in-memory cache; Create/Update/Patch/Delete go directly to the API server.", "The cache is warmed with an initial list, then updated via watch; relist happens only on watch failure (for example 410 Gone) or informer recreation.", "Read-after-write is not immediately consistent; a reconciler can read stale data right after Update.", "r.Get/r.List return DeepCopies, but objects seen in EventHandlers and Predicates are shared store objects and must be DeepCopied before mutation.", "DeltaFIFO preserves event order and groups deltas by object key; deduplication of reconcile storms happens in the workqueue, not DeltaFIFO.", "resync does not relist from the API server; it re-emits objects already in the cache back through the informer.", "IndexField plus MatchingFields create inverted indexes for fast cache-backed lookups; without an index, MatchingFields errors.", "MatchingLabels is not indexed and performs a linear scan over cached objects.", "Cache scope can be reduced with namespaces, label selectors, field selectors, and Transform functions to cut memory and network use.", "PartialObjectMetadata can cache metadata-only objects when spec/status/data are not needed, reducing memory significantly.", "APIReader bypasses the cache and should be used for fresh reads, startup reads before mgr.Start(), webhooks, or paginated API access.", "client.Options.Cache.DisableFor turns caching off for specific types entirely, so those reads go straight to the API server.", "Best practices emphasized: make reconciles idempotent, avoid sleeping in reconciles, use RequeueAfter for delays, and do not assume the cache is current immediately after writes."]
timeframes: ["2026-07"]
link: "https://kubernetes.io/blog/2026/07/29/controller-runtime-cache-explained/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-07"
id: "68191031751A1DF1EED8637218A22FE2962DDF7B37EDA1CDB1395D852190ED20"
contentHash: "BD83C21BBD7391173E8BAE55D589D7E73C9CC228C8AC8709719404A7A4F94294"
draft: false
type: "updates2"
llmSummary: "The article explains that controller-runtime controllers read from a local informer cache, not directly from the API server, and that writes go to the API server while the cache catches up asynchronously via watch events. It also details how shared informers, DeltaFIFO, indexing, cache scoping, APIReader, and cache disabling affect consistency, memory use, and query behavior."
---

The article explains that controller-runtime controllers read from a local informer cache, not directly from the API server, and that writes go to the API server while the cache catches up asynchronously via watch events. It also details how shared informers, DeltaFIFO, indexing, cache scoping, APIReader, and cache disabling affect consistency, memory use, and query behavior.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/07/29/controller-runtime-cache-explained/)
