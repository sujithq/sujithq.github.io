import { test, expect } from '@playwright/test'

import matter from 'gray-matter'
import * as fs from 'node:fs'
import { globSync } from 'glob'
import path from 'node:path'

let files = globSync(['content/posts/**/*.md'])

let paths = files.flatMap(file => {
  // Read the frontmatter from the file
  let frontmatter = matter(fs.readFileSync(file, 'utf8'));

  // Determine the slug based on the file structure
  let slug = '';
  if (path.basename(file) === 'index.md') {

    const folder = path.dirname(file).slice("content/posts/".length);

    // Remove leading date (YYYY-MM-DD-) using regex
    const slugOnly = folder.replace(/^\d{4}-\d{2}-\d{2}-/, '');

    // console.log(slugOnly);
    // Extract year, month, and slug from the directory structure
    const dirParts = path.dirname(file).slice("content/posts/".length).split('-');
    const year = dirParts[0];
    const month = dirParts[1];

    slug = `posts/${year}/${month}/${slugOnly}`;
  } else {
    slug = `posts/${path.basename(file, '.md')}`;
  }

  // Exclude drafts
  return frontmatter.data.draft ? [] : [slug];
});

// Add default taxonomy list pages (tags, categories, series)
const taxonomies = ['tags', 'categories', 'series']
paths.push(...taxonomies) // Include `/tags`, `/categories`, `/series` as paths

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
