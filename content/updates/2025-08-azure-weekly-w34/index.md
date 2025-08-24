+++
title = 'Azure Weekly – 2025 Week 34'
date = 2025-08-19T05:33:52Z
lastmod = 2025-08-24T05:36:02Z
draft = false
tags = ['updates', 'weekly', 'azure']
description = 'Highlights from Azure between 2025-08-18 and 2025-08-24 — explore updates, new features, bug fixes, and important enhancements for this period.'
[params]
    author = 'sujith'
+++
## This period at a glance

**Window:** 2025-08-18 → 2025-08-24 (Europe/Brussels)

- **[Azure Functions support for Node.js 22](<https://azure.microsoft.com/updates?id=500438>)** — Azure Functions now supports Node.js 22 in general availability as of August 22, 2025. Developers can use Node.js 22 for local development and deployment across all Azure Functions plans on both Linux and Windows.
  - Node.js 22 support for Azure Functions is now generally available (GA)
  - Applies to all Azure Functions plans on Linux and Windows
  - Available for local development and deployment
- **[Azure Migrate now supports migration to disks with Zone-Redundant Storage (ZRS) redundancy](<https://azure.microsoft.com/updates?id=501233>)** — Azure Migrate now allows users to migrate servers to disks with Zone-Redundant Storage (ZRS) redundancy, enabling selection of ZRS during migration. This feature is generally available as of August 22, 2025.
  - Azure Migrate supports migration to disks with Zone-Redundant Storage (ZRS) redundancy.
  - Users can select ZRS as the redundancy option during server migration.
  - Feature is generally available (GA) as of August 22, 2025.
  - Applies to Virtual Machines and Azure Migrate services.
- **[Application Gateway adds MaxSurge support for zero-capacity-impact upgrades](<https://azure.microsoft.com/updates?id=501017>)** — Azure Application Gateway has introduced MaxSurge support, allowing rolling upgrades to provision new instances without impacting existing capacity. This feature is now generally available as of August 21, 2025.
  - MaxSurge support enables zero-capacity-impact rolling upgrades for Application Gateway.
  - New instances are provisioned during upgrades without taking current ones offline.
  - Feature is generally available (GA) as of August 21, 2025.
- **[Generally, Available: Search Job in Log Analytics - Now Supporting Up to 100 Million Results](<https://azure.microsoft.com/updates?id=500879>)** — Azure Monitor Log Analytics Search Job is now generally available, supporting up to 100 million results per query as of August 21, 2025.
  - Search Job in Log Analytics now supports up to 100 million returned records per query.
  - Feature is generally available as of August 21, 2025.
  - Results are delivered in new Analytics tables for further exploration.
  - Applies to Azure Monitor Log Analytics.
- **[Azure NetApp Files file access logs](<https://azure.microsoft.com/updates?id=500760>)** — Azure NetApp Files file access logs are now generally available as of August 21, 2025, providing detailed visibility into file-level operations for SMB, NFSv4.1, and dual-protocol volumes.
  - File access logs feature is now GA for Azure NetApp Files.
  - Supports logging for SMB, NFSv4.1, and dual-protocol volumes.
  - Enables monitoring of file-level operations for improved security and auditing.
- **[Azure Functions Flex Consumption plan now supports 512 MB instance size and diagnostic settings](<https://azure.microsoft.com/updates?id=500369>)** — Azure Functions Flex Consumption plan now supports a 512 MB memory instance size, expanding options beyond the previous 2048 MB and 4096 MB sizes. Diagnostic settings integration is also available for improved monitoring.
  - 512 MB instance size is now available for Azure Functions Flex Consumption plan (previously only 2048 MB and 4096 MB).
  - Diagnostic settings are now supported for Flex Consumption apps, enabling enhanced monitoring via Azure Monitor.
  - Update is generally available as of August 21, 2025.
- **[Azure Bastion now supports connectivity to private AKS clusters via tunneling](<https://azure.microsoft.com/updates?id=500996>)** — Azure Bastion now offers preview support for tunneling connectivity to private AKS clusters, allowing secure access to the AKS API server from local machines using standard Kubernetes tools.
  - Preview release dated 2025-08-20
  - Enables secure tunneling from local machine to AKS API server via Azure Bastion
  - Supports both private and public AKS clusters
  - Accessible using standard Kubernetes tooling
- **[Azure NetApp Files Flexible service level now supports cool access](<https://azure.microsoft.com/updates?id=500712>)** — Azure NetApp Files now offers cool access support for its Flexible service level, available in preview as of August 20, 2025. This enables independent configuration of storage capacity and throughput for workloads with specific performance needs.
  - Flexible service level in Azure NetApp Files supports cool access tier
  - Users can configure storage capacity and throughput independently
  - Feature is in preview as of August 20, 2025
- **[Private Preview: DCesv6 and ECesv6 series confidential VMs with Intel® TDX](<https://azure.microsoft.com/updates?id=489745>)** — Azure announced a private preview of DCesv6 and ECesv6 series confidential virtual machines, featuring 5th Gen Intel Xeon processors with Intel Trust Domain Extensions (TDX).
  - Private preview of DCesv6 and ECesv6 confidential VM series now available
  - Powered by 5th Gen Intel Xeon (Emerald Rapids) processors
  - Includes Intel Trust Domain Extensions (TDX) for enhanced security
  - Update published on 2025-08-20
- **[Microsoft Sentinel Deprecation in Microsoft Azure operated by 21Vianet Announcement](<https://azure.microsoft.com/updates?id=498754>)** — Microsoft Sentinel will be deprecated in Microsoft Azure operated by 21Vianet, effective August 20, 2025, due to infrastructure and operational complexity.
  - Microsoft Sentinel service will be retired in Azure operated by 21Vianet.
  - Deprecation date is August 20, 2025.
  - Reason cited is increased infrastructure and operational complexity.
- **[Microsoft Defender for Cloud Deprecation in Microsoft Azure Operated by 21Vianet Announcement](<https://azure.microsoft.com/updates?id=498749>)** — Microsoft Defender for Cloud will be deprecated in Microsoft Azure operated by 21Vianet, effective August 20, 2025.
  - Defender for Cloud service is being retired in Azure operated by 21Vianet.
  - Deprecation date is August 20, 2025.
  - Reason cited is increasing infrastructure and operational complexity.
- **[Azure Blob Storage Archive Tier Now in Malaysia West](<https://azure.microsoft.com/updates?id=500630>)** — Azure Blob Storage Archive access tier is now generally available in the Malaysia West region as of August 18, 2025.
  - Archive tier for Azure Blob Storage launched in Malaysia West region
  - Allows storage of infrequently accessed data at lower cost
  - Supports data residency requirements for Malaysia

