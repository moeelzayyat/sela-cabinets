import Link from 'next/link'
import { MapPin, Ruler, Wrench } from 'lucide-react'

import { BreadcrumbSchema } from '@/components/seo/SchemaMarkup'
import { CompletedProjectsSection } from '@/components/sections/completed-projects-section'
import { Button } from '@/components/ui/button'
import type { ServiceAreaPage } from '@/config/service-area-pages'

export function CityServiceAreaPage({ area }: { area: ServiceAreaPage }) {
  const path = `/service-areas/${area.slug}`

  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: '/' },
        { name: 'Service Areas', url: '/service-areas/metro-detroit' },
        { name: area.name, url: path },
      ]} />

      <section className="section-padding bg-charcoal-900 text-white">
        <div className="container-wide max-w-5xl">
          <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-wood-300">
            <MapPin className="h-4 w-4" aria-hidden="true" /> {area.name}, Michigan
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold md:text-5xl">
            Kitchen Cabinets &amp; Installation in {area.name}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-charcoal-300">{area.introduction}</p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg"><Link href={`/estimate?city=${encodeURIComponent(area.name)}`}>Request a {area.name} Estimate</Link></Button>
            <Button asChild size="lg" variant="outline" className="border-white/40 text-white hover:bg-white hover:text-charcoal-900">
              <Link href="/products">Explore Cabinet Styles</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-wide grid gap-8 lg:grid-cols-2">
          <article className="rounded-2xl border border-charcoal-200 p-7 sm:p-8">
            <Ruler className="h-8 w-8 text-primary" aria-hidden="true" />
            <h2 className="mt-4 font-display text-2xl font-semibold text-charcoal-900">Planning around the actual room</h2>
            <p className="mt-4 leading-7 text-charcoal-700">{area.homeNotes}</p>
          </article>
          <article className="rounded-2xl border border-charcoal-200 bg-charcoal-50 p-7 sm:p-8">
            <Wrench className="h-8 w-8 text-primary" aria-hidden="true" />
            <h2 className="mt-4 font-display text-2xl font-semibold text-charcoal-900">From cabinet selection to installation</h2>
            <p className="mt-4 leading-7 text-charcoal-700">{area.planningNotes}</p>
          </article>
        </div>
      </section>

      <section className="section-padding bg-wood-50">
        <div className="container-wide grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div>
            <h2 className="font-display text-3xl font-bold text-charcoal-900 md:text-4xl">One point of contact for your {area.name} cabinet project</h2>
            <p className="mt-5 text-lg leading-8 text-charcoal-700">
              SELA keeps cabinet selection, in-home measurement, written scope, ordering updates,
              and installation coordination together. The owner remains your direct contact while
              the lead installer focuses on careful cabinet fit and adjustment.
            </p>
          </div>
          <nav aria-label={`${area.name} cabinet services`} className="rounded-2xl border border-wood-200 bg-white p-7">
            <h3 className="font-display text-xl font-semibold text-charcoal-900">Explore the next step</h3>
            <ul className="mt-5 space-y-3 font-semibold text-primary">
              <li><Link href="/services/kitchen-cabinet-supply-detroit" className="hover:underline">Kitchen cabinet collections →</Link></li>
              <li><Link href="/services/in-home-cabinet-measurement" className="hover:underline">In-home cabinet measurement →</Link></li>
              <li><Link href="/services/kitchen-cabinet-installation-detroit" className="hover:underline">Professional cabinet installation →</Link></li>
              <li><Link href="/gallery" className="hover:underline">Cabinet style inspiration →</Link></li>
            </ul>
          </nav>
        </div>
      </section>

      <CompletedProjectsSection city={area.name} />

      <section className="section-padding bg-charcoal-900 text-white">
        <div className="container-wide max-w-4xl text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Start your {area.name} kitchen cabinet estimate</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-charcoal-300">
            Share the project address or ZIP code, kitchen photos, cabinet status, and preferred timeline.
            SELA will confirm service availability and the appropriate next step.
          </p>
          <Button asChild size="lg" className="mt-8"><Link href={`/estimate?city=${encodeURIComponent(area.name)}`}>Request an Estimate</Link></Button>
        </div>
      </section>
    </>
  )
}
