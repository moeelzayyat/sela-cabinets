import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CTASection } from '@/components/sections/cta-section'
import { MapPin, Phone, CheckCircle } from 'lucide-react'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Kitchen Cabinets Warren MI | Cabinet Installation & Design',
  description: 'Kitchen cabinet installation in Warren, MI. cabinets, professional measuring & installation. Free in-home estimates. Serving Warren & Macomb County.',
  keywords: ['kitchen cabinets Warren MI', 'cabinet installation Warren', 'kitchen remodel Warren', 'Macomb County cabinets', 'Warren kitchen design'],
}

export default function WarrenPage() {
  return (
    <>
      <section className="section-padding bg-charcoal-900 text-white">
        <div className="container-wide">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-wood-500/30 bg-wood-900/30 px-4 py-2 text-sm text-wood-300">
                <MapPin className="h-4 w-4" />
                Serving Warren, Michigan
              </div>
              <h1 className="mt-6 font-display text-4xl font-bold md:text-5xl lg:text-6xl">
                Kitchen Cabinets in Warren
              </h1>
              <p className="mt-6 text-lg text-charcoal-300">
                Professional kitchen cabinet installation for Warren and Macomb County homes. 
                Quality cabinets, expert measuring, and flawless installation.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link href="/book">
                  <Button size="lg" className="bg-wood-600 hover:bg-wood-500">
                    Book Free Consultation
                  </Button>
                </Link>
                <a href={siteConfig.phoneLink}>
                  <Button size="lg" variant="outline" className="border-white/50">
                    <Phone className="mr-2 h-5 w-5" />
                    Call {siteConfig.phoneFormatted}
                  </Button>
                </a>
              </div>
            </div>
            
            <div className="rounded-2xl bg-charcoal-800 p-8">
              <h2 className="font-display text-2xl font-bold">Why Warren Homeowners Choose SELA</h2>
              <ul className="mt-6 space-y-4">
                {[
                  'Free in-home measurement in Warren',
                  'Macomb County kitchen experts',
                  '24+ cabinet styles ',
                  '1-3 day installation',
                  'Same-week appointments available',
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckCircle className="h-6 w-6 shrink-0 text-wood-400" />
                    <span className="text-charcoal-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <CTASection 
        title="Get Your Warren Kitchen Quote"
        description="Book a free consultation in Warren. We'll bring samples and measure your space."
        variant="wood"
      />
    </>
  )
}
