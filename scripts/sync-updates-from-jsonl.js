// scripts/sync-updates-from-jsonl.js
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const SRC = 'db/items.jsonl';
const ARCHIVE = 'db/items.archive.jsonl';
const ARCHIVE_AFTER_MONTHS = 3;
const OUT_ITEMS_DIR = 'content/updates2/items';
const OUT_ROOT = 'content/updates2';
const OUT_TIMEFRAMES_DIR = 'content/updates2/timeframes';
const MAX_FILENAME_SLUG_LENGTH = 90;
const GENERATED_BY = 'scripts/sync-updates-from-jsonl.js';

function slugify(s) {
  return (s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function toFilenameSlug(slug) {
  if (!slug || slug.length <= MAX_FILENAME_SLUG_LENGTH) {
    return slug;
  }

  const hash = crypto.createHash('sha1').update(slug).digest('hex').slice(0, 8);
  const truncatedLength = MAX_FILENAME_SLUG_LENGTH - hash.length - 1;
  const truncated = slug.slice(0, Math.max(1, truncatedLength)).replace(/-+$/g, '');

  return `${truncated}-${hash}`;
}

function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); }

function tomlString(value) {
  return JSON.stringify(value ?? '');
}

function buildGeneratedFilterIndexFrontMatter(fields) {
  const lines = ['+++'];

  for (const [key, value] of Object.entries(fields)) {
    lines.push(`${key} = ${tomlString(value)}`);
  }

  lines.push(`generated_by = ${tomlString(GENERATED_BY)}`);
  lines.push('+++');

  return `${lines.join('\n')}\n`;
}

function buildItemFilename(item) {
  const title = (item.title || item.id || '').trim();
  const slug = slugify(title) || slugify(item.id);
  const filenameSlug = toFilenameSlug(slug);
  const publishedDate = new Date(item.published);
  const datePrefix = publishedDate.toISOString().split('T')[0];

  return `${datePrefix}-${filenameSlug}`;
}

function listIndexFiles(rootDir) {
  if (!fs.existsSync(rootDir)) {
    return [];
  }

  const files = [];
  const stack = [rootDir];

  while (stack.length > 0) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
        continue;
      }

      if (entry.isFile() && entry.name === '_index.md') {
        files.push(fullPath);
      }
    }
  }

  return files;
}

function pruneStaleFilterIndexes(expectedFilterIndexFiles) {
  const rootIndex = path.resolve(path.join(OUT_ROOT, '_index.md'));
  const allIndexFiles = listIndexFiles(OUT_ROOT);
  let deletedCount = 0;

  for (const file of allIndexFiles) {
    const resolved = path.resolve(file);
    if (resolved === rootIndex) {
      continue;
    }

    if (expectedFilterIndexFiles.has(resolved)) {
      continue;
    }

    const content = fs.readFileSync(file, 'utf8');
    const isLegacyGeneratedFilter = content.includes('type: "updates2-filter"');
    const isTomlGeneratedFilter = content.includes('type = "updates2-filter"')
      || content.includes("type = 'updates2-filter'");
    const hasGeneratedMarker = content.includes(`generated_by = ${JSON.stringify(GENERATED_BY)}`)
      || content.includes(`generated_by: ${JSON.stringify(GENERATED_BY)}`);

    if (!isLegacyGeneratedFilter && !isTomlGeneratedFilter && !hasGeneratedMarker) {
      continue;
    }

    fs.unlinkSync(file);
    deletedCount += 1;
  }

  return deletedCount;
}

function pruneEmptyDirs(dir, protectedDirs) {
  if (!fs.existsSync(dir)) {
    return 0;
  }

  let removedCount = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const child = path.join(dir, entry.name);
    removedCount += pruneEmptyDirs(child, protectedDirs);
  }

  const resolved = path.resolve(dir);
  if (protectedDirs.has(resolved)) {
    return removedCount;
  }

  if (fs.readdirSync(dir).length === 0) {
    fs.rmdirSync(dir);
    removedCount += 1;
  }

  return removedCount;
}

function readJsonl(file) {
  if (!fs.existsSync(file)) {
    return [];
  }

  const raw = fs.readFileSync(file, 'utf8').trim();
  if (!raw) {
    return [];
  }

  const items = [];
  for (const line of raw.split('\n')) {
    if (!line.trim()) continue;
    items.push(JSON.parse(line));
  }

  return items;
}

function writeJsonl(file, items) {
  const content = items.map(item => JSON.stringify(item)).join('\n');
  fs.writeFileSync(file, content ? `${content}\n` : '');
}

function getArchiveCutoffDate(months) {
  const cutoff = new Date();
  cutoff.setUTCMonth(cutoff.getUTCMonth() - months);
  return cutoff;
}

function isOlderThanCutoff(item, cutoff) {
  const published = new Date(item.published);
  if (Number.isNaN(published.getTime())) {
    return false;
  }

  return published < cutoff;
}

const sourceItems = readJsonl(SRC);
const archiveItems = readJsonl(ARCHIVE);
const archiveCutoff = getArchiveCutoffDate(ARCHIVE_AFTER_MONTHS);

const archiveKeys = new Set(archiveItems.map(item => item.id || item.contentHash));
const retainedItems = [];
const movedItems = [];

for (const item of sourceItems) {
  if (!isOlderThanCutoff(item, archiveCutoff)) {
    retainedItems.push(item);
    continue;
  }

  const key = item.id || item.contentHash;
  if (!archiveKeys.has(key)) {
    movedItems.push(item);
    archiveKeys.add(key);
  }
}

if (movedItems.length > 0) {
  writeJsonl(ARCHIVE, [...archiveItems, ...movedItems]);
}

if (movedItems.length > 0 || retainedItems.length !== sourceItems.length) {
  writeJsonl(SRC, retainedItems);
}

ensureDir(OUT_ITEMS_DIR);
ensureDir(OUT_TIMEFRAMES_DIR);

const expectedItemFiles = new Set(retainedItems.map(item => `${buildItemFilename(item)}.md`));
for (const existingFile of fs.readdirSync(OUT_ITEMS_DIR)) {
  if (!existingFile.endsWith('.md')) {
    continue;
  }

  if (expectedItemFiles.has(existingFile)) {
    continue;
  }

  fs.unlinkSync(path.join(OUT_ITEMS_DIR, existingFile));
}

const cats = new Set();
const times = new Set();
const combos = new Set();
const expectedFilterIndexFiles = new Set();

for (const it of retainedItems) {

  const category  = (it.category || 'uncategorized').trim();
  const timeframe = it.timeframeKey || 'unknown';
  const title     = (it.title || it.id || '').trim();

  // prepend category (skip if it's the fallback)
  const displayTitle = category !== 'uncategorized'
  ? `${category}: ${title}`
  : title;

  const slug = slugify(title) || slugify(it.id);
  const filename = buildItemFilename(it);

  cats.add(category);
  times.add(timeframe);
  combos.add(`${category}:::${timeframe}`);

  const tags = (it.llm?.Tags || []).map(t => `"${t.replace(/"/g, '\\"')}"`).join(', ');
  const bullets = (it.llm?.Bullets || []).map(t => `"${t.replace(/"/g, '\\"')}"`).join(', ');

  const fm = `---
title: ${JSON.stringify(displayTitle)}
date: ${new Date(it.published).toISOString()}
slug: ${slug}
update_categories: ["${category.replace(/"/g,'\\"')}"]
update_tags: [${tags}]
update_bullets: [${bullets}]
timeframes: ["${timeframe.replace(/"/g,'\\"')}"]
link: ${JSON.stringify(it.link)}
source: ${JSON.stringify(it.source)}
timeframeKey: ${JSON.stringify(timeframe)}
id: ${JSON.stringify(it.id)}
contentHash: ${JSON.stringify(it.contentHash)}
draft: false
type: "updates2"
llmSummary: ${JSON.stringify(it.llm?.Summary || '')}
---

${it.llm?.Summary || ''}

- **Source:** [${it.source}](${it.link})
`;

  fs.writeFileSync(path.join(OUT_ITEMS_DIR, `${filename}.md`), fm);
}

// Category-only index stubs: /updates2/<category>/
for (const cat of cats) {
  const dir = path.join(OUT_ROOT, slugify(cat));
  ensureDir(dir);
  const stub = buildGeneratedFilterIndexFrontMatter({
    title: cat,
    type: 'updates2-filter',
    list_by: 'category',
    update_category: cat,
  });
  const stubPath = path.join(dir, `_index.md`);
  fs.writeFileSync(stubPath, stub);
  expectedFilterIndexFiles.add(path.resolve(stubPath));
}

// Timeframe-only index stubs: /updates2/timeframes/<timeframe>/
for (const tf of times) {
  const dir = path.join(OUT_TIMEFRAMES_DIR, slugify(tf));
  ensureDir(dir);
  const stub = buildGeneratedFilterIndexFrontMatter({
    title: tf,
    type: 'updates2-filter',
    list_by: 'timeframe',
    timeframe: tf,
  });
  const stubPath = path.join(dir, `_index.md`);
  fs.writeFileSync(stubPath, stub);
  expectedFilterIndexFiles.add(path.resolve(stubPath));
}

// Category + timeframe combined: /updates2/<category>/<timeframe>/
for (const combo of combos) {
  const [cat, tf] = combo.split(':::');
  const dir = path.join(OUT_ROOT, slugify(cat), slugify(tf));
  ensureDir(dir);
  const stub = buildGeneratedFilterIndexFrontMatter({
    title: `${cat} — ${tf}`,
    type: 'updates2-filter',
    list_by: 'category_timeframe',
    update_category: cat,
    timeframe: tf,
  });
  const stubPath = path.join(dir, `_index.md`);
  fs.writeFileSync(stubPath, stub);
  expectedFilterIndexFiles.add(path.resolve(stubPath));
}

const prunedFilterIndexes = pruneStaleFilterIndexes(expectedFilterIndexFiles);
const prunedEmptyDirs = pruneEmptyDirs(
  OUT_ROOT,
  new Set([
    path.resolve(OUT_ROOT),
    path.resolve(OUT_ITEMS_DIR),
    path.resolve(OUT_TIMEFRAMES_DIR)
  ])
);

console.log(`Wrote ${retainedItems.length} item pages, archived ${movedItems.length} items (> ${ARCHIVE_AFTER_MONTHS} months), ${cats.size} categories, ${times.size} timeframes, ${combos.size} combos, pruned ${prunedFilterIndexes} stale filter indexes, removed ${prunedEmptyDirs} empty dirs.`);
