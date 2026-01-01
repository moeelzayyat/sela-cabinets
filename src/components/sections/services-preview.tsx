import Link from 'next/link'
import { Package, Wrench, Ruler, Palette, ArrowRight } from 'lucide-react'
import { siteConfig } from '@/config/site'

const iconMap = {
  Package,
  Wrench,
  Ruler,
  Palette,
}

export function ServicesPreview() {
  return (
    <section className="section-padding wood-grain-bg">
      <div className="container-wide">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-charcoal-900 md:text-4xl lg:text-5xl">
            What We Offer
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-charcoal-600">
            Everything you need for your kitchen cabinet project, from selection to installation.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {siteConfig.services.map((service) => {
            const Icon = iconMap[service.icon as keyof typeof iconMap]
            return (
              <Link
                key={service.id}
                href={`/services#${service.id}`}
                className="group rounded-2xl border border-charcoal-200 bg-white p-8 shadow-sm transition-all hover:border-charcoal-300 hover:shadow-md"
              >
                <div className="flex items-start gap-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-charcoal-900 text-white transition-colors group-hover:bg-wood-600">
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-xl font-semibold text-charcoal-900 group-hover:text-wood-700">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-charcoal-600">
                      {service.shortDescription}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-wood-600 transition-colors group-hover:text-wood-700">
                      Learn more
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-lg font-semibold text-charcoal-900 transition-colors hover:text-wood-600"
          >
            View all services
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

