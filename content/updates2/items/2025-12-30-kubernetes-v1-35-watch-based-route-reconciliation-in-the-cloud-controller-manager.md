---
title: "k8s: Kubernetes v1.35: Watch Based Route Reconciliation in the Cloud Controller Manager"
date: 2025-12-30T18:30:00.000Z
slug: kubernetes-v1-35-watch-based-route-reconciliation-in-the-cloud-controller-manager
update_categories: ["k8s"]
update_tags: ["kubernetes", "v1.35", "cloud-controller-manager", "watch-based-reconciliation", "feature-gate", "k8s.io/cloud-provider", "SIG-Cloud-Provider", "KEP-5237"]
update_bullets: ["Feature gate: CloudControllerManagerWatchBasedRoutesReconciliation (alpha) added to k8s.io/cloud-provider by SIG Cloud Provider.", "Behavior change: route reconciliation switches from fixed-interval polling to watch/informer-based triggers.", "Triggers: reconcile on node add/delete or when .spec.podCIDRs or .status.addresses are updated.", "Periodic reconcile: one additional reconcile at a random interval between 12 and 24 hours chosen at controller start.", "No logic change: the internal reconciliation loop remains unchanged, so existing route configurations should be unaffected.", "How to enable: pass --feature-gate=CloudControllerManagerWatchBasedRoutesReconciliation=true to your CCM implementation.", "More info: see KEP-5237 for design and details."]
timeframes: ["2025-12"]
link: "https://kubernetes.io/blog/2025/12/30/kubernetes-v1-35-watch-based-route-reconciliation-in-ccm/"
source: "Kubernetes Official Blog"
timeframeKey: "2025-12"
id: "B3F41FA249BA61A1F7AF145DA8CB87CF6A2F87B912F5512C3A71E9D29A041624"
contentHash: "F0941D98D0926719C16CB011F8CB6CA279994C28E76D6F58406CE1E21E280548"
draft: false
type: "updates2"
llmSummary: "Kubernetes v1.35 introduces an alpha feature gate (CloudControllerManagerWatchBasedRoutesReconciliation) in k8s.io/cloud-provider that changes the CCM route controller from a fixed-interval reconciliation to a watch/informer-based trigger model. The change reduces unnecessary cloud API calls by reconciling routes only when relevant node or CIDR/address fields change, with an additional randomized periodic reconcile every 12–24 hours. The reconciliation logic itself is unchanged and the feature is enabled via --feature-gate."
---

Kubernetes v1.35 introduces an alpha feature gate (CloudControllerManagerWatchBasedRoutesReconciliation) in k8s.io/cloud-provider that changes the CCM route controller from a fixed-interval reconciliation to a watch/informer-based trigger model. The change reduces unnecessary cloud API calls by reconciling routes only when relevant node or CIDR/address fields change, with an additional randomized periodic reconcile every 12–24 hours. The reconciliation logic itself is unchanged and the feature is enabled via --feature-gate.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2025/12/30/kubernetes-v1-35-watch-based-route-reconciliation-in-ccm/)
