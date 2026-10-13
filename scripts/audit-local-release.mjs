import { writeFileSync } from 'node:fs'
import { JSDOM } from 'jsdom'

const base = process.argv[2] ?? 'http://127.0.0.1:3000'
const report = { base, checks: [] }

function check(name, condition, details = {}) {
  report.checks.push({ name, passed: Boolean(condition), ...details })
  if (!condition) throw new Error(`${name} failed: ${JSON.stringify(details)}`)
}

async function response(path, options = {}) {
  return fetch(`${base}${path}`, options)
}

async function page(path) {
  const result = await response(path)
  check(`${path} status`, result.status === 200, { status: result.status })
  const html = await result.text()
  return { html, document: new JSDOM(html).window.document, headers: result.headers }
}

const home = await page('/')
check('homepage canonical slash', home.document.querySelector('link[rel="canonical"]')?.href === 'https://selacabinets.com/')
check('homepage og:url slash', home.document.querySelector('meta[property="og:url"]')?.content === 'https://selacabinets.com/')
check('homepage twitter:url slash', home.document.querySelector('meta[name="twitter:url"]')?.content === 'https://selacabinets.com/')
const verificationFile = await response('/google5311959f90a181fd.html')
check('GSC verification file status', verificationFile.status === 200, { status: verificationFile.status })
check(
  'GSC verification file content',
  (await verificationFile.text()).trim() === 'google-site-verification: google5311959f90a181fd.html',
)
check('GSC placeholder metadata absent', home.document.querySelector('meta[name="google-site-verification"]') === null)
check('hero high priority', home.document.querySelector('img[fetchpriority="high"][srcset]') !== null)
const heroPreload = home.document.querySelector('link[rel="preload"][as="image"][imagesrcset]')
check('responsive hero preload', heroPreload !== null && heroPreload.getAttribute('imagesizes') !== null)
const styleImages = [...home.document.querySelectorAll('img[alt*="cabinet style"]')]
check('homepage styles lazy', styleImages.length >= 4 && styleImages.every((image) => image.getAttribute('loading') === 'lazy'), { count: styleImages.length })

const robots = await response('/robots.txt').then((result) => result.text())
const isCanonicalProduction = new URL(base).origin === 'https://selacabinets.com'
if (isCanonicalProduction) {
  check('robots keeps private disallows', ['/api/', '/admin/', '/account/'].every((path) => robots.includes(`Disallow: ${path}`)))
  check('robots exposes legacy locations', !robots.includes('Disallow: /locations/'))
} else {
  check('staging robots blocks all crawling', robots.includes('Disallow: /'))
  check('staging robots omits production sitemap', !robots.includes('Sitemap:'))
}

const sitemapText = await response('/sitemap.xml').then((result) => result.text())
const urls = [...sitemapText.matchAll(/<url>[\s\S]*?<loc>(.*?)<\/loc>[\s\S]*?<lastmod>(.*?)<\/lastmod>[\s\S]*?<\/url>/g)]
check('every sitemap URL has lastmod', urls.length > 50 && !sitemapText.match(/<url>(?:(?!<lastmod>).)*<\/url>/s), { urls: urls.length })
check('sitemap canonical root slash', sitemapText.includes('<loc>https://selacabinets.com/</loc>'))
for (const slug of ['redford', 'dearborn-heights', 'taylor']) {
  check(`sitemap includes ${slug}`, sitemapText.includes(`<loc>https://selacabinets.com/service-areas/${slug}</loc>`))
}

for (const path of ['/admin/example', '/account/example']) {
  const result = await response(path, { redirect: 'manual' })
  const xRobotsTag = result.headers.get('x-robots-tag') ?? ''
  check(`${path} x-robots-tag`, xRobotsTag.includes('noindex'), { value: xRobotsTag })
}

const legacy = await response('/locations/ann-arbor', { redirect: 'manual' })
check('legacy locations stays 404', legacy.status === 404, { status: legacy.status })
const trailing = await response('/services/', { redirect: 'manual' })
check('inner trailing slash is one permanent hop', [301, 308].includes(trailing.status) && trailing.headers.get('location') === '/services', { status: trailing.status, location: trailing.headers.get('location') })

const installation = await page('/services/kitchen-cabinet-installation-detroit')
const detroit = await page('/service-areas/detroit')
const style = await page('/products/shaker-white')
const products = await page('/products')

const schemas = (document) => [...document.querySelectorAll('script[type="application/ld+json"]')].map((script) => JSON.parse(script.textContent))
for (const [name, document] of [['home', home.document], ['installation', installation.document], ['city', detroit.document], ['style', style.document], ['products', products.document]]) {
  const values = schemas(document)
  check(`${name} JSON-LD parses`, values.length > 0, { count: values.length })
  check(`${name} has no reviews`, !JSON.stringify(values).match(/AggregateRating|"Review"/))
}
const installationSchemas = schemas(installation.document)
check('installation Service schema', installationSchemas.some((value) => value['@type'] === 'Service' && value.provider?.['@id'] === 'https://selacabinets.com/#business' && value.areaServed?.length === 16))
check('installation FAQ schema', installationSchemas.some((value) => value['@type'] === 'FAQPage' && value.mainEntity?.length >= 4 && value.mainEntity?.length <= 6))
const business = schemas(home.document).find((value) => value['@type'] === 'HomeAndConstructionBusiness')
check('business schema complete', business?.url === 'https://selacabinets.com/' && business?.priceRange === '$$' && business?.logo?.endsWith('.png') && business?.areaServed?.length === 16)
check('business schema omits unverified hours', business && !Object.hasOwn(business, 'openingHoursSpecification'))
const renderedPages = [home, installation, detroit, style, products]
check('sampled public HTML has no bracketed placeholders', renderedPages.every(({ html }) => !html.match(/\[[A-Z][A-Z0-9 _:/,".-]*\]/)))

const cityWords = (detroit.document.querySelector('main')?.textContent ?? detroit.document.body.textContent ?? '').match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g) ?? []
check('Detroit has 500+ words', cityWords.length >= 500, { words: cityWords.length })
for (const href of ['/services/kitchen-cabinet-supply-detroit', '/services/kitchen-cabinet-installation-detroit', '/services/in-home-cabinet-measurement', '/contact']) {
  check(`city links ${href}`, detroit.document.querySelector(`a[href="${href}"]`) !== null)
}
const relatedStyles = new Set([...style.document.querySelectorAll('a[href^="/products/"]')].map((anchor) => anchor.getAttribute('href')).filter((href) => href !== '/products/shaker-white'))
check('style has related style links', relatedStyles.size >= 2 && relatedStyles.size <= 3, { count: relatedStyles.size })
check('style links installation and measurement', ['/services/kitchen-cabinet-installation-detroit', '/services/in-home-cabinet-measurement'].every((href) => style.document.querySelector(`a[href="${href}"]`)))

const failed = report.checks.filter((item) => !item.passed)
report.summary = { passed: report.checks.length - failed.length, failed: failed.length }
const output = JSON.stringify(report, null, 2)
writeFileSync('reports/qa/local-release-audit.json', `${output}\n`)
console.log(output)
