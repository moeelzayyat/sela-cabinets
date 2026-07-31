import type { Metadata } from 'next'
import { createPageSocialMetadata } from '@/components/seo/page-social-metadata'

export const metadata: Metadata = {
  title: 'Request a Kitchen Cabinet Estimate',
  description:
    'Share your Metro Detroit kitchen cabinet project details with SELA Cabinets.',
  alternates: { canonical: '/estimate' },
  ...createPageSocialMetadata({
    title: 'Request a Kitchen Cabinet Estimate',
    description: 'Share your Metro Detroit kitchen cabinet project details with SELA Cabinets.',
    path: '/estimate',
  }),
}

export default function EstimateLayout({ children }: { children: React.ReactNode }) {
  return children
}
