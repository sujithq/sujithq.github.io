---
title: "k8s: Kubernetes v1.35: Extended Toleration Operators to Support Numeric Comparisons (Alpha)"
date: 2026-01-05T18:30:00.000Z
slug: kubernetes-v1-35-extended-toleration-operators-to-support-numeric-comparisons-alpha
update_categories: ["k8s"]
update_tags: ["kubernetes", "v1.35", "taints-and-tolerations", "scheduling", "alpha", "feature-gates", "Gt", "Lt", "sig-scheduling", "cel"]
update_bullets: ["What changed: v1.35 adds two alpha toleration operators: Gt and Lt, enabling numeric comparisons between toleration.value and taint.value.", "Operator semantics (as defined by this release): Gt matches when the taint's numeric value is less than the toleration's value; Lt matches when the taint's numeric value is greater than the toleration's value (used to express min/max thresholds in scheduling).", "Supported effects: works with NoSchedule, NoExecute (including tolerationSeconds eviction behavior), and PreferNoSchedule.", "Numeric value rules: must be positive 64-bit integers, no leading zeros, and the literal \"0\" is not allowed.", "Why tolerations vs NodeAffinity: taints invert control (node-declared policy), enable NoExecute eviction semantics, and centralize operational policies for safer defaults.", "Common use cases: SLA-based placement (failure probability), GPU tiers (gpu-compute-score), cost-tiering (cost-per-hour), and performance guarantees (disk-iops, network bandwidth).", "How to enable (alpha): set the feature gate on API server and scheduler: --feature-gates=TaintTolerationComparisonOperators=true; taint nodes with numeric values and add Gt/Lt tolerations in pod specs.", "Examples in the release: payment-processor pod using Lt to require failure-probability < 5; training pod using Gt to require gpu-compute-score > 800; cost-sensitive batch jobs using Lt against cost-per-hour.", "Caveats: alpha feature — interfaces and behavior may change; test in non-production clusters before adoption.", "Roadmap & community: planned work includes CEL expressions in tolerations/affinity, autoscaler integration, and graduation to beta/GA. SIG Scheduling is the community contact for feedback and questions."]
timeframes: ["2026-01"]
link: "https://kubernetes.io/blog/2026/01/05/kubernetes-v1-35-numeric-toleration-operators/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-01"
id: "1BA50C762D0B3D954AA01CE3CB459DEA287B752298D0233B0D86B6BB7FD58CC5"
contentHash: "11B18E25A855AB2214DE8340C014C0FCAB398E57E14191F4FDDCAE4197D03591"
draft: false
type: "updates2"
llmSummary: "Kubernetes v1.35 introduces Extended Toleration Operators (alpha) that add numeric comparison operators Gt and Lt to spec.tolerations. This lets tolerations compare numeric taint values (e.g., failure-probability, gpu-compute-score, disk-iops, cost-per-hour) so schedulers can make threshold-based placement decisions while preserving taint/toleration semantics (centralized node-side policy and eviction via NoExecute). The feature is gated, supports all taint effects, has specific numeric format rules, and is experimental — feedback and further enhancements (CEL, autoscaling integration, graduation) are planned."
---

Kubernetes v1.35 introduces Extended Toleration Operators (alpha) that add numeric comparison operators Gt and Lt to spec.tolerations. This lets tolerations compare numeric taint values (e.g., failure-probability, gpu-compute-score, disk-iops, cost-per-hour) so schedulers can make threshold-based placement decisions while preserving taint/toleration semantics (centralized node-side policy and eviction via NoExecute). The feature is gated, supports all taint effects, has specific numeric format rules, and is experimental — feedback and further enhancements (CEL, autoscaling integration, graduation) are planned.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/01/05/kubernetes-v1-35-numeric-toleration-operators/)
