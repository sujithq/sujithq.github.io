+++
title = 'Azure Weekly – 2025 Week 35'
date = 2025-08-26T05:34:03Z
lastmod = 2025-08-31T05:32:31Z
draft = false
tags = ['updates', 'weekly', 'azure']
description = 'Highlights from Azure between 2025-08-25 and 2025-08-31 — explore updates, new features, bug fixes, and important enhancements for this period.'
[params]
    author = 'sujith'
+++
## This period at a glance

**Window:** 2025-08-25 → 2025-08-31 (Europe/Brussels)

- **[Azure Database for PostgreSQL Entra ID group login using user credentials](https://azure.microsoft.com/updates?id=500790)** — Azure Database for PostgreSQL Flexible Server introduces public preview of Entra ID group login using user credentials, available on newly provisioned servers as of August 28, 2025.
  - Public preview of Entra ID group login with user credentials for Azure Database for PostgreSQL Flexible Server.
  - Feature available on newly provisioned servers only.
  - Aims to simplify user management and enhance security.
  - Announced August 28, 2025.
- **[Azure SQL updates for late-August 2025](https://azure.microsoft.com/updates?id=500785)** — Azure SQL and SQL Server received updates in late August 2025, including the general availability of local SQL Server containers via the MSSQL extension.
  - Local SQL Server containers are now generally available (GA).
  - Containers can be created using the MSSQL extension.
  - Applies to SQL Database and Azure Arc services.
- **[Azure SQL updates for late-August 2025](https://azure.microsoft.com/updates?id=500780)** — Azure SQL Database introduced a replication lag metric in late August 2025, available in preview. This metric provides real-time visibility into the recovery point objective (RPO) for databases with Geo-DR enabled.
  - Replication lag metric added to Azure SQL Database (preview)
  - Metric shows real-time recovery point objective (RPO) for Geo-DR-enabled databases
  - Update released in late August 2025
- **[Schema migration is now available in Azure Database Migration Service (DMS)](https://azure.microsoft.com/updates?id=500770)** — Azure Database Migration Service (DMS) now supports schema migration for Azure SQL Database as of August 27, 2025. This feature is generally available and allows users to migrate missing schema objects alongside data.
  - Schema migration for Azure SQL Database is now supported in Azure DMS.
  - Feature is generally available (GA) as of August 27, 2025.
  - Users can migrate missing schema objects with data via a single checkbox.
- **[Azure Cosmos DB for MongoDB (vCore)—add shards and rebalance data](https://azure.microsoft.com/updates?id=500755)** — Azure Cosmos DB for MongoDB (vCore) now supports adding physical shards and rebalancing data as clusters scale. This feature is available in preview as of August 27, 2025.
  - Physical shards can be added to Azure Cosmos DB for MongoDB (vCore) clusters.
  - Data rebalancing across shards is supported.
  - Feature is in preview as of August 27, 2025.
- **[Entra ID and RBAC support for GetAccountInfo and other supplemental APIs for Azure Storage](https://azure.microsoft.com/updates?id=496287)** — Azure Storage APIs now support Microsoft Entra ID and RBAC for enhanced security, with general availability as of August 26, 2025.
  - General availability of Entra ID and RBAC support for Azure Storage supplemental APIs, including GetAccountInfo and ACL management for containers, queues, and tables.
  - Affects APIs: Get Account Information, Get/Set Container ACL, Get/Set Queue ACL, Get/Set Table ACL.
  - Applies globally as of August 26, 2025.
- **[Custom block response code and body for Application Gateway WAF](https://azure.microsoft.com/updates?id=501323)** — Azure Application Gateway WAF now offers a public preview for customizing block response status codes and bodies for blocked requests.
  - Public preview released on 2025-08-26
  - Customizable response status codes and bodies for blocked requests in Application Gateway WAF
  - Applies to Azure Application Gateway WAF integrated deployments
- **[CNI Overlay for Application Gateway for Containers and AGIC](https://azure.microsoft.com/updates?id=500991)** — Azure CNI Overlay is now generally available for Application Gateway for Containers and AGIC as of August 26, 2025. This feature allows AKS clusters to assign pod IPs from a separate CIDR, optimizing VNet IP usage and facilitating multi-cluster deployments.
  - Azure CNI Overlay GA for Application Gateway for Containers and AGIC (Aug 26, 2025)
  - AKS clusters can use pod IPs from a distinct CIDR, conserving VNet IP space
  - Supports simplified multi-cluster deployments
- **[Azure NetApp Files short-term clones](https://azure.microsoft.com/updates?id=500914)** — Azure NetApp Files introduces short-term clones in preview, allowing users to create temporary, space-efficient thin clones from existing volume snapshots for instant read/write access without full data copies.
  - Short-term clones feature now in preview for Azure NetApp Files.
  - Enables temporary thin clones from volume snapshots.
  - Provides instant read/write access to cloned data.
  - Reduces storage usage by avoiding full data copies.
- **[Roslyn Analyzer for Durable Functions in .NET isolated](https://azure.microsoft.com/updates?id=500473)** — Azure Durable Functions in the .NET isolated model now supports the Roslyn Analyzer for real-time code analysis, helping developers follow orchestration coding constraints. The analyzer is enabled by default in preview as of August 25, 2025.
  - Roslyn Analyzer support added for Durable Functions in .NET isolated model
  - Provides real-time code analysis for orchestration coding constraints
  - Analyzer is enabled by default
  - Feature is in preview as of August 25, 2025
- **[Microsoft Azure now available from cloud region in Austria](https://azure.microsoft.com/updates?id=500650)** — Microsoft Azure has launched a new cloud region in Austria, now generally available as of August 25, 2025. This enables local data storage and processing for Austrian organizations, supporting compliance and access to Azure services.
  - Azure cloud region now available in Austria (GA) as of August 25, 2025
  - Supports local data storage and processing for Austrian companies and public administration
  - Resource Mover service included among available features

