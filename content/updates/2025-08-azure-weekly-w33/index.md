+++
title = 'Azure Weekly – 2025 Week 33'
date = 2025-08-13T12:50:21Z
lastmod = 2025-08-14T05:40:48Z
draft = false
tags = ['updates', 'weekly', 'azure']
description = 'Highlights from Azure between 2025-08-11 and 2025-08-17.'
[params]
    author = 'sujith'
+++
## This period at a glance

**Window:** 2025-08-11 → 2025-08-17 (Europe/Brussels)

- **[Logic Apps Community Day 2025](https://techcommunity.microsoft.com/blog/integrationsonazureblog/logic-apps-community-day-2025/4442668)** — Microsoft announced Logic Apps Community Day 2025, scheduled for October 30, 2025 (Pacific Time), featuring a full day of learning focused on Logic Apps.
  - Logic Apps Community Day 2025 will be held on October 30, 2025 (Pacific Time).
  - The event is a full day dedicated to learning about Logic Apps.
  - Participants are encouraged to join and engage as key contributors.
- **[Azure App Testing: Playwright Workspaces for Local-to-Cloud Test Runs](https://techcommunity.microsoft.com/blog/appsonazureblog/azure-app-testing-playwright-workspaces-for-local-to-cloud-test-runs/4442711)** — Azure announced Playwright Workspaces for Azure App Testing, enabling local, Azure Web App, and cloud-scale Playwright test runs with provided scripts and configurations.
  - Playwright Workspaces support running tests locally, against Azure Web Apps, and at cloud scale.
  - Sample app, scripts, configurations, and troubleshooting guidance are provided.
  - Announcement dated 2025-08-13 from Azure App Service and Playwright Testing teams.
- **[Simplifying Data Ingestion with Copy job – Reset Incremental Copy, Auto Table Creation, and JSON Format Support](https://blog.fabric.microsoft.com/en-US/blog/simplifying-data-ingestion-with-copy-job-reset-incremental-copy-auto-table-creation-and-json-format-support/)** — Microsoft Fabric Data Factory's Copy Job now supports resetting incremental copy, automatic table creation, and JSON format ingestion to simplify data movement across environments.
  - Copy Job in Microsoft Fabric Data Factory supports multiple delivery styles: bulk copy, incremental copy, and CDC replication.
  - New features include the ability to reset incremental copy jobs, enabling fresh data ingestion cycles.
  - Automatic table creation is now supported during data ingestion, reducing manual setup.
  - JSON format support has been added to Copy Job, expanding data format compatibility.
  - These updates aim to simplify data movement across clouds, on-premises systems, and services.
- **[Deployment resumption - Azure Automation revised Service and Subscription limits](<https://azure.microsoft.com/updates?id=500198>)** — Azure Automation resumed deployments of revised Service and Subscription limits starting August 11, 2025, to improve resource distribution and service reliability.
  - Deployment of revised Service and Subscription limits resumed on August 11, 2025.
  - Update aims to ensure fair distribution of cloud resources among customers.
  - Improvements target reliability and performance of Azure Automation services.
- **[Azure Managed Instance for Apache Cassandra v5.0 Generally Available!](https://devblogs.microsoft.com/cosmosdb/azure-managed-instance-for-apache-cassandra-v5-0-generally-available/)** — Azure Managed Instance for Apache Cassandra has reached general availability for version 5.0 as of August 13, 2025. This update delivers new features and performance improvements for cloud-native applications.
  - Azure Managed Instance for Apache Cassandra upgraded to version 5.0.
  - Version 5.0 is now generally available as of August 13, 2025.
  - Update includes new features and performance enhancements.
  - Applies to Cosmos DB service under Apache Cassandra Managed Instance.
- **[Announcing Extended Support for Azure Database for MySQL](https://techcommunity.microsoft.com/blog/adformysql/announcing-extended-support-for-azure-database-for-mysql/4442924)** — Microsoft announced a new paid Extended Support offering for Azure Database for MySQL to enhance customer success and operational continuity.
  - Extended Support for Azure Database for MySQL is now available as a paid option.
  - The offering aims to help customers maintain operational continuity beyond standard support periods.
  - Announcement date: August 13, 2025.
- **[Build lightweight AI Apps on Azure App Service with gpt-oss-20b](https://techcommunity.microsoft.com/blog/appsonazureblog/build-lightweight-ai-apps-on-azure-app-service-with-gpt-oss-20b/4442885)** — Azure announced support for the open-weight gpt-oss-20b language model on Azure App Service, enabling lightweight AI app development with cost-efficient, high-performance models under the Apache 2.0 license.
  - OpenAI released gpt-oss-20b, an open-weight language model with strong real-world performance and low cost.
  - gpt-oss-20b is available under the Apache 2.0 license, allowing flexible use.
  - Azure App Service now supports building lightweight AI applications using gpt-oss-20b.
  - This update was announced on August 13, 2025, by Azure.
- **[Azure Cosmos DB for MongoDB (vCore) encryption with customer-managed key](<https://azure.microsoft.com/updates?id=499670>)** — Azure Cosmos DB for MongoDB (vCore) now offers a preview feature allowing encryption with customer-managed keys in addition to the existing service-managed key encryption.
  - Data in Azure Cosmos DB for MongoDB (vCore) clusters is encrypted by default with Microsoft-managed keys.
  - A new preview feature enables an additional encryption layer using customer-managed keys.
  - This update enhances security options for Cosmos DB users.
- **[Azure Database for PostgreSQL flexible server in Malaysia West](<https://azure.microsoft.com/updates?id=499679>)** — Azure Database for PostgreSQL flexible server is now generally available in the Malaysia West Azure region as of August 13, 2025.
  - Azure Database for PostgreSQL flexible server launched in Malaysia West region.
  - Update type is General Availability (GA).
- **[Azure Managed Instance for Apache Cassandra v5.0](<https://azure.microsoft.com/updates?id=499753>)** — Azure Managed Instance for Apache Cassandra now supports Cassandra version 5.0 in public preview, offering improved performance and new indexing features.
  - Azure Managed Instance for Apache Cassandra updated to support Cassandra 5.0.
  - New features include better performance and enhanced indexing capabilities.
  - This update is currently available in public preview.
  - No infrastructure management required by users.
- **[Azure Developer CLI: From Dev to Prod with Azure DevOps Pipelines](https://devblogs.microsoft.com/devops/azure-developer-cli-from-dev-to-prod-with-azure-devops-pipelines/)** — Azure DevOps Blog announced a method to implement dev-to-prod promotion using Azure DevOps YAML pipelines with Azure Developer CLI (azd), enabling consistent deployments across environments.
  - Demonstrates 'build once, deploy everywhere' pattern with Azure DevOps Pipelines.
  - Leverages Azure Developer CLI (azd) for deployment consistency.
  - Follows up on previous GitHub Actions implementation with Azure DevOps approach.
  - Focuses on environment-specific infrastructure management.
- **[Exciting News: Azure AI Blogs Have Come Together in the New Azure AI Foundry Blog](https://techcommunity.microsoft.com/blog/azure-ai-services-blog/exciting-news-azure-ai-blogs-have-come-together-in-the-new-azure-ai-foundry-blog/4442996)** — Microsoft has consolidated several Azure AI Tech Community blogs into a single Azure AI Foundry blog to streamline content delivery.
  - Multiple Azure AI Tech Community blogs merged into the new Azure AI Foundry blog.
  - This change aims to simplify access to Azure AI content.
  - Announcement dated August 13, 2025.
- **[Azure DevOps OAuth Client Secrets Now Shown Only Once](https://devblogs.microsoft.com/devops/azure-devops-oauth-client-secrets-now-shown-only-once/)** — Azure DevOps will change how OAuth client secrets are displayed starting September 2025, showing them only once at creation to enhance security.
  - Starting September 2025, Azure DevOps OAuth client secrets will be shown only once at creation.
  - After creation, client secrets cannot be retrieved via UI or API.
  - Change aligns with industry best practices to improve security posture.
- **[Private Pod Subnets in AKS Without Overlay Networking](https://techcommunity.microsoft.com/blog/appsonazureblog/private-pod-subnets-in-aks-without-overlay-networking/4442510)** — Azure Kubernetes Service (AKS) now supports private pod subnets without requiring overlay networking, addressing IP address space concerns in corporate network deployments.
  - AKS clusters can be deployed with private pod subnets that do not use overlay networking.
  - This update helps optimize IP address space usage within corporate networks.
  - The announcement was made by Azure on August 12, 2025.
  - Relevant services include Kubernetes Service and Virtual Network.
- **[🚀 General Availability: Enhanced Data Mapper Experience in Logic Apps (Standard)](<https://techcommunity.microsoft.com/blog/integrationsonazureblog/%F0%9F%9A%80-general-availability-enhanced-data-mapper-experience-in-logic-apps-standard/4442296>)** — Azure Logic Apps (Standard) extension for Visual Studio Code has reached General Availability for its redesigned Data Mapper user experience.
  - The redesigned Data Mapper UX is now generally available in the Logic Apps (Standard) extension for Visual Studio Code.
  - This update improves the data mapping experience within Logic Apps development.
  - The release was announced on August 12, 2025, by Azure.
- **[Supercharge Data Intelligence: Build Teams App with Azure Databricks Genie & Azure AI Agent Service](https://techcommunity.microsoft.com/blog/analyticsonazure/supercharge-data-intelligence-build-teams-app-with-azure-databricks-genie--azure/4442653)** — Microsoft announced at BUILD 2025 the integration of Azure Databricks Genie with Azure AI Agent Service to enhance data intelligence capabilities within Teams apps.
  - Integration announced between Azure Databricks Genie and Azure AI Agent Service.
  - This integration enables building Teams applications that leverage advanced data intelligence.
  - Announcement made at Microsoft BUILD 2025 event on August 12, 2025.
- **[Hunting Living Secrets: Secret Validity Checks Arrive in GitHub Advanced Security for Azure DevOps](https://devblogs.microsoft.com/devops/hunting-living-secrets-secret-validity-checks-arrive-in-github-advanced-security-for-azure-devops/)** — GitHub Advanced Security for Azure DevOps now includes secret validity checks that label secret scanning alerts as Active or Unknown, helping users identify which secrets are currently dangerous.
  - Introduced secret validity checks in GitHub Advanced Security for Azure DevOps and standalone Secret Protection.
  - Alerts now include a field indicating if a secret is Active (still usable) or Unknown (could not be verified).
  - This enhancement helps reduce noise by highlighting which secrets pose immediate risk.
  - Announcement dated August 12, 2025, from Azure DevOps Blog.
- **[Public Preview: Auto agent upgrade for Azure Arc-enabled servers](https://techcommunity.microsoft.com/blog/azurearcblog/public-preview-auto-agent-upgrade-for-azure-arc-enabled-servers/4442556)** — Azure Arc-enabled servers now support a public preview feature for automatic upgrades of the Azure Connected Machine agent, ensuring servers stay updated with the latest management capabilities and fixes.
  - Introduced public preview of auto agent upgrade for Azure Arc-enabled servers.
  - Automatically keeps Azure Connected Machine agent up to date.
  - Enhances server management by applying latest capabilities and fixes seamlessly.
- **[Real-Time Security with Continuous Access Evaluation (CAE) comes to Azure DevOps](https://devblogs.microsoft.com/devops/real-time-security-with-continuous-access-evaluation-cae-comes-to-azure-devops/)** — Azure DevOps now supports Continuous Access Evaluation (CAE) from Microsoft Entra ID, enabling near real-time enforcement of Conditional Access policies in development workflows.
  - Continuous Access Evaluation (CAE) is integrated into Azure DevOps as of August 12, 2025.
  - CAE allows near real-time security enforcement of Conditional Access policies.
  - This update enhances security for Azure DevOps users by leveraging Microsoft Entra ID capabilities.
- **[Load data from network-protected Azure Storage accounts to Microsoft OneLake with AzCopy](https://blog.fabric.microsoft.com/en-US/blog/load-data-from-network-protected-azure-storage-accounts-to-microsoft-onelake-with-azcopy/)** — AzCopy now supports copying data from firewall-enabled Azure Storage accounts to Microsoft OneLake using trusted workspace access, enhancing secure data transfer capabilities.
  - AzCopy is the preferred tool for large-scale data movement between Azure Storage and Microsoft OneLake due to its performance and ease of use.
  - The update enables copying data from network-protected (firewall-enabled) Azure Storage accounts to OneLake.
  - Trusted workspace access is used to facilitate secure data transfer.
  - Announcement dated August 12, 2025, from Azure.

