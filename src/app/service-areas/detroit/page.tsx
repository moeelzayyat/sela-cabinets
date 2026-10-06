import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { CityServiceAreaPage } from '@/components/service-area/city-service-area-page'
import { createPageSocialMetadata } from '@/components/seo/page-social-metadata'
import { getServiceAreaPage } from '@/config/service-area-pages'

const area = getServiceAreaPage('detroit')
const title = 'Kitchen Cabinets Detroit MI'
const description = 'Quality kitchen cabinets and professional installation in Detroit, with in-home measurement, written scope, and one direct point of contact.'
const path = '/service-areas/detroit'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  ...createPageSocialMetadata({ title, description, path }),
}

export default function DetroitServiceAreaPage() {
  if (!area) notFound()
  return <CityServiceAreaPage area={area} />
}
