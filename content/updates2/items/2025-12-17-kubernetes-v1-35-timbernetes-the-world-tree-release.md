---
title: "k8s: Kubernetes v1.35: Timbernetes (The World Tree Release)"
date: 2025-12-17T18:30:00.000Z
slug: kubernetes-v1-35-timbernetes-the-world-tree-release
update_categories: ["k8s"]
update_tags: ["kubernetes", "v1.35", "Timbernetes", "in-place-pod-update", "pod-certificates", "storage-version-migration", "KYAML", "cgroup-v2", "containerd-2.0", "deprecations"]
update_bullets: ["Release scope: 60 enhancements (17 stable, 19 beta, 22 alpha) with a community-driven theme and new logo.", "Stable highlight: In-place update of Pod resources (GA) — change CPU/memory without restarting Pods.", "Beta highlight: Pod certificates for native workload identity and automated rotation via PodCertificateRequest.", "Alpha highlight: Nodes can declare supported features (.status.declaredFeatures) to avoid scheduling onto incompatible nodes.", "Graduations to stable include PreferSameNode trafficDistribution, Job.managedBy, Pod .metadata.generation and .status.observedGeneration, and topology manager NUMA limits.", "Key beta features: Downward API exposure of node topology labels, in-tree storage version migration enabled by default, mutable CSINode allocatable counts, opportunistic batching in the scheduler, StatefulSet maxUnavailable, KYAML (beta, default), configurable HPA tolerance, user namespaces in Pods, image VolumeSource (OCI artifacts), secure kubelet credential verification for cached images, and per-container restartPolicy rules.", "Alpha features: native gang scheduling (Workload API / PodGroup), constrained impersonation, machine-readable /flagz and /statusz endpoints, watch-based CCM route reconciliation, extended toleration operators for SLA-based placement, and mutable Job pod resources while suspended.", "Other important changes: comparable resource-version semantics for numeric comparisons, Dynamic Resource Allocation always enabled, improved kubelet restart behavior (preserve container ready state), and various DRA improvements (device taints, consumable capacity).", "Deprecations/removals: Ingress NGINX retirement (best-effort until Mar 2026), removal of cgroup v1 support (cgroup v2 required), deprecation of ipvs mode in kube-proxy (migrate to nftables), and final Kubernetes release supporting containerd v1.x — upgrade to containerd 2.0+ before next Kubernetes release.", "Availability and community: v1.35 available on GitHub/download page, kubeadm/minikube support, release webinar planned and contributor/collaboration stats provided."]
timeframes: ["2025-12"]
link: "https://kubernetes.io/blog/2025/12/17/kubernetes-v1-35-release/"
source: "Kubernetes Official Blog"
timeframeKey: "2025-12"
id: "EB9AE37148E958795B88E8B317689ECBBAEB9514B9E1DF3B3969809968F85508"
contentHash: "33420292327A5F6E8B2D864AC6CE7FFEB6F5A7CAFFABF81EB75AF84212688922"
draft: false
type: "updates2"
llmSummary: "Kubernetes v1.35 (\"Timbernetes / World Tree\" release) ships 60 enhancements (17 stable, 19 beta, 22 alpha), focused on smoother nondisruptive scaling, native pod certificate-based workload identity, improved scheduling correctness, storage and topology improvements, and several important deprecations/removals. The release emphasizes stability, performance, and security hardening (notable GA features, new betas/alphas, and migration guidance for cgroup and containerd)."
---

Kubernetes v1.35 ("Timbernetes / World Tree" release) ships 60 enhancements (17 stable, 19 beta, 22 alpha), focused on smoother nondisruptive scaling, native pod certificate-based workload identity, improved scheduling correctness, storage and topology improvements, and several important deprecations/removals. The release emphasizes stability, performance, and security hardening (notable GA features, new betas/alphas, and migration guidance for cgroup and containerd).

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2025/12/17/kubernetes-v1-35-release/)
