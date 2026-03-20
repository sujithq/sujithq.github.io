---
title: "k8s: Running Agents on Kubernetes with Agent Sandbox"
date: 2026-03-20T18:00:00.000Z
slug: running-agents-on-kubernetes-with-agent-sandbox
update_categories: ["k8s"]
update_tags: ["kubernetes", "ai", "agents", "sig-apps", "sandbox", "crd", "extensions", "gvisor", "kata-containers"]
update_bullets: ["Introduces Agent Sandbox as a declarative abstraction for long-running AI agents on Kubernetes.", "Core Sandbox CRD provides a single-container isolated environment for agent runtimes.", "Supports stronger isolation via runtimes such as gVisor or Kata Containers for untrusted code.", "Designed for idle-heavy workloads with scaling to zero and fast resumption.", "Provides stable hostname and network identity for multi-agent communication.", "Extensions API adds SandboxWarmPool to keep pre-provisioned pods ready and reduce cold-start delay.", "Users can claim environments via SandboxClaim against a SandboxTemplate.", "Quick start includes installing core manifests, optional extensions, and a Python SDK (`k8s-agent-sandbox`) from PyPI.", "Project is open source under `kubernetes-sigs/agent-sandbox` and is in development under SIG Apps."]
timeframes: ["2026-03"]
link: "https://kubernetes.io/blog/2026/03/20/running-agents-on-kubernetes-with-agent-sandbox/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-03"
id: "80EFD52D3554D7428CFD85E1B5634B6B2810424B216CA3130AB2FE3EFF4EFF9A"
contentHash: "FFD42D120F1B4B3BF6856D8111379D80F7EFC70135E4C57AE53EFFCFD8C7BC71"
draft: false
type: "updates2"
llmSummary: "Kubernetes SIG Apps is developing Agent Sandbox, a new API for singleton, stateful AI agent workloads that need persistent identity, isolation, and suspend/resume behavior. The project adds a Sandbox CRD plus extensions like warm pools to reduce cold starts and support untrusted code execution."
---

Kubernetes SIG Apps is developing Agent Sandbox, a new API for singleton, stateful AI agent workloads that need persistent identity, isolation, and suspend/resume behavior. The project adds a Sandbox CRD plus extensions like warm pools to reduce cold starts and support untrusted code execution.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/03/20/running-agents-on-kubernetes-with-agent-sandbox/)
