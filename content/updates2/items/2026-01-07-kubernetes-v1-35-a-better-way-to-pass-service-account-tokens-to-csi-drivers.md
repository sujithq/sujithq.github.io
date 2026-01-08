---
title: "k8s: Kubernetes v1.35: A Better Way to Pass Service Account Tokens to CSI Drivers"
date: 2026-01-07T18:30:00.000Z
slug: kubernetes-v1-35-a-better-way-to-pass-service-account-tokens-to-csi-drivers
update_categories: ["k8s"]
update_tags: ["kubernetes", "csi", "service-account", "security", "v1.35", "storage", "migration"]
update_bullets: ["Current behavior: CSI drivers using TokenRequests receive tokens via volume_context under the key csi.storage.k8s.io/serviceAccount.tokens.", "Problem: volume_context isn't treated as sensitive by protosanitizer, leading to accidental token logging (CVE-2023-2878, CVE-2024-3744) and driver-specific sanitization workarounds.", "New opt-in: CSIDriver spec adds serviceAccountTokenInSecrets: true to receive tokens only in the secrets field (same key) of NodePublishVolumeRequest.", "Default and feature gate: CSIServiceAccountTokenSecrets feature is enabled by default on kubelet and kube-apiserver, but serviceAccountTokenInSecrets defaults to false so behavior is unchanged unless drivers opt in.", "Backward-compatible adoption: drivers should add fallback logic to check req.Secrets first, then req.VolumeContext, making the change safe to ship anytime.", "Rollout sequence: deploy driver with fallback logic, upgrade kube-apiserver and kubelets to v1.35+, ensure DaemonSet rollout completes, then update CSIDriver to set serviceAccountTokenInSecrets: true.", "Important constraint: update driver pods (DaemonSet) before changing the CSIDriver spec to avoid mount failures on nodes running older driver versions.", "Benefits: reduces accidental token exposure, uses CSI's designated secrets field (handled by protosanitizer), and centralizes sensitive-data handling without forcing immediate breaking changes.", "Call to action: SIG Storage urges CSI driver maintainers to adopt the change, follow KEP-5538, and provide migration feedback via the Kubernetes Slack #csi channel."]
timeframes: ["2026-01"]
link: "https://kubernetes.io/blog/2026/01/07/kubernetes-v1-35-csi-sa-tokens-secrets-field-beta/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-01"
id: "3C628150C739480C815EAC68CCBF402022E294019BB805EC80E1A98575D8FC61"
contentHash: "5F195E11F7DCBC6EBDE513BDFD1F004FA44AB274D7B79977CFF3E1B0C7860239"
draft: false
type: "updates2"
llmSummary: "Kubernetes v1.35 introduces a beta opt-in for delivering CSI-requested service account tokens in the NodePublishVolumeRequest secrets field rather than volume_context. This change (controlled by serviceAccountTokenInSecrets in the CSIDriver spec) fixes accidental token exposure in logs, is opt-in to preserve compatibility, and includes guidance and a safe rollout sequence for CSI driver authors."
---

Kubernetes v1.35 introduces a beta opt-in for delivering CSI-requested service account tokens in the NodePublishVolumeRequest secrets field rather than volume_context. This change (controlled by serviceAccountTokenInSecrets in the CSIDriver spec) fixes accidental token exposure in logs, is opt-in to preserve compatibility, and includes guidance and a safe rollout sequence for CSI driver authors.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/01/07/kubernetes-v1-35-csi-sa-tokens-secrets-field-beta/)
