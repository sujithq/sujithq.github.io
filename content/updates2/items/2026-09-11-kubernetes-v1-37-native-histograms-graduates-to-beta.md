---
title: "k8s: Kubernetes v1.37: Native Histograms Graduates to Beta"
date: 2026-09-11T18:30:00.000Z
slug: kubernetes-v1-37-native-histograms-graduates-to-beta
update_categories: ["k8s"]
update_tags: ["kubernetes", "v1.37", "native histograms", "observability", "prometheus", "beta", "metrics"]
update_bullets: ["Native histograms are enabled by default in Kubernetes v1.37 and are implemented in k8s.io/component-base/metrics.", "Kubernetes uses dual exposition: classic histogram buckets remain available while native histogram data is added for compatible collectors.", "The default histogram config uses BucketFactor 1.1 and MaxBucketNumber 160 to bound error and bucket growth.", "Supported components include kube-apiserver, kube-scheduler, kubelet, kube-controller-manager, and kube-proxy.", "Prometheus 3.0+ should use per-job scrape_native_histograms: true and, during migration, always_scrape_classic_histograms: true.", "Prometheus 2.40–2.x requires the global --enable-feature=native-histograms flag.", "Native histograms can be queried directly with PromQL histogram functions using the metric name without the _bucket suffix.", "Migration guidance is to enable both formats, update dashboards and alerts, verify in staging/production, then disable classic scraping to reduce storage usage.", "Rollback is possible by disabling scrape_native_histograms in Prometheus or turning off the Kubernetes feature gate with a component restart."]
timeframes: ["2026-09"]
link: "https://kubernetes.io/blog/2026/09/11/kubernetes-v1-37-native-histograms-beta/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-09"
id: "543BF31B902EEAE55138D45FC9BD8C67F0FB1F25247713E6739D26B3D8438896"
contentHash: "CA9396A5513A30B1795C13D4DDED938C1E47DCAE133D34C6A4D863046A8FD922"
draft: false
type: "updates2"
llmSummary: "Kubernetes v1.37 enables native histogram support for metrics by default and moves the feature to Beta. Components now dual-expose classic buckets and native spans, and users must adjust Prometheus scraping and queries depending on Prometheus version."
---

Kubernetes v1.37 enables native histogram support for metrics by default and moves the feature to Beta. Components now dual-expose classic buckets and native spans, and users must adjust Prometheus scraping and queries depending on Prometheus version.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/09/11/kubernetes-v1-37-native-histograms-beta/)
