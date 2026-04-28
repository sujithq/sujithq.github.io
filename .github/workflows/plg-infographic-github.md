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
3. Generate a PLG-style infographic as HTML at docs/infographic.html
4. Create a pull request that adds or updates this file
5. Provide a clear PR description explaining the generated content
