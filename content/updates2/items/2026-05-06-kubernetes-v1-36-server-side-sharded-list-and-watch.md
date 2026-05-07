---
title: "k8s: Kubernetes v1.36: Server-Side Sharded List and Watch"
date: 2026-05-06T18:35:00.000Z
slug: kubernetes-v1-36-server-side-sharded-list-and-watch
update_categories: ["k8s"]
update_tags: ["kubernetes", "v1.36", "alpha", "apimachinery", "client-go", "list", "watch", "sharding", "controller-scaling"]
update_bullets: ["New alpha feature behind the ShardedListAndWatch feature gate on the API server.", "Adds `shardSelector` to `ListOptions`; clients use `shardRange(...)` to declare a hash range.", "API server computes a deterministic 64-bit FNV-1a hash and returns only objects whose hash falls within `[start, end)`.", "Supported field paths are currently `object.metadata.uid` and `object.metadata.namespace`.", "Works for both list responses and watch streams.", "Controller replicas can pass the selector via `WithTweakListOptions` when creating informers.", "Non-contiguous shard ranges can be combined with `||`.", "List responses include `metadata.shardInfo.selector` when the server honors the shard selector; if absent, the client must assume it received the full collection and may need client-side filtering.", "The hash result is consistent across API server replicas, so the feature is safe with multiple API servers."]
timeframes: ["2026-05"]
link: "https://kubernetes.io/blog/2026/05/06/kubernetes-v1-36-server-side-sharded-list-and-watch/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-05"
id: "AA36B5AFF3640F612C3D91E20C980038A5481CC99E9E0F37BEA8E54C84C34C89"
contentHash: "E41B9C16AAC4769482814509012BE533648F69CC96E26D64A677FB82656EC97A"
draft: false
type: "updates2"
llmSummary: "Kubernetes v1.36 adds server-side sharded list and watch as an alpha feature. The API server can now filter list/watch results by a shard selector so each controller replica receives only the objects in its assigned hash range, reducing duplicate network and deserialization work."
---

Kubernetes v1.36 adds server-side sharded list and watch as an alpha feature. The API server can now filter list/watch results by a shard selector so each controller replica receives only the objects in its assigned hash range, reducing duplicate network and deserialization work.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/05/06/kubernetes-v1-36-server-side-sharded-list-and-watch/)
