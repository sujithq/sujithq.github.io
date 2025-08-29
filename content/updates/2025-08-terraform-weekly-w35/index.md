+++
title = 'Terraform Weekly – 2025 Week 35'
date = 2025-08-28T05:34:03Z
lastmod = 2025-08-29T05:34:16Z
draft = false
tags = ['updates', 'weekly', 'terraform']
description = 'Highlights from Terraform between 2025-08-25 and 2025-08-31 — explore updates, new features, bug fixes, and important enhancements for this period.'
[params]
    author = 'sujith'
+++
## This period at a glance

**Window:** 2025-08-25 → 2025-08-31 (Europe/Brussels)

- **[v4.42.0](https://github.com/hashicorp/terraform-provider-azurerm/releases/tag/v4.42.0)** — Terraform AzureRM Provider v4.42.0 was released on August 28, 2025, addressing a state migration issue for the azurerm_kusto_cluster resource when the language_extensions property is used. Users on versions older than 4.0.0 are advised to upgrade directly to this release.
  - Released v4.42.0 of Terraform AzureRM Provider on August 28, 2025
  - Fixes resource state parsing error for azurerm_kusto_cluster with language_extensions property
  - Includes a state migration for affected resources
  - Users on versions older than 4.0.0 should upgrade directly to v4.42.0
- **[v1.14.0-alpha20250827](https://github.com/hashicorp/terraform/releases/tag/v1.14.0-alpha20250827)** — Terraform v1.14.0-alpha20250827, released on August 27, 2025, introduces enhancements to the 'terraform test' command, improving test output and cleanup behavior.
  - 'terraform test' now includes expected diagnostics in verbose mode output.
  - 'terraform test' ignores the 'prevent_destroy' attribute during cleanup operations.
- **[v1.13.1](https://github.com/hashicorp/terraform/releases/tag/v1.13.1)** — Terraform v1.13.1, released on August 27, 2025, addresses bugs in the testing framework.
  - Fixed a regression where 'terraform test' with zero tests returned a non-zero exit code.
  - Prevented panic in 'terraform test' when resolving incomplete references.

