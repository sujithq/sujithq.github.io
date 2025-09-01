+++
title = 'Terraform Weekly – 2025 Week 35'
date = 2025-08-28T05:34:03Z
lastmod = 2025-08-31T05:32:31Z
draft = false
tags = ['updates', 'weekly', 'terraform']
description = 'Highlights from Terraform between 2025-08-25 and 2025-08-31 — explore updates, new features, bug fixes, and important enhancements for this period.'
[params]
    author = 'sujith'
+++
## This period at a glance

**Window:** 2025-08-25 → 2025-08-31 (Europe/Brussels)

- **[v4.42.0](https://github.com/hashicorp/terraform-provider-azurerm/releases/tag/v4.42.0)** — Terraform AzureRM provider version 4.42.0 was released on August 28, 2025, including a state migration fix for azurerm_kusto_cluster resource parsing errors related to the language_extensions property.
  - Fixed resource state parsing error for azurerm_kusto_cluster when language_extensions is defined via a state migration.
  - Users upgrading from versions older than 4.0.0 should upgrade directly to 4.42.0 to apply the fix.
- **[v1.14.0-alpha20250827](https://github.com/hashicorp/terraform/releases/tag/v1.14.0-alpha20250827)** — Terraform released version 1.14.0-alpha20250827 on August 27, 2025, introducing enhancements to the terraform test command.
  - terraform test now includes expected diagnostics in test output when run in verbose mode.
  - terraform test ignores the prevent_destroy attribute during cleanup operations.
- **[v1.13.1](https://github.com/hashicorp/terraform/releases/tag/v1.13.1)** — Terraform released version 1.13.1 on August 27, 2025, addressing bugs in the terraform test command.
  - Fixed a regression causing terraform test with zero tests to return a non-zero exit code.
  - Prevented panic in terraform test when resolving incomplete references.

