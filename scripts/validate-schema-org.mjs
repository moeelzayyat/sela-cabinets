import { writeFileSync } from 'node:fs'

const base = process.argv[2]
if (!base) throw new Error('Usage: node scripts/validate-schema-org.mjs <base-url>')

const routes = [
  '/',
  '/services/kitchen-cabinet-installation-detroit',
  '/service-areas/detroit',
  '/products/shaker-white',
  '/products',
]

function countErrors(value) {
  if (!value || typeof value !== 'object') return 0
  if (Array.isArray(value)) return value.reduce((total, item) => total + countErrors(item), 0)
  const own = Array.isArray(value.errors) ? value.errors.length : 0
  return own + Object.entries(value)
    .filter(([key]) => key !== 'errors')
    .reduce((total, [, item]) => total + countErrors(item), 0)
}

const results = {}
for (const route of routes) {
  const url = new URL(route, base).toString()
  const body = new URLSearchParams({ url })
  const response = await fetch('https://validator.schema.org/validate', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body,
  })
  const text = await response.text()
  const parsed = JSON.parse(text.replace(/^\)\]\}'\n/, ''))
  const errorCount = countErrors(parsed)
  const types = [...new Set((parsed.tripleGroups ?? []).flatMap((group) =>
    (group.nodes ?? []).flatMap((node) => node.types?.map((type) => type.value) ?? [])
  ))].sort()
  results[route] = { status: response.status, errorCount, types }
  if (!response.ok || errorCount !== 0) {
    throw new Error(`${route} failed Schema.org validation: ${JSON.stringify(results[route])}`)
  }
}

const report = {
  validator: 'https://validator.schema.org/',
  capturedAt: new Date().toISOString(),
  baseUrl: base,
  results,
  summary: { pageTypesChecked: routes.length, totalErrors: 0 },
}
writeFileSync('reports/qa/schema-org-validation.json', `${JSON.stringify(report, null, 2)}\n`)
console.log(JSON.stringify(report.summary))
