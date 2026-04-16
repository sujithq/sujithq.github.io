+++
title = '🧠 Azure Blob Storage Smart Tier is GA'
slug = 'azure-blob-storage-smart-tier-ga'
date = '2026-04-16 08:00:00Z'
lastmod = '2026-04-16 08:00:00Z'
draft = false
tags = [
  "Azure",
  "Azure Storage",
  "Blob Storage",
  "Cost Optimisation",
  "Cloud Architecture",
  "FinOps"
]
categories = [
  "Cloud Computing",
  "Azure",
  "Infrastructure"
]
series = []

layout = "single"
[params]
    cover = true
    author = "sujith"
    cover_prompt = '''Create a clean, modern technical illustration for a blog post about Azure Blob Storage Smart Tier becoming generally available.
    Show a central blob storage container with three temperature-themed zones labelled Hot, Cool, and Cold, connected by smooth automated flow arrows indicating
    objects moving automatically between tiers based on time without access.
    Include a small monitoring panel with tier distribution metrics (SmartHot, SmartCool, SmartCold) and a cost savings graph trending downward.
    Use Microsoft Azure blue and teal as primary colours with warm orange for the hot tier, cool grey-blue for the cool tier, and deep blue for the cold tier.
    Add subtle cloud network lines and storage icons in a minimal, enterprise-ready composition suitable for technical readers interested in storage cost optimisation and FinOps.
    Keep the layout uncluttered with a futuristic but professional aesthetic.'''

description = "Azure Blob Storage Smart Tier is now GA. It auto-moves blobs between hot, cool, and cold tiers by access pattern, cutting costs with no config required."
+++

Azure Blob Storage Smart Tier has reached **general availability**. It is a zero-configuration approach to
automatic storage cost optimisation: you enable it once, and Azure manages tier transitions for you based on actual
access patterns. No lifecycle rules to author. No guessing at access frequency upfront.

## What Smart Tier does

Smart Tier monitors blob access patterns and automatically moves objects between the hot, cool, and cold online
access tiers. When data is not accessed for a period of time, it transitions to a cheaper tier. When data is
accessed again, Azure immediately moves it back to hot.

The transition timeline works as follows:

- New blobs land in the **hot tier**.
- After **30 days** of no access, a blob moves to the **cool tier**.
- After **60 more days** (90 days total) of continued inactivity, it moves to the **cold tier**.
- Any access operation (Get Blob or Put Blob) resets the timer and **immediately moves the object back to hot**.

The archive tier is not part of smart tier. All objects stay on online tiers, which means retrieval is always
instantaneous without a rehydration wait.

## Why this matters over lifecycle management

Blob lifecycle management has been available for years and lets you write rules to tier or delete blobs based on
last-modified time or last-access time. It is powerful, but requires you to predict access patterns upfront and
maintain policies over time.

Smart Tier removes that burden:

- No rules to write or tune.
- No need to know access patterns before ingesting data.
- Transitions happen at the object level based on observed behaviour, not fixed schedules.
- Suitable for workloads with unpredictable or variable access patterns.

If you already know your data is cold after 90 days and will never be accessed again, lifecycle management with an
archive transition is still a better fit. Smart Tier targets the uncertainty in between.

## How the billing model works

Smart Tier uses the billing meters of the **underlying capacity tier**. There is no smart-tier-specific storage
price. Objects are billed at hot rates when in the hot tier, cool rates when in the cool tier, and so on.

The only smart-tier-specific charge is a small monthly monitoring fee:

- **$0.04 per 10,000 objects** (over 128 KiB) managed by smart tier each month.
- Objects **128 KiB or smaller** are not charged a monitoring fee. They stay on the hot tier permanently (labelled
  `SmartHot-small`) because moving small objects to cooler tiers would not produce meaningful savings and would
  trigger the minimum billable object size charge on cool and cold tiers.

Additional billing rules to be aware of:

| Activity | Charged | Free |
|---|---|---|
| Capacity | Underlying tier rates | — |
| Monitoring | $0.04 per 10K objects over 128 KiB | Objects 128 KiB or smaller |
| Tier transitions within smart tier | — | Free |
| Early deletion penalties | — | Not charged |
| Data retrieval | — | Not charged |
| Access operations | Billed at hot tier rates | — |
| Moving blobs **out** of smart tier | Cool write tx per object | — |

The absence of early deletion penalties and data retrieval charges is significant. With manually managed cool and
cold tiers, accessing data unexpectedly could lead to retrieval charges. Smart Tier absorbs those costs and prices
all access at hot tier transaction rates.

## Prerequisites

Smart Tier requires:

- A **Standard general-purpose v2 (GPv2)** storage account. Legacy GPv1 and premium accounts are not supported.
- **Zone-redundant storage**: ZRS, GZRS, or RA-GZRS. LRS and GRS accounts are not eligible.
- **Block blobs only**. Page blobs and append blobs are not supported.

The ZRS requirement is worth noting if you currently use LRS for cost reasons. Enabling smart tier is not possible
without converting to a zone-redundant configuration first.

## Enabling Smart Tier

Smart Tier is configured by setting the **default account access tier** to Smart on a supported storage account.

### At account creation time (Azure portal)

1. Navigate to **Storage accounts** and select **Create**.
2. Complete the **Basics** tab.
3. On the **Advanced** tab, under **Blob storage**, set **Access tier** to **Smart**.
4. Select **Review + Create**.

### On an existing account (Azure portal)

1. Navigate to your storage account.
2. Under **Settings**, select **Configuration**.
3. Locate **Blob access tier (default)** and select **Smart**.
4. Save your changes.

When you enable smart tier on an existing account, all blobs that do **not** have an explicitly set access tier
migrate to smart tier. Blobs with an explicit tier set are not affected.

### Using Azure CLI

```bash
# Create a new account with smart tier as default
az storage account create \
  --name mystorageaccount \
  --resource-group myresourcegroup \
  --location eastus \
  --sku Standard_ZRS \
  --kind StorageV2 \
  --min-tls-version TLS1_2 \
  --access-tier Smart

# Update an existing account to smart tier
az storage account update \
  --name mystorageaccount \
  --resource-group myresourcegroup \
  --access-tier Smart
```

### Using Azure PowerShell

```powershell
# Create a new account with smart tier as default
New-AzStorageAccount `
  -ResourceGroupName "myresourcegroup" `
  -Name "mystorageaccount" `
  -Location "eastus" `
  -SkuName "Standard_ZRS" `
  -Kind "StorageV2" `
  -AccessTier "Smart"

# Update an existing account to smart tier
Set-AzStorageAccount `
  -ResourceGroupName "myresourcegroup" `
  -Name "mystorageaccount" `
  -AccessTier "Smart"
```

## Monitoring Smart Tier distribution

Azure Monitor exposes built-in metrics for smart tier at no additional cost. To see how blobs are distributed
across tiers:

1. Open your storage account in the Azure portal.
2. Select **Monitoring > Metrics**.
3. Configure the metric as follows:
   - **Metric Namespace**: Blob
   - **Metric**: Blob Count or Blob Capacity
   - **Aggregation**: Avg
   - **Apply splitting**: split by **Blob tier** and **Blob type**

The following blob tier values are specific to smart tier:

| Tier value | Description |
|---|---|
| SmartHot | Objects currently on the hot capacity tier |
| SmartCool | Objects that moved to cool after 30 days of inactivity |
| SmartCold | Objects that moved to cold after 90 days of inactivity |
| SmartHot-small | Objects below 128 KiB, permanently on hot tier |
| BlockBlob, Smart | Total objects eligible for the monitoring fee (over 128 KiB) |

## Key constraints and considerations

Before enabling smart tier across all accounts, review these constraints:

- **No archive tier support.** Smart Tier only manages hot, cool, and cold tiers. If you need archive for
  compliance or long-term retention, combine smart tier with lifecycle management delete rules.
- **Moving blobs out of smart tier is one-way.** Once you explicitly set a tier on a blob, it leaves smart tier
  management and cannot be automatically moved back.
- **Lifecycle management tiering rules do not apply** to smart-tier-managed objects. However, lifecycle management
  **delete** rules still work on smart tier objects.
- **Redundancy conversion to LRS or GRS is not supported** while smart tier is active.
- **GZRS failover.** If a GZRS account fails over, you have 60 days to convert the resulting LRS account back to
  zone-redundant storage to restore smart tier eligibility.
- **REST API version 2025-08-01 or later** is required for full smart tier support.
- **Get Blob Properties, Get Blob Metadata, and Get Blob Tags** are not considered access operations. Only Get Blob
  and Put Blob reset the tier transition timer.

## Regional availability

Smart Tier is generally available in nearly all public Azure regions with zonal redundancy. Three regions remain
in public preview:

- Israel Central
- Qatar Central
- UAE North

Azure Government and Azure operated by 21Vianet (China) are also in public preview. To enable smart tier in those
regions, register the **Smart Tier (account level)** preview feature via the Azure portal preview features blade.

## When to use Smart Tier versus alternatives

| Scenario | Recommended approach |
|---|---|
| Unknown or variable access patterns | Smart Tier |
| Predictable cold data after a fixed retention period | Lifecycle management with archive transition |
| Data that must always be on hot | Explicit hot tier, skip smart tier |
| Objects smaller than 128 KiB with rare access | Hot tier explicitly (smart tier will not save costs here) |
| Compliance archival for 1+ years | Lifecycle management to archive |

## Summary

Smart Tier removes the operational overhead of managing blob tier transitions manually. You pay for the underlying
capacity tier your data actually resides in, plus a small monthly monitoring fee for eligible objects. No early
deletion penalties, no retrieval charges, and no rules to maintain.

For workloads where access patterns are hard to predict, or where you want to reduce FinOps complexity without
sacrificing performance, Smart Tier is a practical default to consider enabling on new GPv2 storage accounts today.

## References

- [Optimise Azure Blob Storage costs with smart tier](https://learn.microsoft.com/en-us/azure/storage/blobs/access-tiers-smart)
- [Access tiers for blob data](https://learn.microsoft.com/en-us/azure/storage/blobs/access-tiers-overview)
- [Azure Blob Storage pricing](https://azure.microsoft.com/en-us/pricing/details/storage/blobs/)
- [Best practices for using blob access tiers](https://learn.microsoft.com/en-us/azure/storage/blobs/access-tiers-best-practices)
- [Optimise costs by automatically managing the data lifecycle](https://learn.microsoft.com/en-us/azure/storage/blobs/lifecycle-management-overview)
