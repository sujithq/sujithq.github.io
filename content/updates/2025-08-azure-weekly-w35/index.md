+++
title = 'Azure Weekly – 2025 Week 35'
date = 2025-08-26T05:34:03Z
lastmod = 2025-08-29T13:04:40Z
draft = false
tags = ['updates', 'weekly', 'azure']
description = 'Highlights from Azure between 2025-08-25 and 2025-08-31 — explore updates, new features, bug fixes, and important enhancements for this period.'
[params]
    author = 'sujith'
+++
## This period at a glance

**Window:** 2025-08-25 → 2025-08-31 (Europe/Brussels)

- **[Azure Database for PostgreSQL Entra ID group login using user credentials](https://azure.microsoft.com/updates?id=500790)** — Azure Database for PostgreSQL Flexible Server now supports public preview of Entra ID group login using user credentials on newly provisioned servers as of August 28, 2025.
  - Public preview of Entra ID group login with user credentials is available
  - Feature applies to newly provisioned Azure Database for PostgreSQL Flexible Servers
  - Aims to simplify user management and enhance security
- **[Azure SQL updates for late-August 2025](https://azure.microsoft.com/updates?id=500785)** — Azure SQL and SQL Server received updates in late August 2025, including general availability of local SQL Server containers via the MSSQL extension.
  - Local SQL Server containers are now generally available (GA)
  - Containers can be created using the MSSQL extension
  - Applies to SQL Database and Azure Arc services
- **[Azure SQL updates for late-August 2025](https://azure.microsoft.com/updates?id=500780)** — Azure SQL Database introduced a replication lag metric in late August 2025, available in preview. This metric provides real-time visibility into the recovery point objective (RPO) for databases with Geo-DR enabled.
  - Replication lag metric added to Azure SQL Database (preview)
  - Metric offers real-time RPO visibility for Geo-DR-enabled databases
  - Update released in late August 2025
- **[Schema migration is now available in Azure Database Migration Service (DMS)](https://azure.microsoft.com/updates?id=500770)** — Azure Database Migration Service (DMS) now supports schema migration for Azure SQL Database as of August 27, 2025. This feature is generally available and allows users to migrate missing schema objects alongside data.
  - Schema migration for Azure SQL Database is now supported in Azure DMS.
  - Feature is generally available (GA) as of August 27, 2025.
  - Users can migrate missing schema objects along with data by selecting a checkbox.
- **[Azure Cosmos DB for MongoDB (vCore)—add shards and rebalance data](https://azure.microsoft.com/updates?id=500755)** — Azure Cosmos DB for MongoDB (vCore) now supports adding physical shards and rebalancing data as clusters grow. This feature is available in preview as of August 27, 2025.
  - Ability to add physical shards (nodes) to vCore clusters
  - Supports data rebalancing across shards
  - Feature available in preview
  - Announced August 27, 2025
- **[Entra ID and RBAC support for GetAccountInfo and other supplemental APIs for Azure Storage](https://azure.microsoft.com/updates?id=496287)** — Azure Storage APIs now support Microsoft Entra ID and RBAC for enhanced security, generally available as of August 26, 2025.
  - Entra ID and RBAC support is now GA for Azure Storage supplemental APIs.
  - Affected APIs: GetAccountInfo, Get/Set Container ACL, Get/Set Queue ACL, Get/Set Table ACL.
  - Update released on August 26, 2025.
- **[Custom block response code and body for Application Gateway WAF](https://azure.microsoft.com/updates?id=501323)** — Azure Application Gateway WAF now supports custom response status codes and bodies for blocked requests in public preview as of August 26, 2025.
  - Customizable response status codes and bodies for blocked requests now available in Azure Application Gateway WAF.
  - Feature is in public preview starting August 26, 2025.
  - Applies to WAF integrated with Application Gateway.
- **[CNI Overlay for Application Gateway for Containers and AGIC](https://azure.microsoft.com/updates?id=500991)** — Azure has announced general availability of Azure CNI Overlay for Application Gateway for Containers and AGIC as of August 26, 2025. This feature allows AKS clusters to assign pod IPs from a separate CIDR, helping conserve VNet IP space and streamline multi-cluster deployments.
  - Azure CNI Overlay for Application Gateway for Containers and AGIC is now generally available (GA) as of August 26, 2025.
  - AKS clusters can use pod IPs from a separate CIDR, conserving VNet IP space.
  - Supports simplified multi-cluster deployments.
  - Relevant services: Kubernetes Service, Virtual Network, Application Gateway.
- **[Azure NetApp Files short-term clones](https://azure.microsoft.com/updates?id=500914)** — Azure NetApp Files introduces short-term clones in preview, allowing users to create temporary, thin clones from existing volume snapshots for instant read/write access without full data copies.
  - Short-term clones feature available in Azure NetApp Files (preview).
  - Enables space-efficient, temporary clones from volume snapshots.
  - Provides instant read/write access to cloned data.
  - Reduces storage requirements by avoiding full data duplication.
- **[Roslyn Analyzer for Durable Functions in .NET isolated](https://azure.microsoft.com/updates?id=500473)** — Azure Durable Functions in the .NET isolated model now supports the Roslyn Analyzer, providing real-time code analysis to enforce orchestration coding constraints. This feature is enabled by default and is currently in preview as of August 25, 2025.
  - Roslyn Analyzer support added for Durable Functions in .NET isolated model
  - Analyzer enforces coding constraints for durable orchestrations
  - Feature is enabled by default
  - Available in preview as of August 25, 2025
- **[Microsoft Azure now available from cloud region in Austria](https://azure.microsoft.com/updates?id=500650)** — Microsoft Azure has launched a new cloud region in Austria, now generally available as of August 25, 2025. This enables local data storage and processing for Austrian organizations, supporting compliance and secure operations.
  - Azure cloud region now available in Austria (GA)
  - Supports local data residency and compliance for Austrian customers
  - Resource Mover service included among available features
  - Launch date: August 25, 2025

