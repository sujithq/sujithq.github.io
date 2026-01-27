---
title: "k8s: Cluster API v1.12: Introducing In-place Updates and Chained Upgrades"
date: 2026-01-27T16:00:00.000Z
slug: cluster-api-v1-12-introducing-in-place-updates-and-chained-upgrades
update_categories: ["k8s"]
update_tags: ["cluster-api", "kubernetes", "v1.12.0", "in-place-updates", "chained-upgrades", "ClusterClass", "MachineDeployments", "KubeadmControlPlane", "upgrades", "extensibility"]
update_bullets: ["In‑place updates: new update extensions allow changing existing Machines without deleting and recreating them; supported by KubeadmControlPlane and MachineDeployments.", "Cluster API automatically chooses between immutable rollouts and in‑place updates based on which mechanism is most appropriate for the requested change.", "Use cases: in‑place updates are ideal for changes that don't require node drains or pod restarts (e.g., credential updates); when workloads will be disrupted, immutable rollouts remain preferred.", "Prior rollout improvements retained: in‑place propagation for Kubernetes-only changes, PreferNoSchedule taints for outdated nodes, and delete‑first rollout strategy for constrained environments.", "Chained upgrades: declare a target Kubernetes minor version and Cluster API computes and executes a multi‑step upgrade plan to reach it in a controlled order (control plane then workers) in one operation.", "Worker machines will skip intermediate minor releases when allowed by Kubernetes version skew policies; upgrade plan runtime extensions and lifecycle hooks let platforms influence and automate steps (e.g., addon upgrades).", "Extensibility: operators can implement custom update extensions and upgrade plan extensions to control when and how updates and upgrades occur.", "Guidance: chained upgrades simplify upgrading across several minor versions but are not a substitute for regular security and patching cadence.", "Release and community: v1.12.0 continues Cluster API's focus on safety, usability, and extensibility; contributors and maintainers are acknowledged and contributing guidelines are available."]
timeframes: ["2026-01"]
link: "https://kubernetes.io/blog/2026/01/27/cluster-api-v1-12-release/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-01"
id: "5040D10DFBBF608770F016BD2623693CC09DABC0D98A570F5963C979881BC4FC"
contentHash: "59F076D35BA75BBCEA66110AE0186A9E20E97CB4A44605BD37FE9EFB9E73FED6"
draft: false
type: "updates2"
llmSummary: "Cluster API v1.12.0 adds two major features — in‑place updates and chained upgrades — enabling mutable updates of existing Machines when safe and orchestrated multi‑minor‑version upgrades respectively, while keeping immutable rollouts and strong extensibility as core design principles."
---

Cluster API v1.12.0 adds two major features — in‑place updates and chained upgrades — enabling mutable updates of existing Machines when safe and orchestrated multi‑minor‑version upgrades respectively, while keeping immutable rollouts and strong extensibility as core design principles.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/01/27/cluster-api-v1-12-release/)
