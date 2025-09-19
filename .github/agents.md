# Copilot Coding Agent – Repository Instructions

This repository contains a Hugo-powered technical blog with Playwright tests and a .NET 9 console app (Crawler) that ingests feeds and generates update content. Use this file as your source of truth when making changes, running tests, or proposing PRs.

## Goals

- Ship small, focused changes with a green test suite.
- Preserve content quality, site performance, and security.
- Follow existing conventions and instructions in this repo.

## Project overview

- Static site: Hugo (min version 0.148.2), theme: `github.com/sujithq/ideal-octo-guacamole`.
- Tests: Playwright end-to-end tests under `tests/` with HTML reports in `playwright-report/`.
- Crawler: .NET 9 console app in `src/Crawler` that reads feeds and uses LLM providers.
- Content lives in `content/`; do not edit `public/` directly (generated output).

## What to edit vs. avoid

- Do edit: `content/`, `layouts/`, `assets/`, `static/`, `tests/`, `scripts/`, `src/Crawler/**`.
- Avoid editing generated or vendored paths: `public/`, `node_modules/`, `playwright-report/`, `test-results/`.
- Honour repository instruction files in `.github/` and `.github/instructions/`.

## Conventions and writing standards

- Front matter for content is TOML.
- Prefer British English spelling.
- Use short titles (≤ 50 chars) and summaries (≤ 150 chars).
- Filenames: lowercase, hyphenated.
- Code blocks should specify the language (e.g., `ts`, `bash`, `csharp`).

See also:

- `.github/copilot-instructions.md` for project context and standards.
- `.github/instructions/*.instructions.md` for file- and scope-specific guidance.

## Setup and tooling

- Node: use npm with the existing lockfile; avoid yarn/pnpm.
- Hugo: ensure `hugo version` ≥ 0.148.2.
- .NET SDK: 9.0.
- Browser: Microsoft Edge for Playwright (channel `msedge`). Ensure Edge is installed.

## Commands the agent may run

These commands are safe for agents to execute locally during tasks.

### Install / bootstrap

- npm ci
- npx playwright install  # optional; Edge channel uses system browser

### Development (Hugo)

- hugo server -D -F --gc --minify

### Production build (Hugo)

- hugo --gc --minify -e production

### Tests (Playwright)

- npm test
- npm run upd  # update snapshots when changes are intentional

### Crawler (.NET)

- dotnet build src/Crawler -c Release
- dotnet run --project src/Crawler -c Release -- --verbose

## Testing & quality gates

- Always run `npm test` before committing; ensure Playwright passes.
- For site smoke checks, run a production build: `hugo --gc --minify -e production` (no errors/warnings).
- For Crawler changes, ensure `dotnet build src/Crawler -c Release` succeeds.
- Update or add tests when changing behaviour. If UI changes cause snapshot diffs, use `npm run upd` intentionally and review results.

## Crawler configuration & secrets

- The Crawler reads `src/Crawler/appsettings.json` and environment variables. Key fields:
  - `llm.provider`: one of `foundry`, `github`, `openai` (default is `foundry`).
  - Per-provider keys: `baseUrl`, `model`, `tokenKey`, `initialDelaySeconds`, `maxCallsPerRun`.
- Required secrets by provider (set as environment variables, never commit secrets):
  - Foundry (Azure OpenAI on your endpoint): `FOUNDRY_API_KEY`
  - OpenAI: `OPENAI_API_KEY`
  - GitHub Models: `MODELS_TOKEN`
- The app fails fast if the selected provider is missing a token or base URL.
- Do not add plaintext secrets to the repo. Use environment variables or local user secrets.

## Change management

- Make minimal, focused diffs. Keep commits scoped and descriptive.
- Update docs and tests alongside code changes.
- Do not modify `public/` directly; let Hugo regenerate output.
- When editing or adding content under `content/`, use TOML front matter and follow writing guidelines above.

## PR checks and expectations

- Title: concise and scoped. Example: `[content] Add AZ-700 study notes section` or `[crawler] Tweak LLM throttling`.
- Must pass: `npm test` and a production Hugo build.
- If Playwright snapshots change, include rationale in the PR description.

## Performance & accessibility

- Keep page payloads reasonable; prefer modern image formats (WebP/AVIF) when adding media.
- Use lazy-loading for images where possible.
- Prefer accessible, role-based selectors in Playwright tests and avoid brittle locators.

## Security

- Never commit secrets or tokens. Use environment variables as described above.
- Be cautious with external embeds and scripts; prefer local assets or vetted CDNs.

## Reference: agents.md

- This repository uses a `.github/agents.md` file for agent guidance.
- For schema examples and community practices, see: [agents.md](https://agents.md/)
