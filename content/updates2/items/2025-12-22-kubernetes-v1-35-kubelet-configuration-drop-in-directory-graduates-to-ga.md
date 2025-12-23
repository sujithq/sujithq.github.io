---
title: "k8s: Kubernetes v1.35: Kubelet Configuration Drop-in Directory Graduates to GA"
date: 2025-12-22T18:30:00.000Z
slug: kubernetes-v1-35-kubelet-configuration-drop-in-directory-graduates-to-ga
update_categories: ["k8s"]
update_tags: ["kubelet", "kubelet-config", "drop-in-directory", "v1.35", "GA", "SIG-Node", "configuration", "cluster-management", "configz"]
update_bullets: ["--config-dir is GA in v1.35 and will merge all files in the specified directory with the main kubelet configuration.", "Enables a base config plus targeted overrides for node groups (GPU, edge, high-capacity) using numbered drop-in files.", "File ordering is controlled by numeric prefixes (e.g., 00-, 50-, 99-) to make merge precedence explicit.", "Inspect the final merged configuration (including CLI-set values) via the kubelet /configz endpoint (kubectl proxy + curl).", "Recommended practices: test changes incrementally, store drop-ins in version control, use numeric prefixes, and avoid editor backup files in the directory.", "Supports gradual rollouts by adding high-prefixed drop-ins, testing on subsets of nodes, then promoting changes to the base file.", "Feature graduated through alpha in v1.28, beta in v1.30, and GA in v1.35; developed by SIG Node—feedback via SIG Node channels or GitHub issues."]
timeframes: ["2025-12"]
link: "https://kubernetes.io/blog/2025/12/22/kubernetes-v1-35-kubelet-config-drop-in-directory-ga/"
source: "Kubernetes Official Blog"
timeframeKey: "2025-12"
id: "EAB582384CAD5BBB3FE560C4153B8EB46AAB8586EA588C2ADCD0DB43E336E9E3"
contentHash: "50BAE65CAFD76E83F76AC1758D42DC75F43569D04783D4E935EC89515CB2E80A"
draft: false
type: "updates2"
llmSummary: "Kubernetes v1.35 graduates the kubelet configuration drop-in directory to GA: the --config-dir kubelet flag is now production-ready and automatically merges drop-in files with the main kubelet configuration. This simplifies managing different kubelet settings across heterogeneous node pools and supports staged rollouts and targeted overrides without complex tooling."
---

Kubernetes v1.35 graduates the kubelet configuration drop-in directory to GA: the --config-dir kubelet flag is now production-ready and automatically merges drop-in files with the main kubelet configuration. This simplifies managing different kubelet settings across heterogeneous node pools and supports staged rollouts and targeted overrides without complex tooling.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2025/12/22/kubernetes-v1-35-kubelet-config-drop-in-directory-ga/)
