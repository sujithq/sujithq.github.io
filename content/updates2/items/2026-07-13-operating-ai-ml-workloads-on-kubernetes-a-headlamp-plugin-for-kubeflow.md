---
title: "k8s: Operating AI/ML Workloads on Kubernetes: A Headlamp Plugin for Kubeflow"
date: 2026-07-13T20:00:00.000Z
slug: operating-ai-ml-workloads-on-kubernetes-a-headlamp-plugin-for-kubeflow
update_categories: ["k8s"]
update_tags: ["kubernetes", "headlamp", "kubeflow", "ai-ml", "crd", "plugin", "sig-ui"]
update_bullets: ["Shows Kubeflow resources in Headlamp instead of requiring Kubeflow-specific dashboards or kubectl for troubleshooting.", "Supports Notebooks, Pipelines, Katib, Training, and Spark resources, with sections shown only for installed API groups.", "Notebook views include Pod conditions, failure reasons, resource requests/limits, volume mounts, env vars, sidecars, and tolerations.", "Katib views expose tuning algorithm, search space, Trials, best Trial, early-stopping config, and stopped-early counts.", "Pipeline views read Kubernetes API objects directly, not the Kubeflow Pipelines backend DB or API service.", "Pipeline detail includes YAML diff between latest and previous PipelineVersion specs.", "Run and RecurringRun views show state, duration, and human-readable schedules; artifacts view aggregates pipelineRoot values from recent Runs.", "The plugin adds a Headlamp map source for several Kubeflow resource types and links nodes via ownerReferences.", "The README includes installation and local-cluster setup, including a CRD-only evaluation path.", "Project is under Apache 2.0 and maintained in Kubernetes SIG UI; feedback goes through the Headlamp plugins repo."]
timeframes: ["2026-07"]
link: "https://kubernetes.io/blog/2026/07/13/introducing-headlamp-plugin-for-kubeflow/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-07"
id: "D3BC5CA313A50622D410E68CDA675FED79C5B695694643125B615C39AB94F36A"
contentHash: "1326803516549668F210540CF0D0B9AB631F84F523B3AAA0D98309E53157C3D8"
draft: false
type: "updates2"
llmSummary: "Kubernetes announced a Headlamp plugin for Kubeflow that surfaces Kubeflow CRDs and related Pod-level state directly in the Headlamp Kubernetes UI. The plugin is aimed at operators and SREs troubleshooting ML workloads and works with modular Kubeflow installs by discovering available API groups at runtime."
---

Kubernetes announced a Headlamp plugin for Kubeflow that surfaces Kubeflow CRDs and related Pod-level state directly in the Headlamp Kubernetes UI. The plugin is aimed at operators and SREs troubleshooting ML workloads and works with modular Kubeflow installs by discovering available API groups at runtime.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/07/13/introducing-headlamp-plugin-for-kubeflow/)
