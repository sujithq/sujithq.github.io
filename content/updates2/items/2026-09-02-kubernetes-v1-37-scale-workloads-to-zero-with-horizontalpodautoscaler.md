---
title: "k8s: Kubernetes v1.37: Scale Workloads to Zero with HorizontalPodAutoscaler"
date: 2026-09-02T18:30:00.000Z
slug: kubernetes-v1-37-scale-workloads-to-zero-with-horizontalpodautoscaler
update_categories: ["k8s"]
update_tags: ["kubernetes", "autoscaling", "horizontalpodautoscaler", "beta", "scale-to-zero", "external-metrics", "prometheus-adapter", "v1.37"]
update_bullets: ["HPA can now scale to and from zero with object or external metrics; CPU and memory metrics still cannot drive scale-from-zero.", "Feature gate HPAScaleToZero is enabled by default in both kube-apiserver and kube-controller-manager in v1.37.", "Example use case is queue consumers or batch workers; a durable queue or similar buffering layer is still needed for request-driven traffic.", "Kubernetes Services do not buffer requests while no Pods are ready, so HTTP workloads need an external buffering layer.", "The HPA needs a metric source that exists independently of Pods, such as queue length exposed through the External Metrics API.", "Prometheus Adapter can expose a metric like queue_consumer_lag through externalRules; the article shows a sample configuration and raw API check.", "Example HPA spec uses minReplicas: 0, maxReplicas: 10, and an External metric target value of 30 queued tasks per replica.", "If the Deployment is manually set to zero, the HPA treats it as paused and will not scale it back up unless it previously scaled it down itself.", "The controller uses the ScaledToZero status condition to distinguish automatic scale-to-zero from manual pause.", "Default downscale stabilization still applies; the article notes the default five-minute window.", "If the metrics adapter cannot return the configured metric, HPA reports ScalingActive=False with a failure reason such as FailedGetExternalMetric.", "During control plane upgrades or downgrades, ensure both api-server and controller-manager support the feature before using minReplicas: 0; otherwise workloads at zero may remain paused.", "Before disabling the feature or downgrading, change affected HPAs to minReplicas: 1+ and scale any zero-replica workloads back to at least one pod.", "The feature first appeared as Alpha in v1.16; v1.36 added the ScaledToZero condition and v1.37 enables the feature by default after additional testing."]
timeframes: ["2026-09"]
link: "https://kubernetes.io/blog/2026/09/02/kubernetes-v1-37-hpa-scale-to-zero-beta/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-09"
id: "10D1F814B2411F387973CEF2BEFDC7FA68706922BC2F09CD0AB7DE94EF8DE0B0"
contentHash: "0576F6E8E8351BFB2B76C42530CCD3D9B5A971F4F8181017D6097AD3569D29BA"
draft: false
type: "updates2"
llmSummary: "Kubernetes v1.37 makes HorizontalPodAutoscaler scale workloads down to zero replicas by default when using object or external metrics. The feature is Beta; it requires a metric source that remains available at zero replicas, and the controller marks zero-state ownership with a ScaledToZero condition."
---

Kubernetes v1.37 makes HorizontalPodAutoscaler scale workloads down to zero replicas by default when using object or external metrics. The feature is Beta; it requires a metric source that remains available at zero replicas, and the controller marks zero-state ownership with a ScaledToZero condition.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/09/02/kubernetes-v1-37-hpa-scale-to-zero-beta/)
