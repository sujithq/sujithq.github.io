---
title: "k8s: How to Pretty-Print Your Kubernetes YAML as KYAML and Why You'd Want To"
date: 2026-08-11T18:00:00.000Z
slug: how-to-pretty-print-your-kubernetes-yaml-as-kyaml-and-why-you-d-want-to
update_categories: ["k8s"]
update_tags: ["Kubernetes", "YAML", "KYAML", "kubectl", "yamlfmt", "CLI", "config formatting"]
update_bullets: ["KYAML is a stricter YAML dialect proposed in KEP 5295; it does not add a new configuration format or parser.", "It avoids YAML issues by not relying on indentation for structure and by always quoting string values.", "KYAML always uses {} for maps and [] for lists, and allows comments and trailing commas.", "The format includes a --- header to distinguish it from JSON.", "kubectl supports `-o kyaml` starting in Kubernetes 1.34 (alpha, opt-in) and 1.35+ (beta, enabled by default but still requires the flag).", "`kubectl kuberc` can set KYAML as the default output for commands such as `get` in Kubernetes 1.36+; older versions use `kubectl alpha kuberc`.", "The `sigs.k8s.io/yaml/yamlfmt` tool can convert manifests to KYAML with `-o=kyaml` and can print diffs with `-d`.", "Google's `yamlfmt` added a `kyaml` formatter in v0.21.0; it can format files or directories and supports dry-run mode.", "Valid KYAML is still valid YAML, so existing tools and pipelines can consume it without changes.", "The article recommends KYAML as a consistency and safety choice rather than a required migration."]
timeframes: ["2026-08"]
link: "https://kubernetes.io/blog/2026/08/11/how-to-pretty-print-kubernetes-yaml-as-kyaml/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-08"
id: "1AA805D33830D62F15A7F28B0130ECB2357C1C0561A604EF705EDDEA3D0D5B3E"
contentHash: "0359784EA42EFF7E6A56A72514395FC8174EC86A301776050A64A8D527FAB523"
draft: false
type: "updates2"
llmSummary: "Kubernetes introduced KYAML, a strict YAML subset that uses explicit braces, brackets, quotes, and trailing commas to avoid common YAML pitfalls like indentation errors and silent type coercion. The post explains how to output or format manifests as KYAML with kubectl and yamlfmt, and notes that KYAML remains valid YAML with no new parser required."
---

Kubernetes introduced KYAML, a strict YAML subset that uses explicit braces, brackets, quotes, and trailing commas to avoid common YAML pitfalls like indentation errors and silent type coercion. The post explains how to output or format manifests as KYAML with kubectl and yamlfmt, and notes that KYAML remains valid YAML with no new parser required.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/08/11/how-to-pretty-print-kubernetes-yaml-as-kyaml/)
