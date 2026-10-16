'use strict';

// Deterministic helpers for the living-post refresh agentic workflow.
//
// Commands:
//   plan      Detect new release notes, changed documentation pages, new tool
//             versions and reader reports for every configured living post.
//   record    Write the state proposed by a plan for one post to the state file.
//   validate  Check a refreshed post and its state before a pull request is created.
//
// Change detection runs here, without inference, so the agent only starts work
// when an official source actually changed.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const TOML = require('@iarna/toml');

const DEFAULT_CONFIG = 'feed-config/living-posts.json';
const DEFAULT_STATE = 'state/living-posts.json';
const DEFAULT_ITEMS = 'db/items.jsonl';
const VERIFIED_START = '<!-- living-post:verified:start -->';
const VERIFIED_END = '<!-- living-post:verified:end -->';
const CHANGELOG_HEADING = '## Change log';
const OFFSET_DATE = /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}(Z|[+-]\d{2}:\d{2})$/;
const DAY_MS = 24 * 60 * 60 * 1000;

class UsageError extends Error {}

function readJson(file, fallback) {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function readItems(file) {
  if (!fs.existsSync(file)) return [];
  return fs
    .readFileSync(file, 'utf8')
    .split(/\r?\n/)
    .filter((line) => line.trim())
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function itemText(item) {
  const llm = item.llm || {};
  return [item.title, llm.Summary, ...(llm.Bullets || []), ...(llm.Tags || [])]
    .filter(Boolean)
    .join('\n')
    .toLowerCase();
}

function matchesKeywords(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword.toLowerCase()));
}

function compareVersions(a, b) {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i += 1) {
    const diff = (pa[i] || 0) - (pb[i] || 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

// Latest version announced for a surface, taken from crawler item titles.
function latestVersion(items, surface) {
  const pattern = new RegExp(surface.version_pattern, 'i');
  let best = null;
  for (const item of items) {
    if (item.category !== surface.category) continue;
    const match = pattern.exec((item.title || '').trim());
    if (!match) continue;
    if (!best || compareVersions(match[1], best.version) > 0) {
      best = { version: match[1], title: item.title, link: item.link, published: item.published };
    }
  }
  return best;
}

// {version} is the raw version and {version_underscore} replaces dots, as in VS Code's v1_142 URLs.
// The template is required so every URL the agent fetches is known in advance and covered by the firewall.
function releaseNotesUrl(surface, latest) {
  if (!surface.release_notes_url) throw new UsageError(`Surface ${surface.id} needs a release_notes_url template`);
  return surface.release_notes_url
    .replaceAll('{version_underscore}', latest.version.replaceAll('.', '_'))
    .replaceAll('{version}', latest.version);
}

// Normalised text of the main content, so markup or script changes do not count as edits.
function pageFingerprint(html) {
  const main = html.match(/<main[\s\S]*?<\/main>/i);
  const text = (main ? main[0] : html)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return crypto.createHash('sha256').update(text).digest('hex');
}

async function fetchFingerprint(url) {
  const response = await fetch(url, { headers: { 'user-agent': 'living-post-refresh/1.0' } });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return pageFingerprint(await response.text());
}

function postSlug(postPath) {
  return path.basename(path.dirname(postPath)).replace(/^\d{4}-\d{2}-\d{2}-/, '');
}

function planPost(post, context) {
  const { items, state, now, pageHashes, pageErrors, openPrs, issues } = context;
  const previous = state.posts?.[post.id] || {};
  const handledItems = new Set(previous.handled_item_ids || []);
  const handledIssues = new Set(previous.handled_issue_numbers || []);
  const cutoff = now.getTime() - (post.lookback_days || 30) * DAY_MS;
  const categories = new Set(post.categories || []);

  const newItems = items
    .filter((item) => categories.has(item.category))
    .filter((item) => Date.parse(item.published) >= cutoff)
    .filter((item) => !handledItems.has(item.id))
    .filter((item) => matchesKeywords(itemText(item), post.keywords))
    .map((item) => ({
      id: item.id,
      title: item.title,
      link: item.link,
      category: item.category,
      published: item.published,
    }));

  const changedPages = [];
  const nextHashes = { ...(previous.page_hashes || {}) };
  for (const url of post.watch_pages || []) {
    const hash = pageHashes[url];
    if (!hash) continue;
    if (previous.page_hashes?.[url] !== hash) changedPages.push({ url, previous: previous.page_hashes?.[url] || null, current: hash });
    nextHashes[url] = hash;
  }

  const changedVersions = [];
  const nextVersions = { ...(previous.verified_versions || {}) };
  for (const surface of post.surfaces || []) {
    const latest = latestVersion(items, surface);
    if (!latest) continue;
    const reviewed = previous.verified_versions?.[surface.id];
    if (!reviewed || compareVersions(latest.version, reviewed) > 0) {
      changedVersions.push({
        surface: surface.id,
        label: surface.label,
        previous: reviewed || null,
        ...latest,
        release_notes: releaseNotesUrl(surface, latest),
      });
      nextVersions[surface.id] = latest.version;
    }
  }

  const slug = postSlug(post.path);
  const readerReports = issues
    .filter((issue) => !handledIssues.has(issue.number))
    .filter((issue) => `${issue.title}\n${issue.body || ''}`.toLowerCase().includes(slug))
    .map((issue) => ({ number: issue.number, title: issue.title, url: issue.url }));

  const branch = `living-post/${post.id}`;
  const escapedId = post.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // gh-aw appends a hex suffix to safe-output branch names, for example living-post/hydrafusion-cf959529f560152d.
  const branchPattern = new RegExp(`^living-post/${escapedId}(-[0-9a-f]{8,})?$`);
  const titlePattern = new RegExp(`living-post: ${escapedId}(\\s|$)`);
  const openPullRequests = openPrs.filter((pr) => branchPattern.test(pr.headRefName || '') || titlePattern.test(pr.title || ''));

  let decision = 'up-to-date';
  if (openPullRequests.length > 0) decision = 'skip-open-pr';
  else if (newItems.length || changedPages.length || changedVersions.length || readerReports.length) decision = 'refresh';

  return {
    id: post.id,
    path: post.path,
    branch,
    decision,
    new_items: newItems,
    changed_pages: changedPages,
    page_errors: pageErrors.filter((error) => (post.watch_pages || []).includes(error.url)),
    changed_versions: changedVersions,
    reader_reports: readerReports,
    open_pull_requests: openPullRequests,
    surfaces: post.surfaces || [],
    proposed_state: {
      handled_item_ids: [...new Set([...handledItems, ...newItems.map((item) => item.id)])].sort(),
      handled_issue_numbers: [...new Set([...handledIssues, ...readerReports.map((issue) => issue.number)])].sort((a, b) => a - b),
      page_hashes: nextHashes,
      verified_versions: nextVersions,
      last_checked: now.toISOString().slice(0, 10),
    },
  };
}

async function plan(options, fetcher = fetchFingerprint) {
  const config = readJson(options.config || DEFAULT_CONFIG, { posts: [] });
  for (const post of config.posts) {
    for (const surface of post.surfaces || []) {
      if (!surface.release_notes_url) throw new UsageError(`Post ${post.id}: surface ${surface.id} needs a release_notes_url template`);
    }
  }
  const state = readJson(options.state || DEFAULT_STATE, { posts: {} });
  const items = readItems(options.items || DEFAULT_ITEMS);
  const now = options.now ? new Date(options.now) : new Date();
  if (Number.isNaN(now.getTime())) throw new UsageError(`Invalid --now value: ${options.now}`);
  const openPrs = options['existing-prs'] ? readJson(options['existing-prs'], []) : [];
  const issues = options.issues ? readJson(options.issues, []) : [];

  const pageHashes = {};
  const pageErrors = [];
  if (!options.offline) {
    const urls = [...new Set(config.posts.flatMap((post) => post.watch_pages || []))];
    for (const url of urls) {
      try {
        pageHashes[url] = await fetcher(url);
      } catch (error) {
        pageErrors.push({ url, error: error.message });
      }
    }
  }

  return {
    generated_at: now.toISOString(),
    posts: config.posts.map((post) => planPost(post, { items, state, now, pageHashes, pageErrors, openPrs, issues })),
  };
}

function record(options) {
  if (!options.plan || !options.post) throw new UsageError('record requires --plan=<file> and --post=<id>');
  const planned = readJson(options.plan, null);
  const post = planned?.posts?.find((entry) => entry.id === options.post);
  if (!post) throw new UsageError(`Post ${options.post} is not in the plan`);
  const stateFile = options.state || DEFAULT_STATE;
  const state = readJson(stateFile, { posts: {} });
  state.posts = { ...(state.posts || {}), [post.id]: post.proposed_state };
  fs.mkdirSync(path.dirname(stateFile), { recursive: true });
  fs.writeFileSync(stateFile, `${JSON.stringify(state, null, 2)}\n`);
  return state.posts[post.id];
}

function parseFrontMatter(markdown) {
  const match = markdown.match(/^\+\+\+\r?\n([\s\S]*?)\r?\n\+\+\+/);
  if (!match) throw new Error('missing TOML front matter');
  return TOML.parse(match[1]);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function validate(options) {
  const config = readJson(options.config || DEFAULT_CONFIG, { posts: [] });
  const state = readJson(options.state || DEFAULT_STATE, { posts: {} });
  const post = config.posts.find((entry) => entry.id === options.post);
  if (!post) throw new UsageError(`Unknown living post: ${options.post}`);

  const errors = [];
  const markdown = fs.readFileSync(post.path, 'utf8');
  let frontMatter = {};
  try {
    frontMatter = parseFrontMatter(markdown);
  } catch (error) {
    errors.push(`front matter: ${error.message}`);
  }

  for (const field of ['date', 'lastmod']) {
    const value = frontMatter[field];
    if (typeof value !== 'string' || !OFFSET_DATE.test(value)) {
      errors.push(`${field} must be a quoted 'YYYY-MM-DD HH:MM:SS+HH:MM' string with an explicit offset`);
    }
  }
  if (frontMatter.draft !== false) errors.push('a living post must stay published (draft = false)');
  if (frontMatter.params?.living !== true) errors.push('set living = true under [params]');

  const start = markdown.indexOf(VERIFIED_START);
  const end = markdown.indexOf(VERIFIED_END);
  if (start < 0 || end < start) {
    errors.push(`missing ${VERIFIED_START} ... ${VERIFIED_END} block`);
  } else {
    const block = markdown.slice(start, end);
    const versions = state.posts?.[post.id]?.verified_versions || {};
    for (const surface of post.surfaces || []) {
      const version = versions[surface.id];
      if (!version) continue;
      const row = new RegExp(`^\\|\\s*${escapeRegExp(surface.label)}\\s*\\|\\s*${escapeRegExp(version)}\\s*\\|`, 'm');
      if (!row.test(block)) errors.push(`verified table needs a "| ${surface.label} | ${version} |" row`);
    }
  }

  if (!markdown.includes(`\n${CHANGELOG_HEADING}\n`) && !markdown.includes(`\n${CHANGELOG_HEADING}\r\n`)) {
    errors.push(`missing "${CHANGELOG_HEADING}" section`);
  }
  if (/\u2014/.test(markdown.split(/\+\+\+/).slice(2).join('+++'))) errors.push('replace long dashes with colons or periods');

  return { post: post.id, path: post.path, valid: errors.length === 0, errors };
}

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const options = {};
  for (const arg of rest) {
    const match = arg.match(/^--([^=]+)(?:=(.*))?$/);
    if (!match) throw new UsageError(`Unexpected argument: ${arg}`);
    options[match[1]] = match[2] === undefined ? true : match[2];
  }
  return { command, options };
}

async function main(argv) {
  const { command, options } = parseArgs(argv);
  if (command === 'plan') {
    process.stdout.write(`${JSON.stringify(await plan(options), null, 2)}\n`);
    return 0;
  }
  if (command === 'record') {
    process.stdout.write(`${JSON.stringify(record(options), null, 2)}\n`);
    return 0;
  }
  if (command === 'validate') {
    const result = validate(options);
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    return result.valid ? 0 : 1;
  }
  throw new UsageError('Usage: living-post-refresh.js <plan|record|validate> [--options]');
}

if (require.main === module) {
  main(process.argv.slice(2))
    .then((code) => {
      process.exitCode = code;
    })
    .catch((error) => {
      console.error(error.message);
      process.exitCode = error instanceof UsageError ? 2 : 1;
    });
}

module.exports = { plan, planPost, record, validate, latestVersion, compareVersions, pageFingerprint, matchesKeywords, itemText, releaseNotesUrl };
