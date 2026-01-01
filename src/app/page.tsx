import { Metadata } from 'next'
import Image from 'next/image'
import { HeroSection } from '@/components/sections/hero-section'
import { ServicesPreview } from '@/components/sections/services-preview'
import { ProcessSection } from '@/components/sections/process-section'
import { TrustSection } from '@/components/sections/trust-section'
import { CTASection } from '@/components/sections/cta-section'
import { LocalBusinessJsonLd, ServiceJsonLd } from '@/components/seo/json-ld'
import { siteConfig } from '@/config/site'
import { homeGalleryPreview } from '@/config/images'

export const metadata: Metadata = {
  title: siteConfig.seo.defaultTitle,
  description: siteConfig.seo.defaultDescription,
}

export default function HomePage() {
  return (
    <>
      <LocalBusinessJsonLd />
      <ServiceJsonLd />
      
      <HeroSection />
      <ServicesPreview />
      <ProcessSection />
      <TrustSection />
      
      {/* Gallery Preview */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold text-charcoal-900 md:text-4xl lg:text-5xl">
              See Our Work
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-charcoal-600">
              Browse our gallery of completed kitchen cabinet projects throughout Detroit.
            </p>
          </div>

          {/* TEMP PLACEHOLDER – REPLACE WITH REAL SELA CABINETS PHOTOS */}
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {homeGalleryPreview.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-charcoal-100"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-charcoal-200">{item.location}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href="/gallery"
              className="inline-flex items-center gap-2 text-lg font-semibold text-charcoal-900 transition-colors hover:text-wood-600"
            >
              View full gallery
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <CTASection variant="dark" />
    </>
  )
}

