---
name: PLG Infographic Generator
description: Generate PLG infographic and create PR

on:
  workflow_dispatch:

permissions: read-all

engine: copilot

steps:
  - collect-data
  - generate-infographic
  - upload-artifact
  - create-pull-request

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
    staged: false
    defaults:
      if-no-files: ignore
    allowed-paths:
      - static/infographic/index.html
      - infographic.html
  create-pull-request:
    draft: false

metadata:
  inputs: "README.md, sujithq/sujithq README.md, sujithq/ms-learn transcript.json, Credly badge wallet page https://credly.com/users/sujith/badges"
  outputs: "static/infographic/index.html"
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
4. **Credly badge profile**: read the rendered Credly profile page at `https://credly.com/users/sujith/badges` and extract the visible badge wallet data available on the page (badge name, issuer, issued/expiry text where shown).
5. **GitHub certification ranking**: read relevant files from repo `andrediasbr/github-certification-ranking` if useful

## Generate the infographic

6. Synthesise all collected data into a PLG-style infographic as a single static HTML file at `static/infographic/index.html`.
  Write the file to disk before calling any safe output tools. Do not rely only on a `create_pull_request` patch to materialise the file.
  Include clearly labelled sections for:
  - profile summary (name, bio, location, social links)
  - GitHub stats (followers, total stars, top repos, languages)
  - Microsoft Learn certifications and learning achievements (from transcript.json)
  - Credly badge highlights from the rendered badge wallet page
  - key highlights from the GitHub profile README
7. The HTML must be self-contained and safe:
  - inline CSS only — no external stylesheets, fonts, or scripts
  - no JavaScript, event handlers, or inline scripts
  - no iframes, forms, embeds, tracking pixels, or network requests
  - semantic, accessible markup with clear headings and sections

## Upload and PR

8. Upload the generated HTML as a GitHub Actions artifact so the run exposes the page directly
  - use a path that already exists at upload time (`static/infographic/index.html` or `infographic.html`)
  - do not call `upload_artifact` with a non-existent path
9. Create a pull request (not draft) that adds or updates `static/infographic/index.html`
10. Enable auto-merge on the created pull request when possible
11. Include in the PR description: a summary of the data sources used, confirmation the page is static with no active content, and that the artifact `static/infographic/index.html` is attached to this run
