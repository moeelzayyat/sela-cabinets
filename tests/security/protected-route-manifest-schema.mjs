const HTTP_METHODS = new Set(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'])
const AUDIENCES = new Set(['public', 'admin', 'customer'])
const CLASSIFICATIONS = new Set(['public-entry', 'admin-only', 'disabled-for-launch'])
const DESIRED_AUTH = new Set(['none', 'admin-session', 'disabled'])
const REQUIRED_FIELDS = [
  'sourceRouteFile',
  'routePattern',
  'samplePath',
  'method',
  'audience',
  'classification',
  'desiredAuth',
  'sensitiveData',
  'sideEffects',
]
const ALLOWED_FIELDS = new Set([...REQUIRED_FIELDS, 'requiredInvariant'])

export function routePatternForSource(sourceRouteFile) {
  if (
    typeof sourceRouteFile !== 'string' ||
    !/^src\/app\/api\/(?:[^/]+\/)*route\.(?:ts|js)$/.test(sourceRouteFile) ||
    sourceRouteFile.includes('..') ||
    sourceRouteFile.includes('\\')
  ) {
    return undefined
  }

  return `/${sourceRouteFile.replace(/^src\/app\//, '').replace(/\/route\.(?:ts|js)$/, '')}`
}

function samplePathMatchesPattern(routePattern, samplePath) {
  if (
    typeof routePattern !== 'string' ||
    typeof samplePath !== 'string' ||
    !samplePath.startsWith('/api/') ||
    samplePath.includes('#') ||
    samplePath.includes('\\') ||
    samplePath.includes('://')
  ) {
    return false
  }

  const rawPath = samplePath.split('?')[0]
  let decodedSegments
  try {
    decodedSegments = rawPath.split('/').map((segment) => decodeURIComponent(segment))
  } catch {
    return false
  }

  if (
    decodedSegments.some(
      (segment) =>
        segment === '.' ||
        segment === '..' ||
        segment.includes('/') ||
        segment.includes('\\')
    )
  ) {
    return false
  }

  const patternSegments = routePattern.split('/')
  if (patternSegments.length !== decodedSegments.length) return false

  return patternSegments.every((segment, index) => {
    const sampleSegment = decodedSegments[index]
    if (/^\[[^/\]]+\]$/.test(segment)) return Boolean(sampleSegment)
    return segment === sampleSegment
  })
}

function semanticCombinationIsValid(entry) {
  if (entry.classification === 'public-entry') {
    return entry.audience === 'public' && entry.desiredAuth === 'none'
  }
  if (entry.classification === 'admin-only') {
    return entry.audience === 'admin' && entry.desiredAuth === 'admin-session'
  }
  if (entry.classification === 'disabled-for-launch') {
    return (
      (entry.audience === 'admin' || entry.audience === 'customer') &&
      entry.desiredAuth === 'disabled'
    )
  }
  return false
}

export function parseProtectedRouteManifest(input) {
  if (!Array.isArray(input)) {
    throw new Error('Invalid protected route manifest: root must be an array')
  }

  const issues = []
  const seenPairs = new Set()

  input.forEach((entry, index) => {
    const label = `entry ${index + 1}`
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      issues.push(`${label}: must be an object`)
      return
    }

    const missing = REQUIRED_FIELDS.filter(
      (field) => !Object.prototype.hasOwnProperty.call(entry, field)
    )
    if (missing.length) issues.push(`${label}: missing ${missing.join(', ')}`)

    const unknown = Object.keys(entry).filter((field) => !ALLOWED_FIELDS.has(field))
    if (unknown.length) issues.push(`${label}: unknown ${unknown.join(', ')}`)

    const expectedPattern = routePatternForSource(entry.sourceRouteFile)
    if (!expectedPattern || entry.routePattern !== expectedPattern) {
      issues.push(`${label}: sourceRouteFile and routePattern do not correspond`)
    }
    if (!samplePathMatchesPattern(entry.routePattern, entry.samplePath)) {
      issues.push(`${label}: samplePath does not concretize routePattern`)
    }
    if (!HTTP_METHODS.has(entry.method)) issues.push(`${label}: invalid method`)
    if (!AUDIENCES.has(entry.audience)) issues.push(`${label}: invalid audience`)
    if (!CLASSIFICATIONS.has(entry.classification)) {
      issues.push(`${label}: invalid classification`)
    }
    if (!DESIRED_AUTH.has(entry.desiredAuth)) issues.push(`${label}: invalid desiredAuth`)
    if (typeof entry.sensitiveData !== 'boolean') {
      issues.push(`${label}: sensitiveData must be boolean`)
    }
    if (typeof entry.sideEffects !== 'boolean') {
      issues.push(`${label}: sideEffects must be boolean`)
    }
    if (
      Object.prototype.hasOwnProperty.call(entry, 'requiredInvariant') &&
      (typeof entry.requiredInvariant !== 'string' || !entry.requiredInvariant.trim())
    ) {
      issues.push(`${label}: requiredInvariant must be a non-empty string`)
    }
    if (!semanticCombinationIsValid(entry)) {
      issues.push(`${label}: audience, classification, and desiredAuth are inconsistent`)
    }

    if (typeof entry.method === 'string' && typeof entry.routePattern === 'string') {
      const pair = `${entry.method} ${entry.routePattern}`
      if (seenPairs.has(pair)) issues.push(`${label}: duplicate ${pair}`)
      seenPairs.add(pair)
    }
  })

  if (issues.length) {
    throw new Error(`Invalid protected route manifest:\n${issues.join('\n')}`)
  }

  return Object.freeze(input.map((entry) => Object.freeze({ ...entry })))
}
