import { Metadata } from 'next'
import { ServiceAreaPage } from '@/components/service-area/ServiceAreaPage'

export const metadata: Metadata = {
  title: 'Kitchen Cabinets Detroit MI | SELA Cabinets - Professional Installation',
  description: 'Looking for kitchen cabinets in Detroit? SELA Cabinets offers premium semi-custom cabinets, professional installation, and free in-home measurement. 10x10 kitchens from $3,999. Local Detroit cabinet experts serving the metro area.',
  keywords: ['kitchen cabinets Detroit', 'cabinet installation Detroit MI', 'Detroit kitchen remodel', 'cabinet supply Detroit Michigan', 'kitchen renovation Detroit'],
  openGraph: {
    title: 'Kitchen Cabinets Detroit MI | SELA Cabinets',
    description: 'Premium kitchen cabinets in Detroit with professional installation. Save 66% vs big box stores. Free in-home measurement.',
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
        'Free in-home measurement in all Detroit neighborhoods',
        'Same-week appointments available',
        'Local Detroit metro cabinet experts',
        '10x10 kitchens starting at $3,999 installed',
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
