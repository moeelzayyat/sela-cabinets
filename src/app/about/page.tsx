import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, MapPin, MessageSquareText, Ruler, Wrench } from 'lucide-react'

import { ResponsiveHeroImage } from '@/components/media/responsive-hero-image'
import { BreadcrumbSchema } from '@/components/seo/SchemaMarkup'
import { createPageSocialMetadata } from '@/components/seo/page-social-metadata'
import { CTASection } from '@/components/sections/cta-section'
import { ProcessSection } from '@/components/sections/process-section'
import { VerifiedTrustStrip } from '@/components/sections/verified-trust-strip'
import { Button } from '@/components/ui/button'
import { aboutImages } from '@/config/images'
import { serviceAreaPages } from '@/config/service-area-pages'


const title = 'About Detroit Kitchen Cabinet Installation'
const description = 'Meet the SELA Cabinets process: one direct contact, quality kitchen cabinets, in-home measurement, and professional installation in Metro Detroit.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/about' },
  ...createPageSocialMetadata({ title, description, path: '/about', image: '/images/seo/about-og.jpg' }),
}

const workingBenefits = [
  ['One point of contact', 'Questions, scheduling, ordering, and updates stay with SELA Cabinets from first call to final walkthrough.'],
  ['In-home measurement', 'The kitchen and visible conditions are recorded before the cabinet order is finalized.'],
  ['Cabinet selection help', 'Compare framed and frameless construction, finishes, storage needs, and hardware.'],
  ['Professional installation', 'A cabinet installation specialist focuses on leveling, alignment, secure attachment, scribing, adjustment, and clean fit.'],
  ['Written project scope', 'The included cabinet supply and installation work is documented before commitment.'],
] as const

export default function AboutPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Home', url: '/' }, { name: 'About', url: '/about' }]} />

      <section className="section-padding bg-charcoal-50">
        <div className="container-wide grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">One team for cabinets and installation</p>
            <h1 className="mt-4 font-display text-4xl font-bold text-charcoal-900 md:text-5xl lg:text-6xl">
              About SELA Cabinets
            </h1>
            <p className="mt-6 text-lg leading-8 text-charcoal-700 md:text-xl">
              SELA brings kitchen cabinet supply, in-home measurement, ordering coordination,
              and professional installation together for Metro Detroit homeowners.
            </p>
            <p className="mt-4 text-lg leading-8 text-charcoal-600">
              You pick the cabinets. We handle the rest—with one direct contact from the first
              conversation through the final cabinet walkthrough.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg"><Link href="/estimate">Request an Estimate</Link></Button>
              <Button asChild size="lg" variant="outline"><Link href="/products">Explore Cabinet Styles</Link></Button>
            </div>
          </div>
          <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-charcoal-200 bg-white">
            <ResponsiveHeroImage alt={aboutImages.team.alt} preload className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      <section className="section-padding bg-white" aria-labelledby="how-we-work-title">
        <div className="container-wide">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">How we work</p>
            <h2 id="how-we-work-title" className="mt-3 font-display text-3xl font-bold text-charcoal-900 md:text-4xl">
              Clear communication meets careful cabinet work
            </h2>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <article className="rounded-2xl border border-charcoal-200 bg-charcoal-50 p-7 sm:p-8">
              <MessageSquareText className="h-9 w-9 text-primary" aria-hidden="true" />
              <p className="mt-5 text-sm font-bold uppercase tracking-[0.14em] text-primary">Your direct contact</p>
              <h3 className="mt-2 font-display text-2xl font-semibold text-charcoal-900">SELA Cabinets</h3>
              <p className="mt-4 leading-7 text-charcoal-700">
                SELA Cabinets remains your direct point of contact from the first call through the final
                walkthrough, keeping questions, scheduling, ordering, and updates connected.
              </p>
            </article>

            <article className="rounded-2xl border border-charcoal-200 bg-charcoal-900 p-7 text-white sm:p-8">
              <Wrench className="h-9 w-9 text-wood-300" aria-hidden="true" />
              <p className="mt-5 text-sm font-bold uppercase tracking-[0.14em] text-wood-300">Craftsmanship in the home</p>
              <h3 className="mt-2 font-display text-2xl font-semibold">Professional cabinet installation</h3>
              <p className="mt-4 leading-7 text-charcoal-300">
                Careful installation helps quality cabinets look right, operate smoothly, and fit the
                measured space as intended.
              </p>
              <p className="mt-4 leading-7 text-charcoal-300">
                The installation work emphasizes cabinet leveling, alignment, secure attachment,
                careful scribing, door and drawer adjustment, and a clean fit in the measured space.
              </p>
            </article>
          </div>
        </div>
      </section>

      <ProcessSection />

      <section className="section-padding bg-charcoal-50">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold text-charcoal-900 md:text-4xl">Working With SELA</h2>
            <p className="mt-5 text-lg leading-8 text-charcoal-600">
              A new cabinet business can earn trust through a clear process, documented scope,
              verified product details, and consistent communication.
            </p>
            <ul className="mt-8 space-y-4 text-left">
              {workingBenefits.map(([label, detail]) => (
                <li key={label} className="flex items-start gap-4 rounded-xl border border-charcoal-200 bg-white p-5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                    <Check className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="text-charcoal-700"><strong>{label}:</strong> {detail}</span>
                </li>
              ))}
            </ul>

            <VerifiedTrustStrip />
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl text-center">
            <MapPin className="mx-auto h-9 w-9 text-primary" aria-hidden="true" />
            <h2 className="mt-4 font-display text-3xl font-bold text-charcoal-900 md:text-4xl">Metro Detroit Service Areas</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-charcoal-600">
              Select a city to learn how SELA approaches kitchen cabinet supply and installation there.
              Project availability is confirmed after location and scope review.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {serviceAreaPages.map((area) => (
              <Link key={area.slug} href={`/service-areas/${area.slug}`} className="rounded-full border border-charcoal-200 bg-charcoal-50 px-4 py-2 text-sm font-semibold text-charcoal-700 transition-colors hover:border-primary hover:text-primary">
                {area.name}
              </Link>
            ))}
          </div>
          <div className="mx-auto mt-10 flex max-w-xl items-start gap-4 rounded-xl bg-wood-50 p-5 text-charcoal-700">
            <Ruler className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <p>Do not see your city? Contact SELA with the project ZIP code so service availability can be confirmed.</p>
          </div>
        </div>
      </section>

      <CTASection variant="dark" />
    </>
  )
}
