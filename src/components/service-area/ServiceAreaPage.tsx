import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle, MapPin, Phone, Calendar } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { FAQSchema, BreadcrumbSchema } from '@/components/seo/SchemaMarkup'

interface ServiceAreaPageProps {
  city: string
  state: string
  stateAbbr: string
  population?: string
  highlights: string[]
  neighborhoods?: string[]
}

export function ServiceAreaPage({
  city,
  state,
  stateAbbr,
  population,
  highlights,
  neighborhoods,
}: ServiceAreaPageProps) {
  const faqs = [
    {
      question: `Do you serve ${city}, ${stateAbbr}?`,
      answer: `Yes! SELA Cabinets proudly serves ${city} and the surrounding metro area. We offer in-home measurement throughout ${city} and professional cabinet installation by experienced local contractors.`,
    },
    {
      question: `How do cabinet estimates work in ${city}?`,
      answer: `Every SELA Cabinets estimate is based on the actual kitchen layout, cabinet style, finish selection, storage needs, and installation scope. We start with a consultation and in-home measurement so ${city} homeowners receive a detailed recommendation for their specific project.`,
    },
    {
      question: `What areas in ${city} do you serve?`,
      answer: `We serve all neighborhoods in ${city}, including ${neighborhoods?.slice(0, 5).join(', ') || 'the entire metro area'}, and surrounding communities. Contact us to confirm service in your specific area.`,
    },
    {
      question: `How long does cabinet installation take in ${city}?`,
      answer: `Cabinet project timing in ${city} is confirmed after inspection. We review site conditions, cabinet selections, supplier ordering lead time, delivery schedule, and installation scope before providing a realistic project timeline.`,
    },
  ]

  return (
    <>
      <FAQSchema faqs={faqs} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Service Areas', url: '/service-areas' },
          { name: city, url: `/service-areas/${city.toLowerCase()}` },
        ]}
      />

      {/* Hero */}
      <section className="bg-charcoal-50 py-16 lg:py-24">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 flex items-center justify-center gap-2 text-primary">
              <MapPin className="h-5 w-5" />
              <span className="text-sm font-medium uppercase tracking-wide">Serving {city}, {stateAbbr}</span>
            </div>
            <h1 className="font-display text-4xl font-bold text-charcoal-900 md:text-5xl lg:text-6xl">
              Kitchen Cabinets {city}, {stateAbbr}
            </h1>
            <p className="mt-6 text-lg text-charcoal-600 md:text-xl">
              Premium semi-custom cabinets with professional installation. {population && `Serving ${population}+ residents in ${city} and `}surrounding areas.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/book">
                <Button size="lg">
                  <Calendar className="mr-2 h-5 w-5" />
                  Schedule Measurement
                </Button>
              </Link>
              <a href={siteConfig.phoneLink}>
                <Button size="lg" variant="outline">
                  <Phone className="mr-2 h-5 w-5" />
                  {siteConfig.phoneFormatted}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-3xl font-bold text-charcoal-900 md:text-4xl">
              Why {city} Homeowners Choose SELA Cabinets
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {highlights.map((highlight, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                  <span className="text-charcoal-700">{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Service Details */}
      <section className="section-padding bg-charcoal-50">
        <div className="container-wide">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="font-display text-3xl font-bold text-charcoal-900 md:text-4xl">
                Complete Kitchen Cabinet Services in {city}
              </h2>
              <p className="mt-4 text-charcoal-600">
                We provide everything you need for your kitchen cabinet project in {city}:
              </p>
              <ul className="mt-6 space-y-3 text-charcoal-700">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-wood-500" />
                  <span><strong>Cabinet Supply:</strong> Wide selection of premium semi-custom cabinets</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-wood-500" />
                  <span><strong>Professional Installation:</strong> Experienced local contractors</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-wood-500" />
                  <span><strong>In-Home Measurement:</strong> Accurate measurements and project review</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-wood-500" />
                  <span><strong>Design Consultation:</strong> Expert help planning your dream kitchen</span>
                </li>
              </ul>
              <div className="mt-8">
                <Link href="/services">
                  <Button>View All Services</Button>
                </Link>
              </div>
            </div>
            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <h3 className="text-lg font-semibold text-charcoal-900">Get Your Cabinet Estimate</h3>
              <p className="mt-2 text-sm text-charcoal-600">
                {city} homeowners - start with a personal consultation and in-home measurement
              </p>
              <div className="mt-6 space-y-4">
                <Link href="/estimate" className="block">
                  <Button className="w-full" size="lg">
                    Request Online Estimate
                  </Button>
                </Link>
                <Link href="/book" className="block">
                  <Button className="w-full" variant="outline" size="lg">
                    Plan My Kitchen
                  </Button>
                </Link>
              </div>
              <p className="mt-6 text-center text-sm text-charcoal-500">
                Questions? Call us at{' '}
                <a href={siteConfig.phoneLink} className="font-semibold text-charcoal-900 hover:underline">
                  {siteConfig.phoneFormatted}
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Neighborhoods */}
      {neighborhoods && neighborhoods.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-wide">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-display text-3xl font-bold text-charcoal-900 md:text-4xl">
                {city} Neighborhoods We Serve
              </h2>
              <p className="mt-4 text-charcoal-600">
                Proud to serve homeowners throughout {city}, including:
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {neighborhoods.map((neighborhood, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-charcoal-100 px-4 py-2 text-sm font-medium text-charcoal-700"
                  >
                    {neighborhood}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="section-padding bg-charcoal-50">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-3xl font-bold text-charcoal-900 md:text-4xl">
              Frequently Asked Questions - {city}
            </h2>
            <div className="mt-8 space-y-6">
              {faqs.map((faq, index) => (
                <details key={index} className="group rounded-lg bg-white p-6 shadow-sm">
                  <summary className="flex cursor-pointer items-center justify-between font-semibold text-charcoal-900">
                    {faq.question}
                    <span className="ml-4 text-primary group-open:rotate-180">▼</span>
                  </summary>
                  <p className="mt-4 text-charcoal-600">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-wide text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Ready to Transform Your {city} Kitchen?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">
            Join satisfied {city} homeowners. Start with a personal cabinet consultation and measured project plan.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/book">
              <Button size="lg" variant="secondary">
                Schedule Measurement
              </Button>
            </Link>
            <a href={siteConfig.phoneLink}>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Call {siteConfig.phoneFormatted}
              </Button>
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
