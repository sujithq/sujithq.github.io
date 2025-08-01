import { test, expect } from '@playwright/test'

test.describe('CIDR Calculator Tool', () => {
  test('should calculate CIDR and display results', async ({ page }) => {
    await test.step('Navigate to CIDR Calculator', async () => {
      await page.goto('/tools/cidr-calculator/')

      // Wait for the page to load
      await expect(page.getByRole('heading', { name: 'Azure-Compatible CIDR Calculator (IPv4)' })).toBeVisible()
    })

    await test.step('Enter network IP and CIDR values', async () => {
      // Fill in the network IP
      await page.getByLabel('Network IP').fill('10.0.0.0')

      // Fill in the CIDR value
      await page.getByLabel('CIDR').fill('24')
    })

    await test.step('Click calculate button', async () => {
      // Click the calculate button
      await page.getByRole('button', { name: 'Calculate' }).click()

      // Wait for results to appear
      await expect(page.locator('#output')).not.toBeEmpty()
    })

    await test.step('Verify calculation results are displayed', async () => {
      // Check that both global and Azure network information sections are present
      await expect(page.getByRole('heading', { name: 'GLOBAL NETWORK INFORMATIONS' })).toBeVisible()
      await expect(page.getByRole('heading', { name: 'AZURE NETWORK INFORMATIONS' })).toBeVisible()

      // Verify the output div contains the results
      const output = page.locator('#output')
      await expect(output).toBeVisible()

      // Use more specific assertions that are less likely to have strict mode violations
      // Check for the CIDR notation in the global table
      await expect(output).toContainText('10.0.0.0/24')
      await expect(output).toContainText('10.0.0.255')
      await expect(output).toContainText('256')
      await expect(output).toContainText('254')
      await expect(output).toContainText('251')

      // Azure-specific values
      await expect(output).toContainText('10.0.0.4')
      await expect(output).toContainText('10.0.0.254')

      // Reserved IPs
      await expect(output).toContainText('10.0.0.1')
      await expect(output).toContainText('10.0.0.2')
      await expect(output).toContainText('10.0.0.3')
    })

    await test.step('Take screenshot of results', async () => {
      // Take a screenshot of the full page with results
      await expect(page).toHaveScreenshot('cidr-calculator-results.png', {
        fullPage: true,
        // Mask GitAds banner and any dynamic content
        mask: [
          page.locator('img[alt="Sponsored by GitAds"]'),
          page.locator('a[href*="gitads.dev"]')
        ],
      })
    })
  })

  test('should show error for invalid input', async ({ page }) => {
    await test.step('Navigate to CIDR Calculator', async () => {
      await page.goto('/tools/cidr-calculator/')
    })

    await test.step('Enter invalid values', async () => {
      // Fill in invalid network IP
      await page.getByLabel('Network IP').fill('invalid.ip')

      // Fill in invalid CIDR value
      await page.getByLabel('CIDR').fill('99')
    })

    await test.step('Click calculate and verify error', async () => {
      // Click the calculate button
      await page.getByRole('button', { name: 'Calculate' }).click()

      // Verify error message appears
      await expect(page.locator('#alertBox')).toBeVisible()
      await expect(page.getByText('Please enter a valid IPv4 address and CIDR prefix (0–32).')).toBeVisible()
    })
  })
})
