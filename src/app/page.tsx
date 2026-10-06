import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { HeroSection } from '@/components/sections/hero-section'
import { ServicesPreview } from '@/components/sections/services-preview'
import { ProcessSection } from '@/components/sections/process-section'
import { TrustSection } from '@/components/sections/trust-section'
import { CTASection } from '@/components/sections/cta-section'
import { CompletedProjectsSection } from '@/components/sections/completed-projects-section'
import { ReviewsSection } from '@/components/sections/reviews-section'
import { ServiceJsonLd } from '@/components/seo/json-ld'
import { createPageSocialMetadata } from '@/components/seo/page-social-metadata'
import { siteConfig } from '@/config/site'
import { homeGalleryPreview } from '@/config/images'
import { cabinetConstruction } from '@/config/products-catalog'

export const metadata: Metadata = {
  title: { absolute: siteConfig.seo.defaultTitle },
  description: siteConfig.seo.defaultDescription,
  alternates: { canonical: '/' },
  ...createPageSocialMetadata({
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.defaultDescription,
    path: '/',
    absoluteTitle: true,
    image: '/images/seo/home-og.jpg',
  }),
}

export default function HomePage() {
  return (
    <>
      <ServiceJsonLd />
      
      <HeroSection />
      <ServicesPreview />
      <ProcessSection />
      <TrustSection />

      <section className="section-padding bg-wood-50">
        <div className="container-wide grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Price expectations</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-charcoal-900 md:text-4xl">
              What should you expect to invest?
            </h2>
            <p className="mt-5 text-xl font-semibold leading-8 text-charcoal-900">
              Cabinet and installation pricing depends on kitchen size, cabinet style, layout,
              delivery requirements, site conditions, and the work included in the written scope.
            </p>
            <p className="mt-4 leading-7 text-charcoal-700">
              The exact price comes after in-home measurement and a review of cabinet selection,
              delivery, site conditions, and installation scope.
            </p>
          </div>
          <div className="rounded-2xl border border-wood-200 bg-white p-7 sm:p-8">
            <h3 className="font-display text-2xl font-semibold text-charcoal-900">Quality you can compare</h3>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {cabinetConstruction.framed.slice(0, 6).map((item) => (
                <li key={item} className="flex gap-3 text-charcoal-700">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/products#construction" className="mt-6 inline-block font-semibold text-primary hover:underline">Compare cabinet construction →</Link>
          </div>
        </div>
      </section>

      <section className="section-padding bg-charcoal-50">
        <div className="container-wide grid gap-8 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">One point of contact</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-charcoal-900 md:text-4xl">Direct communication from first call to walkthrough</h2>
          </div>
          <div className="space-y-4 text-lg leading-8 text-charcoal-700">
            <p>SELA Cabinets coordinates questions, measurements, cabinet selection, ordering, scheduling, and project updates.</p>
            <p>A cabinet installation specialist focuses on precise cabinet work: leveling, alignment, scribing, secure attachment, adjustment, and clean fit in the home.</p>
          </div>
        </div>
      </section>
      
      {/* Style Inspiration Preview */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold text-charcoal-900 md:text-4xl lg:text-5xl">
              Style Inspiration
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-charcoal-600">
              Preview current framed and frameless cabinet collections. These catalog
              images show style direction—not completed SELA projects.
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
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-charcoal-200">Current cabinet collection</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href="/gallery"
              className="inline-flex items-center gap-2 text-lg font-semibold text-charcoal-900 transition-colors hover:text-primary"
            >
              Explore style inspiration
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <CompletedProjectsSection />
      <ReviewsSection />

      <CTASection variant="dark" />
    </>
  )
}
