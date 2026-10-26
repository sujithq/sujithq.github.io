'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { getBlockingVulnerabilities } = require('../../scripts/audit-npm-dependencies.js');

const unpatchedBracesAdvisory = {
  url: 'https://github.com/advisories/GHSA-vfj7-8cjw-p6xm',
};

test('allows only the unpatched braces advisory and its dependency chain', () => {
  const vulnerabilities = {
    '@fullhuman/postcss-purgecss': { via: ['purgecss'] },
    purgecss: { via: ['fast-glob'] },
    'fast-glob': { via: ['micromatch'] },
    micromatch: { via: ['braces'] },
    braces: { via: [unpatchedBracesAdvisory] },
  };

  assert.deepEqual(getBlockingVulnerabilities(vulnerabilities), []);
});

test('continues to block other advisories', () => {
  const vulnerabilities = {
    braces: { via: [unpatchedBracesAdvisory] },
    dompurify: {
      via: [{ url: 'https://github.com/advisories/GHSA-other-advisory' }],
    },
  };

  assert.deepEqual(getBlockingVulnerabilities(vulnerabilities), ['dompurify']);
});

test('does not allow the braces advisory when reported against another package', () => {
  const vulnerabilities = {
    micromatch: { via: [unpatchedBracesAdvisory] },
  };

  assert.deepEqual(getBlockingVulnerabilities(vulnerabilities), ['micromatch']);
});
