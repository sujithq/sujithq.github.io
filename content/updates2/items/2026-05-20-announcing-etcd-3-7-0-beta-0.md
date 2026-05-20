---
title: "k8s: Announcing etcd 3.7.0-beta.0"
date: 2026-05-20T00:00:00.000Z
slug: announcing-etcd-3-7-0-beta-0
update_categories: ["k8s"]
update_tags: ["etcd", "release", "beta", "range-stream", "v2store-removal", "eol", "kubernetes"]
update_bullets: ["RangeStream lets clients receive large range results in chunks, reducing latency and making memory usage more predictable.", "The release removes the last v2store components: discovery, bootstrap, v2 requests, and the v2 client.", "Multiple deprecated experimental flags were removed; users on older versions may see breakage, especially if they have not already upgraded to v3.6.11.", "This beta sets end-of-life timing for etcd v3.4; v3.4 has been EOL since May 15, 2026 and will stop receiving updates after the end of May, with at most one final security patch possible.", "Community support policy continues to cover the latest two minor versions; v3.5 support will continue for 1 year after v3.7.0 final release.", "The project is asking users to test the beta and report issues; more betas may follow, with RCs and final release expected through June and possibly early July."]
timeframes: ["2026-05"]
link: "https://kubernetes.io/blog/2026/05/20/etcd-370-beta/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-05"
id: "3F632BF7A203FA953F7FB57860E3E3261461D1AB3D4034F55BBE09904846C12E"
contentHash: "EC53C52F14F84A4A9E1AB60F7D227D56904992C5A6F57FC394F6AED9CF668E8D"
draft: false
type: "updates2"
llmSummary: "etcd v3.7.0-beta.0 is available. It adds RangeStream for chunked large range responses, removes the remaining etcd v2store code paths, and includes bbolt v1.5.0 and raft v3.7.0."
---

etcd v3.7.0-beta.0 is available. It adds RangeStream for chunked large range responses, removes the remaining etcd v2store code paths, and includes bbolt v1.5.0 and raft v3.7.0.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/05/20/etcd-370-beta/)
