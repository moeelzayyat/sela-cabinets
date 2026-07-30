import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Request a Kitchen Cabinet Estimate',
  description:
    'Share your Metro Detroit kitchen cabinet project details with SELA Cabinets.',
  alternates: { canonical: '/estimate' },
}

export default function EstimateLayout({ children }: { children: React.ReactNode }) {
  return children
}
