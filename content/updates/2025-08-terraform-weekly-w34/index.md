+++
title = 'Terraform Weekly – 2025 Week 34'
date = 2025-08-21T05:34:24Z
lastmod = 2025-08-23T05:32:53Z
draft = false
tags = ['updates', 'weekly', 'terraform']
description = 'Highlights from Terraform between 2025-08-18 and 2025-08-24 — explore updates, new features, bug fixes, and important enhancements for this period.'
[params]
    author = 'sujith'
+++
## This period at a glance

**Window:** 2025-08-18 → 2025-08-24 (Europe/Brussels)

- **[v4.41.0](https://github.com/hashicorp/terraform-provider-azurerm/releases/tag/v4.41.0)** — Terraform AzureRM provider version 4.41.0 released on August 21, 2025, adds new resources for network management and routing.
  - Introduced new resource azurerm_network_manager_ipam_pool_static_cidr for IP address management.
  - Added new resource azurerm_network_manager_routing_rule_collection to manage routing rules collections.
- **[v1.13.0](https://github.com/hashicorp/terraform/releases/tag/v1.13.0)** — Terraform v1.13.0, released on August 20, 2025, introduces the new `terraform stacks` CLI command for managing stack operations, with subcommands varying by the stacks plugin implementation.
  - Added `terraform stacks` command to expose stack operations via CLI.
  - Subcommands for `terraform stacks` depend on the installed stacks plugin.
  - Use `terraform stacks -usage` to view available commands.

