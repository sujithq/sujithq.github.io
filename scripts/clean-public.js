const fs = require('node:fs');
const path = require('node:path');

const publicDir = path.resolve(__dirname, '..', 'public');

try {
  if (!fs.existsSync(publicDir)) {
    console.log(`No public directory found at ${publicDir}, skipping clean.`);
    process.exit(0);
  }

  fs.rmSync(publicDir, {
    recursive: true,
    force: true,
    maxRetries: 8,
    retryDelay: 250,
  });
  fs.mkdirSync(publicDir, { recursive: true });
  console.log(`Cleaned ${publicDir}`);
} catch (error) {
  console.warn(
    `Could not fully clean ${publicDir} due to a lock (${error.code ?? 'unknown'}). Continuing build.`
  );
  fs.mkdirSync(publicDir, { recursive: true });
  process.exit(0);
}
