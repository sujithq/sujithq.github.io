---
title: "k8s: Gateway API v1.5: Moving features to Stable"
date: 2026-04-21T16:30:00.000Z
slug: gateway-api-v1-5-moving-features-to-stable
update_categories: ["k8s"]
update_tags: ["kubernetes", "gateway-api", "release-notes", "stable", "ga", "tls", "cors", "mtls", "referencegrant"]
update_bullets: ["Promoted to Standard: ListenerSet, TLSRoute, HTTPRoute CORS filter, client certificate validation (frontend mTLS), certificate selection for Gateway TLS origination, and ReferenceGrant.", "ListenerSet lets listeners be defined separately from the Gateway and merged in, which helps multi-tenant setups and supports more than 64 listeners on a shared Gateway.", "TLSRoute now supports SNI-based routing for both Passthrough and Terminate TLS listener modes; existing Experimental TLSRoutes from v1.4 or earlier may need migration to v1.", "HTTPRoute gains CORS configuration with options including allowed origins, methods, headers, exposed headers, credentials, and maxAge.", "Gateway frontend client certificate validation adds mTLS checks via CA bundle references, with default and per-port configuration and an insecure fallback mode.", "Gateway TLS origination can now select a client certificate for upstream mTLS using tls.backend.clientCertificateRef.", "ReferenceGrant is promoted to v1 and treated as GA with no expected breaking changes.", "The release process now uses a release train model; documentation must be ready before a feature ships.", "Gateway API v1.5 requires Kubernetes 1.30+ and is reported as conformant with seven implementations at release time."]
timeframes: ["2026-04"]
link: "https://kubernetes.io/blog/2026/04/21/gateway-api-v1-5/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-04"
id: "C4F0A3FD9363E3ED5A2425803E579F7BCC463603D6930FAF015E5FA9DD236BC4"
contentHash: "63C2C3D51C1CD12FA6256F58DFCD7CA65895F2D6249637D1FD30A8755743A1D9"
draft: false
type: "updates2"
llmSummary: "Gateway API v1.5 promotes six features to the Standard channel and updates the release process to a release train model with feature freeze dates. It also includes a v1 bump for ReferenceGrant, plus notes on migration and compatibility for existing Experimental TLSRoute resources."
---

Gateway API v1.5 promotes six features to the Standard channel and updates the release process to a release train model with feature freeze dates. It also includes a v1 bump for ReferenceGrant, plus notes on migration and compatibility for existing Experimental TLSRoute resources.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/04/21/gateway-api-v1-5/)
