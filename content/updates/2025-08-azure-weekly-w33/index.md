+++
title = 'Azure Weekly – 2025 Week 33'
date = 2025-08-13T12:50:21Z
lastmod = 2025-08-14T06:50:28Z
draft = false
tags = ['updates', 'weekly', 'azure']
description = 'Highlights from Azure between 2025-08-11 and 2025-08-17 — explore updates, new features, bug fixes, and important enhancements for this period.'
[params]
    author = 'sujith'
+++
## This period at a glance

**Window:** 2025-08-11 → 2025-08-17 (Europe/Brussels)

- **[Logic Apps Community Day 2025](https://techcommunity.microsoft.com/blog/integrationsonazureblog/logic-apps-community-day-2025/4442668)** — Microsoft announced Logic Apps Community Day 2025, scheduled for October 30, 2025 (Pacific Time), offering a full day of learning focused on Logic Apps.
  - Logic Apps Community Day 2025 will take place on October 30, 2025, Pacific Time.
  - The event is a full day dedicated to learning about Logic Apps.
  - Participants are encouraged to join and engage in the community event.
- **[Azure App Testing: Playwright Workspaces for Local-to-Cloud Test Runs](https://techcommunity.microsoft.com/blog/appsonazureblog/azure-app-testing-playwright-workspaces-for-local-to-cloud-test-runs/4442711)** — Azure announced Playwright Workspaces for Azure App Testing, enabling local-to-cloud test runs for Playwright tests on Azure Web Apps. The update includes sample apps, scripts, configurations, and troubleshooting guidance.
  - Introduces Playwright Workspaces to run tests locally, against Azure Web Apps, and at cloud scale.
  - Provides sample app cloning, scripts, configurations, and troubleshooting resources.
  - Supports seamless local-to-cloud testing workflows for Playwright on Azure App Service.
- **[Simplifying Data Ingestion with Copy job – Reset Incremental Copy, Auto Table Creation, and JSON Format Support](https://blog.fabric.microsoft.com/en-US/blog/simplifying-data-ingestion-with-copy-job-reset-incremental-copy-auto-table-creation-and-json-format-support/)** — Microsoft Fabric Data Factory's Copy Job now supports resetting incremental copy, automatic table creation, and JSON format ingestion, enhancing data movement capabilities across clouds and on-premises systems.
  - Copy Job in Microsoft Fabric Data Factory supports bulk copy, incremental copy, and CDC replication.
  - New features include resetting incremental copy to manage data ingestion states.
  - Automatic table creation is now supported during data ingestion.
  - JSON format support has been added for flexible data handling.
  - These updates simplify data movement across cloud and on-premises environments.
- **[Deployment resumption - Azure Automation revised Service and Subscription limits](<https://azure.microsoft.com/updates?id=500198>)** — Azure Automation resumed deployments of revised Service and Subscription limits starting August 11, 2025, to improve resource distribution and service reliability.
  - Deployment of revised Service and Subscription limits resumed on August 11, 2025.
  - Update aims to ensure fair distribution of cloud resources among customers.
  - Improvements target reliability and performance of Azure Automation services.
- **[Azure Managed Instance for Apache Cassandra v5.0 Generally Available!](https://devblogs.microsoft.com/cosmosdb/azure-managed-instance-for-apache-cassandra-v5-0-generally-available/)** — Azure Managed Instance for Apache Cassandra has reached general availability for version 5.0, offering new features and performance improvements.
  - Azure Managed Instance for Apache Cassandra upgraded to version 5.0.
  - Version 5.0 introduces new features and performance enhancements.
  - Update is generally available as of August 13, 2025.
  - Relevant for developers and data platform teams using Cosmos DB with Apache Cassandra MI.
- **[Announcing Extended Support for Azure Database for MySQL](https://techcommunity.microsoft.com/blog/adformysql/announcing-extended-support-for-azure-database-for-mysql/4442924)** — Microsoft announced a paid Extended Support offering for Azure Database for MySQL to enhance customer success and operational continuity.
  - Extended Support for Azure Database for MySQL is now available as a paid service.
  - The offering aims to help customers maintain operational continuity beyond standard support periods.
  - Announcement date: August 13, 2025.
- **[Build lightweight AI Apps on Azure App Service with gpt-oss-20b](https://techcommunity.microsoft.com/blog/appsonazureblog/build-lightweight-ai-apps-on-azure-app-service-with-gpt-oss-20b/4442885)** — Azure announced the availability of gpt-oss-20b, an open-weight language model under Apache 2.0 license, for building lightweight AI applications on Azure App Service.
  - gpt-oss-20b is an open-weight language model introduced by OpenAI, offering strong performance at low cost.
  - The model is available under the Apache 2.0 license, enabling flexible use.
  - Azure App Service now supports building lightweight AI apps using gpt-oss-20b.
  - Announcement date: August 13, 2025.
- **[Azure Cosmos DB for MongoDB (vCore) encryption with customer-managed key](<https://azure.microsoft.com/updates?id=499670>)** — Azure Cosmos DB for MongoDB (vCore) now offers a preview feature allowing encryption with customer-managed keys in addition to the default service-managed keys.
  - Data in Azure Cosmos DB for MongoDB (vCore) clusters is encrypted by default with Microsoft-managed keys.
  - A new preview feature enables customers to use their own encryption keys for an additional security layer.
  - This update applies to the Cosmos DB service and was announced on 2025-08-13.
- **[Azure Database for PostgreSQL flexible server in Malaysia West](<https://azure.microsoft.com/updates?id=499679>)** — Azure Database for PostgreSQL flexible server is now generally available in the Malaysia West Azure region as of August 13, 2025.
  - Azure Database for PostgreSQL flexible server deployment is now supported in the Malaysia West region.
  - This update is a general availability (GA) release dated August 13, 2025.
- **[Azure Managed Instance for Apache Cassandra v5.0](<https://azure.microsoft.com/updates?id=499753>)** — Azure Managed Instance for Apache Cassandra now supports Cassandra 5.0 in public preview, offering improved performance and new indexing features.
  - Cassandra 5.0 is available in Azure Managed Instance for Apache Cassandra as a public preview.
  - New features include better performance and enhanced indexing capabilities.
  - This update reduces infrastructure management overhead for users.
- **[Azure Developer CLI: From Dev to Prod with Azure DevOps Pipelines](https://devblogs.microsoft.com/devops/azure-developer-cli-from-dev-to-prod-with-azure-devops-pipelines/)** — Azure DevOps Blog published a guide on using Azure Developer CLI (azd) with Azure DevOps YAML pipelines to implement a "build once, deploy everywhere" pattern for consistent deployments from development to production.
  - Demonstrates dev-to-prod promotion using Azure DevOps Pipelines with azd.
  - Follows previous guidance on GitHub Actions with a similar deployment pattern.
  - Focuses on environment-specific infrastructure management for reliable deployments.
- **[Exciting News: Azure AI Blogs Have Come Together in the New Azure AI Foundry Blog](https://techcommunity.microsoft.com/blog/azure-ai-services-blog/exciting-news-azure-ai-blogs-have-come-together-in-the-new-azure-ai-foundry-blog/4442996)** — Microsoft has consolidated several Azure AI Tech Community blogs into a single Azure AI Foundry blog to streamline content delivery. This change affects Azure AI Services content as of August 13, 2025.
  - Multiple Azure AI Tech Community blogs merged into the new Azure AI Foundry blog.
  - Change announced on August 13, 2025, by Microsoft Azure.
  - Aims to streamline access to Azure AI content for users.
- **[Azure DevOps OAuth Client Secrets Now Shown Only Once](https://devblogs.microsoft.com/devops/azure-devops-oauth-client-secrets-now-shown-only-once/)** — Starting September 2025, Azure DevOps will display newly generated OAuth client secrets only once at creation, after which they cannot be retrieved via UI or API. This change aligns with security best practices to enhance overall security posture.
  - New OAuth client secrets in Azure DevOps shown only once at creation starting September 2025.
  - Secrets will not be retrievable afterward via UI or API.
  - Change improves security by aligning with industry best practices.
- **[Private Pod Subnets in AKS Without Overlay Networking](https://techcommunity.microsoft.com/blog/appsonazureblog/private-pod-subnets-in-aks-without-overlay-networking/4442510)** — Azure announced support for private pod subnets in AKS clusters without requiring overlay networking, addressing IP address space concerns when deploying AKS within corporate networks.
  - AKS clusters can now use private pod subnets without overlay networking.
  - This update helps reduce IP address space requirements in corporate network deployments.
  - Improves network integration and management for AKS clusters.
- **[🚀 General Availability: Enhanced Data Mapper Experience in Logic Apps (Standard)](<https://techcommunity.microsoft.com/blog/integrationsonazureblog/%F0%9F%9A%80-general-availability-enhanced-data-mapper-experience-in-logic-apps-standard/4442296>)** — Azure Logic Apps (Standard) extension for Visual Studio Code has reached General Availability for its redesigned Data Mapper user experience.
  - The redesigned Data Mapper UX is now generally available in the Logic Apps (Standard) extension for Visual Studio Code.
  - This update enhances the data mapping experience within Logic Apps development.
  - The announcement was made on August 12, 2025, by Azure.
- **[Supercharge Data Intelligence: Build Teams App with Azure Databricks Genie & Azure AI Agent Service](https://techcommunity.microsoft.com/blog/analyticsonazure/supercharge-data-intelligence-build-teams-app-with-azure-databricks-genie--azure/4442653)** — Microsoft announced at BUILD 2025 the integration of Azure Databricks Genie with Azure AI Agent Service to enhance data intelligence capabilities within Teams apps.
  - Integration announced between Azure Databricks Genie and Azure AI Agent Service.
  - This integration enables building Teams applications that leverage advanced data intelligence.
  - Announcement made at Microsoft BUILD 2025 event on August 12, 2025.
- **[Hunting Living Secrets: Secret Validity Checks Arrive in GitHub Advanced Security for Azure DevOps](https://devblogs.microsoft.com/devops/hunting-living-secrets-secret-validity-checks-arrive-in-github-advanced-security-for-azure-devops/)** — GitHub Advanced Security for Azure DevOps now includes secret validity checks that indicate whether detected secrets are active or unknown, helping users prioritize alerts.
  - Introduced secret validity checks in GitHub Advanced Security for Azure DevOps and standalone Secret Protection.
  - Each secret scanning alert now includes a field showing if the secret is Active (still usable) or Unknown (validity could not be determined).
  - Feature aims to reduce noise by helping users identify which secrets are currently dangerous.
  - Announcement dated August 12, 2025, from Azure DevOps Blog.
- **[Public Preview: Auto agent upgrade for Azure Arc-enabled servers](https://techcommunity.microsoft.com/blog/azurearcblog/public-preview-auto-agent-upgrade-for-azure-arc-enabled-servers/4442556)** — Azure Arc-enabled servers now support a public preview feature for automatic upgrades of the Azure Connected Machine agent, ensuring servers stay updated with the latest management capabilities and fixes.
  - Introduced public preview of auto agent upgrade for Azure Arc-enabled servers.
  - Automatically keeps Azure Connected Machine agent up to date.
  - Enhances server management by applying latest capabilities and fixes seamlessly.
- **[Real-Time Security with Continuous Access Evaluation (CAE) comes to Azure DevOps](https://devblogs.microsoft.com/devops/real-time-security-with-continuous-access-evaluation-cae-comes-to-azure-devops/)** — Azure DevOps now supports Continuous Access Evaluation (CAE) from Microsoft Entra ID, enabling near real-time enforcement of Conditional Access policies for enhanced security in development workflows.
  - Continuous Access Evaluation (CAE) is integrated into Azure DevOps as of August 12, 2025.
  - CAE allows near real-time enforcement of Conditional Access policies.
  - This update enhances security by providing immediate policy enforcement during development activities.
  - The feature leverages Microsoft Entra ID capabilities.
  - Announcement pertains to Azure DevOps and Microsoft Entra ID services.
- **[Load data from network-protected Azure Storage accounts to Microsoft OneLake with AzCopy](https://blog.fabric.microsoft.com/en-US/blog/load-data-from-network-protected-azure-storage-accounts-to-microsoft-onelake-with-azcopy/)** — AzCopy now supports copying data from firewall-enabled Azure Storage accounts to Microsoft OneLake using trusted workspace access, enhancing secure large-scale data transfers.
  - AzCopy is the preferred tool for large-scale data movement between Azure Storage and Microsoft OneLake.
  - New support added for copying data from network-protected (firewall-enabled) Azure Storage accounts.
  - Trusted workspace access enables secure data transfer to OneLake.
  - Update announced on 2025-08-12 by Azure.

