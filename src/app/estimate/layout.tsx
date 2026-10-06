import type { Metadata } from 'next'

import { BreadcrumbSchema } from '@/components/seo/SchemaMarkup'
import { createPageSocialMetadata } from '@/components/seo/page-social-metadata'

const title = 'Detroit Cabinet Installation Estimate'
const description = 'Request a Metro Detroit estimate for quality kitchen cabinets and professional installation. Exact pricing follows in-home measurement and scope review.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/estimate' },
  ...createPageSocialMetadata({ title, description, path: '/estimate' }),
}

export default function EstimateLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Home', url: '/' }, { name: 'Estimate', url: '/estimate' }]} />
      {children}
    </>
  )
}
