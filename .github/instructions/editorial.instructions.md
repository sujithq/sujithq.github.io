---
description: 'Weekly editorial packet standards'
applyTo: 'editorial/**'
---

# Editorial Packet Guidelines

Files under `editorial/weekly/YYYY-MM-DD/` are produced by the Weekly CSA Blog Research workflow. They are editorial preparation material for review, not completed posts.

## Scope

- Editorial packets must stay outside `content/`, `static/`, `layouts/` and `public/`, so they never reach the generated site.
- A packet is never a finished post. The requirement that a completed post ships `index.md` and `cover.jpg` together is unchanged, and applies when a draft is promoted to `content/posts/YYYY-MM-DD-slug/`.
- Preparing a packet does not require image-generation credentials.
- This repository is public: a draft prevents website publication, not public access.

## Packet contents

Each packet contains at most these files:

- `digest.md`: ranked announcements, enterprise implications, recommendations, sources and a `## Research limitations` section.
- `article-ideas.md`: up to three proposals with audience, angle, outline, score and rationale, one recommended.
- `blog-draft.md`: the strongest proposal, using Hugo TOML front matter with `draft = true` and the conventions in `posts.instructions.md`.
- `linkedin-draft.md`: an unpublished teaser.
- `sources.json`: structured evidence with dates, URLs and claim-to-source mapping.

`blog-draft.md` and `linkedin-draft.md` are written together or not at all. Never add filler files to complete a packet.

## Evidence rules

- Record announcement dates, availability status, licensing or regional limitations, and source URLs.
- Distinguish verified facts from recommendations, and map every claim to at least one source.
- Never invent announcements, measurements, hands-on experience or customer stories.
- Prefer British English, as elsewhere in the repository.

## Validation

```bash
node scripts/weekly-csa-blog.js validate --packet-dir=editorial/weekly/YYYY-MM-DD
```
