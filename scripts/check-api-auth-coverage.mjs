import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

import { discoverExportedMethods } from './api-auth-discovery.mjs'
import {
  parseProtectedRouteManifest,
  routePatternForSource,
} from '../tests/security/protected-route-manifest-schema.mjs'

const root = process.cwd()
const apiRoot = path.join(root, 'src', 'app', 'api')
const manifestPath = path.join(root, 'tests', 'security', 'protected-route-manifest.json')

function walkRouteCandidates(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name)
    if (entry.isDirectory()) return walkRouteCandidates(absolute)
    return entry.isFile() && entry.name.startsWith('route.') ? [absolute] : []
  })
}

function exportedMethods(fileName) {
  return discoverExportedMethods(fileName, fs.readFileSync(fileName, 'utf8'))
}

function relativeSource(fileName) {
  return path.relative(root, fileName).split(path.sep).join('/')
}

const unsupportedExports = []
const routeCandidates = walkRouteCandidates(apiRoot)
const unsupportedRouteFiles = routeCandidates
  .filter((fileName) => !/route\.(?:ts|js)$/.test(fileName))
  .map(relativeSource)
const routeFiles = routeCandidates.filter((fileName) => /route\.(?:ts|js)$/.test(fileName))
const actual = routeFiles.flatMap((fileName) => {
  const sourceRouteFile = relativeSource(fileName)
  const routePattern = routePatternForSource(sourceRouteFile)
  const result = exportedMethods(fileName)
  unsupportedExports.push(
    ...result.unsupportedExports.map((message) => `${sourceRouteFile}: ${message}`)
  )
  return result.methods.map((method) => ({ sourceRouteFile, routePattern, method }))
})

let manifest
try {
  manifest = parseProtectedRouteManifest(
    JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
  )
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Invalid protected route manifest')
  process.exit(1)
}

const pairKey = ({ routePattern, method }) => `${method} ${routePattern}`
const manifestKeys = manifest.map(pairKey)
const actualKeys = actual.map(pairKey)
const missingKeys = actualKeys.filter((key) => !manifestKeys.includes(key)).sort()
const staleKeys = manifestKeys.filter((key) => !actualKeys.includes(key)).sort()

if (
  unsupportedRouteFiles.length ||
  unsupportedExports.length ||
  missingKeys.length ||
  staleKeys.length
) {
  const details = [
    unsupportedRouteFiles.length
      ? `Unsupported route files (${unsupportedRouteFiles.length}):\n  ${unsupportedRouteFiles.join('\n  ')}`
      : '',
    unsupportedExports.length
      ? `Unsupported route exports (${unsupportedExports.length}):\n  ${unsupportedExports.join('\n  ')}`
      : '',
    missingKeys.length
      ? `Missing manifest entries (${missingKeys.length}):\n  ${missingKeys.join('\n  ')}`
      : '',
    staleKeys.length
      ? `Stale manifest entries (${staleKeys.length}):\n  ${staleKeys.join('\n  ')}`
      : '',
  ]
    .filter(Boolean)
    .join('\n\n')
  console.error(
    `API auth coverage failed. Found ${actual.length} exported route methods and ${manifest.length} manifest entries.\n\n${details}`
  )
  process.exit(1)
}

console.log(
  `API auth coverage passed: ${actual.length} exported route methods exactly match ${manifest.length} manifest entries across ${new Set(actual.map((entry) => entry.sourceRouteFile)).size} route files.`
)
