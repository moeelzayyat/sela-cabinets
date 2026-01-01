'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Phone, Video, Home, Calendar, ArrowRight, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/config/site'
import { trackBookClick } from '@/lib/analytics'

const appointmentTypes = [
  {
    id: 'phone',
    title: 'Free Phone Consultation',
    duration: '15 minutes',
    icon: Phone,
    description: 'Quick call to discuss your project, answer questions, and see if we\'re a good fit.',
    benefits: [
      'No commitment required',
      'Get quick answers to your questions',
      'Discuss budget and timeline',
      'Learn about our process',
    ],
    url: siteConfig.calendly.phoneConsultation,
  },
  {
    id: 'inhome',
    title: 'In-Home Measurement Visit',
    duration: '30-45 minutes',
    icon: Home,
    description: 'We visit your home to measure your kitchen and discuss design options in person.',
    benefits: [
      'Precise kitchen measurements',
      'See cabinet samples in your space',
      'Discuss layout options',
      'Get accurate pricing',
    ],
    url: siteConfig.calendly.inhomeMeasurement,
  },
  {
    id: 'virtual',
    title: 'Virtual Design Planning',
    duration: '30 minutes',
    icon: Video,
    description: 'Video consultation for design guidance, 3D planning discussion, and style selection.',
    benefits: [
      'Convenient from home',
      'Review design concepts',
      'Discuss style options',
      'Get expert recommendations',
    ],
    url: siteConfig.calendly.virtualDesign,
  },
]

export default function BookPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [showEmbed, setShowEmbed] = useState(false)

  const handleSelect = (typeId: string, url: string) => {
    trackBookClick(typeId)
    setSelectedType(typeId)
    setShowEmbed(true)
    
    // Load Calendly widget script
    const script = document.createElement('script')
    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    document.body.appendChild(script)
  }

  const selectedAppointment = appointmentTypes.find((t) => t.id === selectedType)

  return (
    <>
      {/* Hero */}
      <section className="section-padding bg-charcoal-50">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl font-bold text-charcoal-900 md:text-5xl lg:text-6xl">
              Book a Consultation
            </h1>
            <p className="mt-6 text-lg text-charcoal-600 md:text-xl">
              Choose the consultation type that works best for you. All consultations 
              are free and there&apos;s no obligation to proceed.
            </p>
          </div>
        </div>
      </section>

      {/* Appointment Types */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          {!showEmbed ? (
            <div className="grid gap-6 lg:grid-cols-3">
              {appointmentTypes.map((type) => (
                <div
                  key={type.id}
                  className={`group cursor-pointer rounded-2xl border-2 p-8 transition-all ${
                    selectedType === type.id
                      ? 'border-charcoal-900 bg-charcoal-50 shadow-lg'
                      : 'border-charcoal-200 bg-white hover:border-charcoal-300 hover:shadow-md'
                  }`}
                  onClick={() => handleSelect(type.id, type.url)}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-charcoal-900 text-white transition-colors group-hover:bg-wood-600">
                    <type.icon className="h-7 w-7" />
                  </div>

                  <h2 className="mt-6 font-display text-xl font-bold text-charcoal-900">
                    {type.title}
                  </h2>
                  <p className="mt-1 text-sm font-medium text-wood-600">
                    {type.duration}
                  </p>

                  <p className="mt-4 text-charcoal-600">{type.description}</p>

                  <ul className="mt-6 space-y-2">
                    {type.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-2 text-sm text-charcoal-700">
                        <div className="h-1.5 w-1.5 rounded-full bg-wood-500" />
                        {benefit}
                      </li>
                    ))}
                  </ul>

                  <Button className="mt-8 w-full" size="lg">
                    <Calendar className="mr-2 h-5 w-5" />
                    Select & Book
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div>
              {/* Back button */}
              <button
                onClick={() => {
                  setShowEmbed(false)
                  setSelectedType(null)
                }}
                className="mb-6 flex items-center gap-2 text-charcoal-600 hover:text-charcoal-900"
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
                Back to options
              </button>

              {/* Selected type info */}
              {selectedAppointment && (
                <div className="mb-8 rounded-xl border border-charcoal-200 bg-charcoal-50 p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-charcoal-900 text-white">
                      <selectedAppointment.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="font-display text-xl font-bold text-charcoal-900">
                        {selectedAppointment.title}
                      </h2>
                      <p className="text-sm text-charcoal-600">
                        {selectedAppointment.duration}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Calendly Embed */}
              <div className="overflow-hidden rounded-2xl border border-charcoal-200 bg-white">
                <div
                  className="calendly-inline-widget"
                  data-url={selectedAppointment?.url}
                  style={{ minWidth: '320px', height: '700px' }}
                />
              </div>

              {/* Fallback link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-charcoal-500">
                  Having trouble with the scheduler?{' '}
                  <a
                    href={selectedAppointment?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-wood-600 hover:underline"
                  >
                    Open in new tab
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </p>
              </div>
            </div>
          )}

          {/* Phone CTA */}
          <div className="mt-16 rounded-xl border border-charcoal-200 bg-charcoal-50 p-8 text-center">
            <p className="text-lg text-charcoal-700">
              Prefer to talk now?{' '}
              <a
                href={siteConfig.phoneLink}
                className="font-semibold text-charcoal-900 hover:underline"
              >
                Call us at {siteConfig.phoneFormatted}
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="section-padding wood-grain-bg">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center font-display text-3xl font-bold text-charcoal-900 md:text-4xl">
              What to Expect
            </h2>
            <div className="mt-12 space-y-8">
              <div className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-charcoal-900 text-white">
                  1
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-charcoal-900">
                    We&apos;ll Discuss Your Vision
                  </h3>
                  <p className="mt-2 text-charcoal-600">
                    Tell us about your kitchen, your style preferences, and what you&apos;re 
                    hoping to achieve with new cabinets.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-charcoal-900 text-white">
                  2
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-charcoal-900">
                    We&apos;ll Answer Your Questions
                  </h3>
                  <p className="mt-2 text-charcoal-600">
                    No question is too small. We&apos;ll explain our process, discuss 
                    timelines, and help you understand your options.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-charcoal-900 text-white">
                  3
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-charcoal-900">
                    We&apos;ll Outline Next Steps
                  </h3>
                  <p className="mt-2 text-charcoal-600">
                    If we&apos;re a good fit, we&apos;ll schedule a measurement visit 
                    and start planning your dream kitchen. No pressure, no obligation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Estimate CTA */}
      <section className="section-padding bg-charcoal-900 text-white">
        <div className="container-wide text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Want an Estimate First?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-charcoal-300">
            Share details about your project and we&apos;ll get back to you with a 
            preliminary estimate.
          </p>
          <Link href="/estimate" className="mt-8 inline-block">
            <Button size="lg" variant="white">
              Request an Estimate
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}

