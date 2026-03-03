---
title: "k8s: Before You Migrate: Five Surprising Ingress-NGINX Behaviors You Need to Know"
date: 2026-02-27T15:30:00.000Z
slug: before-you-migrate-five-surprising-ingress-nginx-behaviors-you-need-to-know
update_categories: ["k8s"]
update_tags: ["kubernetes", "ingress-nginx", "gateway-api", "migration", "routing", "regex", "rewrites", "redirects", "url-normalization", "gateway-api-1.5"]
update_bullets: ["Ingress-NGINX regex path matching is prefix-based and case-insensitive; many Gateway API implementations’ RegularExpression matching is full and case-sensitive unless configured otherwise (e.g., use (?i) or broaden patterns).", "nginx.ingress.kubernetes.io/use-regex applies per-host across all Ingress-NGINX Ingress resources: if any Ingress for a host enables regex, other paths for that host may be interpreted as regex too (including Exact paths).", "nginx.ingress.kubernetes.io/rewrite-target implicitly enables regex behavior for all paths on the same host, even without use-regex, so typos/case differences can still match and rewrite unexpectedly.", "Ingress-NGINX redirects missing-trailing-slash requests (e.g., /my-path -> /my-path/) with 301 for Exact/Prefix paths; Gateway API requires an explicit RequestRedirect filter to preserve this.", "Ingress-NGINX normalizes URLs (e.g., collapses //, removes ./ and resolves ../) before matching; Gateway API behavior is implementation-dependent though common Envoy-based gateways normalize dot segments by default.", "Mentions SIG Network work on Ingress2Gateway to translate common Ingress-NGINX annotations/behaviors, and notes Gateway API v1.5 release (2026-02-27) graduating ListenerSet and an HTTPRoute CORS filter."]
timeframes: ["2026-02"]
link: "https://kubernetes.io/blog/2026/02/27/ingress-nginx-before-you-migrate/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-02"
id: "9429EA1B3C8DBF9A6E1618EFBB7FE031B960C867AD825741858FD326ECBE6394"
contentHash: "E6A4687D10299600C77F0DD456716FB73B2FE18D34636AA0DAD9BA4C6F02D7E4"
draft: false
type: "updates2"
llmSummary: "Kubernetes will retire the community Ingress-NGINX controller in March 2026; this post lists five non-obvious routing/rewriting/redirect behaviors that can cause outages when translating to Gateway API unless explicitly replicated."
---

Kubernetes will retire the community Ingress-NGINX controller in March 2026; this post lists five non-obvious routing/rewriting/redirect behaviors that can cause outages when translating to Gateway API unless explicitly replicated.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/02/27/ingress-nginx-before-you-migrate/)
