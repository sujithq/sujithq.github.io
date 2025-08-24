+++
title = 'Terraform Weekly – 2025 Week 34'
date = 2025-08-21T05:34:24Z
lastmod = 2025-08-24T05:36:02Z
draft = false
tags = ['updates', 'weekly', 'terraform']
description = 'Highlights from Terraform between 2025-08-18 and 2025-08-24 — explore updates, new features, bug fixes, and important enhancements for this period.'
[params]
    author = 'sujith'
+++
## This period at a glance

**Window:** 2025-08-18 → 2025-08-24 (Europe/Brussels)

- **[v4.41.0](https://github.com/hashicorp/terraform-provider-azurerm/releases/tag/v4.41.0)** — Terraform AzureRM provider version 4.41.0 was released on August 21, 2025, introducing new resources for network management.
  - Added new resource azurerm_network_manager_ipam_pool_static_cidr for managing static CIDRs in IPAM pools.
  - Added new resource azurerm_network_manager_routing_rule_collection for managing routing rule collections.
- **[v1.13.0](https://github.com/hashicorp/terraform/releases/tag/v1.13.0)** — Terraform released version 1.13.0 on August 20, 2025, introducing the new `terraform stacks` CLI command for stack operations, with subcommands varying by plugin implementation.
  - Introduced `terraform stacks` command to manage stack operations via CLI.
  - Subcommands for `terraform stacks` depend on the installed stacks plugin.
  - Use `terraform stacks -usage` to view available subcommands.

