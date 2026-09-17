---
title: "k8s: Kubernetes v1.37: Hardening Container Storage with Bind Mount Options and EmptyDir Permissions"
date: 2026-09-16T18:30:00.000Z
slug: kubernetes-v1-37-hardening-container-storage-with-bind-mount-options-and-emptydir-permissions
update_categories: ["k8s"]
update_tags: ["kubernetes", "v1.37", "storage", "security", "alpha", "bind-mount", "emptyDir", "linux"]
update_bullets: ["bindMountOptions can apply Linux bind mount flags to supported volume mounts, including emptyDir, PersistentVolumes, CSI volumes, projected volumes, ConfigMaps, and Secrets; image volumes are not supported.", "emptyDir now supports a mode field for setting directory permissions at creation time, including sticky-bit use cases such as 01777 and tighter modes like 0750.", "The default behavior is unchanged if the new fields are omitted.", "bindMountOptions requires container runtime support for CRI mount options and node feature advertisement; unsupported nodes are avoided by scheduling or rejected by kubelet.", "emptyDir mode does not require runtime support, but if the kubelet lacks the feature gate it is ignored and falls back to 0777.", "fsGroup can override the group permissions applied by emptyDir mode, matching existing behavior for Secret and ConfigMap defaultMode.", "These features are Linux-only; bindMountOptions has no effect on Windows, and emptyDir mode is skipped on Windows.", "Both features are alpha in v1.37 and gated by VolumeBindMountOptions and EmptyDirVolumeMode on the API server and kubelet."]
timeframes: ["2026-09"]
link: "https://kubernetes.io/blog/2026/09/16/kubernetes-v1-37-hardening-container-storage/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-09"
id: "C83331F8AE35EA9037E0161B9BAE05EF99E237600B020ABD31B35D8D9CBAA270"
contentHash: "C0321DE7210AF61503939BA49B31B25B805F55B55BF113448F1DCB909A743BDD"
draft: false
type: "updates2"
llmSummary: "Kubernetes v1.37 adds alpha support for bind mount options on volume mounts and configurable permission modes for emptyDir volumes. These features let users apply Linux mount flags like noexec, nosuid, and nodev, and set emptyDir modes such as 01777 or 0750 without init-container workarounds."
---

Kubernetes v1.37 adds alpha support for bind mount options on volume mounts and configurable permission modes for emptyDir volumes. These features let users apply Linux mount flags like noexec, nosuid, and nodev, and set emptyDir modes such as 01777 or 0750 without init-container workarounds.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/09/16/kubernetes-v1-37-hardening-container-storage/)
