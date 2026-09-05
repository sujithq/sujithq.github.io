---
title: "k8s: Kubernetes v1.37: KubeletInUserNamespace (aka Rootless mode) Graduates to Beta"
date: 2026-09-04T18:30:00.000Z
slug: kubernetes-v1-37-kubeletinusernamespace-aka-rootless-mode-graduates-to-beta
update_categories: ["k8s"]
update_tags: ["kubernetes", "release-notes", "beta", "rootless", "user-namespaces", "node", "security"]
update_bullets: ["All node components can run rootless: kubelet, CRI/OCI runtimes, CNI plugins, and kube-proxy.", "This is distinct from pod user namespaces (hostUsers: false); the two features do not conflict and can be combined.", "Security benefit: limits damage from node-component breakout vulnerabilities to the unprivileged host account; it does not protect against kernel vulnerabilities.", "Common use cases called out: production clusters, shared machines/HPC, laptops, AI sandboxes, Kubernetes-in-Kubernetes, and bootstrapping.", "The user namespace must be created outside Kubernetes; examples include rootless Docker/Podman/nerdctl.", "Beta changes: the feature gate is on by default, and nodes now report runningInUserNamespace in kubectl get nodes -o yaml.", "Operators can use runningInUserNamespace to add labels/taints and avoid scheduling workloads that need true host root onto rootless nodes.", "Kubernetes CI now runs node conformance e2e tests on a rootless cluster (ci-kubernetes-e2e-kind-rootless).", "Related enabling changes include Linux kernel v6.3 idmapped tmpfs, Kubernetes v1.33 defaulting UserNamespacesSupport, and containerd v2.1 writable cgroups.", "The post says GA is the next target if adoption and feedback are positive; related KEPs are being discussed for rootless Kubernetes-in-Kubernetes improvements."]
timeframes: ["2026-09"]
link: "https://kubernetes.io/blog/2026/09/04/kubernetes-v1-37-rootless-beta/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-09"
id: "C30819C397F75D5A16C173DF85ADB2C04E6466EE7DCB3D32BF229B2592F6B9BB"
contentHash: "6D15F2757864BE6D11154415FC13BCD9DECDFBBA857AD038C603650DA96DF93F"
draft: false
type: "updates2"
llmSummary: "Kubernetes v1.37 moves KubeletInUserNamespace to beta and enables the feature gate by default. It allows node components to run as a non-root user in a Linux user namespace, reducing host impact from node-component exploits, while leaving existing rootful clusters unchanged unless explicitly configured."
---

Kubernetes v1.37 moves KubeletInUserNamespace to beta and enables the feature gate by default. It allows node components to run as a non-root user in a Linux user namespace, reducing host impact from node-component exploits, while leaving existing rootful clusters unchanged unless explicitly configured.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/09/04/kubernetes-v1-37-rootless-beta/)
