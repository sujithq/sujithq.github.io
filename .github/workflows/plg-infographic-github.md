---
name: PLG Infographic Generator
description: Generate PLG infographic and create PR

on:
  workflow_dispatch:

permissions: read-all

engine: copilot

tools:
  github:
    toolsets: [repos, pull_requests]

safe-outputs:
  threat-detection:
    prompt: |
      This workflow is expected to generate a static infographic page.
      Treat plain HTML and CSS used only for layout and styling as benign.
      Flag only genuinely risky web content such as JavaScript, event handlers,
      iframes, forms, remote scripts, external asset loading, credential capture,
      data exfiltration, or hidden tracking behaviour.
  create-pull-request: {}

metadata:
  inputs: "README.md"
  outputs: "docs/infographic.html"
  agents: "planner,generator,reviewer"
  orchestration: "sequential:planner->generator->reviewer"
---

# PLG Infographic Generator

1. Read README.md
2. Extract profile information
3. Generate a PLG-style infographic as a single static HTML file at docs/infographic.html
4. The HTML must be self-contained and safe:
  - inline CSS only
  - no JavaScript
  - no external fonts, images, stylesheets, or scripts
  - no forms, iframes, embeds, tracking, or network requests
  - semantic, accessible markup with clear headings and sections
5. Create a pull request that adds or updates this file
6. Provide a clear PR description explaining the generated content and confirming the page is static with no active content
