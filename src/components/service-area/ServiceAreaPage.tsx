import { notFound } from 'next/navigation'

interface ServiceAreaPageProps {
  city: string
  state: string
  stateAbbr: string
  population?: string
  highlights: string[]
  neighborhoods?: string[]
}

export function ServiceAreaPage(_props: ServiceAreaPageProps) {
  notFound()
}
