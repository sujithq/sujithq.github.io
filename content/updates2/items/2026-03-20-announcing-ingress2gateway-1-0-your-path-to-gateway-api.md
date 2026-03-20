---
title: "k8s: Announcing Ingress2Gateway 1.0: Your Path to Gateway API"
date: 2026-03-20T19:00:00.000Z
slug: announcing-ingress2gateway-1-0-your-path-to-gateway-api
update_categories: ["k8s"]
update_tags: ["kubernetes", "gateway-api", "ingress", "migration", "release-notes", "sig-network"]
update_bullets: ["Expanded Ingress-NGINX support from 3 annotations to over 30 common annotations, including CORS, backend TLS, regex matching, and path rewrite.", "Added controller-level integration tests that compare live Ingress-NGINX behavior with generated Gateway API resources in real clusters.", "Improved notification and error messages to make unsupported annotations and translation gaps clearer.", "Ingress2Gateway remains a migration assistant, not a one-step replacement; users are expected to review output and warnings manually.", "Example translation shows a typical Ingress with TLS, regex paths, CORS, timeouts, and HTTP-to-HTTPS redirect being converted into Gateway and HTTPRoute resources.", "Some settings do not translate directly, including configuration-snippet, proxy-body-size, and exact ingress-nginx timeout/body-size semantics.", "Regex path handling may be translated as case-insensitive and prefix-matched unless adjusted manually.", "The tool can emit implementation-specific extensions via --emitter for agentgateway, envoy-gateway, or kgateway.", "Recommended migration flow: generate manifests, review warnings, test in a development cluster, deploy alongside existing Ingress, shift traffic gradually, then remove the old Ingress controller."]
timeframes: ["2026-03"]
link: "https://kubernetes.io/blog/2026/03/20/ingress2gateway-1-0-release/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-03"
id: "C6B1652AF2E2F1112451E7DED909B4B18D92F4CD2297BBDC9883B05AE5BE0EAF"
contentHash: "218E2D86DECF9E05FB39C342A9BAF0226FD24266EFC375F38D5FF06E9F308964"
draft: false
type: "updates2"
llmSummary: "Ingress2Gateway 1.0 is a stable migration assistant for moving from Ingress to Gateway API, with expanded Ingress-NGINX annotation support and more detailed warnings for unsupported or lossy translations. The release emphasizes controller-level integration tests and safer migration workflows, including manual review, validation in a dev cluster, and gradual traffic shifting."
---

Ingress2Gateway 1.0 is a stable migration assistant for moving from Ingress to Gateway API, with expanded Ingress-NGINX annotation support and more detailed warnings for unsupported or lossy translations. The release emphasizes controller-level integration tests and safer migration workflows, including manual review, validation in a dev cluster, and gradual traffic shifting.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/03/20/ingress2gateway-1-0-release/)
