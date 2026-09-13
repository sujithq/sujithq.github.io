---
name: Content QA (Agentic)
description: "Agentic content QA for Hugo markdown changes."
on:
  pull_request:
    paths:
      - "content/**"
  skip-bots: ["dependabot[bot]"]
if: github.actor != 'dependabot[bot]'
permissions: read-all
engine: copilot
sandbox:
  agent:
    version: v0.28.16
    images:
      agent: ghcr.io/github/gh-aw-firewall/agent:0.28.16@sha256:57a3e27388a6d7d32719088581e52567727fa0bf2f0d477bf565b0c4baa12a3f
      apiProxy: ghcr.io/github/gh-aw-firewall/api-proxy:0.28.16@sha256:cd400948638ffe1b87ec319abf73fa29b6ac9881b015da58bba971c4cc13a400
      squid: ghcr.io/github/gh-aw-firewall/squid:0.28.16@sha256:452197f2e241b2cda8eb0b5674960aa8ca544a64dc242e24f8263c3df6452919
tools:
  github:
    toolsets: [pull_requests]
  bash: ["git", "cat"]
safe-outputs:
  add-comment:
    max: 1
    hide-older-comments: true
network:
  allowed: ["defaults"]
steps:
  - name: Checkout code
    uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1
    with:
      fetch-depth: 0
      persist-credentials: false
  - name: Fetch base branch
    env:
      BASE_BRANCH: ${{ github.event.repository.default_branch }}
    run: git fetch origin "$BASE_BRANCH" --depth=1
---

## Content QA Instructions

You are a content QA reviewer for this repository. Analyse only files changed in this pull request under `content/`.

Required checks for `content/posts/*/index.md`:
- TOML front matter with `+++` markers.
- Required fields: `title`, `slug`, `date`, `lastmod`, `draft`, `tags`, `categories`, `series`, `layout`, `cover`, `author`, `description`.
- Date format must be `YYYY-MM-DD HH:MM:SSZ`.
- `layout = "single"` and `author = "sujith"` must use double quotes.
- Folder name must match `YYYY-MM-DD-slug` from front matter.
- Title length <= 50 chars; description length <= 150 chars.
- No H1 headings.
- Blank lines before and after lists and fenced code blocks.
- Fenced code blocks must include a language identifier.
- Use Hugo image shortcode, with images under `img/` and `src="img/..."`.
- Prefer British English spelling; warn for obvious US spellings.
- Avoid long dashes (—); use a colon or period instead.

Required checks for other `content/**/*.md`:
- No H1 headings.
- Blank lines before and after lists and fenced code blocks.
- Fenced code blocks must include a language identifier.

Process:
1. Use `git diff --name-only origin/$BASE_BRANCH...HEAD -- content/` to list changed files.
2. For each file, read content and validate against the rules above.
3. Collect failures and warnings with file + line references.

Output:
- Post a single comment on the PR using the `add-comment` safe output.
- Comment format:
  - Short status line: PASS or FAIL.
  - Failures list (if any).
  - Warnings list (if any).
  - If no content changes, state that explicitly.
- Do not modify files or open PRs. Use only the safe output for the comment.
