---
title: "github: Docker and Docker Compose version upgrades on hosted runners"
date: 2026-01-30T14:20:34.000Z
slug: docker-and-docker-compose-version-upgrades-on-hosted-runners
update_categories: ["github"]
update_tags: ["docker", "docker-compose", "github-actions", "hosted-runners", "ubuntu", "windows", "changelog", "2026"]
update_bullets: ["Effective date: February 9, 2026.", "What changes: Docker and Docker Compose versions will be updated on hosted runners.", "Affected runners: all Windows and Ubuntu images except ubuntu-slim.", "Why it matters: access to newer features, performance improvements, and bug fixes — but potential for breaking changes in workflows that depend on specific Docker behavior.", "Recommended actions: test affected workflows, pin Docker/Docker Compose versions in CI if you need a specific release, and update or check self-hosted runners manually as needed.", "Quick checks you can add to workflows: run docker --version and docker compose version to confirm the runner versions."]
timeframes: ["2026-01"]
link: "https://github.blog/changelog/2026-01-30-docker-and-docker-compose-version-upgrades-on-hosted-runners"
source: "GitHub"
timeframeKey: "2026-01"
id: "E90FBB6509E84ED4A3D2F4472FD13E7FF10FFAB7D3AEE42566F9331260609E65"
contentHash: "1C66F3AB6D48C1901E9CBEC097AE1063C809737982C218DE0BCFE2FDEA7A7761"
draft: false
type: "updates2"
llmSummary: "On February 9, 2026, GitHub will upgrade Docker and Docker Compose on all Windows and Ubuntu hosted runner images except ubuntu-slim, allowing workflows to use the latest Docker releases. Users should test workflows and pin or adjust tooling if they depend on previous Docker behavior."
---

On February 9, 2026, GitHub will upgrade Docker and Docker Compose on all Windows and Ubuntu hosted runner images except ubuntu-slim, allowing workflows to use the latest Docker releases. Users should test workflows and pin or adjust tooling if they depend on previous Docker behavior.

- **Source:** [GitHub](https://github.blog/changelog/2026-01-30-docker-and-docker-compose-version-upgrades-on-hosted-runners)
