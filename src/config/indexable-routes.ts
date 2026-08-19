export const indexableRoutes = [
  '/',
  '/services',
  '/services/kitchen-cabinet-installation-detroit',
  '/services/kitchen-cabinet-supply-detroit',
  '/services/in-home-cabinet-measurement',
  '/service-areas/metro-detroit',
  '/products',
  '/pricing',
  '/gallery',
  '/about',
  '/faqs',
  '/contact',
  '/book',
  '/estimate',
  '/blog',
  '/blog/kitchen-cabinet-planning-detroit',
] as const

export type IndexableRoute = (typeof indexableRoutes)[number]
