+++
title = 'Azure Weekly – 2025 Week 33'
date = 2025-08-13T12:50:21Z
lastmod = 2025-08-13T12:50:21Z
draft = false
tags = ['updates', 'weekly', 'azure']
description = 'Highlights from Azure between 2025-08-11 and 2025-08-17.'
[params]
    author = 'sujith'
+++
## This period at a glance

**Window:** 2025-08-11 → 2025-08-17 (Europe/Brussels)

- **[Azure App Testing: Playwright Workspaces for Local-to-Cloud Test Runs](https://techcommunity.microsoft.com/blog/appsonazureblog/azure-app-testing-playwright-workspaces-for-local-to-cloud-test-runs/4442711)** — Azure announced Playwright Workspaces for Azure App Testing, enabling running Playwright tests locally, against Azure Web Apps, and at cloud scale. The update includes sample apps, scripts, configurations, and troubleshooting guidance.
  - Playwright Workspaces support local, Azure Web App, and cloud-scale test runs.
  - Sample app and scripts provided for easy setup.
  - Includes configuration files and troubleshooting tips.
- **[Load data from network-protected Azure Storage accounts to Microsoft OneLake with AzCopy](https://blog.fabric.microsoft.com/en-US/blog/load-data-from-network-protected-azure-storage-accounts-to-microsoft-onelake-with-azcopy/)** — AzCopy now supports copying data from firewall-enabled Azure Storage accounts to Microsoft OneLake using trusted workspace access, enhancing secure large-scale data movement.
  - AzCopy is the preferred tool for large-scale data transfer between Azure Storage and Microsoft OneLake due to performance optimizations.
  - New support enables copying data from network-protected (firewall-enabled) Azure Storage accounts.
  - Trusted workspace access is used to facilitate secure data transfer.
  - This update was announced by Azure on 2025-08-12.
- **[Private Pod Subnets in AKS Without Overlay Networking](https://techcommunity.microsoft.com/blog/appsonazureblog/private-pod-subnets-in-aks-without-overlay-networking/4442510)** — Azure Kubernetes Service (AKS) now supports private pod subnets without requiring overlay networking, addressing IP address space concerns in corporate network deployments.
  - AKS clusters can be deployed with private pod subnets directly within corporate networks.
  - This update removes the need for overlay networking, optimizing IP address space usage.
  - Relevant services include Kubernetes Service and Virtual Network.
  - Announcement date: August 12, 2025.
- **[Real-Time Security with Continuous Access Evaluation (CAE) comes to Azure DevOps](https://devblogs.microsoft.com/devops/real-time-security-with-continuous-access-evaluation-cae-comes-to-azure-devops/)** — Azure DevOps now supports Continuous Access Evaluation (CAE) from Microsoft Entra ID, enabling near real-time enforcement of Conditional Access policies in development workflows.
  - Continuous Access Evaluation (CAE) is integrated into Azure DevOps as of August 12, 2025.
  - CAE provides near real-time security enforcement for Conditional Access policies.
  - This update enhances security in Azure DevOps development workflows.
  - The feature leverages Microsoft Entra ID capabilities.
- **[OneLake costs simplified: lowering capacity utilization when accessing OneLake](https://blog.fabric.microsoft.com/en-US/blog/onelake-costs-simplified-lowering-capacity-utilization-when-accessing-onelake/)** — Azure Fabric announced a simplification in OneLake's capacity utilization model on 2025-08-12, reducing the consumption rate of OneLake transactions via proxy to match those via redirect.
  - OneLake transaction consumption rates via proxy are now aligned with redirect rates.
  - This change simplifies managing Fabric capacity and scaling data workloads.
  - The update aims to lower capacity utilization costs when accessing OneLake.
- **[Hunting Living Secrets: Secret Validity Checks Arrive in GitHub Advanced Security for Azure DevOps](https://devblogs.microsoft.com/devops/hunting-living-secrets-secret-validity-checks-arrive-in-github-advanced-security-for-azure-devops/)** — GitHub Advanced Security for Azure DevOps now includes secret validity checks that indicate whether detected secrets are active or unknown in usability, improving alert signal quality.
  - Introduced secret validity checks in GitHub Advanced Security for Azure DevOps and standalone Secret Protection.
  - Alerts now include a field showing if a secret is Active (still usable) or Unknown (usability could not be determined).
  - This enhancement helps users prioritize and assess secret scanning alerts more effectively.
  - Announcement date: August 12, 2025.
- **[Supercharge Data Intelligence: Build Teams App with Azure Databricks Genie & Azure AI Agent Service](https://techcommunity.microsoft.com/blog/analyticsonazure/supercharge-data-intelligence-build-teams-app-with-azure-databricks-genie--azure/4442653)** — Microsoft announced at BUILD 2025 the integration of Azure Databricks Genie with Azure AI Agent Service to enhance data intelligence capabilities within Teams apps.
  - Integration enables building Teams applications that leverage Azure Databricks Genie and Azure AI Agent Service.
  - Aims to maximize data investment value by combining Azure Databricks with Azure AI.
  - Announcement made at Microsoft BUILD 2025 event on August 12, 2025.
- **[🚀 General Availability: Enhanced Data Mapper Experience in Logic Apps (Standard)](<https://techcommunity.microsoft.com/blog/integrationsonazureblog/%F0%9F%9A%80-general-availability-enhanced-data-mapper-experience-in-logic-apps-standard/4442296>)** — Azure Logic Apps (Standard) extension for Visual Studio Code has reached General Availability for its redesigned Data Mapper user experience.
  - The redesigned Data Mapper UX is now generally available in the Logic Apps (Standard) extension for Visual Studio Code.
  - This update enhances the data mapping experience within Logic Apps development.
  - The release was announced on August 12, 2025, by Azure.
- **[Public Preview: Auto agent upgrade for Azure Arc-enabled servers](https://techcommunity.microsoft.com/blog/azurearcblog/public-preview-auto-agent-upgrade-for-azure-arc-enabled-servers/4442556)** — Azure Arc-enabled servers now support a public preview feature for automatic upgrades of the Azure Connected Machine agent, ensuring servers have the latest management capabilities and fixes.
  - Introduced auto agent upgrade feature in public preview for Azure Arc-enabled servers.
  - Automatically keeps the Azure Connected Machine agent up to date with latest capabilities and fixes.
  - Feature announced on 2025-08-12 via Azure Tech Community blog.
- **[Introducing support for Workspace Identity Authentication in Fabric Connectors](https://blog.fabric.microsoft.com/en-US/blog/announcing-support-for-workspace-identity-authentication-in-new-fabric-connectors-and-for-dataflow-gen2/)** — Microsoft Fabric now supports workspace identity authentication for Fabric connectors.
  - Feature: Workspace identity authentication for Fabric connectors.
  - Applies to: Microsoft Fabric (excluding My Workspaces).
  - Announced on: 2025-08-11.
  - Source: Azure blog.
- **[Announcing Tenant-Level Service Health Alerts in Azure Monitor](<https://azure.microsoft.com/updates?id=499776>)** — Azure Monitor has introduced Tenant-Level Service Health Alerts in preview, allowing customers to get proactive notifications about service health issues affecting their entire tenant rather than individual subscriptions.
  - New preview feature: Tenant-Level Service Health Alerts in Azure Monitor.
  - Alerts notify about service health issues impacting the entire tenant.
  - Improves monitoring beyond individual subscription scope.
- **[Introducing Azure App Testing: Scalable End-to-end App Validation](<https://azure.microsoft.com/updates?id=500203>)** — Azure introduced Azure App Testing in preview on August 11, 2025, enabling scalable end-to-end functional and performance testing for applications.
  - Azure App Testing supports large-scale tests using frameworks such as Playwright, JMeter, and Locust.
  - The service combines load testing and Playwright testing capabilities for comprehensive app validation.
  - This update is available as a preview feature from August 11, 2025.
- **[General Available: App Service Inbound IPv6 Support](<https://azure.microsoft.com/updates?id=499998>)** — Azure App Service now generally supports inbound IPv6 on public multi-tenant apps across all public regions for Basic, Standard, Premium SKUs, Functions Consumption, Functions Elastic Premium, and Logic Apps Standard.
  - Inbound IPv6 support is generally available on public multi-tenant App Service.
  - Coverage includes all public Azure regions.
  - Supported SKUs: Basic, Standard, Premium, Functions Consumption, Functions Elastic Premium, Logic Apps Standard.
- **[Announcing GA of Bicep templates support for Microsoft Entra ID resources](https://devblogs.microsoft.com/identity/bicep-templates-for-microsoft-entra-id-resources-is-ga/)** — Bicep templates support for Microsoft Entra ID resources reached general availability on July 29, 2025, enabling declarative infrastructure as code for core Entra ID resources via Microsoft Graph.
  - Bicep templates for Microsoft Entra ID resources are generally available as of July 29, 2025.
  - This feature enables declarative infrastructure as code for core Microsoft Entra ID resources using Microsoft Graph.
  - Initially, support is focused on core Entra ID resources.
- **[Upsert and Script Activity in Azure Data Factory and Azure Synapse Analytics for Azure Database for PostgreSQL](<https://azure.microsoft.com/updates?id=499748>)** — Azure Data Factory and Azure Synapse Analytics now generally support the Upsert method and Script activity for Azure Database for PostgreSQL as of August 11, 2025.
  - General availability of Upsert method in Azure Data Factory and Synapse Analytics for Azure Database for PostgreSQL.
  - Support for Script activity added in these services for the same database.
  - Enhancement enables efficient, scalable, and declarative data operations.
- **[Customer-managed keys for Fabric workspaces is now in Public Preview](https://blog.fabric.microsoft.com/en-US/blog/customer-managed-keys-for-fabric-workspaces-available-in-all-public-regions-now-preview/)** — Customer-managed keys (CMK) for Microsoft Fabric workspaces are now in public preview across all public regions as of August 11, 2025.
  - Feature: Customer-managed keys (CMK) for Microsoft Fabric workspaces.
  - Availability: Public preview in all public regions.
  - Purpose: Enhances compliance and data protection strategies.
  - Date: Released on August 11, 2025.
- **[How Microsoft OneLake seamlessly provides Apache Iceberg support for all Fabric Data](https://blog.fabric.microsoft.com/en-US/blog/how-to-access-your-microsoft-fabric-tables-in-apache-iceberg-format/)** — Microsoft OneLake now supports accessing Microsoft Fabric tables in Apache Iceberg format.
  - Microsoft Fabric uses Delta Lake as the standard table format.
  - Microsoft OneLake enables seamless support for Apache Iceberg format.
  - This update enhances data unification and accessibility in Microsoft Fabric.

