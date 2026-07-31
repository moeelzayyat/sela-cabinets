import { expect, test } from '@playwright/test'

import { indexableRoutes } from '../../src/config/indexable-routes'

const productionOrigin = 'https://selacabinets.com'
const socialImagePath = '/images/seo/sela-cabinets-og.png'
test('rendered production SEO metadata is unique, bounded, and self-canonical', async ({ page }) => {
  test.setTimeout(120_000)
  const titles = new Set<string>()

  for (const route of indexableRoutes) {
    const response = await page.goto(route)
    expect(response?.ok(), route).toBe(true)

    const title = await page.title()
    const description = await page.locator('meta[name="description"]').getAttribute('content')
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
    const openGraphTitle = await page.locator('meta[property="og:title"]').getAttribute('content')
    const openGraphDescription = await page.locator('meta[property="og:description"]').getAttribute('content')
    const openGraphUrl = await page.locator('meta[property="og:url"]').getAttribute('content')
    const openGraphSiteName = await page.locator('meta[property="og:site_name"]').getAttribute('content')
    const openGraphLocale = await page.locator('meta[property="og:locale"]').getAttribute('content')
    const openGraphType = await page.locator('meta[property="og:type"]').getAttribute('content')
    const openGraphImage = await page.locator('meta[property="og:image"]').getAttribute('content')
    const twitterTitle = await page.locator('meta[name="twitter:title"]').getAttribute('content')
    const twitterDescription = await page.locator('meta[name="twitter:description"]').getAttribute('content')
    const twitterImage = await page.locator('meta[name="twitter:image"]').getAttribute('content')

    expect(title.length, `${route} title length`).toBeGreaterThanOrEqual(45)
    expect(title.length, `${route} title length`).toBeLessThanOrEqual(65)
    expect(titles.has(title), `${route} duplicate title`).toBe(false)
    titles.add(title)

    expect(description?.length, `${route} description length`).toBeGreaterThanOrEqual(70)
    expect(description?.length, `${route} description length`).toBeLessThanOrEqual(155)
    expect(canonical).toBe(route === '/' ? productionOrigin : `${productionOrigin}${route}`)
    expect(openGraphTitle, `${route} Open Graph title`).toBe(title)
    expect(openGraphDescription, `${route} Open Graph description`).toBe(description)
    expect(openGraphUrl, `${route} Open Graph URL`).toBe(canonical)
    expect(openGraphSiteName, `${route} Open Graph site name`).toBe('SELA Cabinets')
    expect(openGraphLocale, `${route} Open Graph locale`).toBe('en_US')
    expect(openGraphType, `${route} Open Graph type`).toBe(
      route === '/blog/kitchen-cabinet-planning-detroit' ? 'article' : 'website'
    )
    expect(openGraphImage).toBe(`${productionOrigin}${socialImagePath}`)
    expect(twitterTitle, `${route} Twitter title`).toBe(title)
    expect(twitterDescription, `${route} Twitter description`).toBe(description)
    expect(twitterImage).toBe(`${productionOrigin}${socialImagePath}`)
  }
})

test('planning guide renders article and breadcrumb schema with one business entity', async ({ page }) => {
  await page.goto('/blog/kitchen-cabinet-planning-detroit')

  const schemas = (await page.locator('script[type="application/ld+json"]').allTextContents())
    .map((value) => JSON.parse(value) as { '@type'?: string; '@id'?: string })

  expect(schemas.filter((schema) => schema['@type'] === 'LocalBusiness')).toHaveLength(1)
  expect(schemas.some((schema) => schema['@type'] === 'BlogPosting')).toBe(true)
  expect(schemas.some((schema) => schema['@type'] === 'BreadcrumbList')).toBe(true)
  await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Review Cabinet Services' })).toHaveAttribute(
    'href',
    '/services'
  )
  await expect(page.getByText(/Removed cabinets remain at the property/)).toBeVisible()
  await expect(page.locator('article')).not.toContainText(/additional fee/i)
})

test('old cost URL permanently redirects to the truthful planning guide', async ({ request }) => {
  const response = await request.get('/blog/kitchen-cabinet-costs-detroit', {
    maxRedirects: 0,
  })

  expect([301, 308]).toContain(response.status())
  expect(response.headers().location).toBe('/blog/kitchen-cabinet-planning-detroit')
})

test('unapproved local landing pages fail closed', async ({ request }) => {
  for (const route of ['/locations/royal-oak', '/service-areas/detroit']) {
    const response = await request.get(route, { maxRedirects: 0 })
    expect(response.status(), route).toBe(404)
    expect(response.headers()['x-robots-tag'], route).toBe('noindex, nofollow')
  }
})

test('robots match the deployment target and sitemap exposes only approved routes', async ({ request }, testInfo) => {
  const robots = await (await request.get('/robots.txt')).text()
  const sitemap = await (await request.get('/sitemap.xml')).text()
  const targetOrigin = new URL(String(testInfo.project.use.baseURL)).origin

  if (targetOrigin === productionOrigin) {
    expect(robots).toContain(`Sitemap: ${productionOrigin}/sitemap.xml`)
    expect(robots).toContain('Disallow: /admin/')
  } else {
    expect(robots).toContain('Disallow: /')
    expect(robots).not.toContain('Sitemap:')
  }
  expect(sitemap).toContain(`${productionOrigin}/blog/kitchen-cabinet-planning-detroit`)
  expect(sitemap).not.toContain('kitchen-cabinet-costs-detroit')
  expect(sitemap).not.toMatch(/\/admin|\/account|\/api\//)
})

test('social preview is a real 1200 by 630 PNG', async ({ request }) => {
  const response = await request.get(socialImagePath)
  const image = await response.body()

  expect(response.ok()).toBe(true)
  expect(response.headers()['content-type']).toContain('image/png')
  expect(image.subarray(1, 4).toString('ascii')).toBe('PNG')
  expect(image.readUInt32BE(16)).toBe(1200)
  expect(image.readUInt32BE(20)).toBe(630)
})
