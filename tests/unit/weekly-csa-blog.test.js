'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const yaml = require('js-yaml');

const helper = require('../../scripts/weekly-csa-blog.js');

const FIXTURES = path.join(__dirname, '..', 'fixtures', 'weekly-csa-blog');
const PACKET_DIR = 'editorial/weekly/2026-09-07';

function fixture(name) {
  return path.join(FIXTURES, name);
}

const workflowPath = path.join(__dirname, '..', '..', '.github', 'workflows', 'weekly-csa-blog');
const workflow = fs.readFileSync(`${workflowPath}.md`, 'utf8');
const frontmatter = yaml.load(workflow.split('---')[1]);
const compiled = yaml.load(fs.readFileSync(`${workflowPath}.lock.yml`, 'utf8'));
const agentRun = compiled.jobs.agent.steps.find((step) => step.run?.includes('copilot_harness.cjs')).run;
const firewallLine = agentRun.split('\n').find((line) => line.includes('"allowDomains"'));
const firewall = JSON.parse(firewallLine.match(/'(\{.*\})'/)[1]);

test('weekly research permits proxy-aware curl in the source and compiled agent command', () => {
  assert.ok(frontmatter.tools.bash.includes('curl:*'));
  assert.ok(!frontmatter.tools.bash.includes('*'), 'do not grant unrestricted shell access');
  assert.match(agentRun, /--allow-tool [^\n]*shell\(curl:\*\)/);
  assert.doesNotMatch(agentRun, /--allow-all-tools/);
  assert.match(workflow, /curl --fail --silent --show-error --location --max-time 60 <url>/);
  assert.match(workflow, /inherited `HTTPS_PROXY` and `HTTP_PROXY`/);
  assert.match(workflow, /A failed request or an HTTP error is not a successfully reached source/);
});

test('the firewall permits official research hosts including the configured Azure Updates feed', () => {
  const research = workflow.split('### Step 2:')[1].split('### Step 3:')[0];
  const urls = [...research.matchAll(/`(https:\/\/[^`]+)`/g)].map((match) => match[1]);
  const feeds = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'feed-config', 'feeds.json'), 'utf8'));
  const azureFeed = feeds.find((feed) => feed.Name === 'Azure Updates').Url;
  assert.ok(urls.includes(azureFeed), 'research must include the official Azure Updates RSS endpoint');
  assert.ok(frontmatter.network.allowed.includes(new URL(azureFeed).hostname));

  for (const url of urls) {
    assert.ok(firewall.network.allowDomains.includes(new URL(url).hostname), `${url} must pass through AWF`);
  }
  assert.equal(firewall.network.isolation, true);
  assert.equal(frontmatter.sandbox.agent.version, 'v0.28.16');
  assert.deepEqual(firewall.container.images, frontmatter.sandbox.agent.images);
  assert.ok(!firewall.network.allowDomains.includes('*'), 'do not allow arbitrary network destinations');
});

test('unreachable research still produces an incomplete run rather than a quiet week', () => {
  assert.match(workflow, /successfully reach at least three.*including at least one GitHub source and at least one Microsoft or Azure source/);
  assert.match(workflow, /If you reach fewer, report blocked or incomplete research.*create no packet and no pull request/);
  assert.match(workflow, /Never report a quiet week when the cause is an unreachable source/);
  assert.ok(compiled.jobs.conclusion, 'retain the job that fails report_incomplete runs');
  const incomplete = compiled.jobs.conclusion.steps.find((step) => step.id === 'report_incomplete');
  assert.match(incomplete.with.script, /report_incomplete_handler\.cjs/);
  assert.notEqual(incomplete['continue-on-error'], true, 'incomplete research must still fail');
});

test('reporting period is the previous complete Monday to Sunday week', () => {
  const edition = helper.resolveEdition({ now: Date.parse('2026-09-09T12:00:00Z') });
  assert.equal(edition.edition_date, '2026-09-07');
  assert.equal(edition.edition_id, 'weekly-csa-2026-09-07');
  assert.equal(edition.packet_dir, 'editorial/weekly/2026-09-07');
  assert.equal(edition.reporting_period.first_day, '2026-08-31');
  assert.equal(edition.reporting_period.last_day, '2026-09-06');
  assert.equal(edition.reporting_period.days, 7);
});

test('a Sunday late-evening run in Paris still belongs to the running week', () => {
  // 22:30 UTC on Sunday is already Monday 00:30 in Europe/Paris (summer time).
  const edition = helper.resolveEdition({ now: Date.parse('2026-09-06T22:30:00Z') });
  assert.equal(edition.edition_date, '2026-09-07');
  assert.equal(edition.reporting_period.start_inclusive, '2026-08-31T00:00:00+02:00');
});

test('reporting period offsets follow daylight saving transitions', () => {
  const spring = helper.resolveEdition({ now: Date.parse('2026-03-30T10:00:00Z') });
  assert.equal(spring.reporting_period.start_inclusive, '2026-03-23T00:00:00+01:00');
  assert.equal(spring.reporting_period.end_exclusive, '2026-03-30T00:00:00+02:00');
  assert.equal(spring.reporting_period.days, 7);

  const autumn = helper.resolveEdition({ now: Date.parse('2026-10-26T10:00:00Z') });
  assert.equal(autumn.reporting_period.start_inclusive, '2026-10-19T00:00:00+02:00');
  assert.equal(autumn.reporting_period.end_exclusive, '2026-10-26T00:00:00+01:00');
  assert.equal(autumn.reporting_period.days, 7);
});

test('manual edition dates are validated', () => {
  const backfill = helper.resolveEdition({
    now: Date.parse('2026-09-09T12:00:00Z'),
    editionDate: '2026-08-31',
  });
  assert.equal(backfill.edition_id, 'weekly-csa-2026-08-31');

  assert.throws(
    () => helper.resolveEdition({ now: Date.parse('2026-09-09T12:00:00Z'), editionDate: '2026-09-09' }),
    /must be a Monday/
  );
  assert.throws(
    () => helper.resolveEdition({ now: Date.parse('2026-09-09T12:00:00Z'), editionDate: '2026-09-14' }),
    /in the future/
  );
  assert.throws(
    () => helper.resolveEdition({ now: Date.parse('2026-09-09T12:00:00Z'), editionDate: '07-09-2026' }),
    /YYYY-MM-DD/
  );
});

test('plan proceeds for a week without a packet or pull request', () => {
  const result = helper.plan({
    now: '2026-09-09T12:00:00Z',
    'repo-root': fixture('quiet-week'),
  });
  assert.equal(result.packet_exists, false);
  assert.equal(result.duplicate, false);
  assert.equal(result.decision, 'proceed');
});

test('plan reports a duplicate when the packet already exists', () => {
  const result = helper.plan({
    now: '2026-09-09T12:00:00Z',
    'repo-root': fixture('valid'),
  });
  assert.equal(result.packet_exists, true);
  assert.equal(result.decision, 'skip-duplicate');
});

test('plan reports a duplicate for a closed pull request of the same edition', () => {
  const result = helper.plan({
    now: '2026-09-09T12:00:00Z',
    'repo-root': fixture('quiet-week'),
    'existing-prs': path.join(FIXTURES, 'existing-prs.json'),
  });
  assert.equal(result.duplicate, true);
  assert.equal(result.decision, 'skip-duplicate');
  assert.deepEqual(
    result.existing_pull_requests.map((pr) => pr.number),
    [511]
  );
});

test('matching pull requests ignore unrelated editions', () => {
  const matches = helper.matchingPullRequests(
    [{ number: 1, title: 'editorial: weekly-csa-2026-08-31 packet' }],
    'weekly-csa-2026-09-07'
  );
  assert.deepEqual(matches, []);
});

test('a complete packet passes validation', () => {
  const result = helper.validate({
    'repo-root': fixture('valid'),
    'packet-dir': PACKET_DIR,
    now: '2026-09-09T12:00:00Z',
  });
  assert.deepEqual(result.errors, []);
  assert.equal(result.valid, true);
  assert.equal(result.complete_article, true);
});

test('a packet without a defensible topic may omit the article and teaser', () => {
  const result = helper.validate({
    'repo-root': fixture('insufficient-evidence'),
    'packet-dir': PACKET_DIR,
    now: '2026-09-09T12:00:00Z',
  });
  assert.deepEqual(result.errors, []);
  assert.equal(result.complete_article, false);
});

test('unverifiable evidence fails validation', () => {
  const result = helper.validate({
    'repo-root': fixture('invalid-evidence'),
    'packet-dir': PACKET_DIR,
    now: '2026-09-09T12:00:00Z',
  });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => /unknown source id/.test(error)));
  assert.ok(result.errors.some((error) => /published must use YYYY-MM-DD/.test(error)));
});

test('failed sources must be disclosed and meet minimum coverage', () => {
  const result = helper.validate({
    'repo-root': fixture('source-failure'),
    'packet-dir': PACKET_DIR,
    now: '2026-09-09T12:00:00Z',
  });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => /reachable official sources/.test(error)));
  assert.ok(result.errors.some((error) => /disclose partial source coverage/.test(error)));
});

test('validation rejects files outside the packet directory', () => {
  const result = helper.validate({
    'repo-root': fixture('valid'),
    'packet-dir': PACKET_DIR,
    now: '2026-09-09T12:00:00Z',
    'changed-files': path.join(FIXTURES, 'changed-files-outside.txt'),
  });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => /outside the editorial packet directory/.test(error)));
});

test('validation refuses a packet directory outside editorial/weekly', () => {
  assert.throws(
    () => helper.validate({ 'repo-root': fixture('valid'), 'packet-dir': 'content/posts/2026-09-07-example' }),
    /editorial\/weekly\/YYYY-MM-DD/
  );
});
