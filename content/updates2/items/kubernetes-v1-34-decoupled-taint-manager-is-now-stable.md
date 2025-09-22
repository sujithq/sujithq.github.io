---
title: "k8s: Kubernetes v1.34: Decoupled Taint Manager Is Now Stable"
date: 2025-09-15T18:30:00.000Z
slug: kubernetes-v1-34-decoupled-taint-manager-is-now-stable
update_categories: ["k8s"]
update_tags: ["Kubernetes", "v1.34", "taint-manager", "taint-eviction-controller", "node-lifecycle-controller", "SeparateTaintEvictionController", "GA", "kube-controller-manager", "eviction"]
update_bullets: ["Functionality split: node lifecycle controller applies NoExecute taints; taint eviction controller performs pod eviction.", "Feature gate SeparateTaintEvictionController is now GA in v1.34.", "Operators can disable taint-based eviction with --controllers=-taint-eviction-controller in kube-controller-manager.", "Separation improves code organization and makes custom or improved taint-based eviction implementations easier.", "Further reading: KEP and the v1.29 beta announcement (Decoupling taint manager from node lifecycle controller).", "Acknowledgement of contributors who moved the feature from beta to stable (multiple community members)."]
timeframes: ["2025-09"]
link: "https://kubernetes.io/blog/2025/09/15/kubernetes-v1-34-decoupled-taint-manager-is-now-stable/"
source: "Kubernetes Official Blog"
timeframeKey: "2025-09"
id: "102BFCB3A8FEF72EACFD4A7A476C158BFFE8EE00EABB448CEDA1CDDD7219AAB6"
contentHash: "9ADDFF514E60280C17FC48E292CA1E607B752066C14289E400794F027280DF98"
draft: false
type: "updates2"
llmSummary: "Kubernetes v1.34 promotes the SeparateTaintEvictionController feature to GA, splitting responsibilities so the node lifecycle controller only applies NoExecute taints while a dedicated taint eviction controller handles pod eviction. This improves code separation, enables easier improvements or custom eviction implementations, and can be disabled via a kube-controller-manager flag. Documentation and a KEP/beta announcement provide more details."
---

Kubernetes v1.34 promotes the SeparateTaintEvictionController feature to GA, splitting responsibilities so the node lifecycle controller only applies NoExecute taints while a dedicated taint eviction controller handles pod eviction. This improves code separation, enables easier improvements or custom eviction implementations, and can be disabled via a kube-controller-manager flag. Documentation and a KEP/beta announcement provide more details.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2025/09/15/kubernetes-v1-34-decoupled-taint-manager-is-now-stable/)
