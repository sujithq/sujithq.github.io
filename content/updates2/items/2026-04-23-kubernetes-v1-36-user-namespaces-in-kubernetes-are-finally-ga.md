---
title: "k8s: Kubernetes v1.36: User Namespaces in Kubernetes are finally GA"
date: 2026-04-23T18:35:00.000Z
slug: kubernetes-v1-36-user-namespaces-in-kubernetes-are-finally-ga
update_categories: ["k8s"]
update_tags: ["kubernetes", "v1.36", "user-namespaces", "linux", "security", "rootless", "id-mapped-mounts", "pods"]
update_bullets: ["GA applies to Linux-only clusters.", "Setting hostUsers: false opts a Pod out of the host user namespace.", "runAsUser: 0 inside the Pod no longer implies host root when user namespaces are enabled.", "Capabilities such as CAP_NET_ADMIN become namespaced and affect only container-local resources.", "ID-mapped mounts remap UIDs/GIDs at mount time instead of rewriting file ownership on disk.", "This avoids recursive chown of large volumes and makes volume setup effectively O(1).", "No container image changes or special runtime configuration are required beyond the Pod spec field.", "The feature has been developed through multiple alpha and beta cycles over roughly a decade."]
timeframes: ["2026-04"]
link: "https://kubernetes.io/blog/2026/04/23/kubernetes-v1-36-userns-ga/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-04"
id: "574F53F97688DA9F11538409F331A12F8B93D3EAED0F7C79B7AE81694EC74A41"
contentHash: "226A1990A67B53E89DABA907644E156B927733E29E66773501A74D69AC18D41C"
draft: false
type: "updates2"
llmSummary: "Kubernetes v1.36 makes User Namespaces GA on Linux, allowing Pods to run with hostUsers: false so container root is isolated from host root. The release also relies on ID-mapped mounts to avoid recursive chown on volumes, improving startup performance and preserving on-disk ownership."
---

Kubernetes v1.36 makes User Namespaces GA on Linux, allowing Pods to run with hostUsers: false so container root is isolated from host root. The release also relies on ID-mapped mounts to avoid recursive chown on volumes, improving startup performance and preserving on-disk ownership.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/04/23/kubernetes-v1-36-userns-ga/)
