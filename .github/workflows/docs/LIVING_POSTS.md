# Living Post Refresh

An agentic workflow that keeps "living" blog posts accurate. It checks each
living post against official release notes and documentation, and proposes
updates as a **draft pull request** that a human reviews and merges.

The first living post is
[Using HydraFusion Across Copilot Surfaces](../../../content/posts/2026-10-16-hydrafusion-github-copilot-orchestration/index.md).

## Files

| File | Purpose |
|------|---------|
| [`../living-post-refresh.md`](../living-post-refresh.md) | Workflow definition (gh-aw Markdown with YAML frontmatter) |
| [`../living-post-refresh.lock.yml`](../living-post-refresh.lock.yml) | Generated GitHub Actions workflow, compiled with gh-aw `v0.89.10` |
| [`../../../feed-config/living-posts.json`](../../../feed-config/living-posts.json) | Living posts, keywords, crawler categories, watched pages and tracked tool versions |
| [`../../../state/living-posts.json`](../../../state/living-posts.json) | Reviewed items, page fingerprints, reviewed versions and handled reader reports |
| [`../../../scripts/living-post-refresh.js`](../../../scripts/living-post-refresh.js) | Deterministic `plan`, `record` and `validate` helper |
| [`../../../tests/unit/living-post-refresh.test.js`](../../../tests/unit/living-post-refresh.test.js) | Offline tests for the helper and workflow scope |
| [`../../ISSUE_TEMPLATE/outdated-post.yml`](../../ISSUE_TEMPLATE/outdated-post.yml) | "Report an outdated step" issue form for readers |

## How it works

1. The crawler collects release notes into `db/items.jsonl` from the feeds in
   `feed-config/feeds.json`:
   - GitHub Changelog (`github`), which also covers the Copilot app.
   - VS Code updates and blog (`vscode`), which include stable and Insiders
     release notes.
   - Copilot CLI GitHub releases (`copilot-cli`). Pre-releases are skipped
     with `ExcludeTitlePattern`.
   - Visual Studio Blog (`visualstudio`).
2. `scripts/living-post-refresh.js plan` runs before the agent, without
   inference. For each living post it reports:
   - new crawler items that mention the post's keywords;
   - watched documentation pages whose main content changed;
   - new versions of tracked tools, read from release-note titles;
   - open issues labelled `outdated-post` that name the post slug.
3. When nothing changed, the decision is `up-to-date` and the agent stops
   without creating anything. When a refresh pull request is already open, the
   decision is `skip-open-pr`.
4. Otherwise the agent reads the full release notes and documentation, updates
   the post, the "Last verified" table and the `## Change log`, records the
   state with `record`, runs `validate` and opens one draft pull request.

The state file only changes when the pull request is merged. If you close a
refresh pull request without merging, the next run detects the same changes
again.

## Activation

The workflow ships disabled. Enable it with a repository variable:

```bash
gh variable set LIVING_POST_REFRESH_ENABLED --body true
```

It runs on Tuesday and Friday at 06:23 Europe/Brussels, and on manual dispatch
from **Actions → Living Post Refresh → Run workflow**.

## Making a post living

The `living-post-onboarding` custom agent in `.github/agents/` does these steps
for you and opens a draft pull request. Select it in Copilot Chat or assign it
to a Copilot coding agent task, and name the post:

```text
Make this post living: content/posts/<folder>/index.md
```

A GitHub URL to the file also works. To do it by hand:

1. Add `living = true` under `[params]` in the post front matter.
2. Add a `## Last verified` section with a table between
   `<!-- living-post:verified:start -->` and
   `<!-- living-post:verified:end -->`. Each tracked surface needs a row that
   starts with `| <surface label> | <version> |`.
3. Add a `## Change log` section with dated bullets.
4. Add a "Report an outdated step" link to the `outdated-post.yml` issue form
   with the post slug in the title.
5. Add the post to `feed-config/living-posts.json` (see the reference below).
6. Run `node scripts/living-post-refresh.js plan`, check that it only reports
   items the post does not cover yet, and record a baseline with
   `node scripts/living-post-refresh.js record --plan=<file> --post=<id>`.
7. Run `node scripts/living-post-refresh.js validate --post=<id>` and
   `npm run test:unit`.

## Configuration reference

Nothing in the script or workflow is specific to HydraFusion: every topic is a
`posts` entry in `feed-config/living-posts.json`.

| Field | Purpose |
|-------|---------|
| `id` | Short identifier, used for the branch `living-post/<id>` and in the state file |
| `path` | The post's `index.md` |
| `keywords` | Case-insensitive terms matched against crawler item titles and summaries |
| `categories` | Crawler categories from `feeds.json` to search for keyword matches |
| `lookback_days` | How far back crawler items are considered (default 30) |
| `watch_pages` | Documentation pages whose main content is fingerprinted |
| `surfaces` | Optional tools whose new versions trigger a review |

Each surface has:

| Field | Purpose |
|-------|---------|
| `id` | Key in the state file |
| `label` | Must match the first column of the post's "Last verified" row |
| `category` | Crawler category whose item titles announce versions |
| `version_pattern` | Regex with one capture group for the version, matched against item titles |
| `release_notes_url` | Required template with `{version}` or `{version_underscore}`. Its host must be in the workflow's `network.allowed` list |

Example for an Azure topic that tracks Azure Updates and Microsoft Learn:

```json
{
  "id": "azure-container-apps",
  "path": "content/posts/YYYY-MM-DD-azure-container-apps-guide/index.md",
  "keywords": ["Container Apps"],
  "categories": ["azure", "github"],
  "watch_pages": ["https://learn.microsoft.com/en-us/azure/container-apps/overview"],
  "surfaces": []
}
```

### Adding a topic with new sources

1. If the topic needs release notes the crawler does not collect yet, add the
   feed to `feed-config/feeds.json` with a new `Category`. Use
   `ExcludeTitlePattern` for noisy feeds such as nightly or pre-release tags.
2. If its watched pages or release notes live on a host the workflow cannot
   reach, add the host to `network.allowed` in `living-post-refresh.md` and
   recompile with `gh aw compile living-post-refresh` (pinned `v0.89.10`).
   A unit test fails until every configured host is allowed.
3. Follow [Making a post living](#making-a-post-living).

## Limits

- The workflow refreshes one post per run and opens at most one pull request.
  With several living posts that change at the same time, the others are
  picked up by the next scheduled runs.
- The workflow only sees documented changes. A UI change that no release note
  mentions still needs a reader report through the issue form.
- Release notes and docs often lag behind the product. A report filed by the
  repository owner that states the exact labels or menu path and the version
  counts as first-hand evidence, so the agent updates the step even when no
  official source mentions the change yet. Reports from anyone else are leads:
  the agent changes a step only when an official source confirms them. To add
  detail to an existing report, comment on the issue; the agent reads the
  comments.
- The "Last verified" table records which release notes and documentation were
  reviewed. It does not claim that the steps were tested by hand.
- Tool versions only appear after the crawler has collected the matching
  feeds, so the first run after adding a surface reviews its latest release.
- The agent shell runs without interactive approval. Any command outside the
  `bash` list in the workflow front matter is denied, including commands
  chained with an allowed one such as `cd dir; curl url`. If a run reports
  denied `curl` calls or a missing tool, check which command was chained and
  either add it to the list or tighten the prompt, then recompile.

## Later: Markdown release notes and remaining sources

These sources are not used yet and are planned as follow-up work:

- **VS Code Markdown release notes.** The public `microsoft/vscode-docs`
  repository has one Markdown file per release in `release-notes/`, for
  example `release-notes/v1_142.md`, and Insiders notes are updated there
  during the month. Reading these files directly would let the plan step diff
  release notes section by section instead of relying on the feed entry and the
  agent's review. They are public: use
  `https://raw.githubusercontent.com/microsoft/vscode-docs/main/release-notes/v1_142.md`
  or the API without a token. A personal `gh` token that belongs to a member of
  the `microsoft` organisation must be authorised for SAML SSO first.
- **Copilot app.** It has no separate release-notes feed yet. It is covered
  through the GitHub Changelog keyword match.
- **Visual Studio release notes.** The official release notes on Microsoft
  Learn are HTML pages without a feed. The Visual Studio Blog feed is used
  instead.
