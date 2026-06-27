---
title: "k8s: Introducing the Cluster API plugin for Headlamp"
date: 2026-06-25T22:00:00.000Z
slug: introducing-the-cluster-api-plugin-for-headlamp
update_categories: ["k8s"]
update_tags: ["Headlamp", "Cluster API", "CAPI", "Kubernetes", "plugin", "alpha", "Prometheus", "LFX Mentorship"]
update_bullets: ["Adds a dedicated Cluster API section to Headlamp with list and detail views for core CAPI resources.", "Supports cluster overview, cluster detail, MachineDeployments, MachineSets, Machines, MachinePools, and KubeadmControlPlane monitoring.", "Shows replica counts, conditions, provider IDs, versions, infrastructure and control plane references, and ownership relationships.", "Includes a dashboard with health summaries, active condition issues, provider information, configuration template counts, and remediation guidance.", "Allows scaling MachineDeployments and MachineSets from the UI; topology-managed clusters indicate when scaling should happen at the Cluster level.", "Provides structured inspection of KubeadmConfig bootstrap data, including files, kubelet args, extra volumes, and join/init settings.", "Adds a map view to visualize Cluster, control plane, and worker relationships.", "Supports both Cluster API v1beta1 and v1beta2.", "Integrates with the Headlamp Prometheus plugin to show inline metrics on detail pages for Clusters, MachineDeployments, MachineSets, and Machines.", "Built during CNCF LFX Mentorship; the release is alpha and ongoing work is planned."]
timeframes: ["2026-06"]
link: "https://kubernetes.io/blog/2026/06/25/headlamp-cluster-api-plugin/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-06"
id: "A754A48E9A31A4D33247DD8196B17FE1BFF99BEED52C563462B510A647E3466C"
contentHash: "75762A05C4515F99698E5875D765AB54577E841B98934C81E8A7FDE43AC441E6"
draft: false
type: "updates2"
llmSummary: "Headlamp now has an alpha Cluster API plugin that adds visual management and debugging views for CAPI resources inside the UI. It covers cluster health, resource hierarchies, scaling, bootstrap config inspection, topology awareness, map view, and inline Prometheus metrics support."
---

Headlamp now has an alpha Cluster API plugin that adds visual management and debugging views for CAPI resources inside the UI. It covers cluster health, resource hierarchies, scaling, bootstrap config inspection, topology awareness, map view, and inline Prometheus metrics support.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/06/25/headlamp-cluster-api-plugin/)
