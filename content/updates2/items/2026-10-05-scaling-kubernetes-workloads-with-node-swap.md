---
title: "k8s: Scaling Kubernetes Workloads with Node Swap"
date: 2026-10-05T18:00:00.000Z
slug: scaling-kubernetes-workloads-with-node-swap
update_categories: ["k8s"]
update_tags: ["Kubernetes", "node swap", "v1.34", "GA", "Local SSD", "cgroup v2", "pod density", "memory management", "GKE"]
update_bullets: ["Node swap support reached General Availability in Kubernetes v1.34 and requires cgroup v2-based swap accounting.", "The post benchmarks Local SSD-backed swap on three workloads: Linux kernel builds, headless browser sandboxes, and isolated Python sandboxes.", "Kernel build memory limit dropped from 600 MB to 300 MB with swap enabled, with no slowdown at that setting; forcing it to 200 MB caused more than 40% slower runtime.", "Headless Chrome density increased from 40 to 50 pods with Kata Containers, from 80 to 160 pods with gVisor, and plain runc reached 768 pods with swap after failing past 512 without it.", "Python sandbox density increased from 80 to 240 concurrent sessions, a 3× improvement.", "The post says higher latency at peak density was mostly due to CPU contention, while swap I/O became a problem only when the active working set was forced into swap.", "Recommended configuration shown: kubelet with failSwapOn: false, memorySwap.swapBehavior: LimitedSwap.", "The post recommends Burstable QoS and pairing node swap with high-speed local storage, such as Google Kubernetes Engine Local SSD profiles."]
timeframes: ["2026-10"]
link: "https://kubernetes.io/blog/2026/10/05/scaling-kubernetes-workloads-with-node-swap/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-10"
id: "85F8B427AEE9428CCE95D23A5BAA2814C8C97C33A65B06B435D97EF77B453E59"
contentHash: "81EF86E906869F9F48C736F9EE9B1A7B5EE76140EDD27168AA309EF42415B485"
draft: false
type: "updates2"
llmSummary: "Kubernetes node swap is now GA in v1.34, and this post reports that using fast NVMe Local SSDs for swap can raise pod density for memory-heavy workloads with little latency impact when active working sets remain in RAM."
---

Kubernetes node swap is now GA in v1.34, and this post reports that using fast NVMe Local SSDs for swap can raise pod density for memory-heavy workloads with little latency impact when active working sets remain in RAM.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/10/05/scaling-kubernetes-workloads-with-node-swap/)
