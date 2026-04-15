---
description: Designer-based blog cover creation workflow for Hugo posts
applyTo: '.github/agents/Post.agent.md'
---

## Skill Purpose

Use this skill to create consistent cover-image prompts for `designer.microsoft.com`
and to standardise cover file output for Hugo posts in this repository.

## When To Use

Use this skill for every new post created from a source link.

- Create a `cover_prompt` for front matter.
- Produce implementation-ready instructions for generating and saving the cover.
- Ensure path and filename match repository conventions.
- Enforce a cover-only image strategy unless the user explicitly asks for additional in-body images.

## Inputs

- Post title and slug
- Post summary and target audience
- Core technologies mentioned in the post
- 3 to 5 key concepts to visualise

## Required Output Contract

1. Provide a Designer prompt ready to paste into `designer.microsoft.com`.
1. Keep visual direction aligned with existing post covers: clean, technical,
   modern, enterprise-friendly.
1. Specify exact output filename as `cover.jpg`.
1. Specify exact output path as
   `content/posts/YYYY-MM-DD-slug/cover.jpg`.
1. Ensure front matter includes:
   - `cover = true`
   - `author = "sujith"`
   - `cover_prompt = '''...'''`
1. Do not generate or suggest in-body image placeholders by default.

## Prompt Construction Rules

- Use concrete nouns and visual anchors instead of generic adjectives.
- Include topic-specific icons or motifs tied to the source link content.
- Mention composition style, colour direction, and target audience.
- Keep the prompt concise enough to be editable, but detailed enough to reduce
  ambiguity.
- Avoid references to specific people, logos, or copyrighted artwork styles.

## Quality Checks

- Prompt reflects the actual article content and not a generic template.
- Prompt includes at least one architecture/workflow metaphor where appropriate.
- Prompt avoids visual clutter and unreadable text-heavy scenes.
- File path and filename are valid and match the post folder.

## Output Template

```text
Designer Action:
1. Open designer.microsoft.com.
2. Paste this prompt:
   <cover_prompt_text>
3. Export as JPG.
4. Save as: content/posts/YYYY-MM-DD-slug/cover.jpg
```
