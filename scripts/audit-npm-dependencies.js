'use strict';

const { spawnSync } = require('node:child_process');

const UNPATCHED_ADVISORIES = new Map([
  ['braces', new Set(['https://github.com/advisories/GHSA-vfj7-8cjw-p6xm'])],
]);

function hasUnacceptedAdvisory(name, vulnerabilities, visited = new Set()) {
  if (visited.has(name)) return false;
  visited.add(name);

  const vulnerability = vulnerabilities[name];
  if (!vulnerability) return true;

  return vulnerability.via.some((advisory) => {
    if (typeof advisory === 'string') {
      return hasUnacceptedAdvisory(advisory, vulnerabilities, visited);
    }

    return !UNPATCHED_ADVISORIES.get(name)?.has(advisory.url);
  });
}

function getBlockingVulnerabilities(vulnerabilities) {
  return Object.keys(vulnerabilities)
    .filter((name) => hasUnacceptedAdvisory(name, vulnerabilities));
}

function auditDependencies() {
  const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const result = spawnSync(npmCommand, ['audit', '--audit-level=low', '--json'], {
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
  });

  if (result.error) {
    console.error(result.error.message);
    process.exitCode = 1;
    return;
  }

  let report;
  try {
    report = JSON.parse(result.stdout);
  } catch {
    process.stderr.write(result.stderr);
    process.stderr.write(result.stdout);
    process.exitCode = result.status || 1;
    return;
  }

  const vulnerabilities = report.vulnerabilities || {};
  const hasFindings = Object.keys(vulnerabilities).length > 0;
  if (report.error || (result.status !== 0 && !(result.status === 1 && hasFindings))) {
    process.stderr.write(result.stderr);
    console.error(report.error?.summary || 'npm audit did not complete successfully');
    process.exitCode = 1;
    return;
  }

  const blocking = getBlockingVulnerabilities(vulnerabilities);

  if (blocking.length > 0) {
    console.error(`npm audit found unaccepted vulnerabilities: ${blocking.join(', ')}`);
    process.exitCode = 1;
    return;
  }

  if (Object.keys(vulnerabilities).length > 0) {
    console.log(
      'npm audit found only GHSA-vfj7-8cjw-p6xm in braces; no patched release is available, ' +
        'and PurgeCSS uses a repository-controlled glob.'
    );
  }
}

if (require.main === module) {
  auditDependencies();
}

module.exports = { getBlockingVulnerabilities };
