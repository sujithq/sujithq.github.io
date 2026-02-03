---
title: "k8s: Introducing Node Readiness Controller"
date: 2026-02-03T02:00:00.000Z
slug: introducing-node-readiness-controller
update_categories: ["k8s"]
update_tags: ["Kubernetes", "Node Readiness Controller", "NodeReadinessRule", "taints", "bootstrapping", "Node Conditions", "Node Problem Detector", "CNI", "dry-run", "SIG-Node"]
update_bullets: ["Introduces NodeReadinessRule (NRR) API to declare readiness gates for nodes.", "Automates taint management: applies or removes taints based on node condition status to prevent scheduling on unready infrastructure.", "Supports two enforcement modes: continuous enforcement (lifecycle-wide) and bootstrap-only (one-time initialization).", "Reacts to Node Conditions rather than running checks itself—integrates with Node Problem Detector (NPD) or a provided Readiness Condition Reporter agent.", "Provides dry-run mode to simulate the impact of new rules across a fleet before applying taints for safer rollouts.", "Example use case: CNI bootstrapping rule that holds scheduling until a cniplugin.example.net/NetworkReady condition is True.", "Benefits: custom readiness definitions, automated taint handling, and declarative multi-step node bootstrapping with better observability.", "Project is newly released, seeking community feedback; links to GitHub, Slack channel, and docs available and a maintainer talk planned at KubeCon + CloudNativeCon Europe 2026."]
timeframes: ["2026-02"]
link: "https://kubernetes.io/blog/2026/02/03/introducing-node-readiness-controller/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-02"
id: "02E0DDEE7F7D629E8FDC43BBC95061FC3D5FF45485E5DBF17A0217D5849BC0D1"
contentHash: "22951298FDF93FB823BA35721031DCB17410E8F02C2991B349A4E7A4FD0E5F6B"
draft: false
type: "updates2"
llmSummary: "The Node Readiness Controller is a new Kubernetes project that provides a declarative system (NodeReadinessRule) to manage node taints based on custom node conditions. It extends readiness guardrails during node bootstrapping and runtime by automating taint application/removal so workloads land only on nodes that meet infrastructure-specific requirements."
---

The Node Readiness Controller is a new Kubernetes project that provides a declarative system (NodeReadinessRule) to manage node taints based on custom node conditions. It extends readiness guardrails during node bootstrapping and runtime by automating taint application/removal so workloads land only on nodes that meet infrastructure-specific requirements.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/02/03/introducing-node-readiness-controller/)
