import Link from 'next/link'
import { ArrowRight, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ResponsiveHeroImage } from '@/components/media/responsive-hero-image'
import { siteConfig } from '@/config/site'
import { heroImages } from '@/config/images'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="container-wide grid min-h-[82vh] items-center gap-12 py-20 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-charcoal-200 bg-white px-4 py-2 text-sm font-medium text-charcoal-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-wood-500" />
            Kitchen cabinets supplied & installed across Metro Detroit
          </div>

          <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-primary">
            You pick the cabinets. We handle the rest.
          </p>

          <h1 className="mt-4 font-display text-4xl font-bold leading-[1.08] text-charcoal-900 sm:text-5xl md:text-6xl">
            Kitchen Cabinets &amp; Professional Installation in Metro Detroit
          </h1>

          <p className="mt-6 max-w-lg text-lg text-charcoal-600 sm:text-xl">
            Quality cabinets at a fair price, measured and installed by an experienced
            installer. You get one point of contact from the first call through the final
            walkthrough.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/estimate">
              <Button size="xl" className="w-full bg-primary hover:bg-[#184A47] sm:w-auto">
                Get a Cabinet Estimate
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/products">
              <Button
                size="xl"
                variant="outline"
                className="w-full sm:w-auto"
              >
                Explore Cabinet Styles
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
            <span className="text-charcoal-600">In-home measurement available</span>
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-charcoal-200 bg-white shadow-sm">
            <ResponsiveHeroImage
              alt={heroImages.main.alt}
              preload
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 left-6 right-6 rounded-xl border border-charcoal-200 bg-white/95 p-4 shadow-md backdrop-blur">
            <p className="text-sm font-semibold text-charcoal-900">Cabinet supply and installation, kept together.</p>
            <p className="mt-1 text-sm text-charcoal-600">One contact for selection, measurement, ordering, and installation updates.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
