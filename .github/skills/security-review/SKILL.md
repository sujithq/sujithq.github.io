---
name: security-review
description: Review security-sensitive changes to the crawler, workflows, and external publishing boundaries in this repository.
---

# Security review

Use this skill when a change touches any of these real trust boundaries:

- Provider credentials and token handling in `src/Crawler/Llm/` and
  `src/Crawler/appsettings.json`.
- Azure OIDC, repository permissions, or deployment destinations in
  `.github/workflows/`.
- External content ingestion and generated data written under `db/`, `state/`,
  `content/`, or `reports/`.

Check that secrets remain environment-provided, permissions stay least
privileged, and generated or external content is not treated as trusted code.
Run the checks listed in `AGENTS.md` for the affected paths and report any
human-review boundary before merge.
