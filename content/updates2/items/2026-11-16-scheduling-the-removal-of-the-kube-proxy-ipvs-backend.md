---
title: "k8s: Scheduling the removal of the kube-proxy IPVS backend"
date: 2026-11-16T18:35:00.000Z
slug: scheduling-the-removal-of-the-kube-proxy-ipvs-backend
update_categories: ["k8s"]
update_tags: ["kubernetes", "kube-proxy", "ipvs", "deprecation", "nftables", "iptables", "sig-network"]
update_bullets: ["IPVS was originally added to improve kube-proxy performance over iptables, especially for large clusters and frequent service updates.", "The IPVS backend is not feature-complete for all Kubernetes Service behaviors and relies on iptables for some features, which limits its long-term viability.", "IPVS scaling is constrained by the lack of batch update support in the kernel API, and its use of iptables creates additional maintenance and RHEL support issues.", "Most IPVS schedulers do not provide meaningful benefit in kube-proxy's distributed architecture, despite being a notable user-facing feature.", "Kubernetes recommends switching to nftables if running Kubernetes 1.36+ on a Linux kernel 5.13+; the change is mainly a kube-proxy config update and restart.", "If nftables is not available, switching to iptables is still an option; kube-proxy's iptables backend has had multiple optimizations for rules generation and resync behavior.", "KEP-5495 contains the deprecation timeline and plan; related nftables background is in the kube-proxy nftables blog post."]
timeframes: ["2026-11"]
link: "https://kubernetes.io/blog/2026/11/16/ipvs-removal/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-11"
id: "8A81AB0F0BF175E8F13EBB8A720C6EBB3D6E4420DC9CAF4F43DBAA2368E9F706"
contentHash: "F2361B26BE9B1213E81797015DD9265A24D1ACF112347BCF9916D00C0EFEFE52"
draft: false
type: "updates2"
llmSummary: "Kubernetes SIG Network has deprecated the kube-proxy IPVS backend in 1.35 and plans to remove it in 1.40. Users are advised to migrate to nftables on 1.36+ with Linux kernel 5.13+; iptables remains an alternative, with recent performance and scaling improvements."
---

Kubernetes SIG Network has deprecated the kube-proxy IPVS backend in 1.35 and plans to remove it in 1.40. Users are advised to migrate to nftables on 1.36+ with Linux kernel 5.13+; iptables remains an alternative, with recent performance and scaling improvements.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/11/16/ipvs-removal/)
