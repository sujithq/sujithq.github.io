---
title: "k8s: Building a Custom Metrics Exporter for Kubernetes"
date: 2026-07-14T18:00:00.000Z
slug: building-a-custom-metrics-exporter-for-kubernetes
update_categories: ["k8s"]
update_tags: ["kubernetes", "prometheus", "metrics-exporter", "go", "autoscaling", "service-monitor", "distroless", "hpa"]
update_bullets: ["Describes when to use a standalone exporter versus instrumenting an app directly.", "Covers Prometheus metric types: counters for totals, gauges for current values, and histograms for distributions.", "Uses Go's Prometheus client library with a default registry and `MustRegister` for exporter metrics.", "Example metrics: `worker_jobs_processed_total` (counter vector), `worker_queue_depth` (gauge), and `worker_job_duration_seconds` (histogram).", "Shows a polling loop that updates metrics from an internal data source and notes the scrape interval should be longer than the update interval.", "Exposes `/metrics` with `promhttp` and a separate `/healthz` endpoint for liveness probes.", "Recommends a multi-stage Docker build and a `distroless/static:nonroot` final image.", "Deploys the exporter with a Deployment and Service in the `monitoring` namespace.", "For Prometheus Operator installs, uses a `ServiceMonitor` with a matching `release` label; for annotation-based discovery, shows `prometheus.io/*` annotations.", "Verification steps include checking Prometheus targets for `UP` state and querying `rate(worker_jobs_processed_total{status=\"success\"}[2m])`.", "States that HPA usage requires exposing custom metrics through a metrics adapter such as Prometheus Adapter."]
timeframes: ["2026-07"]
link: "https://kubernetes.io/blog/2026/07/14/custom-metrics-exporter-kubernetes/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-07"
id: "31326D978FF785F3CD288D47D68902114494EE9B36292B4F8A37602857127685"
contentHash: "F74E3AD7C72C9C63525012FEDF2CA8E92CF5D0F253D6BFF217E43048D4699ABA"
draft: false
type: "updates2"
llmSummary: "The post explains how to build a custom Prometheus metrics exporter for Kubernetes in Go, package it as a minimal container image, and expose it for scraping by Prometheus. It also shows how to verify the target in Prometheus and notes that a metrics adapter such as Prometheus Adapter is needed if you want to use the exported metrics for HorizontalPodAutoscaler scaling."
---

The post explains how to build a custom Prometheus metrics exporter for Kubernetes in Go, package it as a minimal container image, and expose it for scraping by Prometheus. It also shows how to verify the target in Prometheus and notes that a metrics adapter such as Prometheus Adapter is needed if you want to use the exported metrics for HorizontalPodAutoscaler scaling.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/07/14/custom-metrics-exporter-kubernetes/)
