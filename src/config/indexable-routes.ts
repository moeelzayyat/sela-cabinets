export const indexableRoutes = [
  '/',
  '/services',
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
