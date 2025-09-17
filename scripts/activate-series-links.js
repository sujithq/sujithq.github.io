'use strict';
/**
 * Activate links for the CSharp Async Await series as parts become published.
 *
 * Behaviour:
 * 1. Reads the series index file (series root index.md) for the specified series.
 * 2. Detects which part files (part1..part7) have draft=false AND publication date <= now.
 * 3. Rewrites the navigation list and per-part teaser list entries:
 *    - For published parts: converts plain text placeholder to markdown link.
 *    - Leaves future parts as plain text with release date.
 * 4. (Optional future enhancement) Could also update per-part Previous/Next blocks if needed.
 *
 * Usage:
 *   node scripts/activate-series-links.js --series "CSharp Async Await" --root-date 2025-09-17 --parts 7 --dry-run
 *
 * Options:
 *   --series        Series name (exact match in front matter array)
 *   --root-date     Date (YYYY-MM-DD) root folder for index (used to derive path) default 2025-09-17
 *   --parts         Total number of parts (default 7)
 *   --dry-run       Do not write changes
 *   --now           Override current datetime (ISO) for testing
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const matter = require('gray-matter');
const TOML = require('@iarna/toml');

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { parts: 7, series: 'CSharp Async Await', rootDate: '2025-09-17', dryRun: false, simulate: false };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--series') opts.series = args[++i];
    else if (a === '--root-date') opts.rootDate = args[++i];
    else if (a === '--parts') opts.parts = parseInt(args[++i], 10) || opts.parts;
    else if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--now') opts.now = args[++i];
    else if (a === '--simulate') opts.simulate = true;
  }
  return opts;
}

function parseDate(str) {
  if (!str) return NaN;
  const iso = str.replace(/^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2}Z)$/,'$1T$2');
  return Date.parse(iso);
}

function loadFrontMatter(file) {
  const raw = fs.readFileSync(file,'utf8');
  const parsed = matter(raw, { delimiters: '+++', language: 'toml', engines: { toml: { parse: (s)=>TOML.parse(s), stringify: (d)=>TOML.stringify(d) }}});
  return { raw, data: parsed.data };
}

function buildPartFolderDate(rootDate, partIndex) {
  // rootDate is date of index & part1; part2 is +7 days etc.
  const base = new Date(rootDate + 'T00:00:00Z');
  const d = new Date(base.getTime() + (partIndex-1)*7*24*3600*1000);
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth()+1).padStart(2,'0');
  const dd = String(d.getUTCDate()).padStart(2,'0');
  return `${yyyy}-${mm}-${dd}`;
}

function generateNavLines(publishedMap, rootDate, totalParts) {
  const labels = [
    'Part 1 – Introduction',
    'Part 2 – Deep Dive',
    'Part 3 – Pitfalls & Best Practices',
    'Part 4 – Patterns',
    'Part 5 – Real-World Use Cases',
    'Part 6 – Advanced Topics',
    'Part 7 – Testing & Debugging'
  ];
  const lines = [];
  for (let i=1;i<=totalParts;i++) {
    const folderDate = buildPartFolderDate(rootDate,i);
    if (publishedMap[i]) {
      // Permalink pattern defined in config: /posts/:year/:month/:slug
      const [year, month] = folderDate.split('-');
      const slug = `csharp-async-await-part${i}`;
      lines.push(`${i}. [${labels[i-1]}](/posts/${year}/${month}/${slug}/)`);
    } else {
      const releaseLabel = i===1 ? folderDate : `Releases ${folderDate.replace(/-/g,' ')}`.replace(/ (\d{4})$/,' $1');
      // Use uniform date formatting: DD Mon? Keep original style -> day month numeric
      lines.push(`${i}. ${labels[i-1]} (${i===1 ? folderDate : 'Releases ' + folderDate})`);
    }
  }
  return lines;
}

function updateIndexNav(indexRaw, newNavLines) {
  // Replace the numbered list under '### Series Navigation' until the blank line after 7.
  const lines = indexRaw.split(/\r?\n/);
  const startIdx = lines.findIndex(l => /^1\. /.test(l.trim()));
  if (startIdx === -1) return indexRaw;
  // assume 7 lines continuous
  const endIdx = startIdx + 6;
  const updated = lines.slice(0,startIdx).concat(newNavLines, lines.slice(endIdx+1));
  return updated.join('\n');
}

function replaceTeaserPlaceholder(section, partNumber, folderDate) {
  // Replace lines like '👉 Releases 24 Sep 2025' or '👉 Part 1 goes live ...' with a markdown link once published.
  // We just look for the first line containing 'Part {n}' and 'Releases' or 'goes live'.
  const lines = section.split(/\r?\n/);
  const partRegex = new RegExp(`^(👉)?\\s*.*Part\\s+${partNumber}[^\n]*$`, 'i');
  for (let i=0;i<lines.length;i++) {
    if (/^👉/.test(lines[i]) && partRegex.test(lines[i])) {
      // Build link slug pattern
      const link = `👉 [Read Part ${partNumber}](./part${partNumber}.md)`;
      lines[i] = link;
      break;
    }
  }
  return lines.join('\n');
}

function main() {
  const opts = parseArgs();
  const now = opts.now ? Date.parse(opts.now) : Date.now();

  // Discover part files
  const partFiles = {};
  for (let i=1;i<=opts.parts;i++) {
    const folderDate = buildPartFolderDate(opts.rootDate,i);
    const folderName = i===1 ? `${folderDate}-csharp-async-await-part1` : `${folderDate}-csharp-async-await-part${i}`;
    const file = path.join('content','posts', folderDate + (i===1 ? '-csharp-async-await-part1' : `-csharp-async-await-part${i}`), 'index.md');
    if (fs.existsSync(file)) partFiles[i] = file;
  }

  // Determine published parts
  const publishedMap = {};
  for (const [iStr, file] of Object.entries(partFiles)) {
    const i = parseInt(iStr,10);
    const { data } = loadFrontMatter(file);
    const dateMs = parseDate(data.date);
    const isPublished = data.draft === false && Number.isFinite(dateMs) && dateMs <= now;
    publishedMap[i] = isPublished;
  }

  const indexFile = path.join('content','posts', `${opts.rootDate}-csharp-async-await`, 'index.md');
  if (!fs.existsSync(indexFile)) {
    console.error('Series index file not found:', indexFile);
    process.exit(1);
  }
  const indexRaw = fs.readFileSync(indexFile,'utf8');

  const newNav = generateNavLines(publishedMap, opts.rootDate, opts.parts);
  const updatedIndex = updateIndexNav(indexRaw, newNav);

  if (updatedIndex !== indexRaw) {
    if (opts.dryRun || opts.simulate) {
      console.log(`[${opts.simulate ? 'SIMULATE' : 'DRY RUN'}] Would update series navigation:`);
      console.log(newNav.join('\n'));
    } else {
      fs.writeFileSync(indexFile, updatedIndex, 'utf8');
      console.log('Updated series index navigation.');
    }
  } else {
    console.log('No changes required for series navigation.');
  }

  // (Optional) Activate teaser links inside the same index file when their part is published
  let teaserUpdated = updatedIndex;
  for (let i=1;i<=opts.parts;i++) {
    if (!publishedMap[i]) continue;
    const folderDate = buildPartFolderDate(opts.rootDate,i);
    // Find the section for Part i using a safer pattern (escape asterisks) and avoid complex nested regex that caused errors.
    const headerRegex = new RegExp(`^### \\*\\*Part ${i}:.*$`, 'm');
    const match = headerRegex.exec(teaserUpdated);
    if (!match) continue;
    const startIdx = match.index;
    // Locate start of next part header or end of file
    const nextHeaderRegex = /^### \*\*Part \d:/gm;
    nextHeaderRegex.lastIndex = startIdx + match[0].length;
    let nextIdx = teaserUpdated.length;
    let nh;
    while ((nh = nextHeaderRegex.exec(teaserUpdated))) {
      if (nh.index > startIdx) { nextIdx = nh.index; break; }
    }
    const before = teaserUpdated.slice(0,startIdx);
    const section = teaserUpdated.slice(startIdx,nextIdx);
    const after = teaserUpdated.slice(nextIdx);
    // Replace a placeholder arrow line (starting with 👉 and not already a [Read Part] link)
    const updatedSection = section.replace(/^(👉\s+)(?!\[Read Part)(.*)$/m, `👉 [Read Part ${i}](./part${i}.md)`);
    teaserUpdated = before + updatedSection + after;
  }
  if (teaserUpdated !== updatedIndex) {
    if (opts.dryRun || opts.simulate) {
      console.log(`[${opts.simulate ? 'SIMULATE' : 'DRY RUN'}] Would update teaser links for published parts.`);
    } else {
      fs.writeFileSync(indexFile, teaserUpdated,'utf8');
      console.log('Updated teaser links.');
    }
  }

  // --- NEW: Update per-part Series Navigation blocks for Next links ---
  for (let i=1;i<=opts.parts;i++) {
    const file = partFiles[i];
    if (!file || !fs.existsSync(file)) continue;
    const raw = fs.readFileSync(file,'utf8');
    const lines = raw.split(/\r?\n/);
    const navIdx = lines.findIndex(l => /^###\s+Series Navigation$/i.test(l.trim()));
    if (navIdx === -1) continue;
    // Determine slice end: next heading '### ' or EOF
    let sliceEnd = lines.length;
    for (let k = navIdx+1; k < lines.length; k++) {
      if (/^###\s+/.test(lines[k]) && k !== navIdx) { sliceEnd = k; break; }
    }
    const before = lines.slice(0, navIdx+1); // include heading
    const after = lines.slice(sliceEnd);

    // Build fresh navigation block (blank line after heading for readability)
    const navLines = [];
    navLines.push('');
    const rootParts = opts.rootDate.split('-');
    const [rootYear, rootMonth] = [rootParts[0], rootParts[1]];

    // Previous
    const prevPart = i-1;
    if (prevPart >= 1) {
      const prevFolderDate = buildPartFolderDate(opts.rootDate, prevPart);
      const [pyear,pmonth] = prevFolderDate.split('-');
      const prevSlug = `csharp-async-await-part${prevPart}`;
      if (publishedMap[prevPart]) {
        navLines.push(`Previous: [Part ${prevPart} – ${labelFor(prevPart)}](/posts/${pyear}/${pmonth}/${prevSlug}/)`);
      } else {
        navLines.push(`Previous: Part ${prevPart} – ${labelFor(prevPart)} (Releases ${prevFolderDate})`);
      }
    }

    // Series Index always shown
    navLines.push(`Series Index: [Overview](/posts/${rootYear}/${rootMonth}/csharp-async-await/)`);

    // Next
    const nextPart = i+1;
    if (nextPart <= opts.parts) {
      const nextFolderDate = buildPartFolderDate(opts.rootDate, nextPart);
      const [nyear,nmonth] = nextFolderDate.split('-');
      const nextSlug = `csharp-async-await-part${nextPart}`;
      if (publishedMap[nextPart]) {
        navLines.push(`Next: [Part ${nextPart} – ${labelFor(nextPart)}](/posts/${nyear}/${nmonth}/${nextSlug}/)`);
      } else {
        navLines.push(`Next: Part ${nextPart} – ${labelFor(nextPart)} (Releases ${nextFolderDate})`);
      }
    }

    // Existing nav content (between heading and sliceEnd) may already match; compare
    const existing = lines.slice(navIdx+1, sliceEnd).join('\n');
    const rebuilt = navLines.join('\n');
    if (existing.trim() !== rebuilt.trim()) {
      const newLines = before.concat(navLines, after);
      const updatedRaw = newLines.join('\n');
      if (opts.dryRun || opts.simulate) {
        console.log(`[${opts.simulate ? 'SIMULATE' : 'DRY RUN'}] Would rebuild navigation block in Part ${i}.`);
      } else {
        fs.writeFileSync(file, updatedRaw, 'utf8');
        console.log(`Rebuilt navigation block in Part ${i}.`);
      }
    }
  }
}

function labelFor(i) {
  switch(i) {
    case 1: return 'Introduction';
    case 2: return 'Deep Dive';
    case 3: return 'Pitfalls & Best Practices';
    case 4: return 'Patterns';
    case 5: return 'Real-World Use Cases';
    case 6: return 'Advanced Topics';
    case 7: return 'Testing & Debugging';
    default: return `Part ${i}`;
  }
}

if (require.main === module) {
  main();
}
