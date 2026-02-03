import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CTASection } from '@/components/sections/cta-section'
import { MapPin, Phone, CheckCircle } from 'lucide-react'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Kitchen Cabinets Troy MI | Cabinet Installation & Design',
  description: 'Kitchen cabinet installation in Troy, MI. Aline cabinets, professional measuring & installation. Free in-home estimates. Serving Troy, Rochester Hills & Oakland County.',
  keywords: ['kitchen cabinets Troy MI', 'cabinet installation Troy', 'kitchen remodel Troy', 'Aline cabinets Troy', 'Troy kitchen design', 'Oakland County cabinets'],
}

export default function TroyPage() {
  return (
    <>
      <section className="section-padding bg-charcoal-900 text-white">
        <div className="container-wide">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-wood-500/30 bg-wood-900/30 px-4 py-2 text-sm text-wood-300">
                <MapPin className="h-4 w-4" />
                Serving Troy, Michigan
              </div>
              <h1 className="mt-6 font-display text-4xl font-bold md:text-5xl lg:text-6xl">
                Kitchen Cabinets in Troy
              </h1>
              <p className="mt-6 text-lg text-charcoal-300">
                Premium kitchen cabinets for Troy and Oakland County homes. Aline quality, 
                professional installation, and service that exceeds expectations.
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
              <h2 className="font-display text-2xl font-bold">Troy & Oakland County Service</h2>
              <ul className="mt-6 space-y-4">
                {[
                  'Serving Troy & Rochester Hills',
                  'Free in-home measurements',
                  'Oakland County kitchen experts',
                  'Flexible scheduling',
                  'Competitive pricing',
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

      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold text-charcoal-900">Cabinet Services for Troy Homes</h2>
          </div>
          
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                title: 'Full Service',
                description: 'From selection to installation, we handle your Troy kitchen project completely.',
              },
              {
                title: 'Premium Products',
                description: 'Aline cabinets known for quality construction and beautiful finishes.',
              },
              {
                title: 'Local Expertise',
                description: 'Understanding of Troy and Oakland County homes and styles.',
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

      <CTASection 
        title="Troy Kitchen Cabinet Quote"
        description="Book your free Troy consultation. We'll bring samples and provide a detailed quote for your project."
        variant="dark"
      />
    </>
  )
}
