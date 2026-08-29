---
title: "k8s: Kubernetes v1.37: Pod Certificates and Cluster Trust Bundles"
date: 2026-08-28T18:30:00.000Z
slug: kubernetes-v1-37-pod-certificates-and-cluster-trust-bundles
update_categories: ["k8s"]
update_tags: ["Kubernetes", "v1.37", "GA", "Pod Certificates", "Cluster Trust Bundles", "X.509", "mTLS", "identity", "rotation", "SPIFFE"]
update_bullets: ["Pod Certificates provide proof-of-possession workload identity using X.509 certificates instead of bearer service account JWTs.", "Kubelet generates private keys, creates PodCertificateRequest objects, and writes issued keys/cert chains to the pod filesystem.", "Cluster Trust Bundles let Kubelet collect and write matching trust anchors for workloads, with updates applied as bundle contents change.", "Certificate rotation is automatic; workloads must watch for file changes via inotify or polling.", "Core Kubernetes signers are not yet shipped; the post points users to the third-party Tinycert signer for experimentation.", "Tinycert includes a service signer for Service DNS SANs, a SPIFFE signer, a Go helper library, and sample mTLS apps.", "Built-in node restriction admission is used to limit certificate requests to the node actually running the pod.", "The post notes intended future built-in signers for service TLS certificates and SPIFFE client certificates.", "Maximum lifetime is described as 24 hours for eventual core signers and 91 days for other signers."]
timeframes: ["2026-08"]
link: "https://kubernetes.io/blog/2026/08/28/kubernetes-v1-37-pod-certificates-and-cluster-trust-bundles/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-08"
id: "330CB55407BFB02C74CF381883AE70DF172F9AAC81E80B7FACD79A6E9D72D1C6"
contentHash: "C0FF327575345F422B7898949BD66B15968E0C8E1FDD6A2C7C59612CD114730A"
draft: false
type: "updates2"
llmSummary: "Kubernetes 1.37 graduates Pod Certificates and Cluster Trust Bundles to GA, adding built-in support for workload X.509 identity and trust bundle distribution. The feature uses Kubelet, PodCertificateRequest objects, and signer controllers to issue and rotate certificates for TLS/mTLS while keeping key material on the node filesystem."
---

Kubernetes 1.37 graduates Pod Certificates and Cluster Trust Bundles to GA, adding built-in support for workload X.509 identity and trust bundle distribution. The feature uses Kubelet, PodCertificateRequest objects, and signer controllers to issue and rotate certificates for TLS/mTLS while keeping key material on the node filesystem.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/08/28/kubernetes-v1-37-pod-certificates-and-cluster-trust-bundles/)
