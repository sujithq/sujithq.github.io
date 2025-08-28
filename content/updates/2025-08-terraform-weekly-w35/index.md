+++
title = 'Terraform Weekly – 2025 Week 35'
date = 2025-08-28T05:34:03Z
lastmod = 2025-08-28T05:34:03Z
draft = false
tags = ['updates', 'weekly', 'terraform']
description = 'Highlights from Terraform between 2025-08-25 and 2025-08-31 — explore updates, new features, bug fixes, and important enhancements for this period.'
[params]
    author = 'sujith'
+++
## This period at a glance

**Window:** 2025-08-25 → 2025-08-31 (Europe/Brussels)

- **[v1.14.0-alpha20250827](https://github.com/hashicorp/terraform/releases/tag/v1.14.0-alpha20250827)** — Terraform released version 1.14.0-alpha20250827 on August 27, 2025, introducing enhancements to the terraform test command.
  - terraform test now includes expected diagnostics in verbose mode output.
  - terraform test ignores the prevent_destroy attribute during cleanup.
- **[v1.13.1](https://github.com/hashicorp/terraform/releases/tag/v1.13.1)** — Terraform v1.13.1, released on August 27, 2025, addresses bugs in the testing framework.
  - Fixed a regression where `terraform test` with zero tests returned a non-zero exit code.
  - Prevented panic in `terraform test` when resolving incomplete references.

