import Link from 'next/link'
import { MapPin, Ruler, Wrench } from 'lucide-react'

import { BreadcrumbSchema } from '@/components/seo/SchemaMarkup'
import { CompletedProjectsSection } from '@/components/sections/completed-projects-section'
import { PopularCabinetStyleLinks } from '@/components/sections/internal-link-sections'
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
        <div className="container-wide">
          <div className="grid gap-8 lg:grid-cols-2">
            {area.contentSections.map((section, index) => (
              <article
                key={section.heading}
                className={`rounded-2xl border p-7 sm:p-8 ${index % 2 === 0 ? 'border-charcoal-200 bg-white' : 'border-wood-200 bg-wood-50'}`}
              >
                {index % 2 === 0
                  ? <Ruler className="h-8 w-8 text-primary" aria-hidden="true" />
                  : <Wrench className="h-8 w-8 text-primary" aria-hidden="true" />}
                <h2 className="mt-4 font-display text-2xl font-semibold text-charcoal-900">{section.heading}</h2>
                <div className="mt-4 space-y-4 leading-7 text-charcoal-700">
                  {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-wood-50">
        <div className="container-wide">
          <nav aria-label={`${area.name} cabinet services`} className="rounded-2xl border border-wood-200 bg-white p-7 sm:p-8">
            <h2 className="font-display text-3xl font-bold text-charcoal-900">Cabinet services for {area.name}</h2>
            <ul className="mt-5 space-y-3 font-semibold text-primary">
              <li><Link href="/services/kitchen-cabinet-supply-detroit" className="inline-flex min-h-11 items-center py-2 hover:underline">Kitchen cabinet collections →</Link></li>
              <li><Link href="/services/in-home-cabinet-measurement" className="inline-flex min-h-11 items-center py-2 hover:underline">In-home cabinet measurement →</Link></li>
              <li><Link href="/services/kitchen-cabinet-installation-detroit" className="inline-flex min-h-11 items-center py-2 hover:underline">Professional cabinet installation →</Link></li>
              <li><Link href="/gallery" className="inline-flex min-h-11 items-center py-2 hover:underline">Cabinet style inspiration →</Link></li>
            </ul>
          </nav>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-wide rounded-2xl border border-charcoal-200 bg-charcoal-50 p-7 sm:p-8">
          <PopularCabinetStyleLinks heading={`Popular cabinet styles for ${area.name} kitchens`} />
        </div>
      </section>

      <CompletedProjectsSection city={area.name} />

      <section className="section-padding bg-charcoal-900 text-white">
        <div className="container-wide max-w-4xl text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Start your {area.name} kitchen cabinet estimate</h2>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg"><Link href={`/estimate?city=${encodeURIComponent(area.name)}`}>Request an Estimate</Link></Button>
            <Button asChild size="lg" variant="outline" className="border-white/40 text-white hover:bg-white hover:text-charcoal-900">
              <Link href="/contact">Contact SELA</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
