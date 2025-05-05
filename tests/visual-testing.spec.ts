import { test, expect } from '@playwright/test'

const paths = ['/', '/resume']

test.describe.configure({ mode: 'parallel' })

for (const path of paths) {
  test(path, async ({ page }) => {
    await page.goto(path, { waitUntil: 'networkidle' })

    // Scroll to bottom to trigger lazy-loading
    await page.evaluate(async () => {
      // Scroll down to the bottom
      await new Promise<void>((resolve) => {
        let totalHeight = 0
        const distance = 200
        const timer = setInterval(() => {
          window.scrollBy(0, distance)
          totalHeight += distance

          if (totalHeight >= document.body.scrollHeight) {
            clearInterval(timer)
            resolve()
          }
        }, 50)
      })
    })

    // // Ensure all images and lazy-loaded content are fully loaded
    // await page.evaluate(async () => {
    //   const images = Array.from(document.images);
    //   console.log('images', images);
    //   await Promise.all(
    //     images.map((img) =>
    //       img.complete
    //         ? Promise.resolve()
    //         : new Promise((resolve) => {
    //             img.onload = resolve;
    //             img.onerror = resolve;
    //           })
    //     )
    //   );
    // });

    // Scroll back to the top
    await page.evaluate(() => window.scrollTo(0, 0));

    // Wait for any additional animations or content to load
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot({
      fullPage: true,
      mask: await page.getByRole('img').all(),
    })
  })
}
