---
title: "azure: [In preview] Public Preview: VM vCore customization features disabling simultaneous multi-threading (SMT/HT) and constrained cores"
date: 2025-10-22T17:15:22.000Z
slug: in-preview-public-preview-vm-vcore-customization-features-disabling-simultaneous-multi-threading-smt-ht-and-constrained-cores
update_categories: ["azure"]
update_tags: ["Azure", "Virtual Machines", "vCore", "SMT", "Hyper-Threading", "Constrained Cores", "Preview", "Performance", "Licensing"]
update_bullets: ["Two new vCore customization options in public preview: Disable SMT/HT and Constrained Cores (limit vCPU count exposed to the VM).", "Disable SMT/HT: turns off simultaneous multithreading to improve single‑thread performance and mitigate some SMT-related security concerns.", "Constrained Cores: present fewer cores to the guest OS to simplify licensing, sizing, or to enforce workload isolation and predictable CPU capacity.", "Benefits include potential performance gains for single‑threaded applications, reduced licensing costs when licenses are core‑based, and improved performance determinism.", "Configuration is exposed through Azure management planes (portal, CLI, ARM/API) during VM provisioning or update (feature is in preview—expect feature flags/region and SKU limitations).", "Considerations: preview limitations and supportability vary by VM series and region; validate OS and application compatibility and test workloads before production rollout.", "Recommended approach: test in a representative environment, measure performance and licensing impact, and follow Azure preview documentation for enablement and known limitations."]
timeframes: ["2025-10"]
link: "https://azure.microsoft.com/updates?id=516990"
source: "Azure Updates"
timeframeKey: "2025-10"
id: "874BEF74B65E127D8A0D771EF3A6B5DB2D11FDE0417B54143C012E82CF18E5D7"
contentHash: "03D01682F50831A744D0168A56E67DEBF796B6F9903CEFD763C99FD771FB5509"
draft: false
type: "updates2"
llmSummary: "Azure announced a public preview of VM vCore customization that gives customers greater control over virtual CPU configuration. The preview introduces two capabilities: disabling simultaneous multithreading (SMT/Hyper‑Threading) on vCPUs, and constraining the number of cores exposed to the guest. These options help optimize single‑threaded workload performance, reduce license costs by limiting visible cores, and improve CPU isolation and predictable performance. The features are available in public preview and can be configured through Azure management interfaces."
---

Azure announced a public preview of VM vCore customization that gives customers greater control over virtual CPU configuration. The preview introduces two capabilities: disabling simultaneous multithreading (SMT/Hyper‑Threading) on vCPUs, and constraining the number of cores exposed to the guest. These options help optimize single‑threaded workload performance, reduce license costs by limiting visible cores, and improve CPU isolation and predictable performance. The features are available in public preview and can be configured through Azure management interfaces.

- **Source:** [Azure Updates](https://azure.microsoft.com/updates?id=516990)
