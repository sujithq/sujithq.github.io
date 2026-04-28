---
name: PLG Infographic Generator
description: Generate PLG infographic and create PR

on:
  workflow_dispatch:

permissions: read-all

engine: copilot

tools:
  github:
    allowed-repos:
      - sujithq/ms-learn
      - sujithq/sujithq
      - andrediasbr/github-certification-ranking
    min-integrity: none
    toolsets: [repos, pull_requests]

safe-outputs:
  threat-detection:
    prompt: |
      This workflow is expected to generate a static infographic page.
      Treat plain HTML and CSS used only for layout and styling as benign.
      Flag only genuinely risky web content such as JavaScript, event handlers,
      iframes, forms, remote scripts, external asset loading, credential capture,
      data exfiltration, or hidden tracking behaviour.
  upload-artifact:
    max-uploads: 1
    retention-days: 7
    skip-archive: true
    allowed-paths:
      - docs/infographic.html
      - infographic.html
  create-pull-request:
    draft: true

metadata:
  inputs: "README.md"
  outputs: "docs/infographic.html"
  agents: "planner,generator,reviewer"
  orchestration: "sequential:planner->generator->reviewer"
---

# PLG Infographic Generator

1. Read README.md
2. Fetch relevant public profile/project data from sujithq/ms-learn and sujithq/sujithq when needed
3. Extract profile information
4. Generate a PLG-style infographic as a single static HTML file at docs/infographic.html
5. The HTML must be self-contained and safe:
  - inline CSS only
  - no JavaScript
  - no external fonts, images, stylesheets, or scripts
  - no forms, iframes, embeds, tracking, or network requests
  - semantic, accessible markup with clear headings and sections
6. Upload docs/infographic.html as a GitHub Actions artifact so the run exposes the generated page directly
  - use the exact upload path docs/infographic.html (not infographic.html)
7. Create a draft pull request that adds or updates this file
8. Provide a clear PR description explaining the generated content, confirming the page is static with no active content, and mentioning that the workflow artifact contains docs/infographic.html
