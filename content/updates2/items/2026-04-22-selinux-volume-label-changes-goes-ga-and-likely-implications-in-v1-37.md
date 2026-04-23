---
title: "k8s: SELinux Volume Label Changes goes GA (and likely implications in v1.37)"
date: 2026-04-22T18:35:00.000Z
slug: selinux-volume-label-changes-goes-ga-and-likely-implications-in-v1-37
update_categories: ["k8s"]
update_tags: ["kubernetes", "selinux", "release-notes", "feature-gate", "v1.36", "v1.37", "storage", "security"]
update_bullets: ["`SELinuxMountReadWriteOncePod` is GA in v1.36; broader `SELinuxMount` remains Beta and disabled by default in v1.36.", "When supported by the OS, Pod label, PVC access mode, and volume driver/CSI `seLinuxMount` support, kubelet can mount volumes with `-o context=<label>` instead of recursively relabeling files.", "`spec.securityContext.seLinuxChangePolicy` is stable in v1.36 with three values: unset/default, `Recursive` (opt out), and `MountOption` (use mount labeling when eligible).", "Breaking change risk: shared volumes used by multiple Pods with different SELinux labels, including privileged/unprivileged Pod combinations, may no longer be shareable under mount-based labeling and can cause Pods to stay in `ContainerCreating`.", "Kubernetes v1.36 adds `selinux-warning-controller` in `kube-controller-manager` to emit Events and the `selinux_warning_controller_selinux_volume_conflict` metric for conflicting Pods; it can also reveal namespace names in metrics.", "Kubelet emits `volume_manager_selinux_volume_context_mismatch_warnings_total` while SELinuxMount is disabled and `volume_manager_selinux_volume_context_mismatch_errors_total` once SELinuxMount is enabled and conflicts block startup.", "Recommended upgrade path: enable the warning controller, inspect conflict metrics, fix workloads or set `seLinuxChangePolicy: Recursive` where needed, then upgrade to the release that turns `SELinuxMount` on by default.", "If SELinux is not enabled on the nodes/kernel, none of these changes apply."]
timeframes: ["2026-04"]
link: "https://kubernetes.io/blog/2026/04/22/breaking-changes-in-selinux-volume-labeling/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-04"
id: "C0FA8ED61E85637650BF5FF2A0A8BC24BFF8FB3A4285AA47AD366BBFA9996EBC"
contentHash: "186FE402A50E9E87719AE0BBC05B6BA02E5C1C71E4A3164127E41D96D304C2C1"
draft: false
type: "updates2"
llmSummary: "Kubernetes v1.36 introduces stable Pod field `spec.securityContext.seLinuxChangePolicy` and a new optional `selinux-warning-controller` to help prepare for a likely v1.37 default-on `SELinuxMount` change. When SELinux is enabled, mounts can switch from recursive relabeling to mount-time labeling, which improves performance but can break some shared-volume patterns; clusters should audit for conflicts and opt out per Pod with `Recursive` if needed."
---

Kubernetes v1.36 introduces stable Pod field `spec.securityContext.seLinuxChangePolicy` and a new optional `selinux-warning-controller` to help prepare for a likely v1.37 default-on `SELinuxMount` change. When SELinux is enabled, mounts can switch from recursive relabeling to mount-time labeling, which improves performance but can break some shared-volume patterns; clusters should audit for conflicts and opt out per Pod with `Recursive` if needed.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/04/22/breaking-changes-in-selinux-volume-labeling/)
