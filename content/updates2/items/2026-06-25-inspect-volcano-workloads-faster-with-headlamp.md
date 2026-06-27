---
title: "k8s: Inspect Volcano workloads faster with Headlamp"
date: 2026-06-25T20:00:00.000Z
slug: inspect-volcano-workloads-faster-with-headlamp
update_categories: ["k8s"]
update_tags: ["Kubernetes", "Headlamp", "Volcano", "batch scheduling", "AI/ML", "HPC", "gang scheduling"]
update_bullets: ["Adds Volcano-specific list and detail views in Headlamp for Jobs, Queues, and PodGroups.", "Job pages show workload status, task details, related Queue and PodGroup links, conditions, events, supported actions like Suspend/Resume, and direct Pod log access.", "Queue pages surface capacity, allocated resources, deserved and guaranteed resources, reservations, and child queues.", "PodGroup pages show gang-scheduling state, progress, conditions, and minimum resource requirements.", "A map view visualizes relationships between Jobs, PodGroups, Queues, and Pods, including warning and error states.", "The plugin is positioned as a troubleshooting aid; kubectl and the Volcano CLI still cover automation, scripting, and raw object inspection.", "Future work mentioned includes Prometheus integration and richer scheduling insights.", "To use it, install Headlamp, install the Volcano plugin from the Plugin Catalog, and connect to a cluster with Volcano already installed."]
timeframes: ["2026-06"]
link: "https://kubernetes.io/blog/2026/06/25/visual-context-volcano-headlamp-plugin/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-06"
id: "D2E4F8A645C767C815C6F5CB6BA8E69FAE044739856CFBBD05FE9F67EB078D4F"
contentHash: "77EFE8745E068EF909B07C270A761A018C690EEE9C83EF2E019A451820FAD021"
draft: false
type: "updates2"
llmSummary: "The Volcano plugin for Headlamp adds dedicated views for Volcano Jobs, Queues, and PodGroups, plus a map view that shows how they relate to Pods and events. It is meant to improve interactive troubleshooting and inspection of batch workloads without replacing kubectl or the Volcano CLI."
---

The Volcano plugin for Headlamp adds dedicated views for Volcano Jobs, Queues, and PodGroups, plus a map view that shows how they relate to Pods and events. It is meant to improve interactive troubleshooting and inspection of batch workloads without replacing kubectl or the Volcano CLI.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/06/25/visual-context-volcano-headlamp-plugin/)
