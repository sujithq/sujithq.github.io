# Azure Certification Journey - Series Plan

This document outlines the complete structure for the "Azure Certification Journey" blog series. Use this as a reference when creating each subsequent post to maintain consistency and logical progression.

## Important Note

**This series is aligned with Microsoft's official study guides** available at `https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/[exam-code]`. Each post will reference the current official study guide and cover the exact skills measured by Microsoft for each certification. Study guide links and skills measured sections are updated regularly to reflect Microsoft's latest exam requirements.

## Series Metadata

- **Series Name**: `Azure Certification Journey`
- **Total Parts**: 12
- **Target Audience**: Beginners to Advanced Azure practitioners
- **Focus**: Practical certification preparation with real-world examples
- **Progression**: AZ (Azure Core) → DP (Data Platform) → AI (Artificial Intelligence) → SC (Security & Compliance)

## Progress Tracker

### Series Progress: 1/12 (8%)

**Last Updated**: 2025-08-08

**Current Status**: Part 1 created (draft)

**Completed Posts**:

- Part 1: AZ-900 - Azure Fundamentals — slug: `azure-certification-journey-az-900` (Draft)

**Next Up**:

- 🎯 **Part 2: Azure Administrator (AZ-104)** (Target: 2025-08-21)

**Internal Linking Reference**:

- Hugo URL structure: `/posts/YYYY/MM/slug/`
- Series URL pattern: `azure-certification-journey-X`

**Quick Reference for Next Post**:

- **Slug**: `azure-certification-journey-az-104`
- **Focus**: Azure administration across identity, compute, storage, networking
- **Key Topics**: Entra ID and RBAC, VM and App Service, VNets and NSGs, Storage
- **Prerequisites**: AZ-900 knowledge
- **Builds To**: DevOps (AZ-400) and architecture tracks

### Progress by Track

| Track | Progress | Status |
|-------|----------|---------|
| **AZ - Azure Core (1-7)** | 1/7 (14%) | 🟡 In Progress |
| **DP - Data Platform (8)** | 0/1 (0%) | ⚪ Not Started |
| **AI - Artificial Intelligence (9-10)** | 0/2 (0%) | ⚪ Not Started |
| **SC - Security & Compliance (11-12)** | 0/2 (0%) | ⚪ Not Started |

## Complete Series Structure

### AZ - Azure Core Track (Parts 1-7)

#### Part 1: Azure Fundamentals (AZ-900)

- **Official Study Guide**: [AZ-900 Study Guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900)
- **Skills Measured** (as of January 23, 2024):
  - **Describe cloud concepts (25–30%)**:
    - Define cloud computing and shared responsibility model
    - Define cloud models (public, private, hybrid) and appropriate use cases
    - Describe consumption-based model and cloud pricing models
    - Describe benefits of cloud services (availability, scalability, reliability, security)
    - Describe cloud service types (IaaS, PaaS, SaaS) and use cases
  - **Describe Azure architecture and services (35–40%)**:
    - Describe core architectural components (regions, availability zones, resources, subscriptions)
    - Describe Azure compute and networking services (VMs, containers, functions, networking)
    - Describe Azure storage services (storage accounts, tiers, redundancy)
    - Describe Azure identity, access, and security (Microsoft Entra ID, RBAC, Zero Trust)
  - **Describe Azure management and governance (30–35%)**:
    - Describe cost management (pricing calculator, TCO calculator, cost management tools)
    - Describe governance and compliance features (Azure Policy, resource locks, Microsoft Purview)
    - Describe management and deployment tools (Azure portal, Cloud Shell, ARM templates)
    - Describe monitoring tools (Azure Advisor, Service Health, Azure Monitor)
- **Focus**: Azure cloud fundamentals and core service overview
- **Target Audience**: Beginners to cloud and Azure
- **Prerequisites**: Basic IT knowledge
- **Key Learning**: Azure cloud fundamentals and service overview
- **Builds To**: All Azure role-based technical certifications
- **Study Duration**: 3-4 weeks
- **Exam Details**:
  - Duration: 85 minutes
  - Question types: Multiple choice, drag-and-drop
  - Passing score: 700/1000
  - Cost: £99 (may vary by region)

#### Part 2: Azure Administrator (AZ-104)

- **Official Study Guide**: [AZ-104 Study Guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-104)
- **Skills Measured** (as of April 18, 2025):
  - **Manage Azure identities and governance (20–25%)**:
    - Manage Microsoft Entra users and groups (create users/groups, manage properties, licenses, external users, SSPR)
    - Manage access to Azure resources (built-in roles, role assignments, interpret access)
    - Manage Azure subscriptions and governance (Azure Policy, resource locks, tags, resource groups, subscriptions, costs, management groups)
  - **Implement and manage storage (15–20%)**:
    - Configure access to storage (firewalls, SAS tokens, access policies, access keys, identity-based access)
    - Configure and manage storage accounts (create accounts, redundancy, replication, encryption, Storage Explorer, AzCopy)
    - Configure Azure Files and Blob Storage (file shares, containers, storage tiers, soft delete, snapshots, lifecycle management, versioning)
  - **Deploy and manage Azure compute resources (20–25%)**:
    - Automate deployment using ARM templates or Bicep files
    - Create and configure virtual machines (VM creation, disk encryption, sizing, disks, availability zones/sets, VM Scale Sets)
    - Provision and manage containers (Container Registry, Container Instances, Container Apps, sizing and scaling)
    - Create and configure Azure App Service (App Service plans, scaling, certificates/TLS, custom DNS, backup, networking, deployment slots)
  - **Implement and manage virtual networking (15–20%)**:
    - Configure and manage virtual networks (create VNets/subnets, VNet peering, public IP addresses, user-defined routes, troubleshoot connectivity)
    - Configure secure access to virtual networks (NSGs, application security groups, Azure Bastion, service/private endpoints)
    - Configure name resolution and load balancing (Azure DNS, internal/public load balancer, troubleshoot load balancing)
  - **Monitor and maintain Azure resources (10–15%)**:
    - Monitor resources in Azure (interpret metrics, configure logs, query/analyze logs, alerts and action groups, monitoring insights, Network Watcher)
    - Implement backup and recovery (Recovery Services vault, Azure Backup vault, backup policies, backup/restore operations, Azure Site Recovery, failover, reports/alerts)
- **Key Learning**: Azure infrastructure administration
- **Prerequisites**: AZ-900 or equivalent knowledge
- **Builds To**: Expert-level architecture and DevOps certifications
- **Exam Details**:
  - Duration: 150 minutes
  - Question types: Multiple choice, case studies, lab simulations
  - Passing score: 700/1000

#### Part 3: Azure Developer (AZ-204)

- **Official Study Guide**: [AZ-204 Study Guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-204)
- **Skills Measured** (as of July 21, 2025):
  - **Develop Azure compute solutions (25–30%)**:
    - Implement containerized solutions (create/manage container images, publish to Container Registry, run with Container Instances, create solutions with Container Apps)
    - Implement Azure App Service Web Apps (create Web Apps, configure diagnostics/logging, deploy code/containers, configure TLS/API settings/service connections, implement autoscaling, configure deployment slots)
    - Implement Azure Functions (create/configure Functions app, implement input/output bindings, implement triggers using data operations/timers/webhooks)
  - **Develop for Azure storage (15–20%)**:
    - Develop solutions that use Azure Cosmos DB (perform operations with SDK, set consistency levels, implement change feed notifications)
    - Develop solutions that use Azure Blob Storage (set/retrieve properties and metadata, perform operations with appropriate SDK, implement storage policies and lifecycle management)
  - **Implement Azure security (15–20%)**:
    - Implement user authentication and authorization (authenticate with Microsoft Identity platform, authenticate with Microsoft Entra ID, create/implement shared access signatures, interact with Microsoft Graph)
    - Implement secure Azure solutions (secure app configuration with Azure App Configuration/Key Vault, develop code using keys/secrets/certificates from Key Vault, implement Managed Identities)
  - **Monitor, troubleshoot, and optimize Azure solutions (5–10%)**:
    - Monitor and troubleshoot solutions using Application Insights (monitor/analyze metrics/logs/traces, implement web tests and alerts, instrument apps/services)
  - **Connect to and consume Azure services and third-party services (20–25%)**:
    - Implement Azure API Management (create instances, create/document APIs, configure access, implement policies)
    - Develop event-based solutions (implement solutions using Azure Event Grid, implement solutions using Azure Event Hubs)
    - Develop message-based solutions (implement solutions using Azure Service Bus, implement solutions using Azure Queue Storage queues)
- **Key Learning**: Azure application development
- **Prerequisites**: Programming experience, AZ-900 knowledge
- **Builds To**: DevOps and solution architecture paths
- **Exam Details**:
  - Duration: 150 minutes
  - Question types: Multiple choice, case studies, lab simulations
  - Passing score: 700/1000

#### Part 4: Azure DevOps Engineer (AZ-400)

- **Official Study Guide**: [AZ-400 Study Guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-400)
- **Skills Measured** (as of July 26, 2024):
  - **Design and implement processes and communications (10–15%)**
    - Design and implement traceability and flow of work
    - Design and implement appropriate metrics and queries for DevOps
    - Configure collaboration and communication
  - **Design and implement a source control strategy (10–15%)**
    - Design and implement branching strategies for the source code
    - Configure and manage repositories
  - **Design and implement build and release pipelines (50–55%)**
    - Design and implement a package management strategy
    - Design and implement a testing strategy for pipelines
    - Design and implement pipelines
    - Design and implement deployments
    - Design and implement infrastructure as code (IaC)
    - Maintain pipelines
  - **Develop a security and compliance plan (10–15%)**
    - Design and implement authentication and authorization methods
    - Design and implement a strategy for managing sensitive information in automation
    - Automate security and compliance scanning
  - **Implement an instrumentation strategy (5–10%)**
    - Configure monitoring for a DevOps environment
    - Analyze metrics from instrumentation
- **Topics**:
  - Configure processes and communications (Azure DevOps, GitHub)
  - Design and implement source control strategies (Git, branching)
  - Design and implement build and release pipelines (YAML, CI/CD)
  - Develop a security and compliance plan (secrets management, policies)
  - Implement an instrumentation strategy (monitoring, logging, telemetry)
  - Hands-on pipeline development and automation
- **Key Learning**: Azure DevOps and automation expertise
- **Prerequisites**: Development or operations experience
- **Builds To**: DevOps architect and platform engineering roles
- **Exam Details**:
  - Duration: 150 minutes
  - Question types: Multiple choice, case studies, lab simulations
  - Passing score: 700/1000

#### Part 5: Azure Solutions Architect (AZ-305)

- **Official Study Guide**: [AZ-305 Study Guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-305)
- **Skills Measured** (as of October 18, 2024):
  - **Design identity, governance, and monitoring solutions (25–30%)**
    - Design solutions for logging and monitoring
    - Design authentication and authorization solutions
    - Design governance
  - **Design data storage solutions (20–25%)**
    - Design data storage solutions for relational data
    - Design data storage solutions for semi-structured and unstructured data
    - Design data integration
  - **Design business continuity solutions (15–20%)**
    - Design solutions for backup and disaster recovery
    - Design for high availability
  - **Design infrastructure solutions (30–35%)**
    - Design compute solutions
    - Design an application architecture
    - Design migrations
    - Design network solutions
- **Topics**:
  - Design identity, governance, and monitoring solutions
  - Design data storage and integration solutions
  - Design business continuity solutions (backup, disaster recovery)
  - Design infrastructure solutions (compute, networking, migration)
  - Advanced architecture patterns and decision frameworks
  - Case study analysis and solution design
- **Key Learning**: Enterprise Azure solution architecture
- **Prerequisites**: AZ-104 and one other associate certification
- **Builds To**: Technical leadership and consulting roles
- **Exam Details**:
  - Duration: 150 minutes
  - Question types: Multiple choice, case studies, design scenarios
  - Passing score: 700/1000

#### Part 6: Azure Security Engineer (AZ-500)

- **Official Study Guide**: [AZ-500 Study Guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-500)
- **Skills Measured** (as of January 31, 2025):
  - **Secure identity and access (15–20%)**
    - Manage security controls for identity and access
    - Manage Microsoft Entra application access
  - **Secure networking (20–25%)**
    - Plan and implement security for virtual networks
    - Plan and implement security for private access to Azure resources
    - Plan and implement security for public access to Azure resources
  - **Secure compute, storage, and databases (20–25%)**
    - Plan and implement advanced security for compute
    - Plan and implement security for storage
    - Plan and implement security for Azure SQL Database and Azure SQL Managed Instance
  - **Secure Azure using Microsoft Defender for Cloud and Microsoft Sentinel (30–35%)**
    - Implement and manage enforcement of cloud governance policies
    - Manage security posture by using Microsoft Defender for Cloud
    - Configure and manage threat protection by using Microsoft Defender for Cloud
    - Configure and manage security monitoring and automation solutions
- **Topics**:
  - Manage identity and access (Microsoft Entra ID, PIM, conditional access)
  - Implement platform protection (network security, host security)
  - Manage security operations (monitoring, SIEM, incident response)
  - Secure data and applications (encryption, classification, threat protection)
  - Hands-on security configurations and monitoring tools
- **Key Learning**: Azure security implementation and management
- **Prerequisites**: Azure administration and networking knowledge
- **Builds To**: Security architect and compliance roles
- **Exam Details**:
  - Duration: 150 minutes
  - Question types: Multiple choice, case studies, lab simulations
  - Passing score: 700/1000

#### Part 7: Azure Network Engineer (AZ-700)

- **Official Study Guide**: [AZ-700 Study Guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-700)
- **Skills Measured** (as of October 25, 2024):
  - **Design and implement core networking infrastructure (25–30%)**
    - Design and implement IP addressing for Azure resources
    - Design and implement name resolution
    - Design and implement VNet connectivity and routing
    - Monitor networks
  - **Design, implement, and manage connectivity services (20–25%)**
    - Design, implement, and manage a site-to-site VPN connection
    - Design, implement, and manage a point-to-site VPN connection
    - Design, implement, and manage Azure ExpressRoute
    - Design and implement an Azure Virtual WAN architecture
  - **Design and implement application delivery services (15–20%)**
    - Design and implement Azure Load Balancer and Azure Traffic Manager
    - Design and implement Azure Application Gateway
    - Design and implement Azure Front Door
  - **Design and implement private access to Azure services (10–15%)**
    - Design and implement Azure Private Link service and Azure private endpoints
    - Design and implement service endpoints
  - **Design and implement Azure network security services (15–20%)**
    - Implement and manage network security groups
    - Design and implement Azure Firewall and Azure Firewall Manager
    - Design and implement a Web Application Firewall (WAF) deployment
- **Topics**:
  - Design, implement, and manage hybrid networking (VPN, ExpressRoute)
  - Design and implement core networking infrastructure (VNets, routing, DNS)
  - Design and implement routing and load balancing (Application Gateway, Load Balancer)
  - Secure and monitor networks (NSGs, Firewall, Network Watcher)
  - Design and implement Private Access to Azure Services (Private Link, Service Endpoints)
  - Hands-on network configuration and troubleshooting
- **Key Learning**: Azure networking specialisation
- **Prerequisites**: Azure fundamentals and networking knowledge
- **Builds To**: Network architect and infrastructure roles
- **Exam Details**:
  - Duration: 150 minutes
  - Question types: Multiple choice, case studies, lab simulations
  - Passing score: 700/1000

### DP - Data Platform Track (Part 8)

#### Part 8: Azure Cosmos DB Developer (DP-420)

- **Official Study Guide**: [DP-420 Study Guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/dp-420)
- **Skills Measured** (as of January 27, 2025):
  - **Design and implement data models (35-40%)**:
    - Design and implement a non-relational data model for Azure Cosmos DB for NoSQL (multi-entity containers, related entities in documents, denormalization, document referencing, key identification, access patterns, TTL configuration, document/schema versioning)
    - Design a data partitioning strategy (partitioning strategy selection, partition key choice, transaction planning, cross-partition query costs, data/throughput distribution evaluation, synthetic/hierarchical partition keys, multi-partition key workloads)
    - Plan and implement sizing and scaling (throughput/storage requirements, serverless/provisioned/free model selection, database-level provisioned throughput, granular scale units, global distribution costs, Azure portal configuration)
    - Implement client connectivity options (gateway vs direct connectivity, connection creation, Cosmos DB emulator, connection error handling, client singleton, region specification, threading/parallelism configuration, SDK logging)
    - Implement data access using SQL language (arrays/nested objects/aggregation/ordering queries, correlated subqueries, array/type-checking functions, mathematical/string/date functions, variable-based queries)
    - Implement data access using NoSQL SDKs (point vs query operations, CRUD operations, patch operations, transactional batch, bulk support, optimistic concurrency/ETags, consistency overrides, session consistency/tokens, pagination, continuation tokens, error handling, document TTL, query metrics)
    - Implement server-side programming using JavaScript (stored procedures, triggers, user-defined functions, multi-document transactions)
  - **Design and implement data distribution (5-10%)**:
    - Design and implement a replication strategy (data distribution decisions, automatic failover policies, manual failovers, consistency model selection, use case identification, availability/RU cost impact, performance/latency impact, application connection specification)
    - Design and implement multi-region write (multi-region write decisions, implementation, custom conflict resolution policies)
  - **Integrate an Azure Cosmos DB solution (5-10%)**:
    - Enable Azure Cosmos DB analytical workloads (Synapse Link enablement, Synapse Link vs Spark Connector, analytical store configuration, custom partitioning, Synapse Spark/SQL connections, transactional store queries, write-back operations, Change Data Capture, time travel)
    - Implement solutions across services (Azure Functions/Event Hubs integration, Change Feed denormalization/referential integrity/aggregation/archiving, Azure AI Search integration)
  - **Optimize an Azure Cosmos DB solution (15-20%)**:
    - Optimize query performance (index adjustments, query cost calculation, request unit cost retrieval, integrated cache implementation)
    - Design and implement change feeds (Azure Functions triggers, SDK-based consumption, change feed estimator, denormalization/referential enforcement/aggregation/archiving)
    - Define and implement an indexing strategy (read-heavy vs write-heavy strategies, index type selection, custom indexing policies, composite indexes, performance optimization)
  - **Maintain an Azure Cosmos DB solution (25-30%)**:
    - Monitor and troubleshoot (response status/failure metrics, normalized throughput usage, server-side latency, data replication monitoring, Azure Monitor alerts, log implementation/querying, partition throughput/distribution monitoring, security logging/auditing)
    - Implement backup and restore (periodic vs continuous backup, periodic backup configuration, continuous backup/recovery, recovery point location, database/container recovery)
    - Implement security (service-managed vs customer-managed encryption keys, network-level access control, data encryption, control plane RBAC, Data Explorer RBAC, data plane Entra ID access, CORS configuration, Key Vault account key management, customer-managed keys, Always Encrypted)
    - Implement data movement (data movement strategy selection, SDK bulk operations, Azure Data Factory/Synapse pipelines, Kafka connector, Stream Analytics, Spark Connector, IoT Hub custom endpoint configuration)
    - Implement a DevOps process (declarative vs imperative operations, ARM template resource management, PowerShell/CLI throughput migration, PowerShell/CLI regional failover, ARM template indexing policies)
- **Focus**: Advanced Cosmos DB development and optimisation
- **Target Audience**: Developers and database specialists
- **Prerequisites**: Database experience and Azure development knowledge
- **Key Learning**: Azure Cosmos DB development patterns and NoSQL database expertise
- **Builds To**: NoSQL architect and database specialist roles
- **Study Duration**: 6-8 weeks
- **Exam Details**:
  - Duration: 150 minutes
  - Question types: Multiple choice, case studies, lab simulations
  - Passing score: 700/1000

### AI - Artificial Intelligence Track (Parts 9-10)

#### Part 9: Azure AI Fundamentals (AI-900)

- **Official Study Guide**: [AI-900 Study Guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-900)
- **Skills Measured** (as of May 2, 2025):
  - **Describe Artificial Intelligence workloads and considerations (15-20%)**:
    - Identify features of common AI workloads (computer vision, NLP, document processing, generative AI)
    - Identify guiding principles for responsible AI (fairness, reliability, safety, privacy, security, inclusiveness, transparency, accountability)
  - **Describe fundamental principles of machine learning on Azure (15-20%)**:
    - Identify common machine learning techniques (regression, classification, clustering, deep learning, Transformer architecture)
    - Describe core machine learning concepts (features, labels, training/validation datasets)
    - Describe Azure Machine Learning capabilities (automated ML, data/compute services, model management/deployment)
  - **Describe features of computer vision workloads on Azure (15-20%)**:
    - Identify common types of computer vision solutions (image classification, object detection, OCR, facial detection/analysis)
    - Identify Azure tools and services for computer vision tasks (AI Vision service, AI Face detection service)
  - **Describe features of Natural Language Processing (NLP) workloads on Azure (15-20%)**:
    - Identify features of common NLP scenarios (key phrase extraction, entity recognition, sentiment analysis, language modeling, speech recognition/synthesis, translation)
    - Identify Azure tools and services for NLP workloads (AI Language service, AI Speech service)
  - **Describe features of generative AI workloads on Azure (20-25%)**:
    - Identify features of generative AI solutions (models, common scenarios, responsible AI considerations)
    - Identify generative AI services in Microsoft Azure (AI Foundry, OpenAI service, AI Foundry model catalog)
- **Focus**: Understanding AI concepts and Azure AI services
- **Target Audience**: Beginners to AI and cloud technologies
- **Prerequisites**: Basic technical knowledge
- **Key Learning**: Azure AI fundamentals and service overview
- **Builds To**: AI-102 and advanced AI certifications
- **Study Duration**: 3-4 weeks
- **Exam Details**:
  - Duration: 85 minutes
  - Question types: Multiple choice
  - Passing score: 700/1000
  - Cost: £99 (may vary by region)

#### Part 10: Azure AI Engineer (AI-102)

- **Official Study Guide**: [AI-102 Study Guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-102)
- **Skills Measured** (as of April 30, 2025):
  - **Plan and manage an Azure AI solution (20-25%)**:
    - Select the appropriate Azure AI Foundry services (generative AI, computer vision, NLP, speech, information extraction, knowledge mining)
    - Plan, create and deploy an Azure AI Foundry service (Responsible AI principles, resource creation, model selection/deployment, SDKs/APIs, CI/CD integration, container deployment)
    - Manage, monitor, and secure an Azure AI Foundry Service (monitoring, cost management, key protection, authentication)
    - Implement AI solutions responsibly (content moderation, safety insights, content filters/blocklists, prompt shields, governance framework)
  - **Implement generative AI solutions (15-20%)**:
    - Build generative AI solutions with Azure AI Foundry (project deployment, model selection, prompt flow, RAG patterns, evaluation, SDK integration)
    - Use Azure OpenAI in Foundry Models to generate content (resource provisioning, model deployment, prompt submission, DALL-E, application integration, multimodal models, Assistants)
    - Optimize and operationalize a generative AI solution (parameter configuration, monitoring/diagnostics, resource optimization, tracing/feedback, orchestration, prompt engineering, fine-tuning)
  - **Implement an agentic solution (5-10%)**:
    - Create custom agents (agent understanding, resource configuration, Azure AI Foundry Agent Service, Semantic Kernel/Autogen, multi-agent workflows, testing/deployment)
  - **Implement computer vision solutions (10-15%)**:
    - Analyze images (visual features, object detection, image tags, text extraction, handwriting conversion)
    - Implement custom vision models (classification vs detection, labeling, training, evaluation, publishing, consumption, code-first approach)
    - Analyze videos (Video Indexer insights, Spatial Analysis for presence/movement detection)
  - **Implement natural language processing solutions (15-20%)**:
    - Analyze and translate text (key phrase extraction, entity recognition, sentiment analysis, language detection, PII detection, translation)
    - Process and translate speech (generative speaking, text-to-speech/speech-to-text, SSML, custom speech, intent/keyword recognition, speech translation)
    - Implement custom language models (intents/entities/utterances, training/evaluation/deployment, optimization/backup/recovery, client integration, Q&A projects, multi-turn conversations, multi-language solutions, custom translation)
  - **Implement knowledge mining and information extraction solutions (15-20%)**:
    - Implement an Azure AI Search solution (resource provisioning, index/skillset creation, data sources/indexers, custom skills, querying, Knowledge Store projections, semantic/vector solutions)
    - Implement an Azure AI Document Intelligence solution (resource provisioning, prebuilt models, custom models, training/testing/publishing, composed models)
    - Extract information with Azure AI Content Understanding (OCR pipelines, document summarization/classification, entity/table/image extraction, multi-media processing)
- **Focus**: Advanced AI solution development and implementation
- **Target Audience**: Developers and AI practitioners
- **Prerequisites**: Programming experience and AI-900 knowledge
- **Key Learning**: Azure AI service implementation and integration
- **Builds To**: AI architect and specialised AI roles
- **Study Duration**: 6-8 weeks
- **Exam Details**:
  - Duration: 150 minutes
  - Question types: Multiple choice, case studies, lab simulations
  - Passing score: 700/1000

### SC - Security & Compliance Track (Parts 11-12)

#### Part 11: Microsoft Identity and Access Administrator (SC-300)

- **Official Study Guide**: [SC-300 Study Guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/sc-300)
- **Skills Measured** (as of July 25, 2025):
  - **Implement and manage user identities (20-25%)**:
    - Configure and manage a Microsoft Entra tenant (built-in/custom roles, administrative units, effective permissions, domains, company branding, tenant properties/settings)
    - Create, configure, and manage Microsoft Entra identities (users, groups, custom security attributes, bulk operations, device join/registration, license management)
    - Implement and manage identities for external users and tenants (external collaboration settings, external user invitations/management, cross-tenant access/synchronization, external identity providers/protocols)
    - Implement and manage hybrid identity (Entra Connect Sync/Cloud Sync, password hash synchronization, pass-through authentication, seamless SSO, AD FS migration, Connect Health)
  - **Implement authentication and access management (25-30%)**:
    - Plan, implement, and manage Microsoft Entra user authentication (authentication planning, methods including certificate-based/TAP/OAuth/Authenticator/passkey, tenant-wide MFA, SSPR, Windows Hello for Business, account management, password protection, Kerberos authentication)
    - Plan, implement, and manage Microsoft Entra Conditional Access (policy planning, assignments, controls, testing/troubleshooting, session management, device restrictions, continuous access evaluation, authentication context, protected actions, templates)
    - Manage risk by using Microsoft Entra ID Protection (user/sign-in risk management, MFA registration policies, risky user/sign-in monitoring/remediation, risky workload identity management)
    - Implement access management for Azure resources by using Azure roles (custom Azure roles, role assignments, effective permissions evaluation, VM login enablement, Key Vault RBAC/access policies)
    - Implement Global Secure Access (client deployment, Private Access, Internet Access, Internet Access for Microsoft 365)
  - **Plan and implement workload identities (20-25%)**:
    - Plan and implement identities for applications and Azure workloads (identity selection including managed identities/service principals/user accounts, managed identity creation/assignment/usage)
    - Plan, implement, and monitor the integration of enterprise applications (enterprise application settings, role assignments, Application Proxy integration, SaaS app integration, user/group/app role management, consent configuration, application collections)
    - Plan and implement app registrations (registration planning, creation, authentication configuration, API permissions, app roles)
    - Manage and monitor app access by using Microsoft Defender for Cloud Apps (cloud discovery analysis, connected app configuration, application-enforced restrictions, Conditional Access app control, access/session policies, OAuth app policies, Cloud app catalog management)
  - **Plan and automate identity governance (20-25%)**:
    - Plan and implement entitlement management in Microsoft Entra (entitlement planning, catalog configuration, access package management, access request management, terms of use, external user lifecycle, connected organizations)
    - Plan, implement, and manage access reviews in Microsoft Entra (access review planning, configuration, activity monitoring, manual response)
    - Plan and implement privileged access (Entra roles in PIM including settings/assignments, Azure resources in PIM, PIM-managed groups, request/approval process, audit history/reports, break-glass accounts)
    - Monitor identity activity by using logs, workbooks, and reports (sign-in/audit/provisioning log analysis, diagnostic settings configuration, KQL queries in Log Analytics, workbook/reporting analysis, Identity Secure Score improvement)
- **Focus**: Identity and access management using Microsoft Entra ID
- **Target Audience**: Identity administrators and security professionals
- **Prerequisites**: Azure fundamentals and security basics
- **Key Learning**: Microsoft Entra ID implementation and identity governance
- **Builds To**: SC-100 and identity architect roles
- **Study Duration**: 6-8 weeks
- **Exam Details**:
  - Duration: 150 minutes
  - Question types: Multiple choice, case studies, lab simulations
  - Passing score: 700/1000

#### Part 12: Microsoft Security Architect (SC-100)

- **Official Study Guide**: [SC-100 Study Guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/sc-100)
- **Skills Measured** (as of July 22, 2025):
  - **Design solutions that align with security best practices and priorities (20-25%)**:
    - Design a resiliency strategy for ransomware and other attacks based on Microsoft Security Best Practices (business resiliency goals, BCDR solutions, ransomware mitigation, security updates)
    - Design solutions that align with the Microsoft Cybersecurity Reference Architectures (MCRA) and Microsoft cloud security benchmark (MCSB) (cybersecurity capabilities/controls, insider/external/supply chain protection, Zero Trust security/RaMP)
    - Design solutions that align with the Microsoft Cloud Adoption Framework for Azure and the Microsoft Azure Well-Architected Framework (CAF/WAF strategy evaluation, governance recommendations, Azure landing zones, DevSecOps process)
  - **Design security operations, identity, and compliance capabilities (25-30%)**:
    - Design solutions for security operations (XDR/SIEM detection/response, centralized logging/auditing, hybrid/multicloud monitoring, SOAR automation, workflow evaluation, MITRE ATT&CK threat detection)
    - Design solutions for identity and access management (SaaS/PaaS/IaaS/hybrid/multicloud access, Microsoft Entra ID solutions, external identities B2B/B2C/decentralized, modern authentication/authorization, Conditional Access/Zero Trust alignment, AD DS hardening, secrets/keys/certificates management)
    - Design solutions for securing privileged access (enterprise access model delegation, Entra ID PIM/entitlement management/access reviews, AD DS security/governance, cloud tenant administration, cloud infrastructure entitlement management, PAW solutions)
    - Design solutions for regulatory compliance (compliance-to-security controls translation, Microsoft Purview solutions, privacy requirements/Microsoft Priva, Azure Policy for security/compliance, regulatory alignment validation)
  - **Design security solutions for infrastructure (25-30%)**:
    - Design solutions for security posture management in hybrid and multicloud environments (Defender for Cloud/MCSB evaluation, Secure Score evaluation, integrated posture management, cloud workload protection, Azure Arc integration, Defender EASM, Security Exposure Management requirements)
    - Specify requirements for securing server and client endpoints (server security across platforms, mobile/client endpoint protection/hardening, IoT/embedded systems security, OT/ICS security with Defender for IoT, security baselines, Windows LAPS solutions)
    - Specify requirements for securing SaaS, PaaS, and IaaS services (security baselines for cloud services, IoT workload security, web workload security, container/orchestration security, Azure AI services security)
    - Evaluate solutions for network security and Security Service Edge (SSE) (network design evaluation, Entra Internet Access as secure web gateway, Entra Internet Access for Microsoft Services/cross-tenant, Entra Private Access solutions)
  - **Design security solutions for applications and data (20-25%)**:
    - Evaluate solutions for securing Microsoft 365 (productivity/collaboration security posture, Defender for Office 365/Cloud Apps, Microsoft Intune device management, Purview data security, Copilot security/compliance controls)
    - Design solutions for securing applications (application portfolio security posture, threat modeling for business-critical apps, full lifecycle application security, secure development standards/practices, technology-to-requirements mapping, workload identity solutions, API management/security, Azure WAF solutions)
    - Design solutions for securing an organization's data (data discovery/classification, threat mitigation priorities, encryption solutions including Key Vault, Azure workload data security, Azure Storage security, Defender for Storage/Databases)
- **Focus**: Enterprise security architecture across Microsoft 365, Azure, and hybrid environments
- **Target Audience**: Security architects and senior security professionals
- **Prerequisites**: Security experience and SC-300 knowledge
- **Key Learning**: Zero-trust architecture design and enterprise security strategy
- **Builds To**: CISO and security leadership roles
- **Study Duration**: 8-10 weeks
- **Exam Details**:
  - Duration: 150 minutes
  - Question types: Multiple choice, case studies, design scenarios
  - Passing score: 700/1000


## Content Standards for Each Post

### Front Matter Template

```toml
+++
title = '🎓 Azure Certification Journey: Part X - [Certification Name]'
slug = 'azure-certification-journey-X-[exam-code]'
date = '2025-MM-DD 06:00:00Z'
lastmod = '2025-MM-DD 06:00:00Z'
draft = true
tags = [
  "Azure",
  "Certification",
  "[Exam Code]",
  "Cloud Computing",
  # Add specific tags per certification
]
categories = [
  "Cloud",
  "Certification",
  "Professional Development"
]
series = [
  'Azure Certification Journey'
]

layout = 'single'
[params]
    cover = true
    author = 'sujith'
    cover_prompt = '''[Specific prompt for each certification topic]'''
    
description = "[Concise summary of certification and what readers will learn]"
+++
```

### Post Structure Template

1. **Introduction**
   - Certification overview and value proposition
   - Target audience and career benefits
   - How it fits in the Azure certification pathway

2. **Exam Overview**
   - Exam format, duration, and scoring
   - Question types and structure
   - Cost and scheduling information

3. **Skills Measured**
   - Detailed breakdown of exam domains
   - Percentage weightings for each area
   - Key topics and subtopics

4. **Study Plan**
   - Recommended timeline (4-8 weeks typical)
   - Learning resources and materials
   - Hands-on lab requirements

5. **Hands-On Practice**
   - Essential Azure services to explore
   - Step-by-step tutorials and labs
   - Free tier usage and cost management

6. **Preparation Strategy**
   - Study techniques and best practices
   - Practice test recommendations
   - Time management tips

7. **Exam Day Tips**
   - What to expect during the exam
   - Common pitfalls and how to avoid them
   - Post-exam next steps

8. **Career Advancement**
   - Job roles this certification enables
   - Salary expectations and market demand
   - Next certification recommendations

### Content Guidelines

- **Practical Focus**: Include hands-on exercises and real-world scenarios
- **Cost Awareness**: Emphasise free tier usage and cost-effective study methods
- **Current Information**: Ensure all exam details are up-to-date
- **Study Resources**: Provide comprehensive list of learning materials
- **Community Links**: Include study groups and certification communities
- **Success Stories**: Share certification journey experiences
- **British English**: Use British spelling throughout
- **Emoji Usage**: Consistent emoji in titles (🎓 for certification posts)

### Tags Strategy

**Core Tags** (all posts): `Azure`, `Certification`, `Cloud Computing`, `Professional Development`

**Specific Tags**: Add exam code and relevant technology tags per post (e.g., `AZ-900`, `Security`, `DevOps`, `Data`, `AI`)

## Study Resources Reference

### Microsoft Official Resources

- [Microsoft Learn](https://docs.microsoft.com/en-us/learn/)
- [Azure Architecture Center](https://docs.microsoft.com/en-us/azure/architecture/)
- [Azure Documentation](https://docs.microsoft.com/en-us/azure/)
- [Microsoft Training and Certifications](https://www.microsoft.com/en-us/learning/)

### Practice and Assessment

- [Microsoft Official Practice Tests](https://www.measureup.com/microsoft)
- [Whizlabs Azure Practice Tests](https://www.whizlabs.com/)
- [Azure Free Account](https://azure.microsoft.com/en-gb/free/)
- [Azure Sandbox Environments](https://docs.microsoft.com/en-us/learn/modules/)

### Community Resources

- [Azure Reddit Community](https://www.reddit.com/r/AZURE/)
- [Microsoft Tech Community](https://techcommunity.microsoft.com/)
- [Azure Study Groups on LinkedIn](https://www.linkedin.com/groups/)
- [YouTube Azure Channels](https://www.youtube.com/c/MicrosoftAzure)

## Certification Path Recommendations

### Service Family Sequential Path (Recommended)

1. **Complete AZ Track** (Azure Core): **AZ-900** → **AZ-104** → **AZ-204** → **AZ-400** → **AZ-305** → **AZ-500** → **AZ-700**
2. **Data Platform Specialization**: **DP-420** (Cosmos DB Developer)
3. **AI Specialization**: **AI-900** → **AI-102** (AI Engineer)  
4. **Security Specialization**: **SC-300** → **SC-100** (Security Architect)

### Alternative Career-Focused Paths

#### Cloud Infrastructure Path

1. **AZ-900** (Fundamentals) → **AZ-104** (Administrator) → **AZ-305** (Solutions Architect) → **AZ-500** (Security Engineer)

#### Developer Path

1. **AZ-900** (Fundamentals) → **AZ-204** (Developer) → **AZ-400** (DevOps Engineer) → **AI-102** (AI Engineer)

#### Security Specialist Path

1. **AZ-900** (Fundamentals) → **AZ-104** (Administrator) → **AZ-500** (Security Engineer) → **SC-300** → **SC-100**

#### Data Professional Path

1. **AZ-900** (Fundamentals) → **AZ-104** (Administrator) → **DP-420** (Cosmos DB Developer) → **AI-900** → **AI-102**

#### Network Specialist Path

1. **AZ-900** (Fundamentals) → **AZ-104** (Administrator) → **AZ-700** (Network Engineer) → **AZ-500** (Security Engineer)

## Notes for Future Development

- Monitor Microsoft certification roadmap changes
- Update exam requirements and weightings regularly
- Include success rates and difficulty assessments
- Add community feedback and testimonials
- Consider creating certification comparison guides
- Develop downloadable study checklists and resources

## Progress Update Instructions

## Series Summary

This comprehensive Azure Certification Journey series covers 12 carefully selected certifications across 4 tracks:

### AZ - Azure Core Track Overview (Parts 1-7)

- **AZ-900**: Azure Fundamentals - Entry point to Azure and cloud concepts
- **AZ-104**: Azure Administrator - Infrastructure administration and management  
- **AZ-204**: Azure Developer - Application development and cloud solutions
- **AZ-400**: Azure DevOps Engineer - CI/CD and automation expertise
- **AZ-305**: Azure Solutions Architect - Enterprise solution architecture
- **AZ-500**: Azure Security Engineer - Security implementation and management
- **AZ-700**: Azure Network Engineer - Networking specialisation and connectivity

### DP - Data Platform Track Overview (Part 8)

- **DP-420**: Azure Cosmos DB Developer - NoSQL database specialisation

### AI - Artificial Intelligence Track Overview (Parts 9-10)

- **AI-900**: Azure AI Fundamentals - Entry point to AI and Azure AI services
- **AI-102**: Azure AI Engineer - Advanced AI solution development

### SC - Security & Compliance Track Overview (Parts 11-12)

- **SC-300**: Microsoft Identity and Access Administrator - Identity management
- **SC-100**: Microsoft Security Architect - Enterprise security architecture

### Key Features

**Comprehensive Coverage**: From AI fundamentals to enterprise architecture, covering the most valuable Azure certifications for career progression.

**Official Alignment**: All content aligned with current Microsoft official study guides, including exact skills measured percentages and current exam requirements.

**Practical Focus**: Each part includes hands-on projects, real-world scenarios, and career advancement guidance.

**Flexible Progression**: While designed as a sequential journey, individual certifications can be pursued based on career goals and prerequisites.

**Regular Updates**: Content maintained to reflect the latest Microsoft certification changes and Azure service updates.

### Total Investment

- **Time**: 12-18 months for complete journey (depending on experience and study pace)
- **Cost**: Approximately £1,200-£1,500 for all exams (may vary by region)
- **Value**: Comprehensive Azure expertise from fundamentals to advanced specialisations

---

**When completing a new post:**

1. Update the **Progress Tracker** section:
   - Move completed post from "Next Up" to "Completed Posts"
   - Update overall progress percentage
   - Set the next post as "Next Up"
   - Update the "Last Updated" date

2. **Update Forward Navigation** in previous post (if it exists):
   - Add clickable link to new post in the "Career Advancement" section
   - Use correct Hugo URL structure: `../MM/azure-certification-journey-X/`

3. Update the **Progress by Track** table:
   - Increment the completed count for the relevant track
   - Update the percentage
   - Change status emoji if track is completed

4. Mark the specific part in the **Complete Series Structure**:
   - Add ✅ emoji and publication date to the completed part
   - Update status and certification details

**Status Emojis:**

- ✅ Completed
- 🎯 Next Up  
- 🟡 In Progress (track has some completed posts)
- ⚪ Not Started

---

*This plan serves as the master reference for the complete "Azure Certification Journey" series covering 12 focused Azure certifications. All content is aligned with current Microsoft official study guides and will be updated as Microsoft updates certification requirements or introduces new certifications.*
