import { Metadata } from 'next'
import Link from 'next/link'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CTASection } from '@/components/sections/cta-section'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: `Contact ${siteConfig.name} for kitchen cabinets in Detroit. Call ${siteConfig.phone} or book a consultation online. Serving Detroit and surrounding areas.`,
}

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-padding bg-charcoal-50">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl font-bold text-charcoal-900 md:text-5xl lg:text-6xl">
              Contact Us
            </h1>
            <p className="mt-6 text-lg text-charcoal-600 md:text-xl">
              Ready to start your kitchen cabinet project? Get in touch with us today. 
              We&apos;re here to answer your questions and help you get started.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info & Map */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Info */}
            <div>
              <h2 className="font-display text-2xl font-bold text-charcoal-900 md:text-3xl">
                Get In Touch
              </h2>
              <p className="mt-4 text-charcoal-600">
                The best way to start is to book a consultation or request an estimate online. 
                You can also call us directly for immediate assistance.
              </p>

              <div className="mt-8 space-y-6">
                <a
                  href={siteConfig.phoneLink}
                  className="flex items-start gap-4 rounded-xl border border-charcoal-200 bg-charcoal-50 p-5 transition-colors hover:border-charcoal-300"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-charcoal-900 text-white">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal-900">Phone</h3>
                    <p className="mt-1 text-lg font-semibold text-wood-600">
                      {siteConfig.phoneFormatted}
                    </p>
                    <p className="text-sm text-charcoal-500">Click to call</p>
                  </div>
                </a>

                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-start gap-4 rounded-xl border border-charcoal-200 bg-charcoal-50 p-5 transition-colors hover:border-charcoal-300"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-charcoal-900 text-white">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal-900">Email</h3>
                    <p className="mt-1 text-lg font-semibold text-wood-600">
                      {siteConfig.email}
                    </p>
                    <p className="text-sm text-charcoal-500">We&apos;ll respond within 24 hours</p>
                  </div>
                </a>

                <div className="flex items-start gap-4 rounded-xl border border-charcoal-200 bg-charcoal-50 p-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-charcoal-900 text-white">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal-900">Location</h3>
                    <p className="mt-1 text-lg font-semibold text-charcoal-700">
                      {siteConfig.location.full}
                    </p>
                    <p className="text-sm text-charcoal-500">Serving the Detroit metro area</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-xl border border-charcoal-200 bg-charcoal-50 p-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-charcoal-900 text-white">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal-900">Hours</h3>
                    <div className="mt-1 space-y-1 text-charcoal-600">
                      <p>Monday – Friday: 8:00 AM – 6:00 PM</p>
                      <p>Saturday: 9:00 AM – 3:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link href="/book">
                  <Button size="lg" className="w-full sm:w-auto">
                    Book a Consultation
                  </Button>
                </Link>
                <Link href="/estimate">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Get an Estimate
                  </Button>
                </Link>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="overflow-hidden rounded-2xl bg-charcoal-100">
              <div className="flex h-full min-h-[400px] items-center justify-center p-8 text-center">
                <div>
                  <MapPin className="mx-auto h-12 w-12 text-charcoal-400" />
                  <p className="mt-4 text-charcoal-500">
                    Add your Google Maps embed here.
                    <br />
                    <br />
                    <code className="rounded bg-charcoal-200 px-2 py-1 text-xs">
                      NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
                    </code>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="section-padding wood-grain-bg">
        <div className="container-wide">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold text-charcoal-900 md:text-4xl">
              Service Areas
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-charcoal-600">
              We provide kitchen cabinet services throughout the Detroit metro area. 
              If your city isn&apos;t listed, give us a call — we may still be able to help!
            </p>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {siteConfig.serviceAreas.map((area) => (
              <div
                key={area}
                className="rounded-lg bg-white px-4 py-3 text-center font-medium text-charcoal-700 shadow-sm"
              >
                {area}
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection variant="dark" />
    </>
  )
}

