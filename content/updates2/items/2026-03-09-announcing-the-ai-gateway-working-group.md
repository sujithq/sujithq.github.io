---
title: "k8s: Announcing the AI Gateway Working Group"
date: 2026-03-09T18:00:00.000Z
slug: announcing-the-ai-gateway-working-group
update_categories: ["k8s"]
update_tags: ["kubernetes", "working-group", "gateway-api", "networking", "ai-infrastructure", "standards", "payload-processing", "egress-gateway", "security", "rate-limiting", "access-control"]
update_bullets: ["Defines “AI Gateway” as gateway infrastructure (proxies/load balancers, etc.) implementing Gateway API plus AI-focused capabilities such as token-based rate limiting, fine-grained inference access control, payload inspection for routing/caching/guardrails, and AI-specific protocols/routing patterns.", "WG mission: develop proposals for Kubernetes SIGs/subprojects; create declarative APIs/standards/guidance for AI workload networking; ensure extensible, composable, ordered processing for AI gateway extensions; build on existing networking standards.", "Active proposal: Payload Processing—standardize declarative configuration for inspecting/transforming full HTTP request/response payloads, ordered processing pipelines, and failure modes; targets prompt-injection defenses, content filtering, anomaly/signature detection, semantic routing, caching, and RAG integration.", "Active proposal: Egress Gateways—standardize secure routing to external AI services (e.g., OpenAI, Vertex AI, Bedrock) including managed auth/token injection, regional compliance/failover, external backend resource definitions (FQDNs), TLS policy/CA control, and cross-cluster routing.", "User stories include managed access to external AI services, multi-provider inference failover, enforcing regional restrictions, and centralizing AI workloads on dedicated clusters.", "Plans a KubeCon + CloudNativeCon Europe 2026 session covering WG proposals and intersections with MCP and agent networking patterns.", "Participation: GitHub repo/charter, weekly meetings (Thu 2PM EST), Slack #wg-ai-gateway, and mailing list; working with SIG Network on Gateway API enhancements."]
timeframes: ["2026-03"]
link: "https://kubernetes.io/blog/2026/03/09/announcing-ai-gateway-wg/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-03"
id: "85567876CE2D010CBA3291E4DBD0ECB9E7EA71EA14E75B4854F36601E9F17B4E"
contentHash: "6098D48EE52FD30221722CCB0FEBFE310977678EB36424B5850600CB2C4E7F26"
draft: false
type: "updates2"
llmSummary: "Kubernetes has formed a new AI Gateway Working Group to define standards and best practices for Gateway API-based networking infrastructure tailored to AI workloads."
---

Kubernetes has formed a new AI Gateway Working Group to define standards and best practices for Gateway API-based networking infrastructure tailored to AI workloads.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/03/09/announcing-ai-gateway-wg/)
