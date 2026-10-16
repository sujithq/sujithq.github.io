'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const yaml = require('js-yaml');

const helper = require('../../scripts/living-post-refresh.js');

const ROOT = path.join(__dirname, '..', '..');
const POST_PATH = 'content/posts/2026-10-16-hydrafusion-github-copilot-orchestration/index.md';
const PAGE = 'https://docs.example.test/hydrafusion';

const surfaces = [
  { id: 'vscode', label: 'VS Code', category: 'vscode', version_pattern: '^Visual Studio Code (\\d+\\.\\d+)$', release_notes_url: 'https://code.visualstudio.com/updates/v{version_underscore}' },
  { id: 'vscode-insiders', label: 'VS Code Insiders', category: 'vscode', version_pattern: '^Visual Studio Code (\\d+\\.\\d+) \\(Insiders\\)$', release_notes_url: 'https://code.visualstudio.com/updates/v{version_underscore}' },
  { id: 'copilot-cli', label: 'Copilot CLI', category: 'copilot-cli', version_pattern: '^v?(\\d+\\.\\d+\\.\\d+)$', release_notes_url: 'https://github.com/github/copilot-cli/releases/tag/v{version}' },
];

function workspace({ state = { posts: {} }, items = [] } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'living-post-'));
  const config = {
    posts: [
      {
        id: 'hydrafusion',
        path: POST_PATH,
        lookback_days: 30,
        keywords: ['HydraFusion'],
        categories: ['github', 'vscode', 'copilot-cli'],
        watch_pages: [PAGE],
        surfaces,
      },
    ],
  };
  const files = {
    config: path.join(dir, 'living-posts.json'),
    state: path.join(dir, 'state.json'),
    items: path.join(dir, 'items.jsonl'),
  };
  fs.writeFileSync(files.config, JSON.stringify(config));
  fs.writeFileSync(files.state, JSON.stringify(state));
  fs.writeFileSync(files.items, items.map((item) => JSON.stringify(item)).join('\n'));
  return files;
}

const items = [
  { id: 'hf-1', title: 'HydraFusion updates', category: 'github', published: '2026-10-14T20:00:00+00:00', llm: { Summary: 'New Max option.' } },
  { id: 'other', title: 'Unrelated change', category: 'github', published: '2026-10-14T20:00:00+00:00', llm: { Summary: 'Nothing relevant.' } },
  { id: 'old', title: 'HydraFusion preview', category: 'github', published: '2026-08-01T00:00:00+00:00', llm: {} },
  { id: 'vs-1', title: 'Visual Studio Code 1.141', category: 'vscode', published: '2026-10-07T17:00:00+00:00', llm: {} },
  { id: 'vs-2', title: 'Visual Studio Code 1.142', category: 'vscode', published: '2026-10-14T17:00:00+00:00', llm: {} },
  { id: 'vs-i', title: 'Visual Studio Code 1.143 (Insiders)', category: 'vscode', published: '2026-10-21T17:00:00+00:00', llm: {} },
  { id: 'cli-1', title: '1.0.98', category: 'copilot-cli', published: '2026-10-13T00:00:00+00:00', llm: {} },
];

const NOW = '2026-10-16T06:00:00Z';

test('plan detects new keyword items, new tool versions and changed pages', async () => {
  const files = workspace({ items });
  const result = await helper.plan({ ...files, now: NOW }, async () => 'hash-a');
  const post = result.posts[0];

  assert.equal(post.decision, 'refresh');
  assert.deepEqual(post.new_items.map((item) => item.id), ['hf-1']);
  assert.deepEqual(
    Object.fromEntries(post.changed_versions.map((change) => [change.surface, change.version])),
    { vscode: '1.142', 'vscode-insiders': '1.143', 'copilot-cli': '1.0.98' }
  );
  assert.deepEqual(post.changed_pages.map((page) => page.url), [PAGE]);
  assert.deepEqual(post.proposed_state.verified_versions, { vscode: '1.142', 'vscode-insiders': '1.143', 'copilot-cli': '1.0.98' });
  assert.equal(post.changed_versions.find((change) => change.surface === 'vscode').release_notes, 'https://code.visualstudio.com/updates/v1_142');
});

test('plan is up to date when everything was already reviewed', async () => {
  const state = {
    posts: {
      hydrafusion: {
        handled_item_ids: ['hf-1'],
        page_hashes: { [PAGE]: 'hash-a' },
        verified_versions: { vscode: '1.142', 'vscode-insiders': '1.143', 'copilot-cli': '1.0.98' },
      },
    },
  };
  const files = workspace({ items, state });
  const result = await helper.plan({ ...files, now: NOW }, async () => 'hash-a');
  assert.equal(result.posts[0].decision, 'up-to-date');
});

test('plan skips a post with an open refresh pull request and reports fetch failures', async () => {
  const files = workspace({ items });
  const prs = path.join(path.dirname(files.config), 'prs.json');
  fs.writeFileSync(prs, JSON.stringify([{ number: 7, title: 'living-post: hydrafusion refresh 2026-10-13', headRefName: 'living-post/hydrafusion' }]));
  const result = await helper.plan({ ...files, now: NOW, 'existing-prs': prs }, async () => {
    throw new Error('HTTP 503');
  });
  const post = result.posts[0];
  assert.equal(post.decision, 'skip-open-pr');
  assert.deepEqual(post.page_errors, [{ url: PAGE, error: 'HTTP 503' }]);
  assert.deepEqual(post.changed_pages, []);
});

test('reader reports that name the post slug trigger a refresh once', async () => {
  const state = {
    posts: {
      hydrafusion: {
        handled_item_ids: ['hf-1'],
        handled_issue_numbers: [3],
        page_hashes: { [PAGE]: 'hash-a' },
        verified_versions: { vscode: '1.142', 'vscode-insiders': '1.143', 'copilot-cli': '1.0.98' },
      },
    },
  };
  const files = workspace({ items, state });
  const issues = path.join(path.dirname(files.config), 'issues.json');
  fs.writeFileSync(issues, JSON.stringify([
    { number: 3, title: '[outdated] hydrafusion-github-copilot-orchestration', body: '', url: 'u3' },
    { number: 4, title: '[outdated] something', body: 'https://quintelier.dev/posts/2026/10/hydrafusion-github-copilot-orchestration/', url: 'u4' },
    { number: 5, title: '[outdated] another-post', body: '', url: 'u5' },
  ]));
  const post = (await helper.plan({ ...files, now: NOW, issues }, async () => 'hash-a')).posts[0];
  assert.equal(post.decision, 'refresh');
  assert.deepEqual(post.reader_reports.map((issue) => issue.number), [4]);
  assert.deepEqual(post.proposed_state.handled_issue_numbers, [3, 4]);
});

test('record writes the proposed state for one post', async () => {
  const files = workspace({ items });
  const planned = await helper.plan({ ...files, now: NOW }, async () => 'hash-a');
  const planFile = path.join(path.dirname(files.config), 'plan.json');
  fs.writeFileSync(planFile, JSON.stringify(planned));

  helper.record({ plan: planFile, post: 'hydrafusion', state: files.state });
  const state = JSON.parse(fs.readFileSync(files.state, 'utf8'));
  assert.equal(state.posts.hydrafusion.page_hashes[PAGE], 'hash-a');
  assert.deepEqual(state.posts.hydrafusion.handled_item_ids, ['hf-1']);
});

test('page fingerprints ignore markup and scripts outside the main content', () => {
  const a = helper.pageFingerprint('<html><script>1</script><main><h1>Using HydraFusion</h1></main></html>');
  const b = helper.pageFingerprint('<html><script>2</script><main>\n<h1 class="x">Using HydraFusion</h1></main></html>');
  const c = helper.pageFingerprint('<main><h1>Using HydraFusion Max</h1></main>');
  assert.equal(a, b);
  assert.notEqual(a, c);
});

test('the committed HydraFusion post passes validation', () => {
  const cwd = process.cwd();
  process.chdir(ROOT);
  try {
    const result = helper.validate({ post: 'hydrafusion' });
    assert.deepEqual(result.errors, []);
  } finally {
    process.chdir(cwd);
  }
});

test('validation requires a verified row for every recorded version', () => {
  const cwd = process.cwd();
  process.chdir(ROOT);
  try {
    const files = workspace({ state: { posts: { hydrafusion: { verified_versions: { vscode: '9.99' } } } } });
    fs.writeFileSync(files.config, fs.readFileSync(path.join(ROOT, 'feed-config', 'living-posts.json')));
    const result = helper.validate({ post: 'hydrafusion', config: files.config, state: files.state });
    assert.equal(result.valid, false);
    assert.match(result.errors.join('\n'), /\| VS Code \| 9\.99 \|/);
  } finally {
    process.chdir(cwd);
  }
});

test('the refresh workflow is scoped to one draft pull request with limited files', () => {
  const workflowPath = path.join(ROOT, '.github', 'workflows', 'living-post-refresh');
  const workflow = fs.readFileSync(`${workflowPath}.md`, 'utf8');
  const frontmatter = yaml.load(workflow.split('---')[1]);
  const pr = frontmatter['safe-outputs']['create-pull-request'];

  assert.equal(pr.draft, true);
  assert.equal(pr.max, 1);
  assert.deepEqual(pr['allowed-files'], ['content/posts/*/index.md', 'state/living-posts.json']);
  assert.ok(!frontmatter.tools.bash.includes('*'), 'do not grant unrestricted shell access');
  assert.equal(frontmatter.permissions, 'read-all');

  const compiled = fs.readFileSync(`${workflowPath}.lock.yml`, 'utf8');
  for (const host of ['code.visualstudio.com', 'docs.github.com', 'github.blog', 'devblogs.microsoft.com']) {
    assert.ok(compiled.includes(`"${host}"`), `firewall must allow ${host}`);
  }
});

test('release-note URLs come from per-surface templates', () => {
  const latest = { version: '1.142', link: 'https://example.test/feed-link' };
  assert.equal(
    helper.releaseNotesUrl({ release_notes_url: 'https://code.visualstudio.com/updates/v{version_underscore}' }, latest),
    'https://code.visualstudio.com/updates/v1_142'
  );
  assert.equal(
    helper.releaseNotesUrl({ release_notes_url: 'https://github.com/o/r/releases/tag/v{version}' }, latest),
    'https://github.com/o/r/releases/tag/v1.142'
  );
  assert.throws(() => helper.releaseNotesUrl({ id: 'x' }, latest), /needs a release_notes_url template/);
});

test('plan rejects a surface without a release-note template', async () => {
  const files = workspace({ items });
  const config = JSON.parse(fs.readFileSync(files.config, 'utf8'));
  delete config.posts[0].surfaces[2].release_notes_url;
  fs.writeFileSync(files.config, JSON.stringify(config));
  await assert.rejects(helper.plan({ ...files, now: NOW }, async () => 'hash-a'), /copilot-cli needs a release_notes_url template/);
});

test('the firewall allows every host the agent is told to fetch for every living post', () => {
  const compiled = fs.readFileSync(path.join(ROOT, '.github', 'workflows', 'living-post-refresh.lock.yml'), 'utf8');
  const allowed = JSON.parse(compiled.match(/"allowDomains":(\[[^\]]*\])/)[1]);
  const isAllowed = (host) => allowed.some((domain) => domain === host || (domain.startsWith('*.') && host.endsWith(domain.slice(1))));
  const config = JSON.parse(fs.readFileSync(path.join(ROOT, 'feed-config', 'living-posts.json'), 'utf8'));
  const feeds = JSON.parse(fs.readFileSync(path.join(ROOT, 'feed-config', 'feeds.json'), 'utf8'));
  const crawled = fs.readFileSync(path.join(ROOT, 'db', 'items.jsonl'), 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));

  const urls = config.posts.flatMap((post) => {
    const categories = new Set(post.categories);
    return [
      ...(post.watch_pages || []),
      ...post.surfaces.map((surface) => {
        assert.ok(surface.release_notes_url, `${post.id}/${surface.id} needs a release_notes_url template`);
        return surface.release_notes_url;
      }),
      // The agent opens the original announcement for every new crawler item in these categories.
      ...feeds.filter((feed) => categories.has(feed.Category)).map((feed) => feed.Url),
      ...crawled.filter((item) => categories.has(item.category) && item.link).map((item) => item.link),
    ];
  });
  const hosts = new Set(urls.map((url) => new URL(url.replace(/\{[^}]+\}/g, 'x')).hostname));
  for (const host of hosts) {
    assert.ok(isAllowed(host), `add ${host} to network.allowed in living-post-refresh.md and recompile`);
  }
});

test('every watched surface category is collected by the crawler', () => {
  const feeds = JSON.parse(fs.readFileSync(path.join(ROOT, 'feed-config', 'feeds.json'), 'utf8'));
  const config = JSON.parse(fs.readFileSync(path.join(ROOT, 'feed-config', 'living-posts.json'), 'utf8'));
  const categories = new Set(feeds.map((feed) => feed.Category));
  for (const post of config.posts) {
    for (const category of post.categories) assert.ok(categories.has(category), `no feed collects category ${category}`);
    for (const surface of post.surfaces) assert.ok(categories.has(surface.category), `no feed collects ${surface.id}`);
  }
});
