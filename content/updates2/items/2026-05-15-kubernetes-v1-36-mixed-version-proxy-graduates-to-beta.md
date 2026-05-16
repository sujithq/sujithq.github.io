---
title: "k8s: Kubernetes v1.36: Mixed Version Proxy Graduates to Beta"
date: 2026-05-15T18:00:00.000Z
slug: kubernetes-v1-36-mixed-version-proxy-graduates-to-beta
update_categories: ["k8s"]
update_tags: ["kubernetes", "release-notes", "api-server", "beta", "mixed-version-proxy", "discovery", "upgrade-safety"]
update_bullets: ["Addresses incorrect 404s during mixed-version control-plane upgrades by proxying requests to a peer API server that can serve the resource.", "Replaces StorageVersion-based peer lookup with Aggregated Discovery; this matters because StorageVersion does not support CRDs and aggregated APIs.", "Adds peer-aggregated discovery so discovery responses merge local and peer API data into a unified view across active API servers.", "A non-aggregated discovery view is available with `profile=nopeer` in the discovery `Accept` header.", "`--peer-ca-file` is required for secure peer communication; without it, TLS verification fails and proxying does not work.", "`--peer-advertise-ip` and `--peer-advertise-port` can be set to control how peers reach the API server; otherwise bind/advertise settings are used.", "With kubeadm, the required peer CA path can be set in `ClusterConfiguration.apiServer.extraArgs`.", "The article recommends verifying API server flags and testing the feature before upgrading to 1.36."]
timeframes: ["2026-05"]
link: "https://kubernetes.io/blog/2026/05/15/kubernetes-1-36-feature-mixed-version-proxy-beta/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-05"
id: "08F9B1B4542E1E2823B72C9E6E54D120A9C0346C36F97D15637A557EF575AAAA"
contentHash: "E377C4F6DE3CE6B0122FA2043554DDCDDB2B0CA7700B30DDCB43880C9368FA97"
draft: false
type: "updates2"
llmSummary: "Kubernetes 1.36 graduates the Mixed Version Proxy (feature gate `UnknownVersionInteroperabilityProxy`) to Beta and enables it by default. The feature now uses Aggregated Discovery, adds peer-aggregated discovery for unified API listings across control-plane nodes, and requires `--peer-ca-file` plus peer advertise settings for secure API server-to-server proxying."
---

Kubernetes 1.36 graduates the Mixed Version Proxy (feature gate `UnknownVersionInteroperabilityProxy`) to Beta and enables it by default. The feature now uses Aggregated Discovery, adds peer-aggregated discovery for unified API listings across control-plane nodes, and requires `--peer-ca-file` plus peer advertise settings for secure API server-to-server proxying.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/05/15/kubernetes-1-36-feature-mixed-version-proxy-beta/)
