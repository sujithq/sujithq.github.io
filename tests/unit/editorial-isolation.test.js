'use strict';

// Guards the publication boundary: weekly editorial packets are review material
// and must never be reachable from the generated Hugo site.

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const REPO_ROOT = path.join(__dirname, '..', '..');

function read(relativePath) {
  return fs.readFileSync(path.join(REPO_ROOT, relativePath), 'utf-8');
}

test('Hugo mounts do not expose the editorial directory', () => {
  const configs = ['hugo.toml', 'config/_default/config.toml', 'config/production/config.toml']
    .filter((file) => fs.existsSync(path.join(REPO_ROOT, file)))
    .map((file) => read(file));

  for (const config of configs) {
    assert.ok(!/editorial/i.test(config), 'Hugo configuration must not reference the editorial directory');
    assert.ok(!/^\s*contentDir\s*=/m.test(config) || !/editorial/i.test(config));
  }
});

test('editorial material is not staged under content or static', () => {
  for (const directory of ['content', 'static', 'layouts', 'assets']) {
    const absolute = path.join(REPO_ROOT, directory);
    if (!fs.existsSync(absolute)) continue;
    assert.equal(fs.existsSync(path.join(absolute, 'editorial')), false, `${directory}/editorial must not exist`);
  }
});

test('the weekly workflow may only write editorial packet files', () => {
  const workflow = read('.github/workflows/weekly-csa-blog.md');
  const allowed = /allowed-files:\n((?:\s+- "[^"]+"\n)+)/.exec(workflow);
  assert.ok(allowed, 'the workflow must restrict writes with allowed-files');

  const patterns = allowed[1]
    .split('\n')
    .map((line) => line.replace(/^\s+- "/, '').replace(/"$/, '').trim())
    .filter(Boolean);

  assert.ok(patterns.length > 0);
  for (const pattern of patterns) {
    assert.match(pattern, /^editorial\/weekly\/\*\/[a-z-]+\.(md|json)$/);
  }
});

test('the weekly workflow keeps repository permissions read-only and drafts its pull request', () => {
  const workflow = read('.github/workflows/weekly-csa-blog.md');
  assert.match(workflow, /^permissions: read-all$/m);
  assert.match(workflow, /^\s{4}draft: true$/m);
  assert.match(workflow, /^\s{4}fallback-as-issue: false$/m);
  assert.match(workflow, /WEEKLY_CSA_BLOG_ENABLED == 'true'/);

  const lock = read('.github/workflows/weekly-csa-blog.lock.yml');
  assert.match(lock, /if: vars\.WEEKLY_CSA_BLOG_ENABLED == 'true'/);
  assert.match(lock, /permissions: read-all/);
});
