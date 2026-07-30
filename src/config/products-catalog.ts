/**
 * Product publication is intentionally disabled for launch.
 * Add only products and images with documented approval and usage rights.
 */
export interface CabinetProduct {
  id: string
  name: string
  description: string
  tags: string[]
  isNew?: boolean
  construction: 'framed' | 'frameless'
  image: string
}

export const productsCatalog: {
  framed: CabinetProduct[]
  frameless: CabinetProduct[]
} = {
  framed: [],
  frameless: [],
}

export type ProductId = never
