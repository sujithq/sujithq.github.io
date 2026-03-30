---
title: "k8s: Kubernetes v1.36 Sneak Peek"
date: 2026-03-30T00:00:00.000Z
slug: kubernetes-v1-36-sneak-peek
update_categories: ["k8s"]
update_tags: ["Kubernetes", "v1.36", "deprecation", "removal", "SELinux", "ServiceAccount", "DRA", "security"]
update_bullets: ["Ingress NGINX was retired on March 24, 2026; no further releases, bugfixes, or security updates will be published.", "Service .spec.externalIPs is deprecated in v1.36, with removal planned for v1.43; warnings will appear when it is used.", "The gitRepo volume driver is removed/disabled in v1.36 and cannot be re-enabled.", "Faster SELinux labelling for volumes is GA; it uses mount-time SELinux labels instead of recursive relabeling and defaults to all volumes via opt-in on Pods/CSIDrivers.", "External signing of ServiceAccount tokens is expected to graduate to GA; kube-apiserver can delegate token signing to external key management or HSM systems.", "DRA device taints and tolerations move to beta, allowing devices to be marked as unschedulable unless explicitly requested.", "DRA partitionable devices are added, allowing a single accelerator to be split into multiple logical units for shared use.", "The release is still in development and details may change before the final changelog."]
timeframes: ["2026-03"]
link: "https://kubernetes.io/blog/2026/03/30/kubernetes-v1-36-sneak-peek/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-03"
id: "806AB8A7EE3705A12093507D000B8109E5D27BBE4DF4F54FD54F5B46BFF613A2"
contentHash: "20367999CB14F92F5A33EAEE38B49CE2F9BFB1752DEB13D3AB75E4A13F0A47E0"
draft: false
type: "updates2"
llmSummary: "Kubernetes v1.36 is planned for April 22, 2026 and includes API deprecations/removals plus several feature graduations. Notable changes are deprecating Service .spec.externalIPs, disabling the gitRepo volume driver, and promoting SELinux volume labeling and external ServiceAccount token signing to GA."
---

Kubernetes v1.36 is planned for April 22, 2026 and includes API deprecations/removals plus several feature graduations. Notable changes are deprecating Service .spec.externalIPs, disabling the gitRepo volume driver, and promoting SELinux volume labeling and external ServiceAccount token signing to GA.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/03/30/kubernetes-v1-36-sneak-peek/)
