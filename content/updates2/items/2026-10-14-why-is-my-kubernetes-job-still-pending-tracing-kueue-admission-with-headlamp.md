---
title: "k8s: Why Is My Kubernetes Job Still Pending? Tracing Kueue Admission with Headlamp"
date: 2026-10-14T18:35:00.000Z
slug: why-is-my-kubernetes-job-still-pending-tracing-kueue-admission-with-headlamp
update_categories: ["k8s"]
update_tags: ["Kubernetes", "Kueue", "Headlamp", "Jobs", "Pods", "ClusterQueue", "LocalQueue", "ResourceFlavor", "Cohort", "admission", "troubleshooting", "plugin", "alpha"]
update_bullets: ["Explains the distinction between Kueue admission and Kubernetes Pod scheduling.", "Shows how to start troubleshooting from the Kueue Workload view in Headlamp.", "Highlights the key Workload conditions: QuotaReserved and Admitted.", "Uses linked LocalQueue and ClusterQueue pages to check queue status, quota, reservations, and policy.", "Describes when to inspect ResourceFlavor and Cohort objects for flavor assignment or shared quota issues.", "If the Workload is admitted but Pods remain Pending, the investigation moves to normal Job/Pod and scheduler views.", "The plugin currently provides read-only views for Kueue v1beta2 Cohorts, ClusterQueues, LocalQueues, ResourceFlavors, and Workloads.", "Current alpha limitations include no create/edit/stop/resume/delete flows and non-clickable owner references.", "A sample failure case shows a Workload requesting three CPUs and three Pod slots being blocked by a ClusterQueue with only two CPUs and two Pod slots."]
timeframes: ["2026-10"]
link: "https://kubernetes.io/blog/2026/10/14/tracing-kueue-admission-with-headlamp/"
source: "Kubernetes Official Blog"
timeframeKey: "2026-10"
id: "2DBB7B9066230AF75FB9D0C04A51564371E1D2EB49A30579FB538616A54E7820"
contentHash: "4A573DFC12EB6A055A3E99882B768CB84191D99D5241AE5F5F07A6204A1B8739"
draft: false
type: "updates2"
llmSummary: "The article introduces the Headlamp Kueue plugin, which helps trace why a Kubernetes Job is still suspended by checking Kueue admission state before looking at Pod scheduling. It walks through a Headlamp-based workflow for inspecting Workloads, LocalQueues, ClusterQueues, ResourceFlavors, and Cohorts, and notes that the 0.1.0-alpha release is read-only."
---

The article introduces the Headlamp Kueue plugin, which helps trace why a Kubernetes Job is still suspended by checking Kueue admission state before looking at Pod scheduling. It walks through a Headlamp-based workflow for inspecting Workloads, LocalQueues, ClusterQueues, ResourceFlavors, and Cohorts, and notes that the 0.1.0-alpha release is read-only.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2026/10/14/tracing-kueue-admission-with-headlamp/)
