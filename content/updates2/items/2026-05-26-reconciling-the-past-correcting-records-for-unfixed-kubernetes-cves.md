---
title: "k8s: Reconciling the Past: Correcting Records for Unfixed Kubernetes CVEs"
date: 2026-05-26T17:30:00.000Z
slug: reconciling-the-past-correcting-records-for-unfixed-kubernetes-cves
update_categories: ["k8s"]
update_tags: ["kubernetes", "cve", "security", "osv", "rbac", "dns", "api-server"]
update_bullets: ["The Kubernetes Security Response Committee found that some older CVE records incorrectly listed fixed versions, despite the issues remaining unfixed.", "Affected CVEs: CVE-2020-8561 (kube-apiserver webhook redirect), CVE-2020-8562 (API server proxy DNS TOCTOU), and CVE-2021-25740 (cross-namespace forwarding via Endpoints/EndpointSlice).", "CVE-2020-8554 is also unfixed and will be updated to use a standardized version format.", "Reason these remain unfixed: fixes would break intended Kubernetes behavior or APIs, so the project is documenting them as architectural risks instead of patchable bugs.", "Mitigations listed: keep API server log verbosity below 10 and disable profiling for CVE-2020-8561; use a caching DNS resolver such as dnsmasq for CVE-2020-8562; restrict write access to Endpoints and EndpointSlices for CVE-2021-25740.", "For CVE-2021-25740, Kubernetes notes that default edit/admin ClusterRoles no longer include Endpoints write permissions for clusters created on v1.22+, but upgraded clusters should audit system:aggregate-to-edit.", "The record corrections may cause vulnerability scanners to start reporting these issues where they were previously missed."]
timeframes: ["2026-05"]
link: "https://kubernetes.io/blog/2026/05/26/reconciling-unfixed-kubernetes-cves/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-05"
id: "7078281997A0BBC42A3FE06AE1DC970B237D6E7BCCF9F1E939A357B78F1C6E62"
contentHash: "93F3BFCCAAD862EB0E276DBDCA1A7BF15F5BB0C3E6325AB9078DA2DCEC835D96"
draft: false
type: "updates2"
llmSummary: "Kubernetes will correct several older CVE records on June 1, 2026 so they no longer imply fixed versions for issues that remain unfixed by design. The update affects CVE-2020-8561, CVE-2020-8562, CVE-2021-25740, and a formatting update for CVE-2020-8554; admins may see new scanner findings after the records are corrected."
---

Kubernetes will correct several older CVE records on June 1, 2026 so they no longer imply fixed versions for issues that remain unfixed by design. The update affects CVE-2020-8561, CVE-2020-8562, CVE-2021-25740, and a formatting update for CVE-2020-8554; admins may see new scanner findings after the records are corrected.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/05/26/reconciling-unfixed-kubernetes-cves/)
