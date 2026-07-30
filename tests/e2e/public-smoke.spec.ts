import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('the public home page is reachable', async ({ page }) => {
  const response = await page.goto('/')

  expect(response?.ok()).toBe(true)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

test('@a11y the public home page has no automatically detectable violations', async ({ page }) => {
  const response = await page.goto('/')

  expect(response?.ok()).toBe(true)

  const results = await new AxeBuilder({ page }).analyze()

  expect(results.violations).toEqual([])
})
