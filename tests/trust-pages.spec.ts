import { test, expect } from '@playwright/test';

test.describe('Trust and Legal Pages', () => {
  const baseURL = process.env.BASE_URL || 'http://localhost:1313';

  test('About page should be accessible and contain key information', async ({ page }) => {
    await page.goto(`${baseURL}/about/`);

    // Verify page loads successfully
    await expect(page).toHaveTitle(/About/);

    // Verify key content exists
    await expect(page.locator('h1, h2').filter({ hasText: /about/i }).first()).toBeVisible();
    await expect(page.locator('#main').getByText(/Sujith Quintelier/i).first()).toBeVisible();
    await expect(page.getByText(/quintelier\.dev/i).first()).toBeVisible();

    // Verify external links exist
    const linkedInLink = page.getByRole('link', { name: /linkedin/i });
    const githubLink = page.getByRole('link', { name: /github/i });

    await expect(linkedInLink.first()).toBeVisible();
    await expect(githubLink.first()).toBeVisible();

    // Verify links to other trust pages
    await expect(page.getByRole('link', { name: /contact/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /privacy/i }).first()).toBeVisible();
  });

  test('Contact page should be accessible and contain contact information', async ({ page }) => {
    await page.goto(`${baseURL}/contact/`);

    // Verify page loads successfully
    await expect(page).toHaveTitle(/Contact/);

    // Verify key content exists
    await expect(page.locator('h1, h2').filter({ hasText: /contact/i }).first()).toBeVisible();
    await expect(page.getByText(/sujith\.quintelier@gmail\.com/i).first()).toBeVisible();

    // Verify email link exists
    const emailLink = page.getByRole('link', { name: /sujith\.quintelier@gmail\.com/i });
    await expect(emailLink.first()).toBeVisible();
    await expect(emailLink.first()).toHaveAttribute('href', /mailto:/);

    // Verify security notice exists
    await expect(page.getByText(/security/i).first()).toBeVisible();

    // Verify links to other trust pages
    await expect(page.getByRole('link', { name: /about/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /privacy/i }).first()).toBeVisible();
  });

  test('Cookies page should be accessible and contain cookie policy', async ({ page }) => {
    await page.goto(`${baseURL}/cookies/`);

    // Verify page loads successfully
    await expect(page).toHaveTitle(/Cookies/);

    // Verify key content exists
    await expect(page.locator('h1, h2').filter({ hasText: /cookies/i }).first()).toBeVisible();

    // Verify mentions of key cookie categories in main content
    await expect(page.locator('#main').getByText(/Microsoft Clarity/i).first()).toBeVisible();
    await expect(page.locator('#main').getByText(/consent/i).first()).toBeVisible();

    // Verify links to Privacy Policy
    const privacyLinks = page.getByRole('link', { name: /privacy/i });
    await expect(privacyLinks.first()).toBeVisible();
  });

  test('Privacy page should be accessible and updated with cross-links', async ({ page }) => {
    await page.goto(`${baseURL}/privacy/`);

    // Verify page loads successfully
    await expect(page).toHaveTitle(/Privacy/);

    // Verify key content exists
    await expect(page.locator('h1, h2').filter({ hasText: /privacy/i }).first()).toBeVisible();
    await expect(page.locator('#main').getByText(/Sujith Quintelier/i).first()).toBeVisible();

    // Verify cross-links to new trust pages
    await expect(page.getByRole('link', { name: /contact/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /cookies/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /about/i }).first()).toBeVisible();
  });

  test('Trust pages should be in navigation menu', async ({ page }) => {
    await page.goto(baseURL);

    // Verify main navigation contains About and Contact
    const nav = page.locator('nav, .navbar, [role="navigation"]').first();

    await expect(nav.getByRole('link', { name: /about/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /contact/i })).toBeVisible();
  });

  test('Legal pages should be in footer', async ({ page }) => {
    await page.goto(baseURL);

    // Verify footer contains legal links
    const footer = page.locator('footer, .footer, .copyright').first();

    // These links should be visible in the footer
    await expect(footer.getByRole('link', { name: /privacy/i })).toBeVisible();
    await expect(footer.getByRole('link', { name: /cookies/i })).toBeVisible();
    await expect(footer.getByRole('link', { name: /contact/i })).toBeVisible();
  });

  test('All trust pages should have proper meta tags', async ({ page }) => {
    const pages = [
      { url: '/about/', titleMatch: /about/i },
      { url: '/contact/', titleMatch: /contact/i },
      { url: '/cookies/', titleMatch: /cookies/i },
      { url: '/privacy/', titleMatch: /privacy/i }
    ];

    for (const { url, titleMatch } of pages) {
      await page.goto(`${baseURL}${url}`);

      // Verify title
      await expect(page).toHaveTitle(titleMatch);

      // Verify description meta tag exists
      const description = await page.locator('meta[name="description"]').getAttribute('content');
      expect(description).toBeTruthy();
      expect(description.length).toBeGreaterThan(50);

      // Verify canonical link exists
      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveAttribute('href', new RegExp(url));
    }
  });

  test('Trust pages should be crawlable (not noindex)', async ({ page }) => {
    const pages = ['/about/', '/contact/', '/cookies/', '/privacy/'];

    for (const url of pages) {
      await page.goto(`${baseURL}${url}`);

      // Check robots meta tag - should either not exist or not contain 'noindex'
      const robotsMeta = page.locator('meta[name="robots"]');
      const robotsCount = await robotsMeta.count();

      if (robotsCount > 0) {
        const content = await robotsMeta.getAttribute('content');
        // Should not contain 'noindex' (unless it's the documentation page)
        if (!url.includes('documentation')) {
          expect(content).not.toContain('noindex');
        }
      }
    }
  });

  test('Security headers meta tags should be present in production mode', async ({ page }) => {
    // This test will check if meta security headers are present
    // In production, these should be present as fallback
    await page.goto(`${baseURL}/`);

    // Check for referrer policy
    const referrerMeta = page.locator('meta[name="referrer"]');
    const referrerCount = await referrerMeta.count();

    // In production mode, this should exist
    // In development, it might not be present
    if (process.env.HUGO_ENV === 'production') {
      expect(referrerCount).toBeGreaterThan(0);
    }
  });
});
