---
title: "k8s: Kubernetes v1.37 Sneak Peek"
date: 2026-07-31T16:00:00.000Z
slug: kubernetes-v1-37-sneak-peek
update_categories: ["k8s"]
update_tags: ["kubernetes", "v1.37", "deprecations", "ga", "beta", "alpha", "kubectl", "kubelet", "kube-proxy", "selinux", "storage"]
update_bullets: ["kubectl run --filename/-f is being deprecated because pod generation is based on CLI arguments, not file input.", "Static Pods can no longer reference Secrets or ConfigMaps; the PreventStaticPodAPIReferences feature gate has been removed.", "kube-proxy ipvs mode is deprecated; warnings will appear on startup. The plan is to disable it by default in v1.40 and remove it in v1.43.", "cgroup v1 support remains on a removal path. Since v1.35, kubelet fails on cgroup v1 by default unless failCgroupV1=false is set temporarily.", "SELinux volume relabeling (SELinuxMount) is expected to go GA and be enabled by default. CSI drivers must opt in, and workloads sharing a volume with different SELinux labels may fail unless seLinuxChangePolicy: Recursive is used.", "metrics.k8s.io is expected to go GA with no functional change; v1 and v1beta1 remain usable during transition.", "Kubelet in UserNS (rootless mode) is expected to graduate to Beta, allowing kubelet to run inside a Linux user namespace instead of as host root.", "Volume health monitor is reset to Alpha and adds CSI RPCs and health reporting for volumes, PVCs, pods, and CSINode status.", "The release is planned for 2026-08-26; the details are still subject to change before release."]
timeframes: ["2026-07"]
link: "https://kubernetes.io/blog/2026/07/31/kubernetes-v1-37-sneak-peek/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-07"
id: "BF25E6665646BF38617A336FC30F2E9C938FBB2E3CFFEC7B5013639642C7912E"
contentHash: "3E80732F1FB7CA69E1DB4D73316832F3DA37D696348E5F5D55D7F54F82ED62F9"
draft: false
type: "updates2"
llmSummary: "Kubernetes v1.37 is planning several deprecations and a few feature graduations. Notable changes include deprecating kubectl run -f, forbidding Static Pods from referencing Secrets/ConfigMaps, starting deprecation of kube-proxy ipvs mode, and moving SELinuxMount to GA with possible workload impact."
---

Kubernetes v1.37 is planning several deprecations and a few feature graduations. Notable changes include deprecating kubectl run -f, forbidding Static Pods from referencing Secrets/ConfigMaps, starting deprecation of kube-proxy ipvs mode, and moving SELinuxMount to GA with possible workload impact.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/07/31/kubernetes-v1-37-sneak-peek/)
