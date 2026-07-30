import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

test('the public home page is reachable', async ({ page }) => {
  const response = await page.goto('/')

  expect(response?.ok()).toBe(true)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

const launchRoutes = [
  '/',
  '/services',
  '/pricing',
  '/gallery',
  '/about',
  '/faqs',
  '/contact',
  '/book',
  '/estimate',
  '/blog',
  '/blog/kitchen-cabinet-costs-detroit',
  '/locations/royal-oak',
] as const

async function expectNoAxeViolations(page: Page, route: string) {
  const response = await page.goto(route)
  expect(response?.ok()).toBe(true)

  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
}

for (const route of launchRoutes) {
  test(`@a11y ${route} has no automatically detectable desktop violations`, async ({
    page,
  }) => {
    await expectNoAxeViolations(page, route)
  })
}

test.describe('mobile accessibility', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  for (const route of launchRoutes) {
    test(`@a11y ${route} has no automatically detectable mobile violations`, async ({
      page,
    }) => {
      await expectNoAxeViolations(page, route)
    })
  }
})
