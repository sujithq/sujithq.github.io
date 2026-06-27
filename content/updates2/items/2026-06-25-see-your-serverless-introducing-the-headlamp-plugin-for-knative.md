---
title: "k8s: See your serverless: introducing the Headlamp plugin for Knative"
date: 2026-06-25T18:00:00.000Z
slug: see-your-serverless-introducing-the-headlamp-plugin-for-knative
update_categories: ["k8s"]
update_tags: ["Headlamp", "Knative", "Kubernetes", "plugin", "serverless", "UI", "observability", "autoscaling", "traffic splitting", "Prometheus"]
update_bullets: ["Maps Knative CRDs in Headlamp's graph view, including KServices, Revisions, and DomainMappings.", "Adds a KService detail view with edit mode for live changes to traffic splits, autoscaling annotations, and other settings.", "Surfaces common actions in the UI header, including YAML view, logs, redeploy, and pod restart, subject to RBAC.", "Supports inline traffic split editing across revisions, with validation for 100% total traffic and unique tags.", "Shows effective autoscaling settings by combining KService annotations with cluster ConfigMaps such as config-autoscaler and config-defaults.", "Renders Prometheus-backed request rate, latency, and resource utilization graphs when the Prometheus plugin is installed.", "Adds list and detail views for Revisions, DomainMappings, ClusterDomainClaims, and a cluster-level Networking overview using config-network and config-gateway.", "Installable from Headlamp Desktop's Plugin Catalog; the plugin appears in the sidebar after reload."]
timeframes: ["2026-06"]
link: "https://kubernetes.io/blog/2026/06/25/headlamp-knative-plugin/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-06"
id: "735C93E19786EB871C33159C025E634F52AFF28FA35D112ED50F8E63706490E8"
contentHash: "762927971DAB450DFC0A42F7C349CA2CE03F7A52D7CCAFC0CB786B203BE8284D"
draft: false
type: "updates2"
llmSummary: "Headlamp now has a Knative plugin that adds integrated views and actions for Knative resources in the Kubernetes UI. It centralizes KService management, traffic splitting, autoscaling configuration, metrics, and related CRDs, with release 0.3.0-beta available."
---

Headlamp now has a Knative plugin that adds integrated views and actions for Knative resources in the Kubernetes UI. It centralizes KService management, traffic splitting, autoscaling configuration, metrics, and related CRDs, with release 0.3.0-beta available.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/06/25/headlamp-knative-plugin/)
