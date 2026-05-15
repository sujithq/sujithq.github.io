---
title: "k8s: Kubernetes v1.36: Deprecation and removal of Service ExternalIPs"
date: 2026-05-14T18:35:00.000Z
slug: kubernetes-v1-36-deprecation-and-removal-of-service-externalips
update_categories: ["k8s"]
update_tags: ["kubernetes", "deprecation", "service", "externalIPs", "security", "kube-proxy", "gateway-api", "metallb"]
update_bullets: ["The deprecation applies only to `Service.spec.externalIPs`, not Node `status.addresses[].type=ExternalIP` or kubectl’s `EXTERNAL-IP` display column.", "SIG Network recommends enabling the `DenyServiceExternalIPs` admission controller to block future use.", "If you are not using `externalIPs`, no immediate action is required.", "One migration path is a manually managed `type: LoadBalancer` Service with the IP set in `.status.loadBalancer.ingress`, though this still requires privileged access and does not add IP ownership checks.", "On non-cloud clusters, a load balancer controller such as MetalLB can assign and enforce IP pools, avoiding the security issues of `externalIPs`.", "Gateway API is another replacement: admins can attach IPs to `Gateway` resources and route traffic to Services via `HTTPRoute`.", "The planned timeline is: deprecated in v1.36, kube-proxy support disabled no earlier than v1.40, and fully removed no earlier than v1.43."]
timeframes: ["2026-05"]
link: "https://kubernetes.io/blog/2026/05/14/kubernetes-v1-36-deprecation-and-removal-of-service-externalips/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-05"
id: "E2A5FEE67ABBA7038E94ACEC09439701079733B55782911C910BD89ED4721435"
contentHash: "127A54C9C7120B2BF214D5C37D083DCD1768CB043C9575AA4DB937A91952578E"
draft: false
type: "updates2"
llmSummary: "Kubernetes 1.36 formally deprecates `Service.spec.externalIPs` because the feature is insecure by default and can enable CVE-2020-8554-style abuse. Kubernetes will warn on use now, disable it in kube-proxy no earlier than v1.40 with an opt-in path, and remove opt-back-in support no earlier than v1.43."
---

Kubernetes 1.36 formally deprecates `Service.spec.externalIPs` because the feature is insecure by default and can enable CVE-2020-8554-style abuse. Kubernetes will warn on use now, disable it in kube-proxy no earlier than v1.40 with an opt-in path, and remove opt-back-in support no earlier than v1.43.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/05/14/kubernetes-v1-36-deprecation-and-removal-of-service-externalips/)
