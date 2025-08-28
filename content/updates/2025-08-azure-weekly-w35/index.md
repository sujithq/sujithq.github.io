+++
title = 'Azure Weekly – 2025 Week 35'
date = 2025-08-26T05:34:03Z
lastmod = 2025-08-28T05:34:03Z
draft = false
tags = ['updates', 'weekly', 'azure']
description = 'Highlights from Azure between 2025-08-25 and 2025-08-31 — explore updates, new features, bug fixes, and important enhancements for this period.'
[params]
    author = 'sujith'
+++
## This period at a glance

**Window:** 2025-08-25 → 2025-08-31 (Europe/Brussels)

- **[Azure SQL updates for late-August 2025](<https://azure.microsoft.com/updates?id=500780>)** — Azure SQL Database introduced a replication lag metric in late August 2025, available in preview. This metric provides real-time monitoring of recovery point objective (RPO) for Geo-DR-enabled databases.
  - Replication lag metric added to Azure SQL Database (preview)
  - Metric offers real-time RPO visibility for Geo-DR scenarios
  - Update released in late August 2025
- **[Schema migration is now available in Azure Database Migration Service (DMS)](<https://azure.microsoft.com/updates?id=500770>)** — Azure Database Migration Service (DMS) now supports schema migration for Azure SQL Database as of August 27, 2025. This feature is generally available and allows users to migrate missing schema objects along with data.
  - Schema migration for Azure SQL Database is now supported in Azure DMS.
  - Feature is generally available (GA) as of August 27, 2025.
  - Users can migrate missing schema objects together with data via a single checkbox option.
- **[Azure Cosmos DB for MongoDB (vCore)—add shards and rebalance data](<https://azure.microsoft.com/updates?id=500755>)** — Azure Cosmos DB for MongoDB (vCore) now supports adding physical shards and rebalancing data as clusters scale. This feature is available in preview as of August 27, 2025.
  - Physical shards can be added to Azure Cosmos DB for MongoDB (vCore) clusters.
  - Data rebalancing across shards is supported.
  - Feature is in preview as of August 27, 2025.
- **[Entra ID and RBAC support for GetAccountInfo and other supplemental APIs for Azure Storage](<https://azure.microsoft.com/updates?id=496287>)** — Azure Storage APIs now support Microsoft Entra ID and RBAC for enhanced security, effective August 26, 2025. This update is generally available and applies to several supplemental APIs.
  - Entra ID and RBAC support is now GA for Azure Storage supplemental APIs.
  - Affected APIs: GetAccountInfo, Get/Set Container ACL, Get/Set Queue ACL, Get/Set Table ACL.
  - Release date: August 26, 2025.
  - Update type: General Availability (GA).
- **[Custom block response code and body for Application Gateway WAF](<https://azure.microsoft.com/updates?id=501323>)** — Azure Application Gateway WAF now supports custom response status codes and bodies for blocked requests, available in public preview as of August 26, 2025.
  - Customizable response status codes and bodies for blocked requests in Application Gateway WAF
  - Feature available in public preview starting August 26, 2025
  - Applies to Azure Application Gateway with integrated WAF
- **[CNI Overlay for Application Gateway for Containers and AGIC](<https://azure.microsoft.com/updates?id=500991>)** — Azure has announced general availability of CNI Overlay support for Application Gateway for Containers and AGIC as of August 26, 2025. This enables AKS clusters to use pod IPs from a separate CIDR, optimizing VNet IP usage and simplifying multi-cluster deployments.
  - CNI Overlay with Application Gateway for Containers and AGIC is now generally available (GA) as of 2025-08-26.
  - AKS clusters can assign pod IPs from a separate CIDR, conserving VNet IP space.
  - Feature simplifies multi-cluster deployments and integration with Application Gateway Ingress Controller (AGIC).
- **[Azure NetApp Files short-term clones](<https://azure.microsoft.com/updates?id=500914>)** — Azure NetApp Files introduces short-term clones in preview, allowing users to create temporary, space-efficient thin clones from existing volume snapshots for instant read/write access without full data copies.
  - Feature: Short-term clones for Azure NetApp Files
  - Status: Preview release as of 2025-08-26
  - Enables temporary, thin clones from volume snapshots
  - Provides instant read/write access to cloned data
  - Reduces storage usage by avoiding full data copies
- **[Roslyn Analyzer for Durable Functions in .NET isolated](<https://azure.microsoft.com/updates?id=500473>)** — Azure Functions now supports the Roslyn Analyzer for Durable Functions in the .NET isolated model, providing real-time code analysis to enforce orchestration coding constraints. This feature is enabled by default and is currently in preview as of August 25, 2025.
  - Roslyn Analyzer support added for Durable Functions in .NET isolated model.
  - Provides real-time code analysis to enforce orchestration constraints.
  - Enabled by default.
  - Feature is in preview as of August 25, 2025.
- **[Microsoft Azure now available from cloud region in Austria](<https://azure.microsoft.com/updates?id=500650>)** — Microsoft Azure has launched a new cloud region in Austria, now generally available as of August 25, 2025. This enables local data storage and processing for Austrian organizations, supporting compliance and regional requirements.
  - Azure cloud region in Austria is now generally available (GA)
  - Supports secure, compliant data storage and processing for Austrian customers
  - Relevant services include Resource Mover

