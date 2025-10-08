---
title: "dotnet: Preparing for the .NET 10 GC (DATAS)"
date: 2025-10-08T17:00:00.000Z
slug: preparing-for-the-net-10-gc-datas
update_categories: ["dotnet"]
update_tags: [".NET", ".NET 10", "GC", "DATAS", "Garbage Collection", "Server GC", "performance", "tuning", "heap", "testing"]
update_bullets: ["DATAS in .NET 10 dynamically adapts the process heap size rather than relying solely on prior Server GC heuristics.", "Expect differences in allocation and collection patterns compared with older Server GC behavior — test critical workloads to understand impact.", "DATAS aims to reduce the need for manual heap tuning by adapting at runtime, but some scenarios may still benefit from explicit configuration.", "Evaluate latency, throughput, memory footprint, and GC pause characteristics in staging before enabling DATAS in production.", "If DATAS causes regressions for a specific workload, the article describes how to decide whether to tune GC settings or disable DATAS for that scenario.", "Use benchmarking and real-world telemetry to guide decisions rather than assuming parity with previous GC behavior.", "Plan upgrades and testing when moving to .NET 10 so that any GC-related changes are identified and addressed early."]
timeframes: ["2025-10"]
link: "https://devblogs.microsoft.com/dotnet/preparing-for-dotnet-10-gc/"
source: ".NET"
timeframeKey: "2025-10"
id: "8B2328B5427C033F784FD8F0EDB33B19FEE2A8DCD6869F2C6BFDE8FB54160E6C"
contentHash: "34F34BC73CC7F9AE4C4B312BE492C9F99D29A4B3B230404A85B0711B58FED3AD"
draft: false
type: "updates2"
llmSummary: "The .NET 10 Garbage Collector introduces DATAS, a new adaptive mechanism that adjusts heap size automatically. The article explains how DATAS behavior differs from the previous Server GC, and gives guidance on when to tune GC settings or disable DATAS depending on your application's workload and performance goals."
---

The .NET 10 Garbage Collector introduces DATAS, a new adaptive mechanism that adjusts heap size automatically. The article explains how DATAS behavior differs from the previous Server GC, and gives guidance on when to tune GC settings or disable DATAS depending on your application's workload and performance goals.

- **Source:** [.NET](https://devblogs.microsoft.com/dotnet/preparing-for-dotnet-10-gc/)
