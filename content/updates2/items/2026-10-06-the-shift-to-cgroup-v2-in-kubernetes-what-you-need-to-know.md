---
title: "k8s: The Shift to cgroup v2 in Kubernetes: What You Need to Know"
date: 2026-10-06T18:00:00.000Z
slug: the-shift-to-cgroup-v2-in-kubernetes-what-you-need-to-know
update_categories: ["k8s"]
update_tags: ["kubernetes", "cgroup v2", "deprecation", "kubelet", "kubeadm", "linux", "memory qos", "psi", "oom", "oci runtime", "systemd"]
update_bullets: ["cgroup v1 is in maintenance mode since Kubernetes v1.31; cgroup v2 has been stable since v1.25.", "Starting with Kubernetes v1.35, failCgroupV1 defaults to true, so kubelet will not start on a cgroup v1 node unless overridden with failCgroupV1: false.", "kubeadm SystemVerification preflight now returns an error for cgroup v1 nodes with kubelet v1.35+; with older kubelets it remains a warning.", "Kubernetes 1.36 Memory QoS remains alpha and is only available on cgroup v2; it uses memory.high throttling and optional memory.min/memory.low tiered reservation.", "singleProcessOOMKill defaults to false on cgroup v2 nodes, so kubelet sets memory.oom.group to kill all processes in a container on OOM.", "cgroup v2 officially supports delegation; rootless container setups commonly rely on systemd for controller delegation.", "PSI metrics are stable and require cgroup v2; kubelet exposes them through the Summary API and /metrics/cadvisor.", "Newer OCI runtimes change CPU shares-to-weight conversion on cgroup v2; the behavior is in crun v1.23 and runc v1.3.2.", "In-place Pod vertical scaling for Pod-level resources in Kubernetes v1.36 requires cgroup v2 for accurate aggregate enforcement.", "Migration requirements include Linux kernel 5.8+ (5.9+ recommended for Memory QoS), a runtime with cgroup v2 support, and matching kubelet/runtime cgroup drivers.", "Recommended checks and tools include stat -fc %T /sys/fs/cgroup/ (should return cgroup2fs), systemd-cgls, systemd-cgtop, bpftool cgroup list, and inspecting cpu.max/memory.max under the container cgroup."]
timeframes: ["2026-10"]
link: "https://kubernetes.io/blog/2026/10/06/kubernetes-cgroups-v2-shift/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-10"
id: "D4CC8A9721D5DE6D4486CF909830FA31F2777270187B6EC9FEAE8E41D4341AE8"
contentHash: "D2C074ABC2426F49E1B746440EBED3FE88C8F67D38E75394188C8DA68F540ED3"
draft: false
type: "updates2"
llmSummary: "Kubernetes is deprecating cgroup v1 and is moving toward cgroup v2 as the default path: in v1.35, kubelet startup fails by default on cgroup v1 nodes, and kubeadm preflight checks now error on v1.35+ when v1 is detected. The post also summarizes cgroup v2-related behaviors and features in Kubernetes 1.36, including Memory QoS, container-scoped OOM handling, PSI metrics, and in-place pod-level resource updates."
---

Kubernetes is deprecating cgroup v1 and is moving toward cgroup v2 as the default path: in v1.35, kubelet startup fails by default on cgroup v1 nodes, and kubeadm preflight checks now error on v1.35+ when v1 is detected. The post also summarizes cgroup v2-related behaviors and features in Kubernetes 1.36, including Memory QoS, container-scoped OOM handling, PSI metrics, and in-place pod-level resource updates.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/10/06/kubernetes-cgroups-v2-shift/)
