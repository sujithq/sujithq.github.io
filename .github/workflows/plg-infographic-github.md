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
    toolsets: [repos, pull_requests, search]

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
  inputs: "README.md, sujithq/sujithq README.md, sujithq/ms-learn transcript.json"
  outputs: "docs/infographic.html"
---

# PLG Infographic Generator

## Data sources — collect all before generating

1. **This repo README**: read `README.md` in the current repo (sujithq/sujithq.github.io)
2. **GitHub profile README**: read `README.md` from repo `sujithq/sujithq` (branch `master`)
3. **MS Learn transcript**: read `src/ms-learn/wwwroot/data/transcript.json` from repo `sujithq/ms-learn`
4. **Real GitHub stats** — query the GitHub API for the user `sujithq`:
  - total public repositories, followers, following
  - top 10 repositories ordered by stars (name, stargazerCount, forkCount, primaryLanguage)
  - aggregate total stars and forks across all public repos
  - most-used programming languages (from public repos)
5. **GitHub certification ranking**: read relevant files from repo `andrediasbr/github-certification-ranking` if useful

## Generate the infographic

6. Synthesise all collected data into a PLG-style infographic as a single static HTML file at `docs/infographic.html`.
  Include clearly labelled sections for:
  - profile summary (name, bio, location, social links)
  - GitHub stats (followers, total stars, top repos, languages)
  - Microsoft Learn certifications and learning achievements (from transcript.json)
  - key highlights from the GitHub profile README
7. The HTML must be self-contained and safe:
  - inline CSS only — no external stylesheets, fonts, or scripts
  - no JavaScript, event handlers, or inline scripts
  - no iframes, forms, embeds, tracking pixels, or network requests
  - semantic, accessible markup with clear headings and sections

## Upload and PR

8. Upload `docs/infographic.html` as a GitHub Actions artifact so the run exposes the page directly
  - use the exact upload path `docs/infographic.html` (not `infographic.html`)
9. Create a draft pull request that adds or updates `docs/infographic.html`
10. Include in the PR description: a summary of the data sources used, confirmation the page is static with no active content, and that the artifact `docs/infographic.html` is attached to this run
