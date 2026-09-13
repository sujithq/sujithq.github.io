---
on:
  schedule: daily
sandbox:
  agent:
    version: v0.28.16
    images:
      agent: ghcr.io/github/gh-aw-firewall/agent:0.28.16@sha256:57a3e27388a6d7d32719088581e52567727fa0bf2f0d477bf565b0c4baa12a3f
      apiProxy: ghcr.io/github/gh-aw-firewall/api-proxy:0.28.16@sha256:cd400948638ffe1b87ec319abf73fa29b6ac9881b015da58bba971c4cc13a400
      squid: ghcr.io/github/gh-aw-firewall/squid:0.28.16@sha256:452197f2e241b2cda8eb0b5674960aa8ca544a64dc242e24f8263c3df6452919
permissions:
  contents: read
  issues: read
  pull-requests: read
safe-outputs:
  create-issue:
    title-prefix: "[team-status] "
    labels: [report, daily-status]
    close-older-issues: true
---

## Daily Issues Report

Create an upbeat daily status report for the team as a GitHub issue.

## What to include

- Recent repository activity (issues, PRs, discussions, releases, code changes)
- Progress tracking, goal reminders and highlights
- Project status and recommendations
- Actionable next steps for maintainers
