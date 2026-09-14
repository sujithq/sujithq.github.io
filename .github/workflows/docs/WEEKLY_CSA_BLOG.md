# Weekly CSA Blog Research

An agentic workflow that researches the previous complete week of GitHub, Azure and DevOps announcements and prepares an **editorial packet** for Quintelier.dev, written for a Cloud Solution Architect (CSA) audience.

The workflow prepares editorial material. It never produces a finished blog post.

## Files

| File | Purpose |
|------|---------|
| [`../weekly-csa-blog.md`](../weekly-csa-blog.md) | Workflow definition (gh-aw Markdown with YAML frontmatter) |
| [`../weekly-csa-blog.lock.yml`](../weekly-csa-blog.lock.yml) | Generated GitHub Actions workflow, compiled with gh-aw `v0.89.10` |
| `../../../scripts/weekly-csa-blog.js` | Deterministic helper for edition planning and packet validation |
| `../../../tests/unit/weekly-csa-blog.test.js` | Offline tests for the helper |
| `../../../tests/unit/editorial-isolation.test.js` | Guards the publication boundary |

## Activation

The workflow ships disabled. Both the schedule and manual dispatch are gated by a repository variable:

```bash
gh variable set WEEKLY_CSA_BLOG_ENABLED --body true
```

Until the variable is set to `true`, no run reaches the agent, so no AI credits are consumed. Compilation and the offline tests never need the variable.

Setting `safe-outputs.staged: true` would preview the pull request instead of creating it. Staged mode prevents GitHub writes, but it does **not** prevent inference cost: the research still runs and still consumes AI credits.

## Schedule and manual runs

- Schedule: `17 7 * * 1` with `timezone: Europe/Paris`, so the run happens at 07:17 local time in both CET and CEST.
- Manual: **Actions → Weekly CSA Blog Research → Run workflow**, optionally supplying `edition_date`.

`edition_date` must be a Monday in `YYYY-MM-DD` format and cannot be in the future. It is used for reproducible retries and backfills.

## Reporting period and edition identity

`scripts/weekly-csa-blog.js plan` fixes the edition **before** research starts and writes it to `/tmp/gh-aw/agent/weekly-csa-plan.json` and the Actions run summary:

- Reporting period: the previous complete Monday-to-Sunday calendar week in Europe/Paris, with an inclusive start, an exclusive end and the timezone offsets in force on those dates.
- Edition date: the Monday immediately following that reporting period.
- Edition identifier: `weekly-csa-YYYY-MM-DD`, used for the packet directory, the branch and the pull request title.

## Duplicate prevention

Before research, the workflow lists open, merged and closed pull requests matching `weekly-csa in:title` and checks whether the packet directory already exists. When either is found, the agent stops, reports the existing pull request and creates nothing. A rejected edition is never recreated and human edits are never overwritten.

Overlapping runs are serialised by the generated workflow concurrency group (`gh-aw-<workflow>` with `queue: max`), and per-edition agent slots come from `concurrency.job-discriminator`.

## Deliverables

A successful run creates `editorial/weekly/YYYY-MM-DD/` containing:

- `digest.md`: ranked announcements, enterprise implications, recommendations, sources and a `## Research limitations` section.
- `article-ideas.md`: up to three proposals with audience, angle, outline, score and rationale, one recommended.
- `blog-draft.md`: a complete draft with Hugo TOML frontmatter and `draft = true`.
- `linkedin-draft.md`: an unpublished teaser.
- `sources.json`: structured evidence with dates, URLs and claim-to-source mapping.

Outcomes that do **not** create files or a pull request:

- Quiet week: research succeeded, but no announcement qualifies. The run summary records the no-update outcome.
- Blocked research: fewer than three official sources were reachable. The run summary reports blocked or incomplete research, never "no updates".

When qualifying announcements exist but none supports a defensible article, the packet contains `digest.md`, `article-ideas.md` and `sources.json` only. `blog-draft.md` and `linkedin-draft.md` are always written together or not at all.

## Permissions and secrets

- The agent job runs with `permissions: read-all`. All writes go through the `create-pull-request` safe output.
- The safe output enforces `draft: true`, `max: 1`, `fallback-as-issue: false`, `max-patch-files: 5`, `max-patch-size: 512` and an exclusive `allowed-files` list limited to the five editorial packet files.
- Copilot engine authentication uses the `COPILOT_GITHUB_TOKEN` secret, as for the other agentic workflows in this repository. Alternatively an organisation with centralised Copilot billing can use `permissions.copilot-requests: write`.
- Budget guardrails: `timeout-minutes: 25` for the agentic step and `max-ai-credits: 400` per run.

No credentials are embedded in the workflow, and image-generation credentials are not required to prepare an editorial packet.

## Validation

Deterministic checks run before any pull request is created:

```bash
node scripts/weekly-csa-blog.js validate --packet-dir=editorial/weekly/YYYY-MM-DD
npm run test:unit
```

The validator checks the packet path, the allowed file list, parseable TOML frontmatter with `draft = true`, title and description limits, required evidence fields, claim-to-source mapping and minimum source coverage.

Do not dispatch `hugo.yml` to validate a packet: its manual dispatch path can deploy the site. Use a local, non-deploying build instead:

```bash
hugo -e production --gc --minify --destination /tmp/hugo-check
```

A production build without `-D` or `-F` confirms that `editorial/` never reaches `public/`: the directory is outside `content/` and `static/`, it is not mounted in `hugo.toml`, and `layouts/_default/search.json` indexes only the `posts` section.

## Review and promotion

Pull requests created with the default `GITHUB_TOKEN` do not trigger the normal `pull_request` CI workflows, so a packet pull request arrives without `hugo.yml` or `dependency-checks.yml` results. That is safe for review because the packet cannot affect the site build. To validate anyway:

1. Check out the branch locally.
2. Run `npm run test:unit` and `node scripts/weekly-csa-blog.js validate --packet-dir=editorial/weekly/YYYY-MM-DD`.
3. Optionally run the local production Hugo build above.
4. Alternatively, push the branch under a maintainer account, which triggers the standard PR checks.

Promotion to a published post stays a human-approved, separate step:

1. Verify every claim and source in `sources.json`.
2. Create `content/posts/YYYY-MM-DD-slug/index.md` from `blog-draft.md`, keeping the repository post conventions.
3. Generate `cover.jpg` for that post. The repository requires `index.md` **and** `cover.jpg` together, and the editorial workflow does not weaken that rule.
4. Set `draft = false` only when the post is ready to publish.

Editorial drafts and draft pull requests in this public repository are publicly readable. `draft = true` prevents publication on the website, not public access.

## Recompiling

```bash
gh extension install github/gh-aw --pin v0.89.10
gh aw compile .github/workflows/weekly-csa-blog.md
```

The scheduled `agentic-compile.yml` workflow recompiles all agentic workflows with the same pinned version and commits the lock files.
