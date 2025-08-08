+++
title = '🎓 AZ-900: Azure Fundamentals study guide'
slug = 'azure-certification-journey-az-900'
date = '2025-08-08 10:00:00Z'
lastmod = '2025-08-08 10:00:00Z'
draft = true
tags = [
  "Azure",
  "Certification",
  "AZ-900",
  "Cloud Fundamentals",
  "Study Guide"
]
categories = [
  "Cloud Computing",
  "Certification",
  "Azure"
]
series = [
  "Azure Certification Journey"
]

layout = "single"
[params]
    cover = true
    author = "sujith"
    cover_prompt = '''Create a clean, modern technical illustration for a blog post about
    preparing for the AZ-900 Azure Fundamentals exam. Use Azure branding colours
    (blue/teal) with minimalist icons for cloud, regions, governance, and cost
    management. Depict a learning path timeline (weeks 1-3), resource icons (Docs,
    Learn, sandbox), and simple CLI terminal. Include subtle circuit and network
    motifs with geometric shapes. Style should appeal to cloud engineers and
    learners, professional and enterprise-ready. Add small labels like "Cloud
    concepts", "Core services", "Security & governance", and "Cost management".'''

description = "Kick-start your Azure Certification Journey with a clear, actionable AZ-900 study plan, resources, and validation steps."
+++

## Why this guide

This is a concise, current, and practical study guide for AZ-900 (Azure Fundamentals). It aligns to Microsoft’s official study guide and certification page, includes hands-on labs, and gives quick knowledge checks so you can validate understanding as you go.

### Official references (bookmark these)

- Study guide: [Study guide for Exam AZ-900: Microsoft Azure Fundamentals](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900)
- Certification page (practice assessment, sandbox, scheduling): [Microsoft Certified: Azure Fundamentals](https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/)
- Instructor-led course: [Course AZ-900T00: Introduction to Microsoft Azure](https://learn.microsoft.com/en-us/training/courses/az-900t00)

## Exam overview

- Purpose: Validate foundational knowledge of cloud concepts and core Azure services, plus governance and management.
- Passing score: 700/1000.
- Duration: See “Exam duration and experience” on the certification page; Microsoft indicates you’ll have a short timed assessment window and a proctored experience.
- Languages: Multiple (see certification page for the current list).
- Practice first: Use the official [Practice assessment](https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/practice/assessment?assessment-type=practice&assessmentId=23&practice-assessment-type=certification) and the [Exam sandbox](https://go.microsoft.com/fwlink/?linkid=2226877) to get familiar with the interface.

## Skills measured (mapped to the official guide)

Percentages are shown on the official study guide and summarised below. Use these as study weightings.

### Describe cloud concepts (about 25–30%)

- Core ideas: what cloud computing is, the shared responsibility model, public vs private vs hybrid, consumption-based pricing, and when you’d use each model.
- Benefits: availability, scalability, reliability, predictability, security/governance, and manageability—know what each means and when it matters.
- Service types: IaaS, PaaS, SaaS—recognise examples and typical use cases for each.

### Describe Azure architecture and services (about 35–40%)

- Core architecture: regions, region pairs, availability zones, resource groups, subscriptions, management groups; understand the hierarchy.
- Compute and networking: VMs, scale sets, containers, Functions; VNets, subnets, peering, DNS, VPN Gateway, ExpressRoute; public vs private endpoints.
- Storage: Blob, Files, Tables, Queues; hot/cool/archive tiers; redundancy options (LRS/ZRS/GRS/GZRS); common migration/movement tools (AzCopy, Storage Explorer, Azure Migrate, Data Box).
- Identity and security: Microsoft Entra ID (and Domain Services), auth methods (SSO, MFA, passwordless), external identities (B2B/B2C), Conditional Access, RBAC, Zero Trust, defence-in-depth, Microsoft Defender for Cloud.

### Describe Azure management and governance (about 30–35%)

- Cost management: what affects cost, pricing vs TCO calculators, Cost Management features, purpose of tags.
- Governance and compliance: Azure Policy (enforce guardrails), resource locks (delete/modify protections), Microsoft Purview (data governance).
- Manage and deploy: Azure portal, Cloud Shell (CLI/PowerShell), Azure Arc, infrastructure as code (ARM templates/Bicep concepts), Resource Manager.
- Monitoring: Azure Advisor (recommendations), Service Health (service incidents/maintenance), Azure Monitor (metrics/logs), Log Analytics, Alerts, Application Insights.

## Core concepts explained briefly

- Cloud models: Public (Microsoft-hosted shared infrastructure), Private (your own dedicated environment), Hybrid (mix); choose based on control, compliance, and agility needs.
- Regions and zones: Regions are geographic areas; availability zones are separate datacentres within a region for higher availability. Zone-redundant services keep running even if one zone fails.
- Service selection: Prefer PaaS when possible (less admin, faster delivery). Use IaaS when you need full OS control. Use containers for portability and density; Functions for event-driven workloads.
- Storage tiers and redundancy: Hot for frequent access, cool for infrequent, archive for long-term. LRS (one region), ZRS (across zones), GRS/GZRS (geo-redundant). Pick for durability and recovery objectives.
- Governance basics: Use management groups and subscriptions to segment and delegate. Apply Policy for guardrails, tags for cost/showback, and locks to prevent accidental deletion.
- SLA thinking: Multiply component SLAs to estimate end-to-end targets; use zones/replication to improve availability.

## Study plan (2–3 weeks, flexible)

Use the official study guide for depth and this plan for daily structure.

Week 1: Cloud concepts and Azure architecture

- Read the [AZ-900 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900) sections for “Describe cloud concepts” and “Core architectural components”.
- Lab: create a resource group, a VNet and subnet, and deploy a small VM.

Week 2: Core services and storage fundamentals

- Cover compute, networking, and storage topics. Learn tiers/redundancy and when to use Blob vs Files.
- Lab: upload/download blobs with AzCopy and set lifecycle rules.

Week 3: Identity, governance, monitoring, and cost

- Review Entra ID basics, RBAC, Conditional Access, and Zero Trust ideas. Learn Azure Policy, tags, and monitoring stack.
- Lab: set an RBAC role assignment, create a policy assignment, and configure alerts in Azure Monitor.

Tip: Take the official [practice assessment](https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/practice/assessment?assessment-type=practice&assessmentId=23&practice-assessment-type=certification) at the end of Week 2 and again just before the exam.

## Hands-on labs (Azure CLI)

All commands assume you’re authenticated with the Azure CLI. Use a free account where possible and clean up to avoid costs.

### 1) Resource group, network, and VM

```bash
az group create -n rg-az900-demo -l westeurope
az network vnet create -g rg-az900-demo -n vnet-az900 --address-prefixes 10.10.0.0/16 \
  --subnet-name snet-web --subnet-prefix 10.10.1.0/24
az vm create -g rg-az900-demo -n vm-az900 --image Ubuntu2204 --vnet-name vnet-az900 \
  --subnet snet-web --admin-username azureuser --generate-ssh-keys
```

### 2) Storage account and blob operations

```bash
az storage account create -g rg-az900-demo -n saaz900$RANDOM -l westeurope --sku Standard_LRS
ACCOUNT=$(az storage account list -g rg-az900-demo --query "[0].name" -o tsv)
az storage container create --name demo --account-name "$ACCOUNT" --auth-mode login
az storage blob upload --account-name "$ACCOUNT" --container-name demo \
  --file README.md --name sample.txt --auth-mode login
```

### 3) RBAC assignment for least privilege

```bash
USER_OBJ_ID=$(az ad signed-in-user show --query id -o tsv)
az role assignment create --assignee-object-id $USER_OBJ_ID \
  --assignee-principal-type User --role "Reader" --scope \
  "/subscriptions/$(az account show --query id -o tsv)/resourceGroups/rg-az900-demo"
```

### 4) Basic monitor alert on CPU for the VM

```bash
VMID=$(az vm show -g rg-az900-demo -n vm-az900 --query id -o tsv)
az monitor metrics alert create -g rg-az900-demo -n cpu-high \
  --scopes $VMID --condition "avg Percentage CPU > 80" --window-size 5m --evaluation-frequency 5m
```

Cleanup: delete the resource group when finished.

```bash
az group delete -n rg-az900-demo --yes --no-wait
```

## Preparation strategy and tips

- Prioritise breadth over deep implementation detail—this is a fundamentals exam.
- Anchor study around the official [study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900) and certification [page](https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/).
- Practice recognising which Azure service to pick for common scenarios (VM vs App Service vs Functions; Blob vs Files; VPN vs ExpressRoute).
- Use the practice assessment twice and the sandbox once.
- Keep a glossary: regions, zones, management groups, RBAC, Policy, GRS/GZRS, Conditional Access, Zero Trust.

## Quick knowledge checks

1) Which service type fits “deploy code without managing servers”? Answer: Functions (serverless, PaaS).
2) You need cross-zone resilience in the same region. Which storage redundancy? Answer: ZRS or GZRS (zone-redundant).
3) Prevent accidental deletion of a resource group. What to use? Answer: Resource lock (CanNotDelete or ReadOnly).
4) Enforce naming rules and restrict SKUs in a subscription. What to use? Answer: Azure Policy.
5) Grant read-only access to a team for a single resource group. What to use? Answer: RBAC “Reader” at the RG scope.
6) Choose between VPN Gateway and ExpressRoute. Rule of thumb? Answer: VPN for internet-based encrypted connectivity; ExpressRoute for private, predictable connectivity.

## Cost awareness

- Prefer free tiers and short-lived resources for labs. Turn off or delete what you don’t need.
- Use tags like cost-centre and environment for visibility. Review Cost Management weekly.
- Compare pricing with the [Pricing calculator](https://azure.microsoft.com/pricing/calculator/) and assess longer-term shifts with the [TCO Calculator](https://azure.microsoft.com/pricing/tco-calculator/).

## Microsoft Learn alignment

- Study guide (skills, scope, changes): [AZ-900 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900)
- Certification (practice, sandbox, scheduling): [Azure Fundamentals certification](https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/)
- Instructor-led option: [AZ-900T00 course](https://learn.microsoft.com/en-us/training/courses/az-900t00)

## What’s next

This is Part 1 in the Azure Certification Journey series. Next up is Part 2: AZ-104 (Azure Administrator)—identity, compute, storage, networking, and monitoring in practice.

## References

- [Study guide for Exam AZ-900](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900)
- [Microsoft Certified: Azure Fundamentals](https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/)
- [Course AZ-900T00: Introduction to Microsoft Azure](https://learn.microsoft.com/en-us/training/courses/az-900t00)
