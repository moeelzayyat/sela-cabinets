import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { CityServiceAreaPage } from '@/components/service-area/city-service-area-page'
import { createPageSocialMetadata } from '@/components/seo/page-social-metadata'
import { getServiceAreaPage, serviceAreaPages } from '@/config/service-area-pages'

export const dynamicParams = false

export function generateStaticParams() {
  return serviceAreaPages
    .filter((area) => area.slug !== 'detroit')
    .map((area) => ({ city: area.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>
}): Promise<Metadata> {
  const { city } = await params
  const area = getServiceAreaPage(city)
  if (!area) return {}

  const title = `Kitchen Cabinets ${area.name} MI`
  const description = `Quality kitchen cabinets and professional installation in ${area.name}, Michigan, with in-home measurement, written scope, and one direct contact.`
  const path = `/service-areas/${area.slug}`

  return {
    title,
    description,
    alternates: { canonical: path },
    ...createPageSocialMetadata({ title, description, path }),
  }
}

export default async function ServiceAreaCityPage({
  params,
}: {
  params: Promise<{ city: string }>
}) {
  const { city } = await params
  const area = getServiceAreaPage(city)
  if (!area || area.slug === 'detroit') notFound()

  return <CityServiceAreaPage area={area} />
}
