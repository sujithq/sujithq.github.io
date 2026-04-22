import { test, expect } from '@playwright/test'

test.describe('Trust and Legal Pages', () => {
  test('About page should be accessible and contain key information', async ({ page }) => {
    await test.step('Navigate to About page', async () => {
      await page.goto('/about/')
    })

    await test.step('Verify page title', async () => {
      await expect(page).toHaveTitle(/About/)
    })

    await test.step('Verify key content exists', async () => {
      await expect(page.locator('h1, h2').filter({ hasText: /about/i }).first()).toBeVisible()
      await expect(page.locator('#main').getByText(/Sujith Quintelier/i).first()).toBeVisible()
      await expect(page.getByText(/quintelier\.dev/i).first()).toBeVisible()
    })

    await test.step('Verify external identity links', async () => {
      await expect(page.getByRole('link', { name: /linkedin/i }).first()).toBeVisible()
      await expect(page.getByRole('link', { name: /github/i }).first()).toBeVisible()
    })

    await test.step('Verify links to other trust pages', async () => {
      await expect(page.getByRole('link', { name: /contact/i }).first()).toBeVisible()
      await expect(page.getByRole('link', { name: /privacy/i }).first()).toBeVisible()
    })
  })

  test('Contact page should be accessible and contain contact information', async ({ page }) => {
    await test.step('Navigate to Contact page', async () => {
      await page.goto('/contact/')
    })

    await test.step('Verify page title', async () => {
      await expect(page).toHaveTitle(/Contact/)
    })

    await test.step('Verify key content exists', async () => {
      await expect(page.locator('h1, h2').filter({ hasText: /contact/i }).first()).toBeVisible()
      await expect(page.getByText(/sujith\.quintelier@gmail\.com/i).first()).toBeVisible()
    })

    await test.step('Verify email link', async () => {
      const emailLink = page.getByRole('link', { name: /sujith\.quintelier@gmail\.com/i })
      await expect(emailLink.first()).toBeVisible()
      await expect(emailLink.first()).toHaveAttribute('href', /mailto:/)
    })

    await test.step('Verify security notice and trust page links', async () => {
      await expect(page.getByText(/security/i).first()).toBeVisible()
      await expect(page.getByRole('link', { name: /about/i }).first()).toBeVisible()
      await expect(page.getByRole('link', { name: /privacy/i }).first()).toBeVisible()
    })
  })

  test('Cookies page should be accessible and contain cookie policy', async ({ page }) => {
    await test.step('Navigate to Cookies page', async () => {
      await page.goto('/cookies/')
    })

    await test.step('Verify page title', async () => {
      await expect(page).toHaveTitle(/Cookies/)
    })

    await test.step('Verify key content exists', async () => {
      await expect(page.locator('h1, h2').filter({ hasText: /cookies/i }).first()).toBeVisible()
      await expect(page.locator('#main').getByText(/Microsoft Clarity/i).first()).toBeVisible()
      await expect(page.locator('#main').getByText(/consent/i).first()).toBeVisible()
    })

    await test.step('Verify link to Privacy Policy', async () => {
      await expect(page.getByRole('link', { name: /privacy/i }).first()).toBeVisible()
    })
  })

  test('Privacy page should be accessible and updated with cross-links', async ({ page }) => {
    await test.step('Navigate to Privacy page', async () => {
      await page.goto('/privacy/')
    })

    await test.step('Verify page title', async () => {
      await expect(page).toHaveTitle(/Privacy/)
    })

    await test.step('Verify key content exists', async () => {
      await expect(page.locator('h1, h2').filter({ hasText: /privacy/i }).first()).toBeVisible()
      await expect(page.locator('#main').getByText(/Sujith Quintelier/i).first()).toBeVisible()
    })

    await test.step('Verify cross-links to trust pages', async () => {
      await expect(page.getByRole('link', { name: /contact/i }).first()).toBeVisible()
      await expect(page.getByRole('link', { name: /cookies/i }).first()).toBeVisible()
      await expect(page.getByRole('link', { name: /about/i }).first()).toBeVisible()
    })
  })

  test('Trust pages should be in navigation menu', async ({ page }) => {
    await test.step('Navigate to home page', async () => {
      await page.goto('/')
    })

    await test.step('Verify About and Contact in main navigation', async () => {
      const nav = page.locator('nav, .navbar, [role="navigation"]').first()
      await expect(nav.getByRole('link', { name: /about/i })).toBeVisible()
      await expect(nav.getByRole('link', { name: /contact/i })).toBeVisible()
    })
  })

  test('Legal pages should be in footer', async ({ page }) => {
    await test.step('Navigate to home page', async () => {
      await page.goto('/')
    })

    await test.step('Verify legal links in footer', async () => {
      const footer = page.locator('footer, .footer, .copyright').first()
      await expect(footer.getByRole('link', { name: /privacy/i })).toBeVisible()
      await expect(footer.getByRole('link', { name: /cookies/i })).toBeVisible()
      await expect(footer.getByRole('link', { name: /contact/i })).toBeVisible()
    })
  })

  test('All trust pages should have proper meta tags', async ({ page }) => {
    const pages = [
      { url: '/about/', titleMatch: /about/i },
      { url: '/contact/', titleMatch: /contact/i },
      { url: '/cookies/', titleMatch: /cookies/i },
      { url: '/privacy/', titleMatch: /privacy/i }
    ]

    for (const { url, titleMatch } of pages) {
      await test.step(`Verify meta tags for ${url}`, async () => {
        await page.goto(url)

        await expect(page).toHaveTitle(titleMatch)

        const description = await page.locator('meta[name="description"]').getAttribute('content')
        expect(description).toBeTruthy()
        expect(description!.length).toBeGreaterThan(50)

        const canonical = page.locator('link[rel="canonical"]')
        await expect(canonical).toHaveAttribute('href', new RegExp(url))
      })
    }
  })

  test('Trust pages should be crawlable (not noindex)', async ({ page }) => {
    const pages = ['/about/', '/contact/', '/cookies/', '/privacy/']

    for (const url of pages) {
      await test.step(`Verify robots meta for ${url}`, async () => {
        await page.goto(url)

        const robotsMeta = page.locator('meta[name="robots"]')
        const robotsCount = await robotsMeta.count()

        if (robotsCount > 0) {
          const content = await robotsMeta.getAttribute('content')
          expect(content).not.toContain('noindex')
        }
      })
    }
  })

  test('Security meta tags should be present', async ({ page }) => {
    await test.step('Navigate to home page', async () => {
      await page.goto('/')
    })

    await test.step('Verify referrer policy meta tag is present', async () => {
      const referrerMeta = page.locator('meta[name="referrer"]')
      const referrerCount = await referrerMeta.count()
      expect(referrerCount).toBeGreaterThan(0)
    })
  })
})
