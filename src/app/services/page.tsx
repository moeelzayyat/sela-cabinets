import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Package, Wrench, Ruler, Palette, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CTASection } from '@/components/sections/cta-section'
import { siteConfig } from '@/config/site'
import { serviceImages, type ServiceImageKey } from '@/config/images'

export const metadata: Metadata = {
  title: 'Our Services',
  description: 'Professional kitchen cabinet services in Detroit: cabinet supply, expert installation, in-home measurement, and design help. Get your dream kitchen today.',
}

const iconMap = {
  Package,
  Wrench,
  Ruler,
  Palette,
}

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-padding bg-charcoal-50">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl font-bold text-charcoal-900 md:text-5xl lg:text-6xl">
              Our Services
            </h1>
            <p className="mt-6 text-lg text-charcoal-600 md:text-xl">
              From cabinet selection to professional installation, we provide everything 
              you need to transform your kitchen. Serving Detroit and surrounding areas.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/book">
                <Button size="lg">Book a Consultation</Button>
              </Link>
              <Link href="/estimate">
                <Button size="lg" variant="outline">
                  Get an Estimate
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="space-y-24">
            {siteConfig.services.map((service, index) => {
              const Icon = iconMap[service.icon as keyof typeof iconMap]
              const isEven = index % 2 === 0

              return (
                <div
                  key={service.id}
                  id={service.id}
                  className={`flex flex-col gap-12 lg:flex-row lg:items-center ${!isEven ? 'lg:flex-row-reverse' : ''}`}
                >
                  {/* TEMP PLACEHOLDER – REPLACE WITH REAL SELA CABINETS PHOTOS */}
                  <div className="flex-1">
                    <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-charcoal-100">
                      {serviceImages[service.id as ServiceImageKey] ? (
                        <Image
                          src={serviceImages[service.id as ServiceImageKey].src}
                          alt={serviceImages[service.id as ServiceImageKey].alt}
                          width={800}
                          height={600}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-charcoal-400">
                          <Icon className="h-24 w-24 opacity-30" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-charcoal-900 text-white">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h2 className="mt-6 font-display text-3xl font-bold text-charcoal-900 md:text-4xl">
                      {service.title}
                    </h2>
                    <p className="mt-4 text-lg text-charcoal-600">
                      {service.description}
                    </p>
                    <ul className="mt-6 space-y-3">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-wood-600" />
                          <span className="text-charcoal-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8">
                      <Link href="/book">
                        <Button>Book This Service</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="section-padding wood-grain-bg">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold text-charcoal-900 md:text-4xl">
              Serving Detroit & Surrounding Areas
            </h2>
            <p className="mt-4 text-lg text-charcoal-600">
              We proudly serve homeowners throughout the Detroit metro area.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {siteConfig.serviceAreas.map((area) => (
              <span
                key={area}
                className="rounded-full bg-white px-4 py-2 text-sm font-medium text-charcoal-700 shadow-sm"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  )
}

