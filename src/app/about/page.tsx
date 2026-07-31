import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Users, Award, Clock, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProcessSection } from '@/components/sections/process-section'
import { CTASection } from '@/components/sections/cta-section'
import { siteConfig } from '@/config/site'
import { aboutImages } from '@/config/images'
import { createPageSocialMetadata } from '@/components/seo/page-social-metadata'

export const metadata: Metadata = {
  title: 'About Our Kitchen Cabinet Planning Team',
  description: 'Learn how SELA Cabinets guides Metro Detroit homeowners through measurement, cabinet selection, ordering coordination, and installation planning.',
  alternates: { canonical: '/about' },
  keywords: ['SELA Cabinets Detroit', 'kitchen cabinet planning Detroit', 'Detroit cabinet company', 'local cabinet planning'],
  ...createPageSocialMetadata({
    title: 'About Our Kitchen Cabinet Planning Team',
    description: 'Learn how SELA Cabinets guides Metro Detroit homeowners through measurement, cabinet selection, ordering coordination, and installation planning.',
    path: '/about',
  }),
}

const values = [
  {
    icon: Award,
    title: 'Quality First',
    description: 'We compare cabinet options carefully and keep the plan grounded in the measured space.',
  },
  {
    icon: Users,
    title: 'Customer Focus',
    description: 'We start by listening to your priorities, questions, and concerns.',
  },
  {
    icon: Clock,
    title: 'Reliability',
    description: 'We aim for clear communication and confirm timing from the actual project scope.',
  },
  {
    icon: MapPin,
    title: 'Local Expertise',
    description: 'We focus on the cabinet-planning needs of Metro Detroit homeowners.',
  },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-padding bg-charcoal-50">
        <div className="container-wide">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h1 className="font-display text-4xl font-bold text-charcoal-900 md:text-5xl lg:text-6xl">
                About {siteConfig.name}
              </h1>
              <p className="mt-6 text-lg text-charcoal-600 md:text-xl">
                SELA helps Metro Detroit homeowners turn kitchen-renovation questions into
                a measured, coordinated cabinet plan.
              </p>
              <p className="mt-4 text-lg text-charcoal-600">
                We guide the process from layout and cabinet selection through ordering,
                delivery, and installation planning.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link href="/book">
                  <Button size="lg">Plan My Kitchen</Button>
                </Link>
                <Link href="/services">
                  <Button size="lg" variant="outline">
                    Our Services
                  </Button>
                </Link>
              </div>
            </div>
            {/* TEMP PLACEHOLDER – REPLACE WITH REAL SELA CABINETS PHOTOS */}
            <div className="aspect-square overflow-hidden rounded-2xl bg-charcoal-100 lg:aspect-[4/3]">
              <Image
                src={aboutImages.team.src}
                alt={aboutImages.team.alt}
                width={800}
                height={600}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold text-charcoal-900 md:text-4xl lg:text-5xl">
              What We Stand For
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-charcoal-600">
              Our values guide everything we do, from how we source cabinets to how we 
              treat every homeowner we work with.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <value.icon className="h-8 w-8" />
                </div>
                <h3 className="mt-6 font-display text-xl font-semibold text-charcoal-900">
                  {value.title}
                </h3>
                <p className="mt-2 text-charcoal-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <ProcessSection />

      {/* Trust Section */}
      <section className="section-padding bg-charcoal-50">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold text-charcoal-900 md:text-4xl">
              Working With Us
            </h2>
            <p className="mt-6 text-lg text-charcoal-600">
              When you choose {siteConfig.name}, you get a dedicated team focused on 
              your project from start to finish. We offer:
            </p>
            <ul className="mt-8 space-y-4 text-left">
              <li className="flex items-start gap-4">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  ?
                </div>
                <span className="text-charcoal-700">
                  <strong>Personal consultations</strong> - phone, virtual, or in-person to discuss your project
                </span>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  ?
                </div>
                <span className="text-charcoal-700">
                  <strong>In-home measurement</strong> - precise measurements for a perfect fit
                </span>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  ?
                </div>
                <span className="text-charcoal-700">
                  <strong>Design assistance</strong> - help choosing styles, colors, and layouts
                </span>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  ?
                </div>
                <span className="text-charcoal-700">
                  <strong>Professional installation</strong> - experienced installers who take pride in their work
                </span>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  ?
                </div>
                <span className="text-charcoal-700">
                  <strong>Clear communication</strong> - we keep you informed throughout the process
                </span>
              </li>
            </ul>

            {/* Licensing note */}
            <div className="mt-10 rounded-xl border border-charcoal-200 bg-white p-6">
              <p className="text-sm text-charcoal-600">
                <strong>Questions about licensing or insurance?</strong> We&apos;re happy to 
                discuss our qualifications and provide any documentation you need. Just ask 
                during your consultation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Area */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold text-charcoal-900 md:text-4xl">
              Serving Detroit & Surrounding Areas
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-charcoal-600">
              We proudly serve homeowners throughout the Detroit metro area. If you don&apos;t 
              see your city listed, contact us. We may still be able to help.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {siteConfig.serviceAreas.map((area) => (
              <span
                key={area}
                className="rounded-full border border-charcoal-200 bg-charcoal-50 px-4 py-2 text-sm font-medium text-charcoal-700"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      <CTASection variant="dark" />
    </>
  )
}
