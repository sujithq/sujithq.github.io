// scripts/sync-updates-from-jsonl.js
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const SRC = 'data/items.jsonl';
const OUT_ITEMS_DIR = 'content/updates2/items';
const OUT_ROOT = 'content/updates2';
const OUT_TIMEFRAMES_DIR = 'content/updates2/timeframes';
const MAX_FILENAME_SLUG_LENGTH = 90;

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

const lines = fs.readFileSync(SRC, 'utf8').trim().split('\n');
ensureDir(OUT_ITEMS_DIR);
ensureDir(OUT_TIMEFRAMES_DIR);

const cats = new Set();
const times = new Set();
const combos = new Set();

for (const line of lines) {
  if (!line.trim()) continue;
  const it = JSON.parse(line);

  const category  = (it.category || 'uncategorized').trim();
  const timeframe = it.timeframeKey || 'unknown';
  const title     = (it.title || it.id || '').trim();

  // prepend category (skip if it's the fallback)
  const displayTitle = category !== 'uncategorized'
  ? `${category}: ${title}`
  : title;

  const slug = slugify(title) || slugify(it.id);
  const filenameSlug = toFilenameSlug(slug);

  // Create date prefix for filename (YYYY-MM-DD format)
  const publishedDate = new Date(it.published);
  const datePrefix = publishedDate.toISOString().split('T')[0]; // Gets YYYY-MM-DD
  const filename = `${datePrefix}-${filenameSlug}`;

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
  const stub = `---
title: ${JSON.stringify(cat)}
type: "updates2-filter"
list_by: "category"
update_category: "${cat}"
---
`;
  fs.writeFileSync(path.join(dir, `_index.md`), stub);
}

// Timeframe-only index stubs: /updates2/timeframes/<timeframe>/
for (const tf of times) {
  const dir = path.join(OUT_TIMEFRAMES_DIR, slugify(tf));
  ensureDir(dir);
  const stub = `---
title: ${JSON.stringify(tf)}
type: "updates2-filter"
list_by: "timeframe"
timeframe: "${tf}"
---
`;
  fs.writeFileSync(path.join(dir, `_index.md`), stub);
}

// Category + timeframe combined: /updates2/<category>/<timeframe>/
for (const combo of combos) {
  const [cat, tf] = combo.split(':::');
  const dir = path.join(OUT_ROOT, slugify(cat), slugify(tf));
  ensureDir(dir);
  const stub = `---
title: ${JSON.stringify(`${cat} — ${tf}`)}
type: "updates2-filter"
list_by: "category_timeframe"
update_category: "${cat}"
timeframe: "${tf}"
---
`;
  fs.writeFileSync(path.join(dir, `_index.md`), stub);
}

console.log(`Wrote ${lines.length} item pages, ${cats.size} categories, ${times.size} timeframes, ${combos.size} combos.`);
