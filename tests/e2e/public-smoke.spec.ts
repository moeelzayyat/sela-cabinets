import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

import { indexableRoutes } from '../../src/config/indexable-routes'

test('the public home page is reachable', async ({ page }) => {
  const response = await page.goto('/')

  expect(response?.ok()).toBe(true)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

async function expectNoAxeViolations(page: Page, route: string) {
  const response = await page.goto(route)
  expect(response?.ok()).toBe(true)

  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
}

for (const route of indexableRoutes) {
  test(`@a11y ${route} has no automatically detectable desktop violations`, async ({
    page,
  }) => {
    await expectNoAxeViolations(page, route)
  })
}

test.describe('mobile accessibility', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  for (const route of indexableRoutes) {
    test(`@a11y ${route} has no automatically detectable mobile violations`, async ({
      page,
    }) => {
      await expectNoAxeViolations(page, route)
    })
  }
})
