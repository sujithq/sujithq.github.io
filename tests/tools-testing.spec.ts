import { test, expect } from '@playwright/test'

import matter from 'gray-matter'
import * as fs from 'node:fs'
import { globSync } from 'glob'
import path from 'node:path'

let files = globSync(['content/tools/**/*.md'])

let paths = files.flatMap(file => {
  // Read the frontmatter from the file
  let frontmatter = matter(fs.readFileSync(file, 'utf8'));

  // Determine the slug based on the file structure
  let slug = '';
  if (path.basename(file) === '_index.md') {
    const folder = path.dirname(file).slice("content/tools/".length);

    slug = `tools/${folder}`;
  } else {
    slug = `tools/${path.basename(file, '.md')}`;
  }

  // Exclude drafts
  return frontmatter.data.draft ? [] : [slug];
});


test.describe.configure({ mode: 'parallel' })

for (const path of paths) {
  test(path, async ({ page }) => {
    await page.goto(path)

    await expect(page).toHaveScreenshot({
      fullPage: true,
      // Apply mask over all images.
      // Some images, like GIFs, can change between snapshots
      // and lead to flaky tests.
      mask: await page.getByRole('img').all(),
    })
  })
}
