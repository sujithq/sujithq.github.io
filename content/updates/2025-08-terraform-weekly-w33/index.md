+++
title = 'Terraform Weekly – 2025 Week 33'
date = 2025-08-14T05:40:48Z
lastmod = 2025-08-14T07:22:39Z
draft = false
tags = ['updates', 'weekly', 'terraform']
description = 'Highlights from Terraform between 2025-08-11 and 2025-08-17 — explore updates, new features, bug fixes, and important enhancements for this period.'
[params]
    author = 'sujith'
+++
## This period at a glance

**Window:** 2025-08-11 → 2025-08-17 (Europe/Brussels)

- **[v1.14.0-alpha20250813](https://github.com/hashicorp/terraform/releases/tag/v1.14.0-alpha20250813)** — Terraform v1.14.0-alpha20250813, released on August 13, 2025, introduces enhancements to the terraform test command, improving output and resource cleanup behavior.
  - Expected diagnostics are now included in terraform test output when running in verbose mode.
  - terraform test will ignore the prevent_destroy attribute during resource cleanup.

