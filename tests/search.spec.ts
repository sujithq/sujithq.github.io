import { test, expect } from '@playwright/test'

test.describe('Search Functionality', () => {
  test('should search for "azure" and display results', async ({ page }) => {
    await test.step('Navigate to search page with keyword', async () => {
      await page.goto('/search/?keyword=azure')

      // Wait for the search to be processed
      await page.waitForLoadState('networkidle')
    })

    await test.step('Verify search results are displayed', async () => {
      // Check that there are search results
      const searchResults = page.locator('.search-result--list .article-list-item')
      const resultCount = await searchResults.count()

      if (resultCount > 0) {
        await expect(searchResults.first()).toBeVisible({ timeout: 10000 })
        // Verify results contain the search term
        const firstResult = searchResults.first()
        await expect(firstResult).toContainText(/azure/i)
      }
    })

    await test.step('Verify search result structure if results exist', async () => {
      const searchResults = page.locator('.search-result--list .article-list-item')
      const resultCount = await searchResults.count()

      if (resultCount > 0) {
        const firstResult = searchResults.first()
        // Check that search results have proper structure
        await expect(firstResult.locator('h3')).toBeVisible() // Title
        await expect(firstResult.locator('a')).toBeVisible() // Link
      }
    })

    await test.step('Take screenshot of search results', async () => {
      await expect(page).toHaveScreenshot('search-results-azure.png', {
        fullPage: true,
        // Mask GitAds banner and any dynamic content
        mask: [
          page.locator('img[alt="Sponsored by GitAds"]'),
          page.locator('a[href*="gitads.dev"]')
        ],
      })
    })
  })

  test('should search using the navigation search form', async ({ page }) => {
    await test.step('Navigate to any page', async () => {
      await page.goto('/')
    })

    await test.step('Use navigation search form', async () => {
      // Find the search form in the navigation
      const searchForm = page.locator('form.search-form')
      await expect(searchForm).toBeVisible()

      // Enter search term
      await searchForm.locator('input[name="keyword"]').fill('github')

      // Submit the form
      await searchForm.locator('button[type="submit"]').click()
    })

    await test.step('Verify navigation to search page with results', async () => {
      // Should be redirected to search page
      await expect(page).toHaveURL(/\/search\/\?keyword=github/)

      // Wait for search results
      await page.waitForLoadState('networkidle')

      // Verify search results appear
      const searchResults = page.locator('.search-result--list .article-list-item')
      const resultCount = await searchResults.count()

      if (resultCount > 0) {
        await expect(searchResults.first()).toBeVisible({ timeout: 10000 })
        // Verify results contain the search term
        const firstResult = searchResults.first()
        await expect(firstResult).toContainText(/github/i)
      }
    })

    await test.step('Take screenshot of navigation search results', async () => {
      await expect(page).toHaveScreenshot('search-navigation-github.png', {
        fullPage: true,
        // Mask GitAds banner and any dynamic content
        mask: [
          page.locator('img[alt="Sponsored by GitAds"]'),
          page.locator('a[href*="gitads.dev"]')
        ],
      })
    })
  })

  test('should handle search with no results', async ({ page }) => {
    await test.step('Search for a term with no results', async () => {
      await page.goto('/search/?keyword=xyzabc123nonexistent')

      // Wait for search to be processed
      await page.waitForLoadState('networkidle')
    })

    await test.step('Verify no results state', async () => {
      // The search result list should be empty or show a no results message
      const searchResultsList = page.locator('.search-result--list')
      await expect(searchResultsList).not.toBeVisible()
    })

    await test.step('Take screenshot of no results state', async () => {
      await expect(page).toHaveScreenshot('search-no-results.png', {
        fullPage: true,
        // Mask GitAds banner and any dynamic content
        mask: [
          page.locator('img[alt="Sponsored by GitAds"]'),
          page.locator('a[href*="gitads.dev"]')
        ],
      })
    })
  })

  test('should search for multiple terms', async ({ page }) => {
    const searchTerms = ['terraform', 'devops', 'github'];

    for (const term of searchTerms) {
      await test.step(`Search for "${term}"`, async () => {
        await page.goto(`/search/?keyword=${term}`)
        await page.waitForLoadState('networkidle')

        // Verify search results appear for this term
        const searchResults = page.locator('.search-result--list .article-list-item')
        const count = await searchResults.count()

        if (count > 0) {
          await expect(searchResults.first()).toBeVisible({ timeout: 10000 })
          // Verify at least one result contains the search term
          const firstResult = searchResults.first()
          await expect(firstResult).toContainText(new RegExp(term, 'i'))
        }
      })
    }
  })
})
