import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const lockfile = JSON.parse(readFileSync('package-lock.json', 'utf8'));
const sanitizerVersion = lockfile.packages['node_modules/dompurify'].version;

for (const viewport of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
  test.describe(`Dependency Assets ${viewport.width}px`, () => {
    test.use({ viewport });

    test('Mermaid renders with the locked sanitizer and local D3', async ({ page, request }) => {
      await test.step('Render the existing article diagrams', async () => {
        const response = await page.goto('/posts/2025/09/when-to-use-github-models-azure-ai-foundry-openai/');
        expect(response?.status()).toBe(200);
        await expect(page.locator('.mermaid[data-processed="true"] svg')).toHaveCount(2);
        await expect(page.locator('.mermaid svg').first()).toHaveAttribute('viewBox', /\d/);
      });

      await test.step('Verify the fingerprinted bundle uses the locked sanitizer', async () => {
        const loader = page.locator('script[data-mermaid-src]');
        await expect(loader).toHaveAttribute('data-mermaid-integrity', /^sha256-/);
        const bundlePath = await loader.getAttribute('data-mermaid-src');
        expect(bundlePath).toMatch(/^\/js\/mermaid\.min\.[a-f0-9]+\.js$/);
        const response = await request.get(bundlePath!);
        expect(response.ok()).toBe(true);
        expect(await response.text()).toContain(`version="${sanitizerVersion}"`);
      });

      await test.step('Verify D3 is served locally with integrity protection', async () => {
        const script = page.locator('script[src*="/vendor/d3/"]');
        await expect(script).toHaveAttribute('src', /^\/vendor\/d3\//);
        await expect(script).toHaveAttribute('integrity', /^sha256-/);
      });
    });
  });
}