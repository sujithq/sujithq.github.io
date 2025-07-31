# Copilot Instructions for sujithq.github.io

## Project Purpose
This repository contains the source code and content for my personal technical blog, built with Hugo. The site features posts on Azure, DevOps, GitHub, cloud architecture, and automation.

## Folder Structure
- `content/`: Markdown files for blog posts, authors, and pages.
- `assets/`: JavaScript, SCSS, and static assets for site styling and interactivity.
- `static/`: Files served as-is (images, PDFs, icons, etc.).
- `layouts/`: Hugo templates and partials for site rendering.
- `config/`: Hugo configuration files for different environments.
- `public/`: Generated site output (do not edit directly).
- `tests/`: Playwright and other test scripts for site validation.

## Coding Standards
- Use clear, concise, and technical language in posts.
- Prefer British English spelling.
- Write front matter in TOML format.
- Use short, descriptive titles (≤50 characters) and summaries (≤150 characters).
- Format code blocks with proper language identifiers.
- Use colons or periods for explanations, not long dashes.
- Keep folder and file names lowercase and hyphenated.

## Tools & Workflows
- Use Hugo for static site generation.
- Use Playwright for end-to-end testing.
- Use SCSS for styling and keep styles modular.
- Use TypeScript for custom scripts in `assets/ts/`.

## Content Guidelines
- Posts should be educational, actionable, and reference official docs when possible.
- Use lists, headings, and code blocks for clarity.
- Add cover images to each post using the `cover` parameter in front matter.
- Avoid jargon unless explained.

## AI Assistant Guidance
- When generating new posts, follow the structure and style of existing posts in `content/posts/`.
- When editing or suggesting changes, preserve TOML front matter and markdown formatting.
- When adding code, prefer modern, idiomatic patterns for the language in use.
- When suggesting images or diagrams, describe them clearly for later manual creation.

## References
- [Hugo Documentation](https://gohugo.io/documentation/)
