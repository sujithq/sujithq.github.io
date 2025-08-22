+++
title = 'Terraform Weekly – 2025 Week 34'
date = 2025-08-21T05:34:24Z
lastmod = 2025-08-22T05:34:25Z
draft = false
tags = ['updates', 'weekly', 'terraform']
description = 'Highlights from Terraform between 2025-08-18 and 2025-08-24 — explore updates, new features, bug fixes, and important enhancements for this period.'
[params]
    author = 'sujith'
+++
## This period at a glance

**Window:** 2025-08-18 → 2025-08-24 (Europe/Brussels)

- **[v4.41.0](https://github.com/hashicorp/terraform-provider-azurerm/releases/tag/v4.41.0)** — Terraform AzureRM provider version 4.41.0 was released on August 21, 2025, introducing new resources for network management and routing.
  - Added new resource azurerm_network_manager_ipam_pool_static_cidr for managing static CIDRs in IPAM pools.
  - Introduced azurerm_network_manager_routing_rule_collection resource to manage routing rule collections.
  - Release focuses on enhancements in Azure network management capabilities.
- **[v1.13.0](https://github.com/hashicorp/terraform/releases/tag/v1.13.0)** — Terraform v1.13.0, released on August 20, 2025, introduces the new CLI command `terraform stacks` for managing stack operations, with subcommands varying by the stacks plugin implementation.
  - Added `terraform stacks` command to expose stack operations via CLI.
  - Subcommands of `terraform stacks` depend on the installed stacks plugin.
  - Use `terraform stacks -usage` to list available stack commands.

