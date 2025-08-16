+++
title = 'Terraform Weekly – 2025 Week 33'
date = 2025-08-14T05:40:48Z
lastmod = 2025-08-16T05:35:53Z
draft = false
tags = ['updates', 'weekly', 'terraform']
description = 'Highlights from Terraform between 2025-08-11 and 2025-08-17 — explore updates, new features, bug fixes, and important enhancements for this period.'
[params]
    author = 'sujith'
+++
## This period at a glance

**Window:** 2025-08-11 → 2025-08-17 (Europe/Brussels)

- **[v4.40.0](https://github.com/hashicorp/terraform-provider-azurerm/releases/tag/v4.40.0)** — Terraform AzureRM provider version 4.40.0 was released on August 14, 2025, introducing a new resource and enhancements.
  - Added new resource azurerm_data_factory_customer_managed_key for managing customer keys in Azure Data Factory.
  - Enhanced azurerm_eventgrid_system_topic to suppress case differences on source_resource_id property.
- **[v1.14.0-alpha20250813](https://github.com/hashicorp/terraform/releases/tag/v1.14.0-alpha20250813)** — Terraform v1.14.0-alpha20250813, released on August 13, 2025, includes enhancements to the terraform test command.
  - terraform test now includes expected diagnostics in test output when running in verbose mode.
  - terraform test ignores the prevent_destroy attribute during cleanup.

