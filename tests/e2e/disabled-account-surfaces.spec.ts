import { expect, test } from '@playwright/test'

const disabledRoutes = [
  '/admin/register',
  '/account',
  '/account/login',
  '/account/register',
]

for (const route of disabledRoutes) {
  test(`${route} is disabled and noindexed for launch`, async ({ page, baseURL }) => {
    const response = await page.goto(route)

    expect(response?.status()).toBe(404)
    expect(response?.url()).toBe(new URL(route, baseURL!).href)
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      /noindex/i
    )
  })
}

test('public navigation exposes no customer portal entry points', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('a[href^="/account"]')).toHaveCount(0)
})

test('admin login does not offer public registration', async ({ page }) => {
  await page.goto('/admin/login')

  await expect(page.locator('a[href="/admin/register"]')).toHaveCount(0)
})
