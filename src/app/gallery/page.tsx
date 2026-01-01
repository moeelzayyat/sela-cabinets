import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { CTASection } from '@/components/sections/cta-section'
import { galleryImages } from '@/config/images'

export const metadata: Metadata = {
  title: 'Project Gallery',
  description: 'Browse our gallery of completed kitchen cabinet projects in Detroit. See examples of our cabinet installations, styles, and craftsmanship.',
}

// TEMP PLACEHOLDER – REPLACE WITH REAL SELA CABINETS PHOTOS
// Gallery images are centralized in src/config/images.ts

export default function GalleryPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-padding bg-charcoal-50">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl font-bold text-charcoal-900 md:text-5xl lg:text-6xl">
              Project Gallery
            </h1>
            <p className="mt-6 text-lg text-charcoal-600 md:text-xl">
              See the quality of our work. Browse kitchen cabinet projects we&apos;ve 
              completed throughout the Detroit metro area.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      {/* TEMP PLACEHOLDER – REPLACE WITH REAL SELA CABINETS PHOTOS */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {galleryImages.map((item) => (
              <div
                key={item.id}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-charcoal-200 bg-white transition-shadow hover:shadow-xl"
              >
                {/* Project Image */}
                <div className="aspect-[4/3] overflow-hidden bg-charcoal-100">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={800}
                    height={600}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="font-display text-lg font-semibold text-charcoal-900 group-hover:text-wood-600">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-charcoal-500">{item.location}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-charcoal-100 px-3 py-1 text-xs font-medium text-charcoal-700">
                      {item.style}
                    </span>
                    <span className="rounded-full bg-wood-100 px-3 py-1 text-xs font-medium text-wood-700">
                      {item.finish}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Note for future replacement */}
          <div className="mt-12 rounded-xl border border-charcoal-200 bg-charcoal-50 p-8 text-center">
            <p className="text-charcoal-600">
              <strong>Note:</strong> These are placeholder images. Replace with real SELA Cabinets project photos 
              by updating <code className="rounded bg-charcoal-200 px-2 py-0.5">src/config/images.ts</code>.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding wood-grain-bg">
        <div className="container-wide text-center">
          <h2 className="font-display text-3xl font-bold text-charcoal-900 md:text-4xl">
            Want Your Kitchen Featured Here?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-charcoal-600">
            Let&apos;s create a beautiful kitchen you&apos;ll love. Start with a free consultation 
            to discuss your vision.
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
      </section>

      <CTASection variant="dark" />
    </>
  )
}

