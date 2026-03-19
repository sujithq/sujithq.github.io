---
title: "k8s: The Invisible Rewrite: Modernizing the Kubernetes Image Promoter"
date: 2026-03-17T00:00:00.000Z
slug: the-invisible-rewrite-modernizing-the-kubernetes-image-promoter
update_categories: ["k8s"]
update_tags: ["kubernetes", "kpromo", "promo-tools", "release-engineering", "rewrite", "performance", "reliability", "supply-chain", "slsa", "cosign", "sbom"]
update_bullets: ["Rewrote the promotion pipeline in phases: Setup, Plan, Provenance, Validate, Promote, Sign, and Attest.", "Split signing from signature replication; replication now runs as a separate periodic Prow job.", "Added SLSA provenance verification and generation by default in v4.4.0.", "Added vulnerability scanning, SBOM handling, and a dedicated in-toto predicate for promotion records.", "Deleted the old monolithic pipeline and legacy dependencies; net codebase reduction was about 20%.", "Parallelized registry reads, reducing the plan phase from about 20 minutes to about 2 minutes.", "Changed tag and signature lookup logic to skip unsigned images and reduce API calls roughly in half.", "In steady state, source-checking before replication reduced signature replication work from about 17 hours to about 15 minutes.", "Added retry logic, per-request timeouts, and HTTP connection reuse to reduce hangs and rate-limit failures.", "Shipped three releases during the rewrite: v4.2.0, v4.3.0, and v4.4.0.", "Two regressions were caught in production and fixed quickly: a registry key mismatch and a default thread count of zero.", "No user-facing CLI or manifest changes were required; existing workflows continued to work."]
timeframes: ["2026-03"]
link: "https://kubernetes.io/blog/2026/03/17/image-promoter-rewrite/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-03"
id: "215259292AC349B2D6F99F514FF49D2C15452D368D9C81F7DA55C83809F2FB6E"
contentHash: "B73628C19E321E85CC311264AE6E1FF514445F56061CF78DBFED5309F1E910C4"
draft: false
type: "updates2"
llmSummary: "Kubernetes rewrote the core of its image promoter (kpromo/promo-tools), removing legacy code and splitting promotion into distinct phases. The new pipeline improved performance and reliability, shipped in v4.2.0–v4.4.0, and kept user-facing flags and manifests unchanged."
---

Kubernetes rewrote the core of its image promoter (kpromo/promo-tools), removing legacy code and splitting promotion into distinct phases. The new pipeline improved performance and reliability, shipped in v4.2.0–v4.4.0, and kept user-facing flags and manifests unchanged.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/03/17/image-promoter-rewrite/)
