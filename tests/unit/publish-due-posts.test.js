'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { parsePostDate } = require('../../scripts/publish-due-posts.js');

test('post dates with Brussels summer and winter offsets parse to the correct instant', () => {
  assert.equal(parsePostDate('2026-07-16 09:00:00+02:00'), Date.parse('2026-07-16T07:00:00Z'));
  assert.equal(parsePostDate('2026-12-16 09:00:00+01:00'), Date.parse('2026-12-16T08:00:00Z'));
});

test('UTC dates remain supported and dates without an explicit offset are rejected', () => {
  assert.equal(parsePostDate('2026-07-16 07:00:00Z'), Date.parse('2026-07-16T07:00:00Z'));
  assert.ok(Number.isNaN(parsePostDate('2026-07-16 09:00:00')));
});
