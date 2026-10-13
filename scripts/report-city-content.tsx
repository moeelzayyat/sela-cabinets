import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'

import { CityServiceAreaPage } from '../src/components/service-area/city-service-area-page'
import { serviceAreaPages } from '../src/config/service-area-pages'

const words = (value: string) => value.toLowerCase().match(/[a-z0-9]+(?:['’-][a-z0-9]+)*/g) ?? []
const visibleText = (markup: string) => markup
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&(amp|quot|#x27|#39);/g, ' ')
const shingle = (tokens: readonly string[], width = 5) => {
  const values = new Set<string>()
  for (let index = 0; index <= tokens.length - width; index += 1) {
    values.add(tokens.slice(index, index + width).join(' '))
  }
  return values
}

const pages = serviceAreaPages.map((area) => {
  const markup = renderToStaticMarkup(<CityServiceAreaPage area={area} />)
  const text = visibleText(markup)
  const tokens = words(text)
  return { slug: area.slug, name: area.name, tokens, shingles: shingle(tokens) }
})

const report = pages.map((page) => {
  const otherShingles = new Set(
    pages
      .filter((candidate) => candidate.slug !== page.slug)
      .flatMap((candidate) => [...candidate.shingles]),
  )
  const unique = [...page.shingles].filter((value) => !otherShingles.has(value)).length
  return {
    slug: page.slug,
    name: page.name,
    renderedWords: page.tokens.length,
    approximateUniquePercent: Number(((unique / page.shingles.size) * 100).toFixed(1)),
  }
})

const output = JSON.stringify({
  method: 'Unique five-word shingles in the server-rendered city page compared with all other city pages.',
  generatedAt: new Date().toISOString(),
  pages: report,
}, null, 2)

const outputPath = resolve(process.cwd(), 'reports/qa/city-content-report.json')
writeFileSync(outputPath, `${output}\n`)
console.log(output)
