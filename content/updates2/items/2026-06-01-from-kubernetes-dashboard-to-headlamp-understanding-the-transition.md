---
title: "k8s: From Kubernetes Dashboard to Headlamp: Understanding the Transition"
date: 2026-06-01T18:00:00.000Z
slug: from-kubernetes-dashboard-to-headlamp-understanding-the-transition
update_categories: ["k8s"]
update_tags: ["kubernetes", "headlamp", "kubernetes-dashboard", "migration", "multi-cluster", "plugins", "rbac", "ui"]
update_bullets: ["Dashboard workflows such as browsing workloads, editing manifests, scaling, and deleting resources are still available in Headlamp under standard Kubernetes RBAC.", "Headlamp adds better resource relationship views and navigation across namespaces and clusters.", "Headlamp supports multi-cluster management from one interface, unlike Dashboard’s single-cluster model.", "Projects provide an application-oriented view by grouping related workloads and resources, while still relying on native Kubernetes concepts like namespaces, labels, and RBAC.", "Headlamp can be extended with plugins, including Flux integration and an AI Assistant, and teams can build their own plugins.", "Headlamp can run either in-cluster or as a desktop app; the desktop app uses kubeconfig and is suitable for local development, onboarding, and multi-cluster access.", "Migration planning should focus on current clusters, namespaces, and authentication methods; existing kubeconfig- and service account-based access should generally carry over.", "The post says a detailed migration guide is coming soon."]
timeframes: ["2026-06"]
link: "https://kubernetes.io/blog/2026/06/01/dashboard-to-headlamp/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-06"
id: "FA57EBEFC6DF34D5FCADE09C56F40D7823C59DFE0F6B8EA8EFAC23DD81FD1490"
contentHash: "DED55B96BBC0F08853BF66BB9A54876842F4A6B17B0042D882678A106E08F946"
draft: false
type: "updates2"
llmSummary: "Kubernetes Dashboard has been archived, and this post explains how Headlamp maps to Dashboard workflows while adding multi-cluster support, application-centric views, plugins, and flexible deployment options. It also notes that a step-by-step migration guide will follow."
---

Kubernetes Dashboard has been archived, and this post explains how Headlamp maps to Dashboard workflows while adding multi-cluster support, application-centric views, plugins, and flexible deployment options. It also notes that a step-by-step migration guide will follow.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/06/01/dashboard-to-headlamp/)
