import { mkdirSync, writeFileSync } from 'node:fs'
import { chromium } from 'playwright-core'

const base = process.argv[2]
if (!base) throw new Error('Usage: node scripts/mobile-scroll-audit.mjs <base-url>')

mkdirSync('reports/qa/mobile-scroll', { recursive: true })
const browser = await chromium.launch({ headless: true, executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] })
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
const page = await context.newPage()
await page.goto(new URL('/', base).toString(), { waitUntil: 'networkidle', timeout: 60_000 })

const checkpoints = []
for (const fraction of [0, 0.25, 0.5, 0.75, 1]) {
  let y = 0
  for (let pass = 0; pass < (fraction === 1 ? 3 : 1); pass += 1) {
    y = await page.evaluate((value) => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      window.scrollTo(0, Math.round(max * value))
      return Math.round(max * value)
    }, fraction)
    await page.waitForTimeout(350)
  }
  const name = `home-${Math.round(fraction * 100)}.png`
  await page.screenshot({ path: `reports/qa/mobile-scroll/${name}` })
  checkpoints.push({ fraction, y, screenshot: name })
}

const metrics = await page.evaluate(() => {
  const footerLinks = [...document.querySelectorAll('footer a')]
  return {
    viewportWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    footerLinkCount: footerLinks.length,
    shortestFooterLinkHeight: Math.min(...footerLinks.map((link) => link.getBoundingClientRect().height)),
    pageHeight: document.documentElement.scrollHeight,
  }
})

const lastFooterLink = page.locator('footer a').last()
await lastFooterLink.scrollIntoViewIfNeeded()
const lastLinkVisible = await lastFooterLink.isVisible()
const report = {
  baseUrl: base,
  capturedAt: new Date().toISOString(),
  checkpoints,
  metrics,
  assertions: {
    noHorizontalOverflow: metrics.scrollWidth <= metrics.viewportWidth,
    footerTargetsAtLeast44px: metrics.shortestFooterLinkHeight >= 44,
    footerReachableAboveFixedCallBar: lastLinkVisible,
  },
}
if (Object.values(report.assertions).some((value) => !value)) {
  throw new Error(`Mobile scroll audit failed: ${JSON.stringify(report, null, 2)}`)
}
writeFileSync('reports/qa/mobile-scroll-audit.json', `${JSON.stringify(report, null, 2)}\n`)
console.log(JSON.stringify(report.assertions))
await browser.close()
