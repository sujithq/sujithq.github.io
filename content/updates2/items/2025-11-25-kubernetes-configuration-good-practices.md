---
title: "k8s: Kubernetes Configuration Good Practices"
date: 2025-11-25T00:00:00.000Z
slug: kubernetes-configuration-good-practices
update_categories: ["k8s"]
update_tags: ["kubernetes", "configuration", "best-practices", "yaml", "deployments", "services", "labels", "kubectl", "version-control", "networking"]
update_bullets: ["Always use the latest stable API version (check with kubectl api-resources) to avoid future deprecations.", "Store all manifests in version control (Git) instead of applying files from a desktop.", "Prefer YAML over JSON for readability; quote anything that could be misinterpreted as a boolean (use true/false only).", "Keep manifests minimal—omit defaults managed by Kubernetes to reduce noise and risk.", "Group related objects (Deployment, Service, ConfigMap) in the same file or folder and apply directories (kubectl apply -f configs/).", "Add human-friendly annotations (e.g., kubernetes.io/description) to explain intent and aid debugging.", "Avoid creating naked Pods in production—use Deployments for long-running services and Jobs for one-off tasks.", "Create Services before the workloads that rely on them (env vars injected for existing Services); prefer DNS-based discovery.", "Avoid hostPort and hostNetwork unless necessary; use kubectl port-forward for testing or NodePort/ingress for external access.", "Use headless Services (clusterIP: None) when you need per-Pod DNS for direct discovery instead of load balancing.", "Apply semantic and common Kubernetes labels (app.kubernetes.io/*, tier, phase) so selectors and tools can work reliably.", "Use label manipulation (kubectl label pod <pod> key-) to detach Pods from controllers for debugging, then delete or fix them manually.", "Leverage kubectl shortcuts for quick tests: kubectl create deployment and kubectl expose; use selectors to get/delete groups (kubectl get pods -l ...).", "Prefer server-side apply when appropriate (kubectl apply --server-side) to improve declarative management and conflict handling."]
timeframes: ["2025-11"]
link: "https://kubernetes.io/blog/2025/11/25/configuration-good-practices/"
source: "Kubernetes Official Blog"
timeframeKey: "2025-11"
id: "6AC508F4DCA99D093FB33755E03DF4F63AB90A1213C7C55E448FC293C43EFA57"
contentHash: "93A7A94E4BD20EEE996BB4C35DA1026AA9AF8C69F19E114D4B66D354A8E7EA93"
draft: false
type: "updates2"
llmSummary: "This article collects practical Kubernetes configuration best practices: prefer current stable APIs, keep manifests minimal and version-controlled, write YAML carefully (watch boolean values), group related objects, favor controllers (Deployments/Jobs) over naked Pods, use Services and DNS properly, avoid hostNetwork/hostPort unless necessary, apply semantic/common labels, add helpful annotations, and use kubectl features like applying directories, label selectors and server-side apply to simplify management."
---

This article collects practical Kubernetes configuration best practices: prefer current stable APIs, keep manifests minimal and version-controlled, write YAML carefully (watch boolean values), group related objects, favor controllers (Deployments/Jobs) over naked Pods, use Services and DNS properly, avoid hostNetwork/hostPort unless necessary, apply semantic/common labels, add helpful annotations, and use kubectl features like applying directories, label selectors and server-side apply to simplify management.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2025/11/25/configuration-good-practices/)
