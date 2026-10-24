'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const lockfile = require('../../package-lock.json');

for (const [name, minimum] of [
  ['brace-expansion', '5.0.12'],
  ['dompurify', '3.4.16'],
]) {
  test(`all locked ${name} copies include the security fixes in ${minimum}`, () => {
    const entries = Object.entries(lockfile.packages)
      .filter(([location]) => location.endsWith(`/node_modules/${name}`) || location === `node_modules/${name}`);

    assert.ok(entries.length > 0, `${name} must be present in the lockfile`);
    const required = minimum.split('.').map(Number);

    for (const [location, { version }] of entries) {
      assert.match(version, /^\d+\.\d+\.\d+$/, `${location} must use a stable release`);
      const actual = version.split('.').map(Number);
      const difference = actual.findIndex((part, index) => part !== required[index]);
      assert.ok(
        difference === -1 || actual[difference] > required[difference],
        `${location}@${version} must be at least ${minimum}`,
      );
    }
  });
}
