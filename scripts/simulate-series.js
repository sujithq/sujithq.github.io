'use strict';
/**
 * Simulate progressive publication of a dated multi-part series.
 * For each simulated date step:
 *  1. Run publish-due-posts.js in simulation (no writes) with NOW override.
 *  2. Run activate-series-links.js in simulate mode to show nav transformation.
 *
 * Usage:
 *   node scripts/simulate-series.js --series "CSharp Async Await" --root-date 2025-09-17 --steps 7 --interval-days 7
 */

const { spawnSync } = require('child_process');

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { series: 'CSharp Async Await', rootDate: '2025-09-17', steps: 7, intervalDays: 7 };
  for (let i=0;i<args.length;i++) {
    const a = args[i];
    if (a === '--series') opts.series = args[++i];
    else if (a === '--root-date') opts.rootDate = args[++i];
    else if (a === '--steps') opts.steps = parseInt(args[++i],10) || opts.steps;
    else if (a === '--interval-days') opts.intervalDays = parseInt(args[++i],10) || opts.intervalDays;
  }
  return opts;
}

function addDays(dateStr, days) {
  const d = new Date(dateStr + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().substring(0,10); // YYYY-MM-DD
}

function run(cmd, args, envExtra) {
  const res = spawnSync(process.execPath, [cmd, ...args], { stdio: 'inherit', env: { ...process.env, ...envExtra } });
  if (res.error) throw res.error;
}

function main() {
  const opts = parseArgs();
  let currentDate = opts.rootDate; // start at root date
  console.log(`Simulating ${opts.steps} step(s) for series '${opts.series}' starting ${currentDate}`);

  for (let step=1; step<=opts.steps; step++) {
    const isoNow = currentDate + 'T12:00:00Z';
    console.log('\n===============================');
    console.log(`STEP ${step}: NOW=${isoNow}`);
    console.log('===============================');

    // Simulate publish-due-posts
    run('scripts/publish-due-posts.js', [], {
      SERIES_ALLOWLIST: opts.series,
      SIMULATION: '1',
      NOW: isoNow
    });

    // Simulate activation script
    run('scripts/activate-series-links.js', [
      '--series', opts.series,
      '--root-date', opts.rootDate,
      '--simulate',
      '--now', isoNow
    ], {});

    // Advance date
    currentDate = addDays(currentDate, opts.intervalDays);
  }
}

if (require.main === module) main();
