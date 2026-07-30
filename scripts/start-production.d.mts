export interface ProductionServerOptions {
  environment?: Record<string, string | undefined>
  loadServer?: (serverPath: string) => Promise<unknown>
  serverPath?: string
}

export function startProductionServer(
  options?: ProductionServerOptions
): Promise<void>
