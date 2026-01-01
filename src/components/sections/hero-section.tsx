import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/config/site'
import { heroImages } from '@/config/images'

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-charcoal-950">
      {/* Background Image */}
      {/* TEMP PLACEHOLDER – REPLACE WITH REAL SELA CABINETS PHOTOS */}
      <div className="absolute inset-0">
        <Image
          src={heroImages.main.src}
          alt={heroImages.main.alt}
          fill
          priority
          className="object-cover opacity-40"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950/90 via-charcoal-950/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="container-wide relative flex min-h-[90vh] items-center py-20">
        <div className="max-w-3xl">
          {/* Location badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-wood-500/30 bg-wood-900/50 px-4 py-2 text-sm text-wood-300">
            <span className="h-2 w-2 rounded-full bg-wood-400" />
            Serving {siteConfig.location.city} and surrounding areas
          </div>

          {/* Main headline */}
          <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Premium Kitchen Cabinets
            <span className="mt-2 block text-wood-400">
              Expertly Installed
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 max-w-xl text-lg text-charcoal-300 sm:text-xl">
            Transform your kitchen with quality cabinets and professional installation. 
            From free in-home measurement to flawless installation — we handle it all.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/book">
              <Button size="xl" className="w-full sm:w-auto">
                Book a Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/estimate">
              <Button
                size="xl"
                variant="outline"
                className="w-full border-white text-white hover:bg-white hover:text-charcoal-900 sm:w-auto"
              >
                Get an Estimate
              </Button>
            </Link>
          </div>

          {/* Phone CTA */}
          <div className="mt-8 flex items-center gap-4">
            <a
              href={siteConfig.phoneLink}
              className="flex items-center gap-2 text-lg font-semibold text-white transition-colors hover:text-wood-400"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-wood-600">
                <Phone className="h-5 w-5" />
              </div>
              {siteConfig.phoneFormatted}
            </a>
            <span className="text-charcoal-500">|</span>
            <span className="text-charcoal-400">Call for immediate assistance</span>
          </div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  )
}

