'use strict';

// Deterministic helpers for the weekly CSA blog agentic workflow.
//
// Commands:
//   plan      Resolve the reporting period, edition identifier and duplicate state.
//   validate  Check a generated editorial packet before a pull request is created.
//
// The agentic workflow calls this script so that period arithmetic, duplicate
// detection and packet constraints stay verifiable offline, without inference.

const fs = require('fs');
const path = require('path');
const TOML = require('@iarna/toml');

const TIMEZONE = 'Europe/Paris';
const PACKET_ROOT = 'editorial/weekly';
const EDITION_PREFIX = 'weekly-csa';
const REQUIRED_PACKET_FILES = ['digest.md', 'article-ideas.md', 'sources.json'];
const CONDITIONAL_PACKET_FILES = ['blog-draft.md', 'linkedin-draft.md'];
const ALLOWED_PACKET_FILES = [...REQUIRED_PACKET_FILES, ...CONDITIONAL_PACKET_FILES];
const REQUIRED_DRAFT_FIELDS = [
  'title',
  'slug',
  'date',
  'lastmod',
  'draft',
  'tags',
  'categories',
  'series',
  'layout',
];
const MIN_SOURCE_COVERAGE = 3;
const DAY_MS = 24 * 60 * 60 * 1000;

class UsageError extends Error {}

// Offset of a timezone, in minutes, at a given instant.
function timezoneOffsetMinutes(instantMs, timeZone) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const parts = {};
  for (const part of formatter.formatToParts(new Date(instantMs))) {
    if (part.type !== 'literal') parts[part.type] = Number(part.value);
  }
  const asUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour === 24 ? 0 : parts.hour,
    parts.minute,
    parts.second
  );
  return (asUtc - Math.floor(instantMs / 1000) * 1000) / 60000;
}

function formatOffset(minutes) {
  const sign = minutes < 0 ? '-' : '+';
  const abs = Math.abs(minutes);
  const hh = String(Math.floor(abs / 60)).padStart(2, '0');
  const mm = String(abs % 60).padStart(2, '0');
  return `${sign}${hh}:${mm}`;
}

// Instant of local midnight for a calendar date, resolved across DST shifts.
function zonedMidnight(dateStr, timeZone = TIMEZONE) {
  const naive = Date.parse(`${dateStr}T00:00:00Z`);
  let instant = naive;
  for (let i = 0; i < 3; i += 1) {
    const offset = timezoneOffsetMinutes(instant, timeZone);
    const next = naive - offset * 60000;
    if (next === instant) break;
    instant = next;
  }
  const offset = timezoneOffsetMinutes(instant, timeZone);
  return { instant, iso: `${dateStr}T00:00:00${formatOffset(offset)}` };
}

function localDateString(instantMs, timeZone = TIMEZONE) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(new Date(instantMs));
}

function isDateString(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

function addDays(dateStr, days) {
  const base = Date.parse(`${dateStr}T00:00:00Z`) + days * DAY_MS;
  return new Date(base).toISOString().slice(0, 10);
}

function weekdayOf(dateStr) {
  return new Date(`${dateStr}T00:00:00Z`).getUTCDay();
}

// Monday of the calendar week containing the supplied local date.
function mondayOf(dateStr) {
  const weekday = weekdayOf(dateStr);
  const delta = weekday === 0 ? -6 : 1 - weekday;
  return addDays(dateStr, delta);
}

function resolveEdition({ now = Date.now(), editionDate = null } = {}) {
  const today = localDateString(now);
  const currentMonday = mondayOf(today);

  let edition = currentMonday;
  if (editionDate !== null && editionDate !== undefined && editionDate !== '') {
    if (!isDateString(editionDate)) {
      throw new UsageError(`edition-date must use YYYY-MM-DD format, received "${editionDate}"`);
    }
    if (weekdayOf(editionDate) !== 1) {
      throw new UsageError(`edition-date must be a Monday, received "${editionDate}"`);
    }
    if (Date.parse(`${editionDate}T00:00:00Z`) > Date.parse(`${currentMonday}T00:00:00Z`)) {
      throw new UsageError(
        `edition-date "${editionDate}" is in the future; the latest complete reporting period ends on ${currentMonday}`
      );
    }
    edition = editionDate;
  }

  const startDate = addDays(edition, -7);
  const start = zonedMidnight(startDate);
  const end = zonedMidnight(edition);

  return {
    edition_date: edition,
    edition_id: `${EDITION_PREFIX}-${edition}`,
    packet_dir: `${PACKET_ROOT}/${edition}`,
    branch: `editorial/${EDITION_PREFIX}-${edition}`,
    reporting_period: {
      timezone: TIMEZONE,
      start_inclusive: start.iso,
      end_exclusive: end.iso,
      first_day: startDate,
      last_day: addDays(edition, -1),
      days: Math.round((end.instant - start.instant) / DAY_MS),
    },
  };
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

// Accepts `gh pr list --json number,title,state,url,body` output.
function matchingPullRequests(pullRequests, editionId) {
  if (!Array.isArray(pullRequests)) return [];
  return pullRequests
    .filter((pr) => pr && typeof pr === 'object')
    .filter((pr) =>
      [pr.title, pr.body, pr.headRefName, pr.branch]
        .filter((value) => typeof value === 'string')
        .some((value) => value.includes(editionId))
    )
    .map((pr) => ({
      number: pr.number ?? null,
      state: pr.state ?? null,
      url: pr.url ?? null,
      title: pr.title ?? null,
    }));
}

function resolveNow(options) {
  if (!options.now) return Date.now();
  const parsed = Date.parse(options.now);
  if (Number.isNaN(parsed)) throw new UsageError(`--now must be an ISO timestamp, received "${options.now}"`);
  return parsed;
}

function plan(options) {
  const repoRoot = options['repo-root'] || process.cwd();
  const edition = resolveEdition({
    now: resolveNow(options),
    editionDate: options['edition-date'] || null,
  });

  const packetPath = path.join(repoRoot, edition.packet_dir);
  const packetExists = fs.existsSync(packetPath) && fs.readdirSync(packetPath).length > 0;

  const pullRequests = options['existing-prs'] ? readJson(options['existing-prs']) : [];
  const existing = matchingPullRequests(pullRequests, edition.edition_id);

  const duplicate = packetExists || existing.length > 0;
  return {
    ...edition,
    packet_exists: packetExists,
    existing_pull_requests: existing,
    duplicate,
    decision: duplicate ? 'skip-duplicate' : 'proceed',
  };
}

function parseTomlFrontMatter(source) {
  const match = /^\+\+\+\r?\n([\s\S]*?)\r?\n\+\+\+\r?\n?/.exec(source);
  if (!match) return { error: 'blog-draft.md must start with TOML front matter delimited by +++' };
  try {
    return { data: TOML.parse(match[1]), body: source.slice(match[0].length) };
  } catch (err) {
    return { error: `blog-draft.md front matter is not valid TOML: ${err.message}` };
  }
}

function validateDraft(source, errors) {
  const parsed = parseTomlFrontMatter(source);
  if (parsed.error) {
    errors.push(parsed.error);
    return;
  }
  const data = parsed.data;
  for (const field of REQUIRED_DRAFT_FIELDS) {
    if (data[field] === undefined) errors.push(`blog-draft.md front matter is missing "${field}"`);
  }
  if (data.draft !== true) errors.push('blog-draft.md must set draft = true');
  if (typeof data.title === 'string' && data.title.length > 50) {
    errors.push(`blog-draft.md title exceeds 50 characters (${data.title.length})`);
  }
  const description = data.description ?? (data.params && data.params.description);
  if (typeof description !== 'string' || description.length === 0) {
    errors.push('blog-draft.md front matter is missing "description"');
  } else if (description.length > 150) {
    errors.push(`blog-draft.md description exceeds 150 characters (${description.length})`);
  }
  if (typeof data.date === 'string' && !/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}Z$/.test(data.date)) {
    errors.push('blog-draft.md date must use the YYYY-MM-DD HH:MM:SSZ format');
  }
  if (parsed.body && /^#\s+/m.test(parsed.body)) {
    errors.push('blog-draft.md must not contain an H1 heading');
  }
}

function validateSources(sources, edition, errors) {
  if (sources.edition_date !== edition.edition_date) {
    errors.push(`sources.json edition_date must be "${edition.edition_date}"`);
  }
  if (sources.outcome !== 'packet') {
    errors.push('sources.json outcome must be "packet" when an editorial packet is committed');
  }
  const period = sources.reporting_period || {};
  if (period.timezone !== TIMEZONE) errors.push(`sources.json reporting_period.timezone must be "${TIMEZONE}"`);
  if (period.start_inclusive !== edition.reporting_period.start_inclusive) {
    errors.push(`sources.json reporting_period.start_inclusive must be "${edition.reporting_period.start_inclusive}"`);
  }
  if (period.end_exclusive !== edition.reporting_period.end_exclusive) {
    errors.push(`sources.json reporting_period.end_exclusive must be "${edition.reporting_period.end_exclusive}"`);
  }

  const items = Array.isArray(sources.sources) ? sources.sources : [];
  if (items.length === 0) errors.push('sources.json must list at least one source');
  const ids = new Set();
  items.forEach((source, index) => {
    const label = `sources.json sources[${index}]`;
    for (const field of ['id', 'title', 'url', 'publisher', 'published']) {
      if (typeof source[field] !== 'string' || source[field].length === 0) {
        errors.push(`${label} is missing "${field}"`);
      }
    }
    if (typeof source.url === 'string' && !/^https:\/\//.test(source.url)) {
      errors.push(`${label} url must be an https URL`);
    }
    if (!isDateString(source.published)) {
      errors.push(`${label} published must use YYYY-MM-DD format`);
    }
    if (typeof source.id === 'string') {
      if (ids.has(source.id)) errors.push(`${label} repeats source id "${source.id}"`);
      ids.add(source.id);
    }
  });

  const claims = Array.isArray(sources.claims) ? sources.claims : [];
  if (claims.length === 0) errors.push('sources.json must map at least one claim to its sources');
  claims.forEach((claim, index) => {
    const label = `sources.json claims[${index}]`;
    if (typeof claim.claim !== 'string' || claim.claim.length === 0) errors.push(`${label} is missing "claim"`);
    if (!['verified', 'recommendation'].includes(claim.type)) {
      errors.push(`${label} type must be "verified" or "recommendation"`);
    }
    const refs = Array.isArray(claim.source_ids) ? claim.source_ids : [];
    if (refs.length === 0) errors.push(`${label} must reference at least one source id`);
    for (const ref of refs) {
      if (!ids.has(ref)) errors.push(`${label} references unknown source id "${ref}"`);
    }
  });

  const coverage = sources.source_coverage || {};
  const reached = Array.isArray(coverage.reached) ? coverage.reached : [];
  const failed = Array.isArray(coverage.failed) ? coverage.failed : [];
  if (reached.length < MIN_SOURCE_COVERAGE) {
    errors.push(
      `sources.json source_coverage.reached must list at least ${MIN_SOURCE_COVERAGE} reachable official sources, found ${reached.length}`
    );
  }
  return { failed };
}

function validate(options) {
  const repoRoot = options['repo-root'] || process.cwd();
  const packetDir = options['packet-dir'];
  if (!packetDir) throw new UsageError('validate requires --packet-dir');

  const normalised = packetDir.replace(/\\/g, '/').replace(/\/$/, '');
  const errors = [];
  const match = new RegExp(`^${PACKET_ROOT}/(\\d{4}-\\d{2}-\\d{2})$`).exec(normalised);
  if (!match) {
    throw new UsageError(`packet-dir must be "${PACKET_ROOT}/YYYY-MM-DD", received "${packetDir}"`);
  }
  const edition = resolveEdition({
    now: resolveNow(options),
    editionDate: match[1],
  });

  const absolute = path.join(repoRoot, normalised);
  if (!fs.existsSync(absolute)) {
    throw new UsageError(`packet directory "${normalised}" does not exist`);
  }

  const entries = fs.readdirSync(absolute, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile()) {
      errors.push(`packet must contain files only, found "${entry.name}"`);
    } else if (!ALLOWED_PACKET_FILES.includes(entry.name)) {
      errors.push(`packet contains unexpected file "${entry.name}"`);
    }
  }
  const names = entries.filter((entry) => entry.isFile()).map((entry) => entry.name);
  for (const required of REQUIRED_PACKET_FILES) {
    if (!names.includes(required)) errors.push(`packet is missing "${required}"`);
  }

  let failedSources = [];
  if (names.includes('sources.json')) {
    try {
      const sources = readJson(path.join(absolute, 'sources.json'));
      ({ failed: failedSources } = validateSources(sources, edition, errors));
    } catch (err) {
      errors.push(`sources.json is not valid JSON: ${err.message}`);
    }
  }

  const hasDraft = names.includes('blog-draft.md');
  const hasTeaser = names.includes('linkedin-draft.md');
  if (hasDraft !== hasTeaser) {
    errors.push('blog-draft.md and linkedin-draft.md must be provided together');
  }
  if (hasDraft) {
    validateDraft(fs.readFileSync(path.join(absolute, 'blog-draft.md'), 'utf-8'), errors);
  }

  if (names.includes('digest.md')) {
    const digest = fs.readFileSync(path.join(absolute, 'digest.md'), 'utf-8');
    if (!/research limitations/i.test(digest)) {
      errors.push('digest.md must include a "Research limitations" section');
    }
    if (failedSources.length > 0 && !/partial|incomplete|blocked|unavailable/i.test(digest)) {
      errors.push('digest.md must disclose partial source coverage when sources failed');
    }
  }

  if (options['changed-files']) {
    const changed = fs
      .readFileSync(options['changed-files'], 'utf-8')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    for (const file of changed) {
      if (!file.replace(/\\/g, '/').startsWith(`${normalised}/`)) {
        errors.push(`file "${file}" is outside the editorial packet directory`);
      }
    }
  }

  return {
    packet_dir: normalised,
    edition_id: edition.edition_id,
    files: names.sort(),
    complete_article: hasDraft && hasTeaser,
    valid: errors.length === 0,
    errors,
  };
}

function parseArgs(argv) {
  const options = {};
  for (const arg of argv) {
    const match = /^--([a-z-]+)(?:=(.*))?$/.exec(arg);
    if (!match) throw new UsageError(`unrecognised argument "${arg}"`);
    options[match[1]] = match[2] === undefined ? true : match[2];
  }
  return options;
}

function run(argv) {
  const [command, ...rest] = argv;
  const options = parseArgs(rest);
  switch (command) {
    case 'plan':
      return plan(options);
    case 'validate':
      return validate(options);
    default:
      throw new UsageError('usage: weekly-csa-blog.js <plan|validate> [--option=value]');
  }
}

if (require.main === module) {
  try {
    const result = run(process.argv.slice(2));
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    process.exit(result.valid === false ? 1 : 0);
  } catch (err) {
    process.stderr.write(`${err.message}\n`);
    process.exit(err instanceof UsageError ? 2 : 1);
  }
}

module.exports = {
  UsageError,
  resolveEdition,
  matchingPullRequests,
  plan,
  validate,
  run,
};
