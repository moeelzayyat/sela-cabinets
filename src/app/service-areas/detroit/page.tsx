import { Metadata } from 'next'
import { ServiceAreaPage } from '@/components/service-area/ServiceAreaPage'

export const metadata: Metadata = {
  title: 'Kitchen Cabinets Detroit MI | SELA Cabinets - Professional Installation',
  description: 'Looking for kitchen cabinets in Detroit? SELA Cabinets offers premium semi-custom cabinets, professional installation, design guidance, and in-home measurement for Detroit-area homes.',
  keywords: ['kitchen cabinets Detroit', 'cabinet installation Detroit MI', 'Detroit kitchen remodel', 'cabinet supply Detroit Michigan', 'kitchen renovation Detroit'],
  openGraph: {
    title: 'Kitchen Cabinets Detroit MI | SELA Cabinets',
    description: 'Premium kitchen cabinets in Detroit with professional installation, design guidance, and in-home measurement.',
    locale: 'en_US',
    type: 'website',
    url: 'https://selacabinets.com/service-areas/detroit',
  },
  alternates: {
    canonical: 'https://selacabinets.com/service-areas/detroit',
  },
}

export default function DetroitCabinets() {
  return (
    <ServiceAreaPage
      city="Detroit"
      state="Michigan"
      stateAbbr="MI"
      population="670,000"
      highlights={[
        'Professional kitchen cabinet installation throughout Detroit',
        'In-home measurement in all Detroit neighborhoods',
        'Inspection-based project planning',
        'Local Detroit metro cabinet experts',
        'Premium cabinet styles and finish guidance',
      ]}
      neighborhoods={[
        'Downtown Detroit',
        'Midtown',
        'Corktown',
        'Indian Village',
        'Boston-Edison',
        'Palmer Woods',
        'Sherwood Forest',
        'University District',
        'Rosedale Park',
        'East English Village',
      ]}
    />
  )
}
