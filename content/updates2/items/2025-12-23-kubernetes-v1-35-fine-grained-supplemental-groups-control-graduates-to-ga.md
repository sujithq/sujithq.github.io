---
title: "k8s: Kubernetes v1.35: Fine-grained Supplemental Groups Control Graduates to GA"
date: 2025-12-23T18:30:00.000Z
slug: kubernetes-v1-35-fine-grained-supplemental-groups-control-graduates-to-ga
update_categories: ["k8s"]
update_tags: ["Kubernetes", "v1.35", "supplementalGroupsPolicy", "GA", "SIG Node", "security", "containerd", "CRI-O", "Pod Security", "migration", "KEP-3619"]
update_bullets: ["Feature graduated to GA in v1.35: spec.securityContext.supplementalGroupsPolicy (introduced alpha v1.31, beta v1.33).", "Default policy Merge preserves historical behavior: group memberships from the container image's /etc/group are merged with Pod-declared groups.", "Strict policy ensures only groups declared in runAsGroup, fsGroup, or supplementalGroups are attached; image /etc/group memberships are ignored.", "Motivation: implicit GIDs from /etc/group in images can create undetectable supplementary groups (example: id shows an extra GID from the image), causing unexpected volume access and policy blind spots.", "Pod status exposes the initially attached process identity in status.containerStatuses[].user.linux (uid, gid, supplementalGroups) to help detect implicit groups; note the identity can change at runtime if the container has privileges to call setuid/setgid/setgroups.", "Upgrade note: there is a behavioral breaking change introduced since beta (v1.33); review the beta graduation blog’s behavioral changes and upgrade considerations if upgrading from v1.32 or earlier.", "Strict requires CRI runtime support; Merge remains backward-compatible with older runtimes.", "Known runtime support: containerd v2.0+ and CRI-O v1.31+; node-level support is indicated by Node.status.features.supplementalGroupsPolicy = true.", "Security guidance: restrict container capabilities (privilege: false, allowPrivilegeEscalation: false) or use the Restricted Pod Security Standard to prevent containers from changing identities; declare supplemental groups explicitly in Pod specs as best practice.", "As runtimes adopt the feature, security policies may begin to enforce supplementalGroupsPolicy: Strict, so prepare workloads by making supplemental groups transparent in Pod specs.", "Resources: see Configure a Security Context for a Pod or Container and KEP-3619 for implementation and design details."]
timeframes: ["2025-12"]
link: "https://kubernetes.io/blog/2025/12/23/kubernetes-v1-35-fine-grained-supplementalgroups-control-ga/"
source: "Kubernetes Official Blog"
timeframeKey: "2025-12"
id: "7D7959318DAF3C2A56888C8CB8DBF022ACBE6CBCFDD2E3C8294FD42F7A44ED6E"
contentHash: "FF5272A4F32203306E930B37FE78A7B6A4EECA9FE28D82FDBB1E89CDD680CCBE"
draft: false
type: "updates2"
llmSummary: "Kubernetes v1.35 graduates fine-grained supplemental groups control to GA via a new Pod field, supplementalGroupsPolicy, letting clusters choose whether to merge group memberships from the container image (/etc/group) or enforce only groups declared in the Pod (Strict) to reduce implicit, hard-to-audit GIDs and improve security (especially for volume access)."
---

Kubernetes v1.35 graduates fine-grained supplemental groups control to GA via a new Pod field, supplementalGroupsPolicy, letting clusters choose whether to merge group memberships from the container image (/etc/group) or enforce only groups declared in the Pod (Strict) to reduce implicit, hard-to-audit GIDs and improve security (especially for volume access).

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2025/12/23/kubernetes-v1-35-fine-grained-supplementalgroups-control-ga/)
