---
title: "k8s: Kubernetes v1.36: Declarative Validation Graduates to GA"
date: 2026-05-05T18:35:00.000Z
slug: kubernetes-v1-36-declarative-validation-graduates-to-ga
update_categories: ["k8s"]
update_tags: ["kubernetes", "release-notes", "validation", "ga", "api-machinery", "code-generation", "openapi", "kubebuilder"]
update_bullets: ["Declarative Validation for Kubernetes native types is now General Availability in v1.36.", "`DeclarativeValidation` feature gate is enabled by default.", "Validation rules are now defined in `types.go` using `+k8s:` marker tags instead of handwritten Go validation code.", "`validation-gen` parses markers and generates Go validation functions registered with the API scheme.", "The post cites roughly 18,000 lines of handwritten validation code as technical debt being replaced.", "Supported markers include presence, bounds, format, collection, union, and immutability constraints.", "Validation ratcheting is now built into the framework: unchanged fields can bypass newly tightened validation rules during updates.", "`kube-api-linter` can statically analyze marker-based API types to enforce API conventions.", "The project plans to keep migrating legacy handwritten validation and require declarative validation for new APIs and new fields.", "Structured validation markers are intended to enable future OpenAPI publication and better client-side and ecosystem tooling, including Kubebuilder."]
timeframes: ["2026-05"]
link: "https://kubernetes.io/blog/2026/05/05/kubernetes-v1-36-declarative-validation-ga/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-05"
id: "720014107D4BB7E66FF803B543290949FD748736DEDE54166E6409C4FE7CB8EF"
contentHash: "BE8E0E4A7BFDDDC56804A0FA552440866B2BD1CEACA28A4262FA2E55B7EDCDE6"
draft: false
type: "updates2"
llmSummary: "Kubernetes v1.36 moves Declarative Validation for native types to GA and makes the DeclarativeValidation feature gate enabled by default. The framework replaces handwritten validation with `+k8s:` markers and `validation-gen`, improving consistency, maintainability, ratcheting behavior, and future OpenAPI/tooling integration."
---

Kubernetes v1.36 moves Declarative Validation for native types to GA and makes the DeclarativeValidation feature gate enabled by default. The framework replaces handwritten validation with `+k8s:` markers and `validation-gen`, improving consistency, maintainability, ratcheting behavior, and future OpenAPI/tooling integration.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/05/05/kubernetes-v1-36-declarative-validation-ga/)
