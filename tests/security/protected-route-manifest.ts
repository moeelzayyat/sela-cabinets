import manifestData from './protected-route-manifest.json'
import { parseProtectedRouteManifest } from './protected-route-manifest-schema.mjs'

export type {
  DesiredAuth,
  HttpMethod,
  ProtectedRouteManifestEntry,
  RouteAudience,
  RouteClassification,
} from './protected-route-manifest-schema.mjs'

export const protectedRouteManifest = parseProtectedRouteManifest(manifestData)
