import Link from 'next/link'

import { popularCabinetStyles } from '@/config/internal-links'
import { serviceAreaPages } from '@/config/service-area-pages'

export function PopularCabinetStyleLinks({
  heading = 'Popular cabinet styles',
}: {
  heading?: string
}) {
  return (
    <nav aria-label={heading}>
      <h2 className="font-display text-2xl font-semibold text-charcoal-900">{heading}</h2>
      <p className="mt-3 leading-7 text-charcoal-600">
        Compare a few popular starting points, then review physical samples in your kitchen lighting before final selection.
      </p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {popularCabinetStyles.map((style) => (
          <li key={style.id}>
            <Link
              href={`/products/${style.id}`}
              className="inline-flex font-semibold text-primary hover:underline"
            >
              {style.name} →
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export function AreasWeServeLinks() {
  return (
    <nav aria-label="Areas we serve">
      <h2 className="font-display text-2xl font-semibold text-charcoal-900">Areas we serve</h2>
      <p className="mt-3 leading-7 text-charcoal-600">
        Explore cabinet planning and installation information for communities in SELA&apos;s confirmed Metro Detroit service area.
      </p>
      <ul className="mt-5 grid grid-cols-2 gap-x-5 gap-y-3 text-sm sm:grid-cols-3">
        {serviceAreaPages.map((area) => (
          <li key={area.slug}>
            <Link
              href={`/service-areas/${area.slug}`}
              className="font-semibold text-primary hover:underline"
            >
              {area.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export function ServiceDiscoveryLinks() {
  return (
    <section className="section-padding bg-wood-50" aria-label="Cabinet styles and service areas">
      <div className="container-wide grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-wood-200 bg-white p-7 sm:p-8">
          <PopularCabinetStyleLinks />
        </div>
        <div className="rounded-2xl border border-wood-200 bg-white p-7 sm:p-8">
          <AreasWeServeLinks />
        </div>
      </div>
    </section>
  )
}
