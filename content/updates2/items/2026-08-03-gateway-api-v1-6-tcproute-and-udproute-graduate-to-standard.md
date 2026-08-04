---
title: "k8s: Gateway API v1.6: TCPRoute and UDPRoute Graduate to Standard"
date: 2026-08-03T16:00:00.000Z
slug: gateway-api-v1-6-tcproute-and-udproute-graduate-to-standard
update_categories: ["k8s"]
update_tags: ["Kubernetes", "Gateway API", "Networking", "TCPRoute", "UDPRoute", "XBackend", "API graduation", "v1.6.0"]
update_bullets: ["TCPRoute and UDPRoute graduated from Experimental to Standard and now use the v1 API; the older v1alpha2 versions are deprecated and will be removed in a future release.", "TCPRoute and UDPRoute attach to Gateway listeners that match the protocol and port, and forward traffic to backend services without L7 inspection.", "Experimental resources now live in the separate gateway.networking.x-k8s.io API group, with kinds named with an X prefix such as XBackend.", "When an experimental resource graduates, it moves back to gateway.networking.k8s.io and drops the X prefix.", "A new experimental XBackend resource was introduced as a backend decorator for Service and other backend types.", "XBackend v1alpha1 currently supports ExternalHostname destinations as an extended/optional feature, aimed at egress use cases.", "The release notes mention future work to move session persistence, retries, TLS origination, and similar per-application config into XBackend.", "The article lists several implementations that were conformance-tested for v1.6, including Agentgateway, Airlock Microgateway, GKE Gateway, kgateway, NGINX Gateway Fabric, and Traefik Proxy."]
timeframes: ["2026-08"]
link: "https://kubernetes.io/blog/2026/08/03/gateway-api-v1-6-release/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-08"
id: "DC8DB7088C05C1D6246F87513331C10F7EF57A1F2B791EC14A76FAD18369F1CB"
contentHash: "C94E8AD8246035D0B16ABD6F32B3A6A10E6BA28BE902D84185F7920B53B4DA7A"
draft: false
type: "updates2"
llmSummary: "Gateway API v1.6.0 promotes TCPRoute and UDPRoute to Standard/v1, adding GA-level raw TCP and UDP routing. It also moves experimental APIs into a separate gateway.networking.x-k8s.io group with X-prefixed kinds to make the experimental boundary explicit."
---

Gateway API v1.6.0 promotes TCPRoute and UDPRoute to Standard/v1, adding GA-level raw TCP and UDP routing. It also moves experimental APIs into a separate gateway.networking.x-k8s.io group with X-prefixed kinds to make the experimental boundary explicit.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/08/03/gateway-api-v1-6-release/)
