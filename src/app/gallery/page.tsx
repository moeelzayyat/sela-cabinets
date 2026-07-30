import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { CTASection } from '@/components/sections/cta-section'
import { galleryImages } from '@/config/images'

export const metadata: Metadata = {
  title: 'Style Inspiration',
  description: 'Explore cabinet styles, finishes, layouts, and design directions. Reference images are shown for inspiration and are not represented as completed SELA projects.',
  alternates: { canonical: '/gallery' },
}

export default function GalleryPage() {
  return (
    <>
      <section className="section-padding bg-charcoal-50">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl font-bold text-charcoal-900 md:text-5xl lg:text-6xl">
              Style Inspiration
            </h1>
            <p className="mt-6 text-lg text-charcoal-600 md:text-xl">
              Explore cabinet styles, finishes, and layout ideas. These are reference
              images for planning inspiration—not completed SELA projects.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {galleryImages.map((item) => (
              <div
                key={item.id}
                className="group overflow-hidden rounded-2xl border border-charcoal-200 bg-white transition-all hover:border-primary/30 hover:shadow-md"
              >
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

                <div className="p-5">
                  <h2 className="font-display text-lg font-semibold text-charcoal-900 group-hover:text-primary">
                    {item.title}
                  </h2>
                  <p className="mt-1 text-sm text-charcoal-600">Inspiration reference</p>
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
        </div>
      </section>

      <section className="section-padding wood-grain-bg">
        <div className="container-wide text-center">
          <h2 className="font-display text-3xl font-bold text-charcoal-900 md:text-4xl">
            Ready to Plan Your Kitchen?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-charcoal-600">
            Start with a short planning call to discuss your layout, priorities, and
            the next measured step.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/book">
              <Button size="lg">Plan My Kitchen</Button>
            </Link>
            <Link href="/estimate">
              <Button size="lg" variant="outline">
                Request an Estimate
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <CTASection variant="dark" />
    </>
  )
}
