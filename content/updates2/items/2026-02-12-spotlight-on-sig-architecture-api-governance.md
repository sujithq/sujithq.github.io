---
title: "k8s: Spotlight on SIG Architecture: API Governance"
date: 2026-02-12T00:00:00.000Z
slug: spotlight-on-sig-architecture-api-governance
update_categories: ["k8s"]
update_tags: ["kubernetes", "sig-architecture", "api-governance", "api-review", "compatibility", "crd", "validation", "kep", "release-process"]
update_bullets: ["API Governance covers more than the Kubernetes REST API: also CLI flags, config files, component invocation, component-to-component protocols (e.g., container runtime), and persisted data formats.", "Quality gates include published conventions/guidelines (updated as new scenarios arise), plus human API review at design time (often via detailed KEPs) or later during implementation if design details are deferred.", "Automated linters/checks reinforce conventions (e.g., spec/status semantics) and catch issues missed in manual review.", "CustomResourceDefinitions (CRDs) were a major inflection point: early CRDs allowed arbitrary APIs (initially without schema), later requiring schemas at GA; recent releases brought GA “built-in validation rules” for CRDs, along with work on backward compatibility, pre-existing invalid data, and “ratcheting validation” to improve validity without breaking existing objects.", "Relationship to other groups: API Machinery provides API-building primitives and code; SIG Architecture sets system direction; API Governance collaborates with other SIGs to ensure consistent patterns and use of API Machinery.", "Workload timing: more design review activity before enhancements freeze and more implementation review before code freeze, but review is continuous because initiatives span multiple releases.", "Contributor onboarding advice: follow a small API change end-to-end (design, implementation, review), join live/high-bandwidth reviews, then progress to larger changes/new APIs.", "Core principle emphasized: prioritize compatibility and stability for users, designing APIs with future evolution and the likelihood of mistakes in mind."]
timeframes: ["2026-02"]
link: "https://kubernetes.io/blog/2026/02/12/sig-architecture-api-spotlight/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-02"
id: "A953C9BDE0B472A0678D3E2F694EE0768DFEE515C8E6AFEBC69E97FFBE2140EA"
contentHash: "94607F359CCED23D8D2090DB2185771AD1B8B3A167D874F9E22FA3CAC4AAA8BD"
draft: false
type: "updates2"
llmSummary: "Interview with Jordan Liggitt describing SIG Architecture’s API Governance subproject: it defines and enforces conventions across Kubernetes API surfaces to balance stability/compatibility with ongoing evolution."
---

Interview with Jordan Liggitt describing SIG Architecture’s API Governance subproject: it defines and enforces conventions across Kubernetes API surfaces to balance stability/compatibility with ongoing evolution.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/02/12/sig-architecture-api-spotlight/)
