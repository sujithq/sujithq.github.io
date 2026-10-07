+++
title = "Article ideas: 21 to 27 September 2026"
+++

# Article ideas: 21 to 27 September 2026

## 1. Proof of presence: closing the gap that stolen tokens exploit (recommended, score 80/100)

- Audience: enterprise architects and security-focused CSAs responsible for GitHub Enterprise Cloud identity and access governance.
- Angle: explain how proof of presence complements sudo mode by binding high-impact actions to a fresh IdP challenge, and map out how to plan a phased rollout for EMU enterprises on Microsoft Entra ID.
- Outline:
  1. The problem: stolen session cookies and long-lived tokens in recent supply chain attacks.
  2. How proof of presence works: IdP redirect, policy types (re-authentication vs multi-factor), two-hour session validity.
  3. Scope and limits today: EMU + GHEC-DR + Entra ID only, pull request merge gating not yet available.
  4. Architecture guidance: where to slot this into an existing conditional access policy, and how it interacts with sudo mode.
  5. What to watch: the planned extension to pull request merges.
- Score and rationale: see digest.md item 1. Highest enterprise/architecture impact, security relevance and novelty of the week's candidates, with no prior coverage on this blog.

## 2. Sandboxing agentic coding tools: a policy checklist for platform teams

- Audience: platform engineering and DevOps leads standardising on GitHub Copilot CLI or the Copilot app.
- Angle: use the new local sandboxing feature as the anchor for a broader checklist on constraining agent file, network and credential access during local development sessions.
- Outline:
  1. Why agent blast radius matters: unintended commands touching files, network or credentials.
  2. What local sandboxing configures, and where (per-project, local repository and working tree sessions).
  3. A policy checklist: default-on sandboxing, exception handling, auditing sandbox bypass requests.
  4. Where this fits alongside existing GitHub Copilot CLI governance controls covered on this blog.
- Score and rationale: see digest.md item 2 (73/100). Strong governance relevance, but a smaller architectural footprint than proof of presence.

## 3. Native OpenTelemetry in GitHub Copilot: extending your existing observability stack

- Audience: SREs and CSAs who already instrument AI coding agents with Grafana or Application Insights.
- Angle: show how the new enterprise-managed OTel setting reduces custom instrumentation work compared with the Grafana/Application Insights approach in `2026-06-02-monitor-ai-coding-agents-grafana-app-insights`, and what metrics/traces become available out of the box.
- Outline:
  1. Recap of the prior custom-instrumentation approach on this blog.
  2. What native OTel support adds: enterprise-managed configuration, standard exporters.
  3. Migration considerations for teams with existing custom dashboards.
  4. Practical caveat: this is an incremental capability, not a new observability paradigm.
- Score and rationale: see digest.md item 3 (63/100). Solid CSA relevance but lower novelty because this blog already covers agent observability; included as the third idea rather than the lead because it extends existing coverage rather than opening a new topic.

Only one candidate (proof of presence) scored strongly enough on novelty and enterprise impact to justify a full draft this week; see `blog-draft.md` for that draft.
