import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, Phone, Ruler, Wrench, PackageCheck } from 'lucide-react'

import { createPageSocialMetadata } from '@/components/seo/page-social-metadata'
import { CTASection } from '@/components/sections/cta-section'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/config/site'

const title = 'Kitchen Cabinet Service Areas in Metro Detroit'
const description = 'Explore SELA cabinet planning, supply, measurement, and installation coverage for homeowners across Detroit and nearby Metro Detroit communities.'
const path = '/service-areas/metro-detroit'

export const metadata: Metadata = {
  title: 'Kitchen Cabinet Service Areas in Metro Detroit',
  description: 'Explore SELA cabinet planning, supply, measurement, and installation coverage for homeowners across Detroit and nearby Metro Detroit communities.',
  alternates: { canonical: '/service-areas/metro-detroit' },
  ...createPageSocialMetadata({ title, description, path }),
}

const serviceLinks = [
  { icon: PackageCheck, title: 'Cabinet supply', copy: 'Cabinet styles and construction options reviewed against the measured layout and project selections.', href: '/services/kitchen-cabinet-supply-detroit' },
  { icon: Ruler, title: 'In-home measurement', copy: 'Room dimensions and visible conditions recorded to support cabinet layout and estimate decisions.', href: '/services/in-home-cabinet-measurement' },
  { icon: Wrench, title: 'Cabinet installation', copy: 'Placement, leveling, alignment, adjustment, and related cabinet work according to the approved scope.', href: '/services/kitchen-cabinet-installation-detroit' },
]

export default function MetroDetroitServiceAreasPage() {
  return (
    <>
      <section className="section-padding bg-charcoal-900 text-white"><div className="container-wide grid gap-10 lg:grid-cols-[1.2fr_.8fr] lg:items-center"><div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-wood-300">SELA Cabinets service area</p><h1 className="mt-4 font-display text-4xl font-bold md:text-5xl">Kitchen Cabinet Planning Across Metro Detroit</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-charcoal-300">SELA serves homeowners in Detroit and nearby Metro Detroit communities with cabinet planning, cabinet supply, in-home measurement, and installation coordination. Project location, requested service, appointment availability, and travel coverage are confirmed before a visit is promised.</p><div className="mt-8 flex flex-col gap-4 sm:flex-row"><Link href="/book"><Button size="lg">Plan My Kitchen</Button></Link><a href={siteConfig.phoneLink}><Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white hover:text-charcoal-900"><Phone className="mr-2 h-5 w-5" />Call {siteConfig.phoneFormatted}</Button></a></div></div><aside className="rounded-2xl border border-charcoal-700 bg-charcoal-800 p-7"><MapPin className="h-10 w-10 text-wood-300" /><h2 className="mt-5 font-display text-2xl font-semibold">A mobile, appointment-based service</h2><p className="mt-3 leading-7 text-charcoal-300">SELA meets homeowners by appointment for project planning and measurement. The business does not present a public retail showroom or invite walk-in visits at a residential address.</p></aside></div></section>

      <section className="section-padding bg-white"><div className="container-wide"><div className="mx-auto max-w-3xl text-center"><h2 className="font-display text-3xl font-bold text-charcoal-900 md:text-4xl">Confirmed Metro Detroit Coverage</h2><p className="mt-4 leading-7 text-charcoal-600">The communities below describe SELA’s current general service area. A listed city does not guarantee a particular appointment time, delivery condition, installation scope, or project acceptance.</p></div><ul className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{siteConfig.serviceAreas.map((area) => <li key={area} className="rounded-xl border border-charcoal-200 bg-charcoal-50 px-4 py-3 text-center font-medium text-charcoal-800">{area}</li>)}</ul></div></section>

      <section className="section-padding bg-charcoal-50"><div className="container-wide"><div className="mx-auto max-w-3xl text-center"><h2 className="font-display text-3xl font-bold text-charcoal-900 md:text-4xl">Cabinet Services Available by Project Scope</h2><p className="mt-4 text-charcoal-600">Each kitchen begins with a project conversation. SELA confirms which services are appropriate after reviewing the location, room, cabinet stage, and requested work.</p></div><div className="mt-12 grid gap-6 md:grid-cols-3">{serviceLinks.map(({ icon: Icon, title: heading, copy, href }) => <article key={href} className="rounded-2xl bg-white p-7 shadow-sm"><Icon className="h-8 w-8 text-primary" /><h3 className="mt-4 font-display text-xl font-semibold text-charcoal-900">{heading}</h3><p className="mt-3 leading-7 text-charcoal-600">{copy}</p><Link href={href} className="mt-5 inline-block font-semibold text-primary hover:underline">Learn more →</Link></article>)}</div></div></section>

      <section className="section-padding bg-white"><div className="container-wide grid gap-10 lg:grid-cols-2"><div><h2 className="font-display text-3xl font-bold text-charcoal-900">What Happens After You Contact SELA</h2><p className="mt-4 leading-7 text-charcoal-600">We first confirm the project location and what you need: cabinet selection, measurement, supply, installation, or a combination. The next step may be a planning call, an in-home visit, or a request for additional project details. Scope and timing are not treated as final until the required information has been reviewed.</p></div><div><h2 className="font-display text-3xl font-bold text-charcoal-900">Planning for Travel, Delivery, and Installation</h2><p className="mt-4 leading-7 text-charcoal-600">Distance is only one part of service availability. Cabinet delivery access, installation readiness, ordered-product status, parking, building rules, and coordination with other trades may affect whether and when SELA can perform the requested work.</p><Link href="/estimate" className="mt-5 inline-block font-semibold text-primary hover:underline">Share your project details →</Link></div></div></section>

      <CTASection title="Check Your Metro Detroit Project Location" description="Send the city, ZIP code, project stage, and cabinet services you need. SELA will confirm coverage and the appropriate next planning step." variant="wood" />
    </>
  )
}
