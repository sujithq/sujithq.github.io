import { test, expect } from '@playwright/test'

test.describe('Tool Pages CSP Regression', () => {
  test('Certification renewal renders data rows', async ({ page }) => {
    await test.step('Open certification renewal page', async () => {
      await page.goto('/tools/cert-renewal/')
      await expect(page).toHaveURL(/\/tools\/cert-renewal\/?$/)
    })

    await test.step('Ensure certification data rows are rendered', async () => {
      const rowCount = page.locator('#cert-tbody tr')
      await expect.poll(async () => rowCount.count()).toBeGreaterThan(0)
      await expect(rowCount.first()).toContainText(/(AI-102|AZ-104|AZ-305|GH-200)/)
    })

    await test.step('Ensure page does not include inline script blocks', async () => {
      const inlineScripts = page.locator('script:not([src])')
      await expect(inlineScripts).toHaveCount(0)
    })
  })

  test('CIDR calculator still computes expected values', async ({ page }) => {
    await test.step('Open CIDR calculator page', async () => {
      await page.goto('/tools/cidr-calculator/')
      await expect(page).toHaveURL(/\/tools\/cidr-calculator\/?$/)
    })

    await test.step('Calculate and verify key values', async () => {
      await page.getByLabel('Network IP').fill('10.0.0.0')
      await page.getByLabel('CIDR').fill('24')
      await page.getByRole('button', { name: 'Calculate' }).click()

      const output = page.locator('#output')
      await expect(output).toContainText('10.0.0.0/24')
      await expect(output).toContainText('10.0.0.255')
      await expect(output).toContainText('10.0.0.4')
      await expect(output).toContainText('10.0.0.254')
    })

    await test.step('Ensure page does not include inline script blocks', async () => {
      const inlineScripts = page.locator('script:not([src])')
      await expect(inlineScripts).toHaveCount(0)
    })
  })

  test('Tech radar renders circles from external data', async ({ page }) => {
    await test.step('Open tech radar page', async () => {
      await page.goto('/tools/tech-radar/')
      await expect(page).toHaveURL(/\/tools\/tech-radar\/?$/)
    })

    await test.step('Ensure radar visualisation is rendered', async () => {
      await expect.poll(async () => page.locator('#radar circle').count()).toBeGreaterThan(0)
      await expect(page.locator('#radar text').first()).toContainText(/.+/)
    })

    await test.step('Ensure page does not include inline script blocks', async () => {
      const inlineScripts = page.locator('script:not([src])')
      await expect(inlineScripts).toHaveCount(0)
    })
  })
})
