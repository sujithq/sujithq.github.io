---
title: "k8s: Kubernetes Dashboard to Headlamp: A Step-by-Step Guide"
date: 2026-07-13T18:00:00.000Z
slug: kubernetes-dashboard-to-headlamp-a-step-by-step-guide
update_categories: ["k8s"]
update_tags: ["kubernetes", "headlamp", "kubernetes-dashboard", "migration", "rbac", "kubeconfig", "oidc", "multi-cluster", "yaml", "ingress"]
update_bullets: ["Dashboard runs only in-cluster and uses service account tokens; Headlamp can run on desktop or in-cluster and uses kubeconfig on desktop.", "Recommended migration approach is a parallel rollout: install Headlamp, let users test it, then remove Dashboard after validation.", "Desktop Headlamp uses the same kubeconfig and RBAC as kubectl; in-cluster Headlamp can be exposed via ingress and optionally use OIDC or an auth proxy.", "Headlamp supports multiple clusters from one kubeconfig, unlike Dashboard which is usually tied to one cluster at a time.", "Resource navigation remains familiar, with workloads, network, storage, configuration, namespace filtering, YAML inspection, events, logs, and RBAC-aware actions.", "Headlamp adds a Map View for resource relationships such as Deployment -> ReplicaSet -> Pod -> Service.", "Resource creation shifts from Dashboard forms to applying YAML manifests; existing Helm and GitOps workflows remain unchanged.", "Debugging features include pod logs, exec/terminal sessions, and metrics display when metrics-server is installed.", "For in-cluster deployments, the guide calls out TLS, ingress/proxy headers, OIDC callback configuration, and least-privilege RBAC.", "After migration, uninstall Kubernetes Dashboard and remove Dashboard-only service accounts, role bindings, and old docs pointing to Dashboard URLs or port-forward commands."]
timeframes: ["2026-07"]
link: "https://kubernetes.io/blog/2026/07/13/kubernetes-dashboard-to-headlamp/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-07"
id: "C07B8A4519217F1D8AB1519D14206E46EED5043A318F02D1EEBE14ACED4D2D93"
contentHash: "D0A8A7785B1B9729B8BCA4F550116101750F88B4D6BE5DCDD352676B0E7EABFA"
draft: false
type: "updates2"
llmSummary: "Kubernetes Dashboard users can migrate to Headlamp by choosing either a desktop or in-cluster deployment. The guide covers kubeconfig-based auth, OIDC for shared installs, multi-cluster support, YAML-based resource creation, debugging features, and cleanup of Dashboard-specific access and RBAC."
---

Kubernetes Dashboard users can migrate to Headlamp by choosing either a desktop or in-cluster deployment. The guide covers kubeconfig-based auth, OIDC for shared installs, multi-cluster support, YAML-based resource creation, debugging features, and cleanup of Dashboard-specific access and RBAC.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/07/13/kubernetes-dashboard-to-headlamp/)
