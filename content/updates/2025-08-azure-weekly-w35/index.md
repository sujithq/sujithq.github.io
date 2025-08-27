+++
title = 'Azure Weekly – 2025 Week 35'
date = 2025-08-26T05:34:03Z
lastmod = 2025-08-27T05:33:06Z
draft = false
tags = ['updates', 'weekly', 'azure']
description = 'Highlights from Azure between 2025-08-25 and 2025-08-31 — explore updates, new features, bug fixes, and important enhancements for this period.'
[params]
    author = 'sujith'
+++
## This period at a glance

**Window:** 2025-08-25 → 2025-08-31 (Europe/Brussels)

- **[Entra ID and RBAC support for GetAccountInfo and other supplemental APIs for Azure Storage](<https://azure.microsoft.com/updates?id=496287>)** — Entra ID and RBAC support is now generally available for several Azure Storage supplemental APIs as of August 26, 2025.
  - General availability of Entra ID and RBAC support for Azure Storage supplemental APIs
  - Affected APIs: GetAccountInfo, Get/Set Container ACL, Get/Set Queue ACL, Get/Set Table ACL
  - Update date: 2025-08-26
- **[Custom block response code and body for Application Gateway WAF](<https://azure.microsoft.com/updates?id=501323>)** — Azure Application Gateway WAF now supports custom response status codes and bodies for blocked requests in public preview as of August 26, 2025.
  - Customizable response status codes and bodies for blocked requests in WAF integrated with Application Gateway
  - Feature is in public preview
  - Announced August 26, 2025
- **[CNI Overlay for Application Gateway for Containers and AGIC](<https://azure.microsoft.com/updates?id=500991>)** — Azure CNI Overlay is now generally available for Application Gateway for Containers and AGIC as of August 26, 2025. This feature allows AKS clusters to assign pod IPs from a separate CIDR, optimizing VNet IP usage and supporting multi-cluster deployments.
  - Azure CNI Overlay GA for Application Gateway for Containers and AGIC
  - AKS clusters can use pod IPs from a separate CIDR
  - Helps conserve VNet IP space
  - Simplifies multi-cluster Kubernetes deployments
- **[Azure NetApp Files short-term clones](<https://azure.microsoft.com/updates?id=500914>)** — Azure NetApp Files introduces short-term clones in preview, allowing users to create temporary, space-efficient thin clones from existing volume snapshots for instant read/write access without full data copies.
  - Feature is in preview as of 2025-08-26.
  - Short-term clones are created from existing volume snapshots.
  - Clones are thin, temporary, and space-efficient.
  - Enables instant read/write access to cloned data.
  - Reduces capacity usage by avoiding full data copies.
- **[Roslyn Analyzer for Durable Functions in .NET isolated](<https://azure.microsoft.com/updates?id=500473>)** — Azure Durable Functions in the .NET isolated model now supports the Roslyn Analyzer, providing real-time code analysis for durable orchestrations. The analyzer is enabled by default and is currently in preview as of August 25, 2025.
  - Roslyn Analyzer support added for Durable Functions in .NET isolated model
  - Provides real-time code analysis to enforce orchestration coding constraints
  - Analyzer is enabled by default
  - Feature is in preview as of August 25, 2025
- **[Microsoft Azure now available from cloud region in Austria](<https://azure.microsoft.com/updates?id=500650>)** — Microsoft Azure has launched its cloud region in Austria, now generally available as of August 25, 2025. This enables local data storage and processing for Austrian organizations, supporting compliance and access to Azure services.
  - Azure cloud region in Austria is now generally available (GA) as of August 25, 2025.
  - Supports secure, compliant data storage and processing for Austrian companies and public administration.
  - Resource Mover service is available in this region.

