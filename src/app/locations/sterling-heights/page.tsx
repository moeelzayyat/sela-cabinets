import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CTASection } from '@/components/sections/cta-section'
import { MapPin, Phone, CheckCircle } from 'lucide-react'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Kitchen Cabinets Sterling Heights MI | Cabinet Installation',
  description: 'Kitchen cabinet installation in Sterling Heights, MI. cabinets, professional measuring & installation. In-home estimates. Serving Sterling Heights & Macomb County.',
  keywords: ['kitchen cabinets Sterling Heights MI', 'cabinet installation Sterling Heights', 'kitchen remodel Sterling Heights', 'Macomb County cabinets'],
}

export default function SterlingHeightsPage() {
  return (
    <>
      <section className="section-padding bg-charcoal-900 text-white">
        <div className="container-wide">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-wood-500/30 bg-wood-900/30 px-4 py-2 text-sm text-wood-300">
                <MapPin className="h-4 w-4" />
                Serving Sterling Heights, Michigan
              </div>
              <h1 className="mt-6 font-display text-4xl font-bold md:text-5xl lg:text-6xl">
                Kitchen Cabinets in Sterling Heights
              </h1>
              <p className="mt-6 text-lg text-charcoal-300">
                Premium kitchen cabinets for Sterling Heights homes. Expert installation, 
                quality products, and service you can trust.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link href="/book">
                  <Button size="lg" className="bg-primary hover:bg-[#184A47]">
                    Plan My Kitchen
                  </Button>
                </Link>
                <a href={siteConfig.phoneLink}>
                  <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white hover:text-charcoal-900">
                    <Phone className="mr-2 h-5 w-5" />
                    Call {siteConfig.phoneFormatted}
                  </Button>
                </a>
              </div>
            </div>
            
            <div className="rounded-2xl bg-charcoal-800 p-8">
              <h2 className="font-display text-2xl font-bold">Sterling Heights Service</h2>
              <ul className="mt-6 space-y-4">
                {[
                  'In-home measurement in Sterling Heights',
                  '24+ cabinet styles available',
                  'Professional installation team',
                  'Flexible scheduling',
                  'Premium cabinet guidance',
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
        title="Ready to Update Your Sterling Heights Kitchen?"
        description="Start a Sterling Heights cabinet estimate with a consultation and measured project review."
        variant="wood"
      />
    </>
  )
}
