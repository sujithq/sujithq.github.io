import { test, expect } from '@playwright/test'

test.describe('UBB Simulator Tool', () => {
  test('runs single request and shows a decision trail', async ({ page }) => {
    await test.step('Open UBB simulator page', async () => {
      await page.goto('/tools/ubb/')
      await expect(page).toHaveURL(/\/tools\/ubb\/?$/)
      await expect(page.getByRole('heading', { name: 'Interactive AI Credits Flow' })).toBeVisible()
    })

    await test.step('Run single request simulation', async () => {
      await page.getByRole('button', { name: 'Run' }).click()
      await expect(page.locator('#ubb-log')).toContainText('Single request')
      await expect(page.locator('#ubb-node-result-detail')).toContainText(/Free pool usage|Paid usage allowed|Request blocked/)
    })
  })

  test('supports agentic mode execution', async ({ page }) => {
    await test.step('Switch to agentic mode', async () => {
      await page.goto('/tools/ubb/')
      await page.getByRole('button', { name: 'Agentic workflow' }).click()
      await expect(page.locator('#ubb-agentic-panel')).not.toHaveClass(/d-none/)
    })

    await test.step('Run agentic scenario and verify log output', async () => {
      await page.getByRole('button', { name: 'Run' }).click()
      await expect(page.locator('#ubb-log')).toContainText('Agentic workflow started')
    })
  })
})
