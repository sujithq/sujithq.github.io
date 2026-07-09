---
title: "k8s: Announcing etcd v3.7.0"
date: 2026-07-08T12:00:00.000Z
slug: announcing-etcd-v3-7-0
update_categories: ["k8s"]
update_tags: ["etcd", "release-notes", "kubernetes", "performance", "breaking-changes", "protobuf", "v2store", "range-stream", "leases", "watch"]
update_bullets: ["RangeStream streams large range results in chunks instead of buffering whole responses, reducing latency and memory use.", "Keys-only range requests now read only from the in-memory index unless sorting by value requires backend reads.", "Lease handling was improved with prioritized revoke processing and FastLeaseKeepAlive.", "Concurrent watch lookup performance was improved by faster find() operations.", "etcd now bootstraps entirely from v3store; legacy v2store bootstrap dependency is removed.", "Legacy v2 API/client/discovery code was removed; users on older versions may need to upgrade first and review the upgrade guide.", "Deprecated experimental flags were removed in favor of Kubernetes-style feature gates.", "Protobuf dependencies were migrated to supported libraries; this may affect users building against etcd Go modules, client SDKs, or api/pkg packages.", "Unix socket endpoints are now supported for single-member clusters.", "etcdutl commands now accept a timeout argument.", "Client v3 can set JWTs directly, and AuthStatus can be retrieved without authenticating first.", "New watch send-loop metrics and a new etcd_server_request_duration_seconds metric were added.", "etcdctl subcommands were reorganized and global flags hidden from help output.", "Official container images are now multiarch only; architecture-tagged images are no longer provided.", "etcd v3.7.0 includes bbolt v1.5.1 and raft v3.7.0, plus dependency updates including golang.org/x/crypto v0.52.0 and Go 1.26.4."]
timeframes: ["2026-07"]
link: "https://kubernetes.io/blog/2026/07/08/announcing-etcd-3.7/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-07"
id: "AF16620CFEA724130D2A07D72DE52411A318D0FEB33E47BDD589D708B43AF910"
contentHash: "1CEF7AF73C7FEFB7D8D434BA8D1E2C22BDF4E40DD8C66D633A6D368657DA456D"
draft: false
type: "updates2"
llmSummary: "etcd v3.7.0 adds RangeStream for chunked range results, improves range/lease/watch performance, and completes the move off legacy v2store dependencies. It also includes protobuf dependency cleanup, Unix socket support, new metrics, and several upgrade-breaking removals."
---

etcd v3.7.0 adds RangeStream for chunked range results, improves range/lease/watch performance, and completes the move off legacy v2store dependencies. It also includes protobuf dependency cleanup, Unix socket support, new metrics, and several upgrade-breaking removals.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/07/08/announcing-etcd-3.7/)
