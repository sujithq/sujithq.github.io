---
title: "k8s: Kubernetes v1.35: New level of efficiency with in-place Pod restart"
date: 2026-01-02T18:30:00.000Z
slug: kubernetes-v1-35-new-level-of-efficiency-with-in-place-pod-restart
update_categories: ["k8s"]
update_tags: ["Kubernetes", "v1.35", "RestartAllContainers", "ContainerRestartRules", "alpha", "RestartAllContainersOnContainerExits", "AI/ML", "Pod lifecycle", "SIG Node", "in-place restart"]
update_bullets: ["What it does: RestartAllContainers causes the kubelet to terminate all containers in a Pod and re-run the Pod startup sequence (init containers first) without deleting the Pod object or changing its Node, UID, IP, sandbox or attached volumes.", "When to use: helpful for complex multi-container apps and large-scale AI/ML or batch workloads where re-scheduling Pods is costly (reduces recovery from minutes to seconds in benchmarks).", "How to trigger: add restartPolicyRules to a container (init, sidecar or regular) with action: RestartAllContainers and matching exit condition(s); example: watcher sidecar exits with a specific code to force full Pod restart.", "Enablement: alpha feature — must enable RestartAllContainersOnContainerExits on the API server and kubelet (v1.35+). ContainerRestartRules graduated to beta in v1.35 and is enabled by default.", "Preserved and affected state: Pod identity, network namespace, sandbox and volumes are preserved; ephemeral containers are terminated; all other containers are restarted and their restartCount increments.", "Observability: new Pod condition AllContainersRestarting becomes True during the restart and returns False once containers have terminated and the Pod is ready to start again.", "Caveats and requirements: containers must be reentrant, init containers will re-run, preStop hooks are not executed on this path (containers should handle abrupt termination), and external tooling should expect init re-execution.", "Use cases: ML/batch job worker recovery (avoid mass rescheduling), re-running init containers to restore clean state, and handling high-rate short tasks without full Pod recreation.", "Further reading and feedback: see KEP-5532 (Restart All Containers), JobSet in-place restart discussion (KEP/issue #467), official Pod Lifecycle docs, and SIG Node for contribution/feedback."]
timeframes: ["2026-01"]
link: "https://kubernetes.io/blog/2026/01/02/kubernetes-v1-35-restart-all-containers/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-01"
id: "B79B812273F975E213E0E0023B82548E38F6C90F8D7CF88BB480DA1A99C4FC7D"
contentHash: "C8AE234D4260447D1AD498EC66C61C8DAE157FF016A548AB8FCB06AA45743787"
draft: false
type: "updates2"
llmSummary: "Kubernetes v1.35 introduces an alpha feature, Restart All Containers (enabled with the RestartAllContainersOnContainerExits feature gate), which adds a RestartAllContainers action to container restart rules to perform a fast, in-place full Pod restart that preserves Pod UID, IP, sandbox and volumes while re-running init, sidecar and application containers."
---

Kubernetes v1.35 introduces an alpha feature, Restart All Containers (enabled with the RestartAllContainersOnContainerExits feature gate), which adds a RestartAllContainers action to container restart rules to perform a fast, in-place full Pod restart that preserves Pod UID, IP, sandbox and volumes while re-running init, sidecar and application containers.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/01/02/kubernetes-v1-35-restart-all-containers/)
