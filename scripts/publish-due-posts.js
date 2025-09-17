'use strict';

// Toggle draft=false on posts in allowed series whose date is in the past.
// Inputs:
// - SERIES_ALLOWLIST: comma-separated list or JSON array of series names to include
// - DRY_RUN: set to '1' to avoid writing changes

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const matter = require('gray-matter');
const TOML = require('@iarna/toml');

function parseSeriesAllowlist(envVal) {
  if (!envVal) return [];
  try {
    const arr = JSON.parse(envVal);
    return Array.isArray(arr) ? arr.map((s) => String(s).trim()).filter(Boolean) : [];
  } catch {
    return String(envVal)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }
}

function parsePostDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return NaN;
  // Normalize "YYYY-MM-DD HH:mm:ssZ" -> ISO by inserting 'T'
  const normalized = dateStr.replace(/^(\d{4}-\d{2}-\d{2})\s(\d{2}:\d{2}:\d{2}Z)$/i, '$1T$2');
  const t = Date.parse(normalized);
  return t;
}

function frontMatterReplaceDraft(source) {
  // Replace the first occurrence of draft = true in the front matter only.
  // Hugo TOML front matter is delimited by +++ on its own line.
  const delim = '+++';
  const start = source.indexOf(delim);
  if (start !== 0) return null; // not TOML front matter at top
  const second = source.indexOf('\n' + delim, delim.length); // search for next delimiter on new line
  if (second === -1) return null; // malformed
  const fmEndIdx = second + 1 + delim.length; // end index of closing delimiter line start
  const header = source.slice(0, fmEndIdx + 1); // include trailing newline after closing +++
  const rest = source.slice(fmEndIdx + 1);

  const headerLines = header.split(/\r?\n/);
  let replaced = false;
  const newHeaderLines = headerLines.map((line) => {
    if (!replaced && /^\s*draft\s*=\s*true\s*$/i.test(line)) {
      replaced = true;
      return line.replace(/true/i, 'false');
    }
    return line;
  });
  if (!replaced) return null; // nothing to change
  return newHeaderLines.join('\n') + rest;
}

function main() {
  const allowlist = parseSeriesAllowlist(process.env.SERIES_ALLOWLIST);
  const dryRun = process.env.DRY_RUN === '1';
  const simulation = process.env.SIMULATION === '1';
  const nowOverride = process.env.NOW; // ISO or 'YYYY-MM-DD' style
  const pattern = path.join('content', 'posts', '**', 'index.md');
  const files = glob.sync(pattern, { nodir: true, dot: false });

  const now = nowOverride ? Date.parse(nowOverride.replace(/^(\d{4}-\d{2}-\d{2})$/, '$1T00:00:00Z')) : Date.now();
  if (simulation) {
    console.log(`[SIMULATION] Using NOW = ${new Date(now).toISOString()}`);
  }
  const results = [];

  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf8');
    // Parse front matter using TOML engine and +++ delimiters
    const parsed = matter(raw, {
      delimiters: '+++',
      language: 'toml',
      engines: {
        toml: {
          parse: (str) => TOML.parse(str),
          stringify: (data) => TOML.stringify(data),
        },
      },
    });

    const data = parsed.data || {};
    const isDraft = data.draft === true;
    if (!isDraft) continue;

    // Ensure series matches allowed list (if provided)
    const series = Array.isArray(data.series) ? data.series.map(String) : [];
    const matchesSeries = allowlist.length === 0 ? false : series.some((s) => allowlist.includes(s));
    if (!matchesSeries) continue;

    // Date check
    const postTime = parsePostDate(data.date);
    if (!Number.isFinite(postTime)) continue;
    const isPast = postTime <= now;
    if (!isPast) {
      if (simulation) {
        console.log(`[SIMULATION] Future post skipped (not yet due): ${file}`);
      }
      continue;
    }

    // Perform targeted replacement in front matter to minimize churn
    const updated = frontMatterReplaceDraft(raw);
    if (!updated) continue;

    results.push(file);
    if (simulation) {
      console.log(`[SIMULATION] Would publish: ${file}`);
    } else if (!dryRun) {
      fs.writeFileSync(file, updated, 'utf8');
    }
  }

  // Summary output for GitHub Actions logging
  if (simulation) {
    console.log(`[SIMULATION] ${results.length} post(s) would be updated.`);
  } else if (results.length > 0) {
    console.log(`Updated drafts -> published for ${results.length} file(s):`);
    results.forEach((f) => console.log('- ' + f));
  } else {
    console.log('No posts required updates.');
  }
}

main();
