import { allCabinetProducts } from '@/config/products-catalog'
import { serviceAreaPages } from '@/config/service-area-pages'

const coreRoutes = [
  '/',
  '/about',
  '/services',
  '/services/kitchen-cabinet-installation-detroit',
  '/services/kitchen-cabinet-supply-detroit',
  '/services/in-home-cabinet-measurement',
  '/products',
  '/gallery',
  '/pricing',
  '/estimate',
  '/book',
  '/faqs',
  '/contact',
  '/service-areas/metro-detroit',
  '/blog',
  '/blog/kitchen-cabinet-planning-detroit',
] as const

export const indexableRoutes = [
  ...coreRoutes,
  ...serviceAreaPages.map((area) => `/service-areas/${area.slug}`),
  ...allCabinetProducts.map((product) => `/products/${product.id}`),
]
