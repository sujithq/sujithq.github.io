# Repository instructions

`AGENTS.md` is the canonical guide for contributors and coding agents. Read it
before making changes. Path-specific guidance lives in
`.github/instructions/`.

## Project boundaries

- This is a Hugo site with a .NET crawler and Playwright tests.
- Source belongs in `content/`, `layouts/`, `assets/`, `static/`, `scripts/`,
  `tests/`, or `src/Crawler/`.
- `public/`, `resources/`, `node_modules/`, `playwright-report/`, and
  `test-results/` are generated or vendored. Do not edit them directly.
- Keep changes small and update related documentation and tests.

## Conventions

- Use npm with the committed `package-lock.json`; use Node and npm versions
  from `.nvmrc` and `package.json`.
- Use Hugo TOML front matter. Blog posts use the conventions in
  `.github/instructions/posts.instructions.md`.
- Prefer British English, lowercase hyphenated filenames, and language
  identifiers on fenced code blocks.
- Use accessible, role-based Playwright locators and web-first assertions.
- New posts are complete only when both `index.md` and `cover.jpg` exist.
- Before generating a cover, authenticate to Azure and use the configured
  Microsoft Foundry image endpoint. If authentication fails, stop and report
  the blocked run rather than committing a partial post.
- Editorial packets under `editorial/weekly/` are not publication-ready posts
  and must stay outside `content/` and `static/`.
- Never commit credentials. Use environment variables for crawler provider
  tokens.

## Commands

```bash
npm ci
npm test
npm run test:unit
npm run build:prod
dotnet restore src/Crawler/Crawler.csproj --locked-mode
dotnet build src/Crawler/Crawler.csproj --configuration Release --no-restore
npm run validate-workflows
```

Use `npm run test:prod-local-health` for the optional local production smoke
test. Run the checks relevant to the files changed.

## Maintenance matrix

| Change | Also update |
| --- | --- |
| Hugo templates, assets, or styles | Relevant Playwright coverage and `npm run build:prod` |
| Crawler code or project files | Crawler tests, `nuget.config` or lock files when dependencies change |
| A blog post | Its `index.md`, `cover.jpg`, and post-specific images together |
| Weekly editorial automation | `.github/workflows/docs/WEEKLY_CSA_BLOG.md` and packet validation |
| Agentic workflow source | Its compiled `.lock.yml` and `npm run validate-workflows` |
| Repository contributor guidance | This file, pointer files, and the applicable `.github/instructions/` file |

## Done means

- `git diff --check` exits successfully.
- `npm run build:prod` exits successfully for site or content changes.
- `npm test` exits successfully for UI or template changes.
- `npm run test:unit` exits successfully for JavaScript script changes.
- `dotnet build src/Crawler/Crawler.csproj --configuration Release --no-restore`
  exits successfully for crawler changes.
- `npm run validate-workflows` exits successfully for agentic workflow changes.
- Changed generated files are not hand-edited, and no secrets are present.

## Never merges without a human

The following changes require explicit human review before merge:

- Changes to `.github/workflows/`, `.github/agents/`, or security-sensitive
  crawler/provider code.
- Changes that add or modify credentials, deployment permissions, OIDC
  configuration, or external publishing destinations.
- Changes that publish or delete content, alter repository protection, or
  modify generated output policies.

## Review and delivery

- Explain the user-visible effect and the checks run in the pull request.
- Keep unrelated cleanup out of the change.
- Reviewer agents in `.github/agents/` are complementary to normal review;
  assign them to changes where their question applies.
