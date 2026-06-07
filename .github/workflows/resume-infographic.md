---
name: Resume Infographic Generator
description: Generate resume infographic artifact

on:
  workflow_dispatch:

permissions: read-all

engine: copilot

tools:
  github:
    allowed-repos:
      - sujithq/*
    min-integrity: none
    toolsets: [repos]

network:
  allowed: ["defaults"]

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
      - resume-infographic.html

metadata:
  inputs: "content/resume/experiences/_index.md, content/resume/accomplishments/_index.md, https://quintelier.dev/resume, https://www.linkedin.com/in/sujithquintelier"
  outputs: "resume-infographic.html"
---

# Resume Infographic Generator

## Data sources — collect all before generating

1. **Work experience**: read `content/resume/experiences/_index.md` from the current repo (sujithq/sujithq.github.io)
2. **Accomplishments and certifications**: read `content/resume/accomplishments/_index.md` from the current repo
3. **Resume page**: fetch the live resume page at `https://quintelier.dev/resume` to extract visible text content including page title, section headings, role descriptions, and any publicly displayed contact or profile information
4. **LinkedIn profile**: fetch `https://www.linkedin.com/in/sujithquintelier` to read only the publicly accessible, unauthenticated view of the profile — extract headline, current role, location, and skills or endorsements visible without logging in; do not attempt to log in, bypass access controls, or scrape content that requires authentication

## Generate the infographic

5. Synthesise all collected data into a resume-style infographic as a single static HTML file at `resume-infographic.html`.
   Write the file to disk before calling any safe output tools. This output is an artifact only, so do not create or update a site file under `static/`.
   Include clearly labelled sections for:
   - Profile summary (name, current role, location, contact and social links)
   - Professional experience timeline (company, title, period, short description)
   - Certifications and accomplishments (grouped by category: Microsoft/Azure, GitHub, Legacy, Applied Skills)
   - Key skills and technology focus areas (derived from experience and certifications)
   - Education or additional context if available from LinkedIn
6. The HTML must be self-contained and safe:
   - Inline CSS only — no external stylesheets, fonts, or scripts
   - No JavaScript, event handlers, or inline scripts
   - No iframes, forms, embeds, tracking pixels, or network requests
   - Semantic, accessible markup with clear headings and sections
   - Visual style should be professional and clean, suited to a resume context

## Upload artifact

7. Upload the generated HTML as a GitHub Actions artifact so the run exposes the page directly.
   - use a path that already exists at upload time (`resume-infographic.html`)
   - do not call `upload_artifact` with a non-existent path
8. Do not create a pull request or commit the generated HTML back to the repository.
