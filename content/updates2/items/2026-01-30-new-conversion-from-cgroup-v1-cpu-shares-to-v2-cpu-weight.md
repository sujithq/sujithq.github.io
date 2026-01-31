---
title: "k8s: New Conversion from cgroup v1 CPU Shares to v2 CPU Weight"
date: 2026-01-30T16:00:00.000Z
slug: new-conversion-from-cgroup-v1-cpu-shares-to-v2-cpu-weight
update_categories: ["k8s"]
update_tags: ["cgroup-v2", "cpu", "conversion", "kubernetes", "OCI", "runc", "crun", "resource-management", "node-SIG", "compatibility"]
update_bullets: ["Background: cgroup v1 used cpu.shares (range 2..262144) and cgroup v2 uses cpu.weight (range 1..10000); KEP-2254 previously used a linear conversion.", "Problems with previous linear formula: 1) 1 CPU (1024m) mapped to ≈39 weight (much lower than cgroup v2 default 100), reducing Kubernetes workload priority versus non-Kubernetes processes; 2) very low weights for small requests (e.g., 100m → 4) hurt sub-cgroup granularity.", "New formula (quadratic/exponential): cpu.weight = ceil(10^{(L^2/612 + 125L/612 - 7/34)}), where L = log2(cpu.shares). It was designed to pass through (2→1), (1024→100), (262144→10000).", "Practical examples with the new formula: 1 CPU (1024m) → cpu.weight = 102 (close to v2 default 100); 100m → cpu.weight = 17 (much better granularity).", "Behavior: The function is 'close to linear' in the central range but deliberately adjusted so key points align, improving priority alignment and sub-cgroup distribution ability.", "Implementation and adoption: Change implemented at the OCI runtime layer (not in Kubernetes core); runc enables it from v1.3.2 and crun from v1.23.", "Impact on deployments: Tools or scripts that compute expected cpu.weight from the old formula may break or report different values; update monitoring, custom resource managers, or any code that assumes the prior mapping.", "Recommendation: Test the new conversion in non-production environments before upgrading OCI runtimes to avoid surprises with resource accounting or automated checks.", "References and next steps: See KEP-2254, Kubernetes cgroup docs, and GitHub issue #131216 for technical discussion, examples, and rationale; consider joining the Kubernetes Node SIG to contribute."]
timeframes: ["2026-01"]
link: "https://kubernetes.io/blog/2026/01/30/new-cgroup-v1-to-v2-cpu-conversion-formula/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-01"
id: "8195A7F7F72F3F64952E61275CDBB862E332D74B561288155E5A226AE016090E"
contentHash: "A3F4E2B0459AC11AE153031694CD9F75A557612C3BAC4E7017BA287C26051515"
draft: false
type: "updates2"
llmSummary: "An improved, non-linear conversion from cgroup v1 CPU shares to cgroup v2 CPU weight replaces the previous linear formula to restore intended priority relationships and improve granularity for small CPU requests. The change is implemented in OCI runtimes (runc >=1.3.2, crun >=1.23) and may require updates to tooling that assumed the old mapping."
---

An improved, non-linear conversion from cgroup v1 CPU shares to cgroup v2 CPU weight replaces the previous linear formula to restore intended priority relationships and improve granularity for small CPU requests. The change is implemented in OCI runtimes (runc >=1.3.2, crun >=1.23) and may require updates to tooling that assumed the old mapping.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/01/30/new-cgroup-v1-to-v2-cpu-conversion-formula/)
