---
title: "commandline: Where the agent decides, and where the tools actually run"
date: 2026-06-22T14:04:58.000Z
slug: where-the-agent-decides-and-where-the-tools-actually-run
update_categories: ["commandline"]
update_tags: ["agent architecture", "state machine", "tool execution", "graph state", "LangGraph", "Azure Container Apps"]
update_bullets: ["Uses a state machine plus tool surface as the baseline application structure.", "Asks where an agent’s judgment step should sit in that architecture.", "Highlights a separation between decision-making and tool execution.", "References graph/state architecture as the organizing model."]
timeframes: ["2026-06"]
link: "https://commandline.microsoft.com/langgraph-squad-azure-container-apps-brain-hands-graph-state-architecture/"
source: "Microsoft Command Line Blog"
timeframeKey: "2026-06"
id: "F0F4021B84FE20E26A3F2D1CA057AA51AF6131ECCA01BE5EC08B570B79D2E092"
contentHash: "05620E26DE1DEEB601F3BABCFD87E04AECB7737B33E5755D32EB807352CA4905"
draft: false
type: "updates2"
llmSummary: "The article frames a design question about where to place an agent’s decision-making logic in an application that already has a deterministic state machine, tool integrations, and CI/CD. It focuses on separating the “brain” (judgment) from the “hands” (tool execution) within a graph/state-based architecture."
---

The article frames a design question about where to place an agent’s decision-making logic in an application that already has a deterministic state machine, tool integrations, and CI/CD. It focuses on separating the “brain” (judgment) from the “hands” (tool execution) within a graph/state-based architecture.

- **Source:** [Microsoft Command Line Blog](https://commandline.microsoft.com/langgraph-squad-azure-container-apps-brain-hands-graph-state-architecture/)
