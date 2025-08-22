+++
title = 'Azure Weekly – 2025 Week 34'
date = 2025-08-19T05:33:52Z
lastmod = 2025-08-22T05:34:25Z
draft = false
tags = ['updates', 'weekly', 'azure']
description = 'Highlights from Azure between 2025-08-18 and 2025-08-24 — explore updates, new features, bug fixes, and important enhancements for this period.'
[params]
    author = 'sujith'
+++
## This period at a glance

**Window:** 2025-08-18 → 2025-08-24 (Europe/Brussels)

- **[Application Gateway adds MaxSurge support for zero-capacity-impact upgrades](<https://azure.microsoft.com/updates?id=501017>)** — Azure Application Gateway has introduced MaxSurge support, allowing rolling upgrades to occur without reducing capacity. This feature is now generally available as of August 21, 2025.
  - MaxSurge support enables provisioning of new instances during rolling upgrades.
  - Existing instances remain online, preventing capacity degradation during upgrades.
  - Feature is generally available (GA) as of August 21, 2025.
- **[Generally, Available: Search Job in Log Analytics - Now Supporting Up to 100 Million Results](<https://azure.microsoft.com/updates?id=500879>)** — Azure Monitor Log Analytics Search Job is now generally available and supports returning up to 100 million records per query as of August 21, 2025.
  - Search Job in Log Analytics is generally available.
  - Maximum query result size increased to 100 million records.
  - Results are delivered in new Analytics tables for further analysis.
  - Applies to Azure Monitor service.
- **[Azure NetApp Files file access logs](<https://azure.microsoft.com/updates?id=500760>)** — Azure NetApp Files file access logs are now generally available as of August 21, 2025, providing detailed logging of file-level operations for SMB, NFSv4.1, and dual-protocol volumes.
  - File access logs feature for Azure NetApp Files is now GA (generally available).
  - Supports logging for SMB, NFSv4.1, and dual-protocol volumes.
  - Enables enterprise-grade visibility into file operations.
  - Release date: August 21, 2025.
- **[Azure Functions Flex Consumption plan now supports 512 MB instance size and diagnostic settings](<https://azure.microsoft.com/updates?id=500369>)** — Azure Functions Flex Consumption plan now offers a 512 MB memory instance size option and supports diagnostic settings as of August 21, 2025.
  - 512 MB instance size is now available alongside 2048 MB and 4096 MB for Flex Consumption apps.
  - Diagnostic settings are now supported for these apps.
  - Update is generally available (GA) as of 2025-08-21.
- **[Azure Bastion now supports connectivity to private AKS clusters via tunneling](<https://azure.microsoft.com/updates?id=500996>)** — Azure Bastion now allows users to securely connect to private AKS clusters using tunneling, enabling direct access to the AKS API server from local machines with standard Kubernetes tools. This feature is available in preview as of August 20, 2025.
  - Secure tunneling from local machine to AKS API server via Azure Bastion
  - Supports both private and public AKS clusters
  - Accessible with standard Kubernetes tooling
  - Feature is in preview as of August 20, 2025
- **[Azure NetApp Files Flexible service level now supports cool access](<https://azure.microsoft.com/updates?id=500712>)** — Azure NetApp Files Flexible service level now supports cool access in preview as of August 20, 2025. This enables configuration of storage optimized for infrequently accessed data with independent control over capacity and throughput.
  - Flexible service level in Azure NetApp Files adds support for cool access tier
  - Allows separate configuration of storage capacity and throughput
  - Targeted at workloads with high-capacity, low-throughput needs
  - Feature is currently in preview as of August 20, 2025
- **[Private Preview: DCesv6 and ECesv6 series confidential VMs with Intel® TDX](<https://azure.microsoft.com/updates?id=489745>)** — Azure has launched a private preview of its next-generation DCesv6 and ECesv6 confidential VM series, featuring 5th Gen Intel Xeon processors with Intel TDX support.
  - Private preview available for DCesv6 and ECesv6 confidential VM series
  - Powered by 5th Gen Intel Xeon (Emerald Rapids) processors
  - Includes Intel Trust Domain Extensions (TDX) for enhanced security
  - Announced on 2025-08-20
- **[Microsoft Sentinel Deprecation in Microsoft Azure operated by 21Vianet Announcement](<https://azure.microsoft.com/updates?id=498754>)** — Microsoft Sentinel will be deprecated in Microsoft Azure operated by 21Vianet, effective August 20, 2025, due to infrastructure and operational complexity.
  - Microsoft Sentinel service will be retired in Azure operated by 21Vianet.
  - Deprecation date is August 20, 2025.
  - Reason cited is increasing infrastructure and operational complexity.
- **[Microsoft Defender for Cloud Deprecation in Microsoft Azure Operated by 21Vianet Announcement](<https://azure.microsoft.com/updates?id=498749>)** — Microsoft Defender for Cloud will be deprecated in Microsoft Azure operated by 21Vianet, effective August 20, 2025.
  - Defender for Cloud service will be retired in Azure operated by 21Vianet.
  - Deprecation takes effect on August 20, 2025.
  - Reason cited: increasing infrastructure and operational complexity.
- **[Azure Blob Storage Archive Tier Now in Malaysia West](<https://azure.microsoft.com/updates?id=500630>)** — Azure Blob Storage Archive access tier is now generally available in the Malaysia West region as of August 18, 2025.
  - Archive tier for Azure Blob Storage launched in Malaysia West region
  - Allows storage of infrequently accessed data at lower cost
  - Supports data residency requirements for Malaysia

