const crypto = require('crypto');
const fs = require('fs');

const API_URL = 'https://github.blog/wp-json/wp/v2/changelogs';
const SRC = 'db/items.jsonl';
const ARCHIVE = 'db/items.archive.jsonl';
const SOURCE = 'GitHub';
const CATEGORY = 'github';
const ARCHIVE_AFTER_MONTHS = 3;

function getArgValue(name, fallback) {
  const prefix = `--${name}=`;
  const arg = process.argv.find(value => value.startsWith(prefix));
  return arg ? arg.slice(prefix.length) : fallback;
}

function hasFlag(name) {
  return process.argv.includes(`--${name}`);
}

function hash(value) {
  return crypto.createHash('sha256').update(value).digest('hex').toUpperCase();
}

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

function writeJsonl(file, items) {
  fs.writeFileSync(file, items.map(item => JSON.stringify(item)).join('\n') + '\n', 'utf8');
}

function decodeHtml(value) {
  return String(value || '')
    .replace(/&hellip;/g, '...')
    .replace(/&ldquo;|&#8220;/g, '"')
    .replace(/&rdquo;|&#8221;/g, '"')
    .replace(/&lsquo;|&#8216;/g, "'")
    .replace(/&rsquo;|&#8217;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#8211;|&ndash;/g, '-')
    .replace(/&#8212;|&mdash;/g, '-')
    .replace(/&#\d+;/g, '')
    .replace(/&[a-z]+;/gi, '');
}

function stripHtml(value) {
  return decodeHtml(value)
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function summarise(item) {
  const excerpt = stripHtml(item.excerpt?.rendered);
  if (excerpt) {
    return excerpt;
  }

  return stripHtml(item.content?.rendered).slice(0, 300).trim();
}

function getPublished(item) {
  const date = item.date_gmt ? `${item.date_gmt}Z` : item.date;
  return new Date(date).toISOString();
}

function getTimeframeKey(published) {
  return published.slice(0, 7);
}

function getArchiveCutoffDate(months) {
  const cutoff = new Date();
  cutoff.setUTCMonth(cutoff.getUTCMonth() - months);
  return cutoff;
}

function toFeedItem(item) {
  const title = stripHtml(item.title?.rendered);
  const link = item.link;
  const published = getPublished(item);
  const summary = summarise(item);
  const contentHash = hash(`${title}\n${link}\n${summary}`);

  return {
    id: hash(link),
    title,
    link,
    source: SOURCE,
    category: CATEGORY,
    timeframeKey: getTimeframeKey(published),
    published,
    contentHash,
    llm: {
      Summary: summary,
      Bullets: summary ? [summary] : [],
      Tags: [SOURCE, CATEGORY, 'changelog'],
    },
  };
}

async function fetchPage(page) {
  const url = new URL(API_URL);
  url.searchParams.set('per_page', '100');
  url.searchParams.set('page', String(page));
  url.searchParams.set('_fields', 'date,date_gmt,title,link,slug,excerpt,content');

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`GitHub changelog API returned ${response.status} for page ${page}`);
  }

  return response.json();
}

async function fetchSince(since) {
  const results = [];

  for (let page = 1; ; page += 1) {
    const items = await fetchPage(page);
    if (items.length === 0) {
      break;
    }

    let reachedCutoff = false;
    for (const item of items) {
      const published = new Date(getPublished(item));
      if (published < since) {
        reachedCutoff = true;
        continue;
      }

      results.push(item);
    }

    if (reachedCutoff) {
      break;
    }
  }

  return results;
}

async function main() {
  const months = Number.parseInt(getArgValue('months', '12'), 10);
  const sinceArg = getArgValue('since', '');
  const dryRun = hasFlag('dry-run');
  const since = sinceArg ? new Date(`${sinceArg}T00:00:00Z`) : new Date();

  if (!sinceArg) {
    since.setUTCMonth(since.getUTCMonth() - months);
  }

  const currentItems = readJsonl(SRC);
  const archiveItems = readJsonl(ARCHIVE);
  const knownLinks = new Set([...currentItems, ...archiveItems].map(item => item.link));
  const changelogItems = await fetchSince(since);
  const newItems = changelogItems
    .map(toFeedItem)
    .filter(item => item.title && item.link && !knownLinks.has(item.link));

  const archiveCutoff = getArchiveCutoffDate(ARCHIVE_AFTER_MONTHS);
  const newCurrentItems = [];
  const newArchiveItems = [];

  for (const item of newItems) {
    if (new Date(item.published) < archiveCutoff) {
      newArchiveItems.push(item);
      continue;
    }

    newCurrentItems.push(item);
  }

  if (!dryRun) {
    writeJsonl(SRC, [...currentItems, ...newCurrentItems]);
    writeJsonl(ARCHIVE, [...archiveItems, ...newArchiveItems]);
  }

  const oldest = changelogItems.at(-1);
  const oldestDate = oldest ? getPublished(oldest).slice(0, 10) : 'none';
  console.log(`${dryRun ? '[DRY RUN] ' : ''}Fetched ${changelogItems.length} GitHub changelog entries back to ${oldestDate}.`);
  console.log(`${dryRun ? '[DRY RUN] ' : ''}Added ${newItems.length} missing entries: ${newCurrentItems.length} current, ${newArchiveItems.length} archived.`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});