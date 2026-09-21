+++
title = "Article ideas: 2026-09-21 edition"
+++

# Article ideas

## 1. Recommended: locking down GitHub Actions with workflow execution protections (GA)

- **Audience**: Cloud Solution Architects and platform engineering teams
  responsible for GitHub Enterprise governance.
- **Angle**: Workflow execution protections moved from public preview to
  general availability on 2026-09-17, adding workflow-file targeting,
  enterprise-wide insights, and a REST API. This is the practical guide to
  rolling it out, including how it closes `pull_request_target` (Pwn
  Request) exposure.
- **Outline**:
  1. What workflow execution protections are: actor rules, event rules, and
     how they evaluate before a run.
  2. What is new at GA: workflow-file targeting, insights, REST API,
     evaluate/shadow mode.
  3. Why `pull_request_target` workflows are a common attack vector and how
     the new secure defaults help.
  4. A rollout plan for a large enterprise: start in evaluate mode, review
     insights, then enforce per workflow file, then codify with the REST
     API.
  5. Governance checklist for CSAs advising customers.
- **Score**: 75/100 (see `digest.md` for full breakdown).
- **Rationale for recommendation**: Highest score of the week, strong
  novelty (no existing post on this topic), and directly actionable for the
  CSA audience with a clear before/after governance story.

## 2. Microsoft Foundry agent network egress controls: a first look at agentic guardrails

- **Audience**: Cloud Solution Architects evaluating agentic AI platform
  security.
- **Angle**: Microsoft Foundry's public preview of network egress controls
  for hosted agents, read alongside the Agent 365 enable/disable controls
  that reached general availability the same week, as an emerging pattern
  of agent network and lifecycle guardrails.
- **Outline**:
  1. Why agentic workloads need explicit egress controls (data
     exfiltration, unintended tool calls).
  2. What is in preview today and what remains to be seen before GA.
  3. How this complements Agent 365 enable/disable controls.
  4. Guidance for customers piloting Foundry agents: treat both as
     preview-stage controls, not yet a complete governance story.
- **Score**: 64/100.
- **Rationale**: Solid security and governance relevance, but preview status
  limits how definitive the guidance can be, and it partially overlaps with
  existing Foundry/Azure AI content on this blog.

## 3. Not recommended as a standalone piece this week: Copilot budget increase requests

- **Audience**: Would have been CSAs advising on Copilot FinOps rollout.
- **Angle**: Self-service budget increase requests for Copilot Business and
  Enterprise, generally available 2026-09-16.
- **Why not proposed as a full idea**: This closely overlaps the existing
  2026-09-13 "GitHub Copilot FinOps" post already on this blog (scored
  63/100, lowest novelty of the week's shortlist). A short update to the
  existing post would serve readers better than a new article competing
  with it.

Only two full proposals are put forward this week; the evidence does not
support a third distinct, non-overlapping proposal without manufacturing
content to meet a quota.
