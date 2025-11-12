---
title: "k8s: Ingress NGINX Retirement: What You Need to Know"
date: 2025-11-11T18:30:00.000Z
slug: ingress-nginx-retirement-what-you-need-to-know
update_categories: ["k8s"]
update_tags: ["kubernetes", "ingress-nginx", "retirement", "gateway-api", "migration", "security", "SIG-Network", "security-response-committee"]
update_bullets: ["Retirement announced due to insufficient maintainership and accumulating security/technical debt.", "Best-effort maintenance continues until March 2026; maintenance and security fixes stop after that date.", "GitHub repositories will be made read-only and left available for reference; Helm charts and container images remain accessible.", "Existing Ingress NGINX deployments will continue to function but will receive no future updates.", "Recommended action: begin migrating now to Gateway API (preferred) or another supported Ingress controller listed in Kubernetes documentation.", "InGate (planned replacement) is also being retired — it never reached maturity.", "Quick check for usage: kubectl get pods --all-namespaces --selector app.kubernetes.io/name=ingress-nginx (requires cluster-admin permissions).", "Reasoning: historical flexibility (e.g., arbitrary NGINX snippets) created security risks and unmanageable technical debt; maintainers were few and unpaid."]
timeframes: ["2025-11"]
link: "https://kubernetes.io/blog/2025/11/11/ingress-nginx-retirement/"
source: "Kubernetes Official Blog"
timeframeKey: "2025-11"
id: "9E628B7406BC983CD1F81ADE81BCC59D02B716C3CE50D7442733EF37791D975C"
contentHash: "116B0BF785E95E927CAD776AFDCFE4F29255787AAD710D9D17D339981DEAC006"
draft: false
type: "updates2"
llmSummary: "Kubernetes SIG Network and the Security Response Committee announced the retirement of Ingress NGINX. Best-effort maintenance will continue until March 2026; after that there will be no further releases, bug fixes, or security updates. Users are advised to migrate to Gateway API or another Ingress controller."
---

Kubernetes SIG Network and the Security Response Committee announced the retirement of Ingress NGINX. Best-effort maintenance will continue until March 2026; after that there will be no further releases, bug fixes, or security updates. Users are advised to migrate to Gateway API or another Ingress controller.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2025/11/11/ingress-nginx-retirement/)
