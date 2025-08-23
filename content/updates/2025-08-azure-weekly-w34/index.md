+++
title = 'Azure Weekly – 2025 Week 34'
date = 2025-08-19T05:33:52Z
lastmod = 2025-08-23T05:32:53Z
draft = false
tags = ['updates', 'weekly', 'azure']
description = 'Highlights from Azure between 2025-08-18 and 2025-08-24 — explore updates, new features, bug fixes, and important enhancements for this period.'
[params]
    author = 'sujith'
+++
## This period at a glance

**Window:** 2025-08-18 → 2025-08-24 (Europe/Brussels)

- **[Azure Functions support for Node.js 22](<https://azure.microsoft.com/updates?id=500438>)** — Azure Functions now supports Node.js 22, available generally as of August 22, 2025. This enables development and deployment of functions using Node.js 22 across all Azure Functions plans on both Linux and Windows.
  - Node.js 22 support is now generally available in Azure Functions.
  - Applies to all Azure Functions plans on Linux and Windows.
  - Released on August 22, 2025.
- **[Azure Migrate now supports migration to disks with Zone-Redundant Storage (ZRS) redundancy](<https://azure.microsoft.com/updates?id=501233>)** — Azure Migrate now allows users to migrate servers to disks with Zone-Redundant Storage (ZRS) redundancy. This feature is generally available as of August 22, 2025.
  - Migration to ZRS disks is now supported in Azure Migrate.
  - Users can select ZRS as the redundancy option during server migration.
  - Feature is generally available (GA) as of August 22, 2025.
- **[Application Gateway adds MaxSurge support for zero-capacity-impact upgrades](<https://azure.microsoft.com/updates?id=501017>)** — Azure Application Gateway has introduced MaxSurge support as of August 21, 2025, allowing rolling upgrades without reducing service capacity.
  - MaxSurge support enables provisioning of new instances during upgrades without taking existing ones offline.
  - Upgrades to newer gateway versions can now be performed with zero impact on capacity.
  - Feature is generally available (GA) as of August 21, 2025.
- **[Generally, Available: Search Job in Log Analytics - Now Supporting Up to 100 Million Results](<https://azure.microsoft.com/updates?id=500879>)** — Azure Monitor Log Analytics Search Job is now generally available, supporting up to 100 million results per query as of August 21, 2025.
  - Search Job in Log Analytics now generally available.
  - Maximum query result size increased to 100 million records.
  - Results delivered in new Analytics tables for further exploration.
  - Update effective August 21, 2025.
- **[Azure NetApp Files file access logs](<https://azure.microsoft.com/updates?id=500760>)** — Azure NetApp Files file access logs are now generally available, providing detailed logging of file-level operations for SMB, NFSv4.1, and dual-protocol volumes.
  - File access logs feature is now GA for Azure NetApp Files as of 2025-08-21.
  - Supports SMB, NFSv4.1, and dual-protocol volumes.
  - Enables enterprise-grade visibility into file operations.
- **[Azure Functions Flex Consumption plan now supports 512 MB instance size and diagnostic settings](<https://azure.microsoft.com/updates?id=500369>)** — Azure Functions Flex Consumption plan now supports a 512 MB memory instance size, expanding options beyond the previous 2048 MB and 4096 MB sizes. Diagnostic settings integration is also available for enhanced monitoring.
  - 512 MB instance size added to Flex Consumption plan (previously only 2048 MB and 4096 MB)
  - Diagnostic settings now supported for Azure Functions Flex Consumption apps
  - Update type: General Availability (GA)
  - Release date: 2025-08-21
- **[Azure Bastion now supports connectivity to private AKS clusters via tunneling](<https://azure.microsoft.com/updates?id=500996>)** — Azure Bastion now allows users to securely connect to private Azure Kubernetes Service (AKS) clusters via tunneling, using standard Kubernetes tools. This feature is available in preview as of August 20, 2025.
  - Secure tunneling from local machine to AKS API server via Azure Bastion is now supported.
  - Works with both private and public AKS clusters.
  - Feature is in preview as of August 20, 2025.
  - Applies to Azure Bastion and Azure Kubernetes Service (AKS).
- **[Azure NetApp Files Flexible service level now supports cool access](<https://azure.microsoft.com/updates?id=500712>)** — Azure NetApp Files' Flexible service level now supports cool access in preview as of August 20, 2025, allowing users to configure storage for workloads needing high capacity but low throughput.
  - Flexible service level in Azure NetApp Files adds support for cool access tier (preview).
  - Users can independently configure storage capacity and throughput.
  - Targets workloads with high capacity and low throughput needs.
  - Announced August 20, 2025.
- **[Private Preview: DCesv6 and ECesv6 series confidential VMs with Intel® TDX](<https://azure.microsoft.com/updates?id=489745>)** — Azure has launched a private preview of its DCesv6 and ECesv6 series confidential virtual machines, featuring 5th Gen Intel Xeon processors with Intel Trust Domain Extensions (TDX). This update enhances security for confidential workloads.
  - Private preview of DCesv6 and ECesv6 confidential VM series announced
  - Powered by 5th Gen Intel Xeon (Emerald Rapids) CPUs with Intel TDX support
  - Aimed at improving security for confidential computing workloads
  - Available on Azure as of August 20, 2025
- **[Microsoft Sentinel Deprecation in Microsoft Azure operated by 21Vianet Announcement](<https://azure.microsoft.com/updates?id=498754>)** — Microsoft Sentinel will be deprecated in Microsoft Azure operated by 21Vianet, as announced on August 20, 2025. The decision is due to increasing infrastructure and operational complexity.
  - Microsoft Sentinel service is being deprecated in Azure operated by 21Vianet (China region).
  - Deprecation announced on August 20, 2025.
  - Reason cited: increasing infrastructure and operational complexity.
- **[Microsoft Defender for Cloud Deprecation in Microsoft Azure Operated by 21Vianet Announcement](<https://azure.microsoft.com/updates?id=498749>)** — Microsoft Defender for Cloud will be deprecated in Microsoft Azure operated by 21Vianet, effective August 20, 2025.
  - Defender for Cloud service will be retired in Azure operated by 21Vianet.
  - Deprecation date is August 20, 2025.
  - Applies only to the 21Vianet-operated Azure region.
- **[Azure Blob Storage Archive Tier Now in Malaysia West](<https://azure.microsoft.com/updates?id=500630>)** — Azure Blob Storage's Archive access tier is now generally available in the Malaysia West region as of August 18, 2025.
  - Archive tier for Azure Blob Storage launched in Malaysia West region
  - Allows storage of infrequently accessed data at lower cost
  - Supports data residency requirements for Malaysian customers
  - General availability (GA) as of August 18, 2025

