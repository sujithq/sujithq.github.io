---
title: "k8s: Kubernetes v1.37: etcd RangeStream Cuts Memory Use on Large List Reads"
date: 2026-09-01T18:30:00.000Z
slug: kubernetes-v1-37-etcd-rangestream-cuts-memory-use-on-large-list-reads
update_categories: ["k8s"]
update_tags: ["kubernetes", "v1.37", "etcd", "etcd-v3.7", "api-server", "feature-gate", "beta", "memory-usage", "list-reads"]
update_bullets: ["etcd v3.7 adds RangeStream, a streaming version of the Range RPC that returns the same results in chunks.", "Kubernetes API server uses RangeStream for full-collection reads when the EtcdRangeStream feature gate is enabled.", "This affects watch cache initialization and direct list fallbacks that read from etcd.", "Streaming lets the API server decode each chunk and release it before fetching the next one, so neither side holds the full collection at once.", "Memory savings are especially relevant for large objects or large collections, where key-count pagination could still produce large pages.", "The API server detects etcd support at startup and falls back to paginated Range if etcd is older or returns Unimplemented.", "To disable it, set --feature-gates=EtcdRangeStream=false.", "Usage can be checked via etcd_request_duration_seconds_count{operation=\"listStream\"}; a non-zero count indicates RangeStream is active."]
timeframes: ["2026-09"]
link: "https://kubernetes.io/blog/2026/09/01/kubernetes-v1-37-etcd-range-stream/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-09"
id: "3010E97830A03909C986090C1CC3CD93FB054819A8A7C96C6B39BD32F5CD8B07"
contentHash: "3A5158BF1B9AF3D65E9CF0C11965118DBC08C921202EA5BFFC4F54AAE01212B0"
draft: false
type: "updates2"
llmSummary: "Kubernetes v1.37 graduates the EtcdRangeStream feature to beta and enables it by default. With etcd v3.7+, the API server can stream large collection reads instead of assembling whole pages in memory, reducing peak memory use and making it more predictable."
---

Kubernetes v1.37 graduates the EtcdRangeStream feature to beta and enables it by default. With etcd v3.7+, the API server can stream large collection reads instead of assembling whole pages in memory, reducing peak memory use and making it more predictable.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/09/01/kubernetes-v1-37-etcd-range-stream/)
