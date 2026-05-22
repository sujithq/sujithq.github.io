---
title: "dotnet: Improving C# Memory Safety"
date: 2026-05-21T16:08:00.000Z
slug: improving-c-memory-safety
update_categories: ["dotnet"]
update_tags: ["C#", ".NET 11", "unsafe", "memory safety", "preview"]
update_bullets: ["`unsafe` will represent a visible contract between callers and callees.", "The goal is to make memory-safety obligations explicit in code review.", "The change is motivated in part by increased AI-assisted code generation.", "The redesign arrives as a preview in .NET 11."]
timeframes: ["2026-05"]
link: "https://devblogs.microsoft.com/dotnet/improving-csharp-memory-safety/"
source: ".NET"
timeframeKey: "2026-05"
id: "C9EC01ADC9349A86CB1320255124876A8AC60376234DE7EB85CB717F5DA6C3AC"
contentHash: "0A2025EF76BB5ADE94912CB3EC5062B4B6C3782E1254420C1BD8E060CF564964"
draft: false
type: "updates2"
llmSummary: "C# `unsafe` is being redesigned to express caller-facing safety contracts instead of only enabling unsafe syntax. The change is in preview for .NET 11 and is meant to make safety obligations clearer and easier to review."
---

C# `unsafe` is being redesigned to express caller-facing safety contracts instead of only enabling unsafe syntax. The change is in preview for .NET 11 and is meant to make safety obligations clearer and easier to review.

- **Source:** [.NET](https://devblogs.microsoft.com/dotnet/improving-csharp-memory-safety/)
