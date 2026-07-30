import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CTASection } from '@/components/sections/cta-section'
import { Check, ClipboardCheck, Home, Palette } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Kitchen Cabinet Estimates Detroit | SELA Cabinets',
  description: 'Learn how SELA Cabinets prepares detailed kitchen cabinet estimates for Detroit-area homeowners. Premium cabinet guidance, in-home measurement, and professional installation.',
  keywords: ['kitchen cabinet estimates Detroit', 'cabinet design consultation Detroit', 'premium kitchen cabinets Michigan', 'cabinet installation consultation'],
}

const estimateFactors = [
  'Kitchen layout and exact cabinet measurements',
  'Door style, finish, and cabinet construction',
  'Drawer, pantry, island, and specialty storage needs',
  'Hardware, trim, molding, and accessory selections',
  'Removal, delivery, installation, and project timeline',
]

const projectPaths = [
  {
    title: 'Style Refresh',
    description: 'A focused cabinet update for homeowners who want a cleaner, more polished kitchen without changing the full layout.',
  },
  {
    title: 'Full Kitchen Cabinet Project',
    description: 'A complete cabinet plan with measurement, design guidance, cabinet ordering, delivery, and professional installation.',
  },
  {
    title: 'Premium Transformation',
    description: 'A more detailed project with upgraded finishes, specialty storage, trim details, island cabinetry, or multi-room cabinetry.',
  },
]

export default function PricingPage() {
  return (
    <>
      <section className="section-padding bg-charcoal-900 text-white">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl font-bold md:text-5xl lg:text-6xl">
              Cabinet Estimates Built Around Your Kitchen
            </h1>
            <p className="mt-6 text-lg text-charcoal-300 md:text-xl">
              Every SELA cabinet project is measured, planned, and estimated around the actual home, not a generic online number.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <h2 className="font-display text-3xl font-bold text-charcoal-900 md:text-4xl">
                Why We Quote After Measurement
              </h2>
              <p className="mt-4 text-charcoal-600">
                Cabinet projects depend on layout, construction, finish, storage needs, and installation details. A personal estimate lets us recommend the right cabinet line and give you a clear project scope before decisions are made.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link href="/book">
                  <Button size="lg">Book a Consultation</Button>
                </Link>
                <Link href="/estimate">
                  <Button size="lg" variant="outline">Start an Estimate</Button>
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-charcoal-200 bg-charcoal-50 p-8">
              <h3 className="font-display text-2xl font-bold text-charcoal-900">
                Your Estimate Considers
              </h3>
              <ul className="mt-6 space-y-4">
                {estimateFactors.map((item) => (
                  <li key={item} className="flex gap-3">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-charcoal-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-charcoal-50">
        <div className="container-wide">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold text-charcoal-900 md:text-4xl">
              Choose the Level of Finish That Fits Your Home
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-charcoal-600">
              We help you compare cabinet lines, finishes, and project details so the final recommendation feels intentional.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {projectPaths.map((path) => (
              <div key={path.title} className="rounded-2xl border border-charcoal-200 bg-white p-8">
                <h3 className="font-display text-xl font-semibold text-charcoal-900">{path.title}</h3>
                <p className="mt-3 text-charcoal-600">{path.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl bg-charcoal-50 p-8">
              <Home className="h-8 w-8 text-primary" />
              <h3 className="mt-4 font-display text-xl font-semibold text-charcoal-900">Measure First</h3>
              <p className="mt-2 text-charcoal-600">
                We document the space, check existing conditions, and confirm what needs to be included.
              </p>
            </div>
            <div className="rounded-2xl bg-charcoal-50 p-8">
              <Palette className="h-8 w-8 text-primary" />
              <h3 className="mt-4 font-display text-xl font-semibold text-charcoal-900">Select Thoughtfully</h3>
              <p className="mt-2 text-charcoal-600">
                You see cabinet styles, colors, and details that match your home instead of guessing from a screen.
              </p>
            </div>
            <div className="rounded-2xl bg-charcoal-50 p-8">
              <ClipboardCheck className="h-8 w-8 text-primary" />
              <h3 className="mt-4 font-display text-xl font-semibold text-charcoal-900">Review Clearly</h3>
              <p className="mt-2 text-charcoal-600">
                We explain the scope, installation plan, and options so you can move forward with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="Get a Cabinet Estimate for Your Home"
        description="Start with a personal consultation and a measured plan for your kitchen."
      />
    </>
  )
}
