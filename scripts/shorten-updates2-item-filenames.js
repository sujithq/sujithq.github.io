import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const ITEMS_DIR = 'content/updates2/items';
const MAX_FILENAME_SLUG_LENGTH = 90;
const DATE_PREFIX_REGEX = /^(\d{4}-\d{2}-\d{2})-(.+)$/;

function toFilenameSlug(slug) {
  if (!slug || slug.length <= MAX_FILENAME_SLUG_LENGTH) {
    return slug;
  }

  const hash = crypto.createHash('sha1').update(slug).digest('hex').slice(0, 8);
  const truncatedLength = MAX_FILENAME_SLUG_LENGTH - hash.length - 1;
  const truncated = slug.slice(0, Math.max(1, truncatedLength)).replace(/-+$/g, '');

  return `${truncated}-${hash}`;
}

function buildRenamedFile(fileName) {
  if (!fileName.toLowerCase().endsWith('.md') || fileName === '_index.md') {
    return null;
  }

  const baseName = fileName.slice(0, -3);
  const match = DATE_PREFIX_REGEX.exec(baseName);
  if (!match) {
    return null;
  }

  const [, datePrefix, slug] = match;
  const nextSlug = toFilenameSlug(slug);
  if (nextSlug === slug) {
    return null;
  }

  return `${datePrefix}-${nextSlug}.md`;
}

function renameOverlongFiles({ dryRun }) {
  if (!fs.existsSync(ITEMS_DIR)) {
    throw new Error(`Directory not found: ${ITEMS_DIR}`);
  }

  const files = fs.readdirSync(ITEMS_DIR).filter((name) => name.endsWith('.md'));
  let changed = 0;
  let skipped = 0;

  for (const fileName of files) {
    const renamedFile = buildRenamedFile(fileName);
    if (!renamedFile) {
      skipped += 1;
      continue;
    }

    const sourcePath = path.join(ITEMS_DIR, fileName);
    const targetPath = path.join(ITEMS_DIR, renamedFile);

    if (fs.existsSync(targetPath)) {
      const sourceBase = fileName.slice(0, -3);
      const collisionHash = crypto.createHash('sha1').update(sourceBase).digest('hex').slice(0, 6);
      const collisionSafe = renamedFile.replace(/\.md$/i, `-${collisionHash}.md`);
      const collisionSafePath = path.join(ITEMS_DIR, collisionSafe);

      if (fs.existsSync(collisionSafePath)) {
        throw new Error(`Unable to resolve filename collision for ${fileName}`);
      }

      if (!dryRun) {
        fs.renameSync(sourcePath, collisionSafePath);
      }
      changed += 1;
      console.log(`${dryRun ? '[dry-run] ' : ''}${fileName} -> ${collisionSafe}`);
      continue;
    }

    if (!dryRun) {
      fs.renameSync(sourcePath, targetPath);
    }
    changed += 1;
    console.log(`${dryRun ? '[dry-run] ' : ''}${fileName} -> ${renamedFile}`);
  }

  console.log(`Done. Renamed ${changed} file(s), skipped ${skipped} file(s).`);
}

const dryRun = process.argv.includes('--dry-run');
renameOverlongFiles({ dryRun });
