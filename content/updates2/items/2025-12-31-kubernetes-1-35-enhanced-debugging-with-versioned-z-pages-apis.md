---
title: "k8s: Kubernetes 1.35: Enhanced Debugging with Versioned z-pages APIs"
date: 2025-12-31T18:30:00.000Z
slug: kubernetes-1-35-enhanced-debugging-with-versioned-z-pages-apis
update_categories: ["k8s"]
update_tags: ["kubernetes", "z-pages", "debugging", "observability", "v1.35", "feature-gates", "security", "api-versioning"]
update_bullets: ["/statusz and /flagz now support versioned JSON outputs (apiVersion config.k8s.io/v1alpha1, kinds Statusz and Flagz) when requested via Accept headers.", "Plain text output is unchanged and returned by default unless the Accept header requests JSON (backward compatible, opt-in).", "Example Accept header formats: \"application/json;v=v1alpha1;g=config.k8s.io;as=Statusz\" and similarly for Flagz.", "Sample structured fields: startTime, uptimeSeconds, goVersion, binaryVersion, emulationVersion, paths (for Statusz); flags map (for Flagz).", "Feature gates required: ComponentStatusz for /statusz and ComponentFlagz for /flagz.", "Authentication and authorization: access restricted to system:monitoring group; use client certs or cluster auth as configured (RBAC applies).", "Security: outputs expose component versions and flags (with confidential values redacted); limit access to trusted operators and tools.", "Alpha status caveats: schema may change, not recommended for critical monitoring until beta/stable; intended for debugging.", "Use cases: programmatic health checks, configuration drift detection, building richer debugging/diagnostic tooling, easier diffs/validation of flags.", "How-to: curl with client certs and the Accept header to retrieve JSON, or use jq to parse; examples provided in the article.", "Future plans: move from v1alpha1 to v1beta1 and v1, gather community feedback, and potentially add more z-page endpoints."]
timeframes: ["2025-12"]
link: "https://kubernetes.io/blog/2025/12/31/kubernetes-v1-35-structured-zpages/"
source: "Kubernetes Official Blog"
timeframeKey: "2025-12"
id: "92C3A724A680BD5A400DBF0B93DFD5D29BFEB7EFC1E934B09726123357ED6F34"
contentHash: "667A141B32CB033E1E76ECAEE598D93B6278504747631B97F581450B0D0A1223"
draft: false
type: "updates2"
llmSummary: "Kubernetes 1.35 adds opt-in, versioned, machine-parseable JSON responses for the existing /statusz and /flagz z-pages used by control plane components. The endpoints remain backward compatible (plain text by default); consumers request structured output by sending an Accept header with a versioned media type. Structured responses enable easier automation for health checks, config validation, and debugging tools. The feature is alpha, requires feature gates and proper RBAC/authentication, and is intended for debugging rather than production-critical automation."
---

Kubernetes 1.35 adds opt-in, versioned, machine-parseable JSON responses for the existing /statusz and /flagz z-pages used by control plane components. The endpoints remain backward compatible (plain text by default); consumers request structured output by sending an Accept header with a versioned media type. Structured responses enable easier automation for health checks, config validation, and debugging tools. The feature is alpha, requires feature gates and proper RBAC/authentication, and is intended for debugging rather than production-critical automation.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2025/12/31/kubernetes-v1-35-structured-zpages/)
