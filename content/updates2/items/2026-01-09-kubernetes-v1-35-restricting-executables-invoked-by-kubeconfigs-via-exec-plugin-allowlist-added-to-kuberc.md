---
title: "k8s: Kubernetes v1.35: Restricting executables invoked by kubeconfigs via exec plugin allowList added to kuberc"
date: 2026-01-09T18:30:00.000Z
slug: kubernetes-v1-35-restricting-executables-invoked-by-kubeconfigs-via-exec-plugin-allowlist-added-to-kuberc
update_categories: ["k8s"]
update_tags: ["kubernetes", "v1.35", "kubectl", "kubeconfig", "credential-plugin", "allowlist", "security", "SIG-Auth", "SIG-CLI", "client-go"]
update_bullets: ["kubectl can run arbitrary executables specified in kubeconfig users[].exec.command, which poses a supply-chain and local-security risk.", "Kubernetes v1.35 adds a beta credential plugin policy and allowlist to limit which exec plugins kubectl will execute.", "Policy options: AllowAll (default), DenyAll (blocks all exec plugins and helps discover usage), and Allowlist (explicit whitelist).", "kuberc fields: credentialPluginPolicy and credentialPluginAllowlist (list of entries with name as full path or basename).", "Basename entries are resolved with exec.LookPath; globbing/wildcards are not supported; full paths are preferred for narrower scope.", "Available to all client-go users via ExecProvider.PluginPolicy; kubectl users can manage it without code changes.", "Planned enhancements include checksum verification and signed-binary requirements; SIG-Auth and SIG-CLI welcome feedback and contributions."]
timeframes: ["2026-01"]
link: "https://kubernetes.io/blog/2026/01/09/kubernetes-v1-35-kuberc-credential-plugin-allowlist/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-01"
id: "136C10E4BFCA7832053D6914B4A11FBB7977A38710B3272ECAA71865E74401C1"
contentHash: "BC7AC5360AEED8AC2401EB12896E631FC3E6FED9765234C2391941319E55E8DA"
draft: false
type: "updates2"
llmSummary: "Kubernetes v1.35 introduces a beta credential plugin policy and allowlist to give users control over executables invoked by kubeconfig exec plugins. You can set policy via the client-go ExecProvider.PluginPolicy or by configuring kubectl's kuberc with credentialPluginPolicy (AllowAll, DenyAll, Allowlist) and credentialPluginAllowlist entries to restrict which plugins may run."
---

Kubernetes v1.35 introduces a beta credential plugin policy and allowlist to give users control over executables invoked by kubeconfig exec plugins. You can set policy via the client-go ExecProvider.PluginPolicy or by configuring kubectl's kuberc with credentialPluginPolicy (AllowAll, DenyAll, Allowlist) and credentialPluginAllowlist entries to restrict which plugins may run.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/01/09/kubernetes-v1-35-kuberc-credential-plugin-allowlist/)
