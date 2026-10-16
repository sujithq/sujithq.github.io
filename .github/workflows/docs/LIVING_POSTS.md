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

1. Add `living = true` under `[params]` in the post front matter.
2. Add a `## Last verified` section with a table between
   `<!-- living-post:verified:start -->` and
   `<!-- living-post:verified:end -->`. Each tracked surface needs a row that
   starts with `| <surface label> | <version> |`.
3. Add a `## Change log` section with dated bullets.
4. Add a "Report an outdated step" link to the `outdated-post.yml` issue form
   with the post slug in the title.
5. Add the post to `feed-config/living-posts.json`.
6. Run `node scripts/living-post-refresh.js plan`, check that it only reports
   items the post does not cover yet, and record a baseline with
   `node scripts/living-post-refresh.js record --plan=<file> --post=<id>`.
7. Run `node scripts/living-post-refresh.js validate --post=<id>` and
   `npm run test:unit`.

## Limits

- The workflow only sees documented changes. A UI change that no release note
  mentions still needs a reader report through the issue form.
- The "Last verified" table records which release notes and documentation were
  reviewed. It does not claim that the steps were tested by hand.
- Tool versions only appear after the crawler has collected the matching
  feeds, so the first run after adding a surface reviews its latest release.

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
