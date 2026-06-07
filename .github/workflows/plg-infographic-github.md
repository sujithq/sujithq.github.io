---
name: PLG Infographic Generator
description: Generate PLG infographic artifact

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
    toolsets: [repos, search]

steps:
  - name: Checkout code
    uses: actions/checkout@v6
    with:
      fetch-depth: 1
      persist-credentials: false

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
      - infographic.html

metadata:
  inputs: "README.md, content/resume/accomplishments/_index.md, sujithq/sujithq README.md, sujithq/ms-learn transcript.json"
  outputs: "infographic.html"
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
6. **Credly profile**: try to read the public profile at `https://www.credly.com/users/sujith`
  - capture the public profile URL and any visible public badge counts, issuers, or notable badges
  - if the profile cannot be fetched, fall back to `content/resume/accomplishments/_index.md` in this repo and summarise the existing Credly badge links already listed there

## Generate the infographic

7. Synthesise all collected data into a PLG-style infographic as a single static HTML file at `infographic.html`.
  Write the file to disk before calling any safe output tools. This output is an artifact only, so do not create or update a site file under `static/`.
  Include clearly labelled sections for:
  - profile summary (name, bio, location, social links)
  - GitHub stats (followers, total stars, top repos, languages)
  - Microsoft Learn certifications and learning achievements (from transcript.json)
  - Credly badges and certifications (profile link plus a concise summary of public badges or the local fallback data)
  - key highlights from the GitHub profile README
8. The HTML must be self-contained and safe:
  - inline CSS only — no external stylesheets, fonts, or scripts
  - no JavaScript, event handlers, or inline scripts
  - no iframes, forms, Credly embeds, tracking pixels, or network requests
  - semantic, accessible markup with clear headings and sections

## Upload artifact

9. Upload the generated HTML as a GitHub Actions artifact so the run exposes the page directly
  - use a path that already exists at upload time (`infographic.html`)
  - do not call `upload_artifact` with a non-existent path
10. Do not create a pull request or commit the generated HTML back to the repository.
