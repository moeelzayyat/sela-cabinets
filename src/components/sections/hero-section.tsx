import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/config/site'
import { heroImages } from '@/config/images'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="container-wide grid min-h-[82vh] items-center gap-12 py-20 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-charcoal-200 bg-white px-4 py-2 text-sm font-medium text-charcoal-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-wood-500" />
            Serving {siteConfig.location.city} & 15+ metro cities
          </div>

          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.1] text-charcoal-900 sm:text-5xl md:text-6xl">
            Your Detroit Kitchen,
            <span className="mt-2 block text-primary">
              Redesigned
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-lg text-charcoal-600 sm:text-xl">
            Premium semi-custom cabinets, precise in-home measurement, and professional installation for a kitchen that feels tailored to your home.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/book">
              <Button size="xl" className="w-full bg-primary hover:bg-[#184A47] sm:w-auto">
                See Your New Kitchen
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/estimate">
              <Button
                size="xl"
                variant="outline"
                className="w-full sm:w-auto"
              >
                Get a Design Estimate
              </Button>
            </Link>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={siteConfig.phoneLink}
              className="flex items-center gap-3 text-lg font-semibold text-charcoal-900 transition-colors hover:text-primary"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                <Phone className="h-5 w-5" />
              </div>
              <span>{siteConfig.phoneFormatted}</span>
            </a>
            <span className="hidden text-charcoal-300 sm:inline">|</span>
            <span className="text-charcoal-600">Private consultations available</span>
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-charcoal-200 bg-white shadow-sm">
            <Image
              src={heroImages.main.src}
              alt={heroImages.main.alt}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 54vw"
            />
          </div>
          <div className="absolute -bottom-6 left-6 right-6 rounded-xl border border-charcoal-200 bg-white/95 p-4 shadow-md backdrop-blur">
            <p className="text-sm font-semibold text-charcoal-900">Measured, planned, and installed with care.</p>
            <p className="mt-1 text-sm text-charcoal-600">A calm cabinet process for Detroit-area homeowners.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
