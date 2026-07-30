export interface DiscoveredRouteMethods {
  methods: string[]
  unsupportedExports: string[]
}

export function discoverExportedMethods(
  fileName: string,
  sourceText: string
): DiscoveredRouteMethods
