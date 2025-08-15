+++
title = 'Terraform Weekly – 2025 Week 33'
date = 2025-08-14T05:40:48Z
lastmod = 2025-08-15T05:40:17Z
draft = false
tags = ['updates', 'weekly', 'terraform']
description = 'Highlights from Terraform between 2025-08-11 and 2025-08-17 — explore updates, new features, bug fixes, and important enhancements for this period.'
[params]
    author = 'sujith'
+++
## This period at a glance

**Window:** 2025-08-11 → 2025-08-17 (Europe/Brussels)

- **[v4.40.0](https://github.com/hashicorp/terraform-provider-azurerm/releases/tag/v4.40.0)** — Terraform AzureRM Provider v4.40.0 introduces a new resource for managing customer-managed keys in Data Factory and enhances the Event Grid System Topic resource by suppressing case differences in the source_resource_id field.
  - Released v4.40.0 of Terraform AzureRM Provider on August 14, 2025.
  - Added new resource: azurerm_data_factory_customer_managed_key.
  - Enhanced azurerm_eventgrid_system_topic to suppress case differences on source_resource_id.
- **[v1.14.0-alpha20250813](https://github.com/hashicorp/terraform/releases/tag/v1.14.0-alpha20250813)** — Terraform v1.14.0-alpha20250813 introduces enhancements to the 'terraform test' command, improving test output and resource cleanup behavior.
  - 'terraform test' now includes expected diagnostics in verbose mode output.
  - 'terraform test' ignores the 'prevent_destroy' attribute during resource cleanup.

