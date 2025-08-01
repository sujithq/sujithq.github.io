import { test, expect } from '@playwright/test'

test.describe('GitAds Banner', () => {
  test('should not be present during tests', async ({ page }) => {
    await test.step('Visit a post page', async () => {
      await page.goto('/posts/2025/01/retrieve-stale-branches-github-organization/')
    })

    await test.step('Verify GitAds banner is not present', async () => {
      // Check that GitAds banner is not rendered
      const gitadsLinks = page.locator('a[href*="gitads.dev"]')
      await expect(gitadsLinks).toHaveCount(0)

      // Also check for the specific image
      const gitadsImages = page.locator('img[alt="Sponsored by GitAds"]')
      await expect(gitadsImages).toHaveCount(0)
    })
  })
})
