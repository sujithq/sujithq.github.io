---
title: "k8s: Kubernetes v1.36: New Metric for Route Sync in the Cloud Controller Manager"
date: 2026-05-15T18:35:00.000Z
slug: kubernetes-v1-36-new-metric-for-route-sync-in-the-cloud-controller-manager
update_categories: ["k8s"]
update_tags: ["kubernetes", "v1.36", "cloud-controller-manager", "ccm", "metrics", "alpha", "route-controller", "feature-gate", "cloud-provider"]
update_bullets: ["New alpha counter metric: `route_controller_route_sync_total` in `k8s.io/cloud-provider` route controller.", "The counter increments each time routes are synced with the cloud provider.", "Used to A/B test `CloudControllerManagerWatchBasedRoutesReconciliation` (introduced in v1.35).", "With the feature gate disabled, the route controller runs on a fixed interval and increments steadily even without node changes.", "With the feature gate enabled, reconciliation is watch-based and should only increment when nodes are added, removed, or updated.", "In stable clusters with few node changes, enabling the feature gate should significantly reduce sync rate and cloud API calls.", "Feedback channels listed: `#sig-cloud-provider` on Kubernetes Slack, KEP-5237 GitHub issue, and SIG Cloud Provider community page."]
timeframes: ["2026-05"]
link: "https://kubernetes.io/blog/2026/05/15/ccm-new-metric-route-sync-total/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-05"
id: "19F9F68D17FB557849DBDEEC13F3D8A75BA9E3758432610CE8C7BD12442025CB"
contentHash: "6D3FCC43508711E2AC1159C9C96F5B9F83AF70DD9009FD841A154A5C459662F2"
draft: false
type: "updates2"
llmSummary: "Kubernetes v1.36 adds an alpha CCM route-controller metric, `route_controller_route_sync_total`, which counts cloud route syncs. It is meant to help validate the watch-based route reconciliation feature gate by comparing sync frequency against the existing fixed-interval loop."
---

Kubernetes v1.36 adds an alpha CCM route-controller metric, `route_controller_route_sync_total`, which counts cloud route syncs. It is meant to help validate the watch-based route reconciliation feature gate by comparing sync frequency against the existing fixed-interval loop.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/05/15/ccm-new-metric-route-sync-total/)
