import Link from 'next/link'
import type { Metadata } from 'next'
import { Calendar, ExternalLink } from 'lucide-react'

import { CalendlyEmbed } from '@/components/calendly/calendly-embed'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Plan My Kitchen',
  description: 'Schedule a 15-minute SELA kitchen planning call for your Metro Detroit cabinet project.',
  alternates: { canonical: '/book' },
}

export default function BookPage() {
  const schedulingUrl = siteConfig.calendly.kitchenPlanningCall

  return (
    <>
      <section className="section-padding bg-charcoal-50">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl font-bold text-charcoal-900 md:text-5xl lg:text-6xl">
              Plan My Kitchen
            </h1>
            <p className="mt-6 text-lg text-charcoal-600 md:text-xl">
              Start with a focused 15-minute call. We&apos;ll learn about your space,
              answer your first questions, and outline the next step toward a measured,
              coordinated cabinet plan.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white" aria-labelledby="scheduler-title">
        <div className="container-wide">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 rounded-xl border border-charcoal-200 bg-charcoal-50 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-charcoal-900 text-white">
                  <Calendar className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <h2 id="scheduler-title" className="font-display text-xl font-bold text-charcoal-900">
                    SELA Kitchen Planning Call
                  </h2>
                  <p className="text-sm font-medium text-primary">15 minutes</p>
                </div>
              </div>
              <p className="mt-4 text-charcoal-600">
                Choose a time that works for you. There&apos;s no obligation—just a clear
                conversation about your kitchen, cabinet needs, and next steps.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-charcoal-200 bg-white">
              <CalendlyEmbed url={schedulingUrl} appointmentType="kitchen_planning_call" />
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-charcoal-600">
                Having trouble with the scheduler?{' '}
                <a
                  href={schedulingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                >
                  Open scheduler in new tab
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </p>
            </div>

            <div className="mt-12 rounded-xl border border-charcoal-200 bg-charcoal-50 p-8 text-center">
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
        </div>
      </section>

      <section className="section-padding wood-grain-bg">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center font-display text-3xl font-bold text-charcoal-900 md:text-4xl">
              What to Expect
            </h2>
            <div className="mt-12 space-y-8">
              <div className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-charcoal-900 text-white">1</div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-charcoal-900">Tell Us About Your Kitchen</h3>
                  <p className="mt-2 text-charcoal-600">
                    Share what is confusing, what is not working, and what you want the room to do better.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-charcoal-900 text-white">2</div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-charcoal-900">Get Clear Answers</h3>
                  <p className="mt-2 text-charcoal-600">
                    We&apos;ll explain cabinet options, measurement, installation, and the information needed to plan accurately.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-charcoal-900 text-white">3</div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-charcoal-900">Leave With a Next Step</h3>
                  <p className="mt-2 text-charcoal-600">
                    If SELA is a good fit, we&apos;ll outline the next step toward a measured cabinet plan—without pressure or obligation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-charcoal-900 text-white">
        <div className="container-wide text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Want to Share Details First?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-charcoal-300">
            Tell us about your project and we&apos;ll review the details before the conversation.
          </p>
          <Link href="/estimate" className="mt-8 inline-block">
            <Button size="lg" variant="white">Start My Kitchen Plan</Button>
          </Link>
        </div>
      </section>
    </>
  )
}
