import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { siteConfig } from '@/config/site'

interface EstimateSuccessProps {
  warning?: string
}

export function EstimateSuccess({ warning }: EstimateSuccessProps) {
  return (
    <section className="section-padding bg-white">
      <div className="container-wide">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" aria-hidden="true" />
          </div>
          <h1 className="mt-6 font-display text-3xl font-bold text-charcoal-900 md:text-4xl">
            Request saved
          </h1>
          <p className="mt-4 text-lg text-charcoal-600">
            Thank you. Your kitchen-planning information was saved securely. We’ll
            review it and follow up by phone or email.
          </p>

          {warning && (
            <div
              role="alert"
              className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-left text-amber-900"
            >
              {warning}
            </div>
          )}

          <div className="mt-8 rounded-xl border border-charcoal-200 bg-charcoal-50 p-6">
            <h2 className="font-semibold text-charcoal-900">What happens next?</h2>
            <ul className="mt-4 space-y-2 text-left text-charcoal-600">
              <li>We’ll review your layout, style, and timeline.</li>
              <li>We’ll contact you to clarify the project details.</li>
              <li>We can schedule a measurement before preparing a detailed scope.</li>
            </ul>
          </div>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <Link href="/book">Plan My Kitchen</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/">Return to Home</Link>
            </Button>
          </div>

          <p className="mt-6 text-charcoal-500">
            Questions? Call us at{' '}
            <a
              href={siteConfig.phoneLink}
              className="font-semibold text-charcoal-900 hover:underline"
            >
              {siteConfig.phoneFormatted}
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
