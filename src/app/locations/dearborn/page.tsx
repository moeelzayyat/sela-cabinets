import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CTASection } from '@/components/sections/cta-section'
import { MapPin, Phone, CheckCircle } from 'lucide-react'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Kitchen Cabinets Dearborn MI | Cabinet Installation & Design',
  description: 'Kitchen cabinet installation in Dearborn, MI. cabinets, professional measuring & installation. Free in-home estimates. Serving Dearborn & surrounding areas.',
  keywords: ['kitchen cabinets Dearborn MI', 'cabinet installation Dearborn', 'kitchen remodel Dearborn', 'cabinets Dearborn', 'Dearborn kitchen design'],
}

export default function DearbornPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-padding bg-charcoal-900 text-white">
        <div className="container-wide">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-wood-500/30 bg-wood-900/30 px-4 py-2 text-sm text-wood-300">
                <MapPin className="h-4 w-4" />
                Serving Dearborn, Michigan
              </div>
              <h1 className="mt-6 font-display text-4xl font-bold md:text-5xl lg:text-6xl">
                Kitchen Cabinets in Dearborn
              </h1>
              <p className="mt-6 text-lg text-charcoal-300">
                Professional kitchen cabinet installation for Dearborn homes. From classic to contemporary, 
                we bring cabinets to your kitchen with expert measuring and flawless installation.
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
              <h2 className="font-display text-2xl font-bold">
                Why Dearborn Homeowners Choose SELA
              </h2>
              <ul className="mt-6 space-y-4">
                {[
                  'Free in-home measurement in Dearborn',
                  '24+ cabinet styles ',
                  'Installation in 1-3 days',
                  'Same-week appointments available',
                  'Local Detroit-area business',
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

      {/* Services */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold text-charcoal-900 md:text-4xl">
              Cabinet Services in Dearborn
            </h2>
            <p className="mt-4 text-charcoal-600">
              Everything you need for your Dearborn kitchen remodel, from selection to installation.
            </p>
          </div>
          
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                title: 'Cabinet Supply',
                description: 'Choose from 24+ cabinet styles. Framed and frameless options in white, gray, navy, oak, and more.',
              },
              {
                title: 'In-Home Measurement',
                description: 'We come to your Dearborn home for precise measurements. Free with your cabinet order.',
              },
              {
                title: 'Professional Installation',
                description: 'Expert installation by experienced craftsmen. Clean worksite, respect for your home.',
              },
            ].map((service) => (
              <div key={service.title} className="rounded-2xl border border-charcoal-200 p-8">
                <h3 className="font-display text-xl font-semibold text-charcoal-900">{service.title}</h3>
                <p className="mt-2 text-charcoal-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cabinet Styles */}
      <section className="section-padding bg-charcoal-50">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold text-charcoal-900 md:text-4xl">
              Popular Cabinet Styles in Dearborn
            </h2>
            <p className="mt-4 text-charcoal-600">
              These styles are favorites among Dearborn homeowners for their blend of quality and value.
            </p>
          </div>
          
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { name: 'Shaker White', desc: 'Clean, timeless white shaker doors. Perfect for any Dearborn home.' },
              { name: 'Shaker Gray', desc: 'Sophisticated gray for modern Dearborn kitchens.' },
              { name: 'Charleston White', desc: 'Elegant raised panel design for traditional homes.' },
              { name: 'Navy Blue', desc: 'Bold navy for statement Dearborn kitchens.' },
            ].map((style) => (
              <div key={style.name} className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="font-display text-lg font-semibold text-charcoal-900">{style.name}</h3>
                <p className="mt-2 text-sm text-charcoal-600">{style.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <Link href="/products">
              <Button variant="outline" size="lg">
                View All 24+ Cabinet Styles
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Areas Served */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold text-charcoal-900 md:text-4xl">
              Serving Dearborn & Nearby Areas
            </h2>
            <p className="mt-4 text-charcoal-600">
              We provide kitchen cabinet installation throughout Dearborn and surrounding communities.
            </p>
          </div>
          
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            {['Dearborn Heights', 'Allen Park', 'Melvindale', 'Lincoln Park', 'Taylor', 'Southgate'].map((city) => (
              <span key={city} className="rounded-full bg-charcoal-100 px-6 py-3 text-charcoal-700">
                {city}
              </span>
            ))}
          </div>
        </div>
      </section>

      <CTASection 
        title="Get Your Dearborn Kitchen Quote"
        description="Book a free in-home consultation. We'll bring samples, measure your space, and give you a detailed quote."
        variant="dark"
      />
    </>
  )
}
