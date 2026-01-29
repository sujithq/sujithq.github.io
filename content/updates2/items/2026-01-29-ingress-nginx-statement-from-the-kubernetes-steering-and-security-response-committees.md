---
title: "k8s: Ingress NGINX: Statement from the Kubernetes Steering and Security Response Committees"
date: 2026-01-29T00:00:00.000Z
slug: ingress-nginx-statement-from-the-kubernetes-steering-and-security-response-committees
update_categories: ["k8s"]
update_tags: ["Ingress NGINX", "retirement", "security", "migration", "Gateway API", "Kubernetes", "action-required", "Jan2026"]
update_bullets: ["Retirement date: March 2026 — no more releases, bug fixes, or security patches after retirement.", "Impact: ~50% of cloud-native environments rely on Ingress NGINX; remaining on it after retirement leaves users vulnerable.", "Reason: chronic lack of contributors/maintainers and accumulated technical debt made continued secure maintenance infeasible.", "Immediate check (requires cluster-admin permissions): kubectl get pods --all-namespaces --selector app.kubernetes.io/name=ingress-nginx", "Alternatives: plan migration to Gateway API or a third‑party Ingress controller — none are guaranteed drop‑in replacements and will need engineering effort.", "Action items: check all clusters now, inventory affected workloads, prioritize high-risk/externally exposed clusters, and begin migration planning and testing immediately.", "Short-term mitigations while migrating: reduce external exposure, tighten RBAC and network policies, increase monitoring and logging, and limit use of untrusted ingress features."]
timeframes: ["2026-01"]
link: "https://kubernetes.io/blog/2026/01/29/ingress-nginx-statement/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-01"
id: "8C27AE014CAA61ACFC673F759000939C7A32A1EF19330DA6BF07DD8C05082881"
contentHash: "B1B1B8945127AC72DD4CBFFAEE63CF7C8B520FCBCA9BCD0C2FC1B9BB1517B5D3"
draft: false
type: "updates2"
llmSummary: "Kubernetes Steering and Security Response Committees announced Ingress NGINX will be retired in March 2026. There will be no further releases, bug fixes, or security patches. Roughly 50% of cloud-native environments rely on it, so many clusters are at risk unless teams check and migrate; alternatives (Gateway API or third‑party Ingress controllers) are not direct drop‑in replacements and require planning and engineering time. There are about two months to prepare."
---

Kubernetes Steering and Security Response Committees announced Ingress NGINX will be retired in March 2026. There will be no further releases, bug fixes, or security patches. Roughly 50% of cloud-native environments rely on it, so many clusters are at risk unless teams check and migrate; alternatives (Gateway API or third‑party Ingress controllers) are not direct drop‑in replacements and require planning and engineering time. There are about two months to prepare.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/01/29/ingress-nginx-statement/)
