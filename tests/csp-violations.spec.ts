import { test, expect } from '@playwright/test'

const toolPages = [
  '/tools/cert-renewal/',
  '/tools/cidr-calculator/',
  '/tools/tech-radar/',
]

test.describe('Tool Pages CSP Smoke', () => {
  for (const toolPage of toolPages) {
    test(`${toolPage} has no console CSP violations`, async ({ page }) => {
      const cspMessages: string[] = []

      page.on('console', (message) => {
        const text = message.text()
        if (/Content Security Policy|violates the following Content Security Policy directive|Refused to .* because it violates/i.test(text)) {
          cspMessages.push(`[${message.type()}] ${text}`)
        }
      })

      await page.goto(toolPage)
      await expect(page.locator('body')).toBeAttached()

      expect(cspMessages).toEqual([])
    })
  }
})
