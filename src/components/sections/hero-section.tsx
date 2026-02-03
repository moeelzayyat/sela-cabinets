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
      <div className="absolute inset-0">
        <Image
          src={heroImages.main.src}
          alt={heroImages.main.alt}
          fill
          priority
          className="object-cover opacity-50"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950/95 via-charcoal-950/75 to-charcoal-950/50" />
      </div>

      {/* Content */}
      <div className="container-wide relative flex min-h-[90vh] items-center py-20">
        <div className="max-w-2xl">
          {/* Location badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-wood-500/30 bg-wood-900/30 px-4 py-2 text-sm text-wood-300 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-wood-400 animate-pulse" />
            Serving {siteConfig.location.city} & 15+ metro cities
          </div>

          {/* Main headline */}
          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.1] text-white sm:text-5xl md:text-6xl">
            Your Detroit Kitchen,
            <span className="mt-2 block text-wood-400">
              Redesigned
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 max-w-lg text-lg text-charcoal-300 sm:text-xl">
            Semi-custom cabinets at wholesale prices. 10×10 kitchens from <span className="font-semibold text-wood-400">$3,999 installed</span>.{' '}
            <span className="text-wood-300">Save up to 66% vs big box stores.</span>
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/book">
              <Button size="xl" className="w-full bg-wood-600 hover:bg-wood-500 sm:w-auto">
                See Your New Kitchen
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/estimate">
              <Button
                size="xl"
                variant="outline"
                className="w-full border-white/50 text-white hover:bg-white hover:text-charcoal-900 sm:w-auto"
              >
                Get a Quick Estimate
              </Button>
            </Link>
          </div>

          {/* Phone CTA */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={siteConfig.phoneLink}
              className="flex items-center gap-3 text-lg font-semibold text-white transition-colors hover:text-wood-400"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-wood-600">
                <Phone className="h-5 w-5" />
              </div>
              <span>{siteConfig.phoneFormatted}</span>
            </a>
            <span className="hidden text-charcoal-500 sm:inline">|</span>
            <span className="text-charcoal-400">Same-week appointments</span>
          </div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  )
}
