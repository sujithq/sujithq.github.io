import { test, expect } from '@playwright/test'

test.describe('Trust and Legal Pages', () => {
  test.describe.configure({ mode: 'parallel' })

  const trustRoutes = [
    { path: '/about/', title: 'About' },
    { path: '/contact/', title: 'Contact' },
    { path: '/privacy/', title: 'Privacy Policy' },
    { path: '/cookies/', title: 'Cookies' },
  ]

  for (const route of trustRoutes) {
    test(`${route.path} renders and contains title`, async ({ page }) => {
      await test.step(`Navigate to ${route.path}`, async () => {
        const response = await page.goto(route.path)
        expect(response?.status()).toBeLessThan(400)
      })

      await test.step('Verify page title is visible', async () => {
        await expect(page.getByRole('heading', { name: route.title, level: 1 })).toBeVisible()
      })
    })
  }

  test('footer contains Privacy Policy link', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('footer').getByRole('link', { name: 'Privacy Policy' })).toBeVisible()
  })

  test('footer contains Cookies link', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('footer').getByRole('link', { name: 'Cookies' })).toBeVisible()
  })

  test('navigation contains About link', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('header').getByRole('link', { name: 'About' })).toBeVisible()
  })

  test('navigation contains Contact link', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('header').getByRole('link', { name: 'Contact' })).toBeVisible()
  })
})
