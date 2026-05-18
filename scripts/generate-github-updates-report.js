const fs = require('fs');
const path = require('path');

const ITEM_FILES = ['db/items.archive.jsonl', 'db/items.jsonl'];
const REPORT_FILE = 'reports/github-latest-updates.md';
const SOURCE = 'GitHub';

function readJsonl(file) {
  if (!fs.existsSync(file)) {
    return [];
  }

  const raw = fs.readFileSync(file, 'utf8').trim();
  if (!raw) {
    return [];
  }

  return raw
    .split('\n')
    .filter(line => line.trim())
    .map(line => JSON.parse(line));
}

function normaliseFeatureTitle(title) {
  return title
    .toLowerCase()
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/github copilot/g, 'copilot')
    .replace(/copilot coding agent/g, 'copilot cloud agent')
    .replace(/copilot cloud agent/g, 'copilot cloud agent')
    .replace(/upcoming deprecation of /g, '')
    .replace(/deprecation notice: /g, '')
    .replace(/ deprecated$/g, '')
    .replace(/ is now generally available/g, '')
    .replace(/ now generally available/g, '')
    .replace(/ is generally available/g, '')
    .replace(/ generally available/g, '')
    .replace(/ in public preview/g, '')
    .replace(/ public preview/g, '')
    .replace(/ in technical preview/g, '')
    .replace(/ technical preview/g, '')
    .replace(/ is now available/g, '')
    .replace(/ now available/g, '')
    .replace(/ available$/g, '')
    .replace(/\s+[-–—]\s+.*/g, '')
    .replace(/[^a-z0-9+#.]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function getLifecycleRank(item) {
  const title = item.title.toLowerCase();

  if (title.includes('deprecated') && !title.includes('upcoming')) {
    return 50;
  }

  if (title.includes('generally available') || title.includes('now available')) {
    return 40;
  }

  if (title.includes('public preview')) {
    return 30;
  }

  if (title.includes('technical preview')) {
    return 20;
  }

  if (title.includes('upcoming deprecation')) {
    return 10;
  }

  return 0;
}

function getLifecycleLabel(item) {
  const title = item.title.toLowerCase();

  if (title.includes('deprecated') && !title.includes('upcoming')) {
    return 'Deprecated';
  }

  if (title.includes('generally available')) {
    return 'Generally available';
  }

  if (title.includes('public preview')) {
    return 'Public preview';
  }

  if (title.includes('technical preview')) {
    return 'Technical preview';
  }

  if (title.includes('upcoming deprecation')) {
    return 'Upcoming deprecation';
  }

  return 'Update';
}

function escapeTableCell(value) {
  return String(value || '')
    .replace(/\r?\n/g, ' ')
    .replace(/\|/g, '\\|')
    .trim();
}

function markdownLink(title, link) {
  const safeTitle = escapeTableCell(title).replace(/\]/g, '\\]');
  return `[${safeTitle}](${link})`;
}

function pickLatestByFeature(items) {
  const latestByFeature = new Map();

  for (const item of items) {
    const featureKey = normaliseFeatureTitle(item.title) || item.id;
    const published = new Date(item.published);
    const rank = getLifecycleRank(item);
    const current = latestByFeature.get(featureKey);

    if (!current) {
      latestByFeature.set(featureKey, { item, rank, published });
      continue;
    }

    const currentTime = current.published.getTime();
    const nextTime = published.getTime();
    const shouldReplace = rank > current.rank || (rank === current.rank && nextTime > currentTime);

    if (shouldReplace) {
      latestByFeature.set(featureKey, { item, rank, published });
    }
  }

  return [...latestByFeature.values()]
    .map(entry => entry.item)
    .sort((left, right) => new Date(left.published) - new Date(right.published));
}

function renderReport(items) {
  const newestItem = items.at(-1);
  const reportDate = newestItem
    ? new Date(newestItem.published).toISOString().slice(0, 10)
    : new Date(0).toISOString().slice(0, 10);

  const rows = items.map(item => {
    const date = new Date(item.published).toISOString().slice(0, 10);
    const update = markdownLink(item.title, item.link);
    const status = getLifecycleLabel(item);
    const summary = item.llm?.Summary || '';

    return `| ${date} | ${update} | ${escapeTableCell(status)} | ${escapeTableCell(summary)} |`;
  });

  return `---
post_title: GitHub Latest Updates Timeline
author1: Sujith Quintelier
post_slug: github-latest-updates-timeline
microsoft_alias: suquinte
featured_image: ""
categories:
  - github
tags:
  - GitHub
  - Copilot
  - changelog
ai_note: AI assisted summary generated from local JSONL feed data.
summary: Deduplicated chronological list of GitHub-sourced feature updates.
post_date: ${reportDate}
generated_by: scripts/generate-github-updates-report.js
---

## GitHub Latest Updates Timeline

This report is stored outside the Hugo site content folders. It is based on
\`db/items.archive.jsonl\` and \`db/items.jsonl\`, filtered to items where
\`source\` is \`GitHub\`.

The list is chronological and deduplicated by feature lifecycle. When a feature
appeared in preview and later became generally available, only the latest state
is shown. When a deprecation notice was followed by completed deprecation, the
completed deprecation is shown.

| Date | Article | Status | Summary |
|---|---|---|---|
${rows.join('\n')}
`;
}

const githubItems = ITEM_FILES
  .flatMap(readJsonl)
  .filter(item => item.source === SOURCE && item.title && item.link && item.published);

const latestItems = pickLatestByFeature(githubItems);
const report = renderReport(latestItems);

fs.mkdirSync(path.dirname(REPORT_FILE), { recursive: true });
fs.writeFileSync(REPORT_FILE, report, 'utf8');

console.log(`Wrote ${latestItems.length} GitHub updates to ${REPORT_FILE}.`);