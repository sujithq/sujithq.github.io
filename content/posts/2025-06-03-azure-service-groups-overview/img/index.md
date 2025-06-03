+++
title = 'What Are Azure Service Groups? Benefits, RBAC Roles, and REST API Guide'
slug = 'azure-service-groups-overview'
date = '2025-06-03T06:00:00Z'
draft = false
tags = ['Azure Governance', 'RBAC', 'Azure REST API', 'Cloud Security']
categories = ['Azure', 'Cloud Governance']
series = ['Azure Governance Deep Dive']
layout = 'single'
[params]
  cover = true
  author = 'sujith'

description = "Learn what Azure Service Groups are, how they enhance Azure governance, which RBAC roles are supported, and how to create them using REST API."
+++

## Introducing Azure Service Groups: Simplified Resource Governance at Scale

Azure environments can grow fast—across teams, business units, and global regions. With that growth comes the need for efficient governance. While Azure Management Groups and Role-Based Access Control (RBAC) help organize and secure resources, Azure now offers an even more granular and flexible capability: **Azure Service Groups**.

{{< notice-card danger "Preview!">}}

Azure Service Groups is currently in PREVIEW. For more information about participating in the preview, see [Azure Service Groups Preview](https://learn.microsoft.com/en-us/azure/governance/service-groups/overview). See the [Supplemental Terms of Use for Microsoft Azure Previews](https://learn.microsoft.com/en-us/legal/cognitive-services/terms) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

{{< /notice-card >}}

In this article, we’ll explore what Service Groups are, how they work, the built-in roles available, and how to create and manage them using the Azure REST API.

---

### What Are Azure Service Groups?

**Azure Service Groups** are a governance feature that allows you to logically group Azure resources—like subscriptions, management groups, or even specific service types—for targeted policy enforcement, access control, and reporting.

Think of them as dynamic or static collections of Azure resources that share a common purpose, ownership, or governance requirement.

### Key Benefits

- **Targeted policy application**: Apply policies to a subset of subscriptions across tenants or business units.
- **Simplified role assignments**: Assign RBAC roles at the Service Group level for unified access control.
- **Cross-tenant support**: Group subscriptions across different tenants using Azure Lighthouse.
- **Automation-friendly**: Create and manage Service Groups entirely via REST APIs.

---

### Service Groups vs. Management Groups

While Management Groups are hierarchical and define organizational structure, **Service Groups are flat and flexible**. They are ideal for scenarios where:

- Resources need to be grouped based on environment (e.g., all dev/test subscriptions).
- Teams need temporary access to a subset of resources.
- Policies must be applied across a dynamic subset of services.

You can even use Service Groups to target a specific service (e.g., only App Services) across multiple subscriptions.

---

### Built-in Roles for Service Groups

Azure provides a set of [built-in roles](https://learn.microsoft.com/en-us/azure/governance/service-groups/manage-service-groups#rbac-permissions) for managing Service Groups:

| Role Name                            | Description                                                                 |
|--------------------------------------|-----------------------------------------------------------------------------|
| **Service Group Contributor**        | Can create and manage service groups and their members.                     |
| **Service Group Reader**             | Can view service groups and their members.                                  |
| **Service Group Member Contributor** | Can add or remove members from existing service groups.                     |

{{< notice-card info>}}

These roles can be assigned at the subscription or resource group level using standard Azure RBAC practices.

{{< /notice-card >}}

You can use these roles to delegate the management of service groups without over-permissioning users.

---

### Creating a Service Group Using the REST API

Service Groups are currently API-first. To create one, use the following REST endpoint:

```http
PUT [https://management.azure.com/providers/Microsoft.Governance/serviceGroups/{serviceGroupName}?api-version=2023-07-01-preview](https://management.azure.com/providers/Microsoft.Governance/serviceGroups/{serviceGroupName}?api-version=2023-07-01-preview)

```

Here’s a minimal example payload:

```json
{
  "location": "global",
  "properties": {
    "displayName": "FinanceTeamGroup",
    "description": "Group for all finance team subscriptions",
    "membershipType": "Static"
  }
}
```

* `membershipType` can be `Static` or `Dynamic`. Dynamic groups use rules to automatically include resources.

---

### Adding Members to a Service Group

To add a subscription or other resource to a Service Group, use:

```http
PUT https://management.azure.com/providers/Microsoft.Governance/serviceGroups/{serviceGroupName}/members/{memberId}?api-version=2023-07-01-preview
```

Example body:

```json
{
  "properties": {
    "resourceId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
  }
}
```

Members can be:

- Subscriptions
- Management groups
- Specific services (like `Microsoft.Web/sites`)

---

### Managing and Listing Service Groups

To list all service groups in your tenant:

```http
GET https://management.azure.com/providers/Microsoft.Governance/serviceGroups?api-version=2023-07-01-preview
```

You can also:

- Retrieve members of a group
- Update group metadata
- Delete a group

All of this is available through the [Service Groups API](https://learn.microsoft.com/en-us/azure/governance/service-groups/create-service-group-rest-api).

---

### Practical Use Cases

1. **Environment Segmentation**
   Create separate Service Groups for `dev`, `tst`, `acc`, and `prd` resources to enforce different governance policies.

2. **Departmental Access Control**
   Give the finance team scoped access only to subscriptions grouped in a `FinanceSG` Service Group.

3. **Policy Targeting**
   Apply a cost control policy to all App Services across all subscriptions using a Service Group that includes only those resources.

---

### Final Thoughts

Azure Service Groups are a powerful addition to the governance toolbox. They don't replace Management Groups or Azure Policy—but they **complement** them by offering more granular control over how resources are grouped and governed.

While currently accessible only via REST APIs, Service Groups already enable custom automation scenarios. Support for infrastructure-as-code tools like Terraform and Bicep is expected as the feature evolves.
