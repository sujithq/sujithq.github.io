---
title: "k8s: Kubernetes v1.36: Admission Policies That Can't Be Deleted"
date: 2026-05-04T18:35:00.000Z
slug: kubernetes-v1-36-admission-policies-that-can-t-be-deleted
update_categories: ["k8s"]
update_tags: ["kubernetes", "v1.36", "alpha", "admission-control", "admission-policy", "validatingadmissionpolicy", "webhooks", "apiserver", "security"]
update_bullets: ["Adds `staticManifestsDir` to `AdmissionConfiguration` for loading manifest-based admission policies.", "Supported manifests are standard Kubernetes resources, but names must end with `.static.k8s.io`.", "Manifest-based policies can include ValidatingAdmissionPolicy and webhook configurations; bindings must reference policies in the same manifest set.", "Manifest-based configs are evaluated before the API server serves requests, so they are active during startup and recovery.", "They can also enforce protection over API-based admission resources, including `ValidatingAdmissionPolicy`, `ValidatingWebhookConfiguration`, and related objects.", "Unlike API-based admission, these static policies are not managed through the API, so deletion or modification must be done by changing files on disk.", "Restrictions: no `paramKind`, no Service references for webhooks (URL only), and no references to cluster state.", "Each API server instance loads its own files independently; there is no built-in cross-server synchronization.", "The API server watches files and swaps in validated changes atomically; invalid updates keep the last known good config.", "Startup is fail-fast: invalid manifest files prevent the API server from starting.", "Enable via the `ManifestBasedAdmissionControlConfig` feature gate and `--admission-control-config-file`."]
timeframes: ["2026-05"]
link: "https://kubernetes.io/blog/2026/05/04/kubernetes-v1-36-manifest-based-admission-control/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-05"
id: "EA9AA663157322D4D7A46BA9596A099865783FF76993C753D9FEF2D9AB82519B"
contentHash: "AD97CF9B8437EDCB6141EFF63883832353A83356F37C16C306B9E5B81EB407C7"
draft: false
type: "updates2"
llmSummary: "Kubernetes v1.36 adds an alpha manifest-based admission control feature that loads admission webhooks and CEL policies from files on disk at API server startup. It closes the bootstrap gap and allows on-disk policies to protect API-based admission resources from deletion or modification."
---

Kubernetes v1.36 adds an alpha manifest-based admission control feature that loads admission webhooks and CEL policies from files on disk at API server startup. It closes the bootstrap gap and allows on-disk policies to protect API-based admission resources from deletion or modification.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/05/04/kubernetes-v1-36-manifest-based-admission-control/)
