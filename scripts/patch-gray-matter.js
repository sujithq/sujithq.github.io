'use strict';
// Patches gray-matter's engines.js to use js-yaml v4 API (load/dump)
// instead of the removed v3 API (safeLoad/safeDump).
// Run automatically via postinstall.

const fs = require('fs');
const path = require('path');

const enginesPath = path.join(__dirname, '..', 'node_modules', 'gray-matter', 'lib', 'engines.js');

if (!fs.existsSync(enginesPath)) {
  console.log('[patch-gray-matter] engines.js not found, skipping patch.');
  process.exit(0);
}

let src = fs.readFileSync(enginesPath, 'utf8');

if (src.includes('yaml.load.bind(yaml)')) {
  console.log('[patch-gray-matter] Already patched, skipping.');
  process.exit(0);
}

src = src
  .replace('yaml.safeLoad.bind(yaml)', 'yaml.load.bind(yaml)')
  .replace('yaml.safeDump.bind(yaml)', 'yaml.dump.bind(yaml)');

fs.writeFileSync(enginesPath, src, 'utf8');
console.log('[patch-gray-matter] Patched gray-matter engines.js for js-yaml v4 compatibility.');
