import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, Phone, Ruler, Wrench } from 'lucide-react'

import { BreadcrumbSchema } from '@/components/seo/SchemaMarkup'
import { createPageSocialMetadata } from '@/components/seo/page-social-metadata'
import { CTASection } from '@/components/sections/cta-section'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/config/site'

const title = 'Kitchen Cabinet Installation | Metro Detroit'
const description = 'Professional kitchen cabinet installation in Metro Detroit with careful leveling, alignment, fitting, adjustment, and one direct point of contact.'
const path = '/services/kitchen-cabinet-installation-detroit'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  ...createPageSocialMetadata({ title, description, path, image: '/images/seo/installation-og.jpg' }),
}

const installationSteps = [
  ['Measure and review', 'The kitchen, cabinet layout, visible conditions, appliance openings, and access are reviewed against the proposed cabinet order.'],
  ['Confirm cabinets and scope', 'Cabinet selections, fillers, panels, trim, and included installation work are documented before commitment.'],
  ['Coordinate ordering and delivery', 'SELA stays the point of contact while the cabinet order and delivery readiness are coordinated.'],
  ['Prepare for installation', 'The owner confirms scheduling and the agreed readiness details before the installation visit.'],
  ['Install with care', 'The lead installer places, levels, aligns, secures, scribes, and adjusts the cabinets according to the approved layout and scope.'],
  ['Walk through the work', 'Cabinet alignment, door and drawer operation, visible condition, and remaining cabinet punch-list items are reviewed.'],
] as const

const craftDetails = [
  'Cabinet placement and secure attachment',
  'Careful leveling and alignment',
  'Scribing and fit at visible walls and panels',
  'Door and drawer adjustment',
  'Fillers, panels, and trim included in the written scope',
  'Final cabinet walkthrough',
] as const

export default function KitchenCabinetInstallationDetroitPage() {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: '/' },
        { name: 'Services', url: '/services' },
        { name: 'Cabinet Installation', url: path },
      ]} />

      <section className="section-padding bg-charcoal-900 text-white">
        <div className="container-wide grid gap-10 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-wood-300">Metro Detroit cabinet installation</p>
            <h1 className="mt-4 font-display text-4xl font-bold md:text-5xl">Professional Kitchen Cabinet Installation</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-charcoal-300">
              Quality cabinets deserve careful installation. SELA connects the measured cabinet
              layout with an experienced lead installer and gives you one point of contact from
              the first call through the final cabinet walkthrough.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg"><Link href="/estimate">Request an Installation Estimate</Link></Button>
              <Button asChild size="lg" variant="outline" className="border-white/50 text-white hover:bg-white hover:text-charcoal-900">
                <a href={siteConfig.phoneLink}><Phone className="mr-2 h-5 w-5" />Call {siteConfig.phoneFormatted}</a>
              </Button>
            </div>
          </div>
          <aside className="rounded-2xl border border-charcoal-700 bg-charcoal-800 p-7">
            <Wrench className="h-8 w-8 text-wood-300" aria-hidden="true" />
            <h2 className="mt-4 font-display text-2xl font-semibold">Craft details that affect the finished kitchen</h2>
            <ul className="mt-5 space-y-3 text-charcoal-300">
              {craftDetails.map((item) => (
                <li key={item} className="flex gap-3"><CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-wood-300" /><span>{item}</span></li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold text-charcoal-900 md:text-4xl">Cabinet Installation, Step by Step</h2>
            <p className="mt-4 text-lg leading-8 text-charcoal-600">
              The same owner keeps cabinet selection, measurement, ordering, scheduling, installation updates,
              and the final walkthrough connected.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {installationSteps.map(([step, detail], index) => (
              <article key={step} className="rounded-2xl border border-charcoal-200 p-7">
                <p className="text-sm font-semibold text-primary">Step {index + 1}</p>
                <h3 className="mt-2 font-display text-xl font-semibold text-charcoal-900">{step}</h3>
                <p className="mt-3 leading-7 text-charcoal-600">{detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-charcoal-50">
        <div className="container-wide grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <Ruler className="h-9 w-9 text-primary" aria-hidden="true" />
            <h2 className="mt-4 font-display text-3xl font-bold text-charcoal-900">A better fit starts with the actual room</h2>
            <p className="mt-4 text-lg leading-8 text-charcoal-700">
              Field measurements help the cabinet selection account for walls, floors, corners,
              openings, appliances, visible utilities, delivery access, and the details that influence cabinet fit.
            </p>
          </div>
          <div className="rounded-2xl border border-charcoal-200 bg-white p-7">
            <h2 className="font-display text-2xl font-semibold text-charcoal-900">Questions about timing, removal, or site readiness?</h2>
            <p className="mt-4 leading-7 text-charcoal-700">
              The FAQ explains how installation timing is confirmed, what happens when cabinet removal
              is included, and what information helps SELA prepare an accurate scope.
            </p>
            <div className="mt-6 flex flex-wrap gap-5">
              <Link href="/faqs" className="font-semibold text-primary hover:underline">Read installation FAQs →</Link>
              <Link href="/services/in-home-cabinet-measurement" className="font-semibold text-primary hover:underline">Review in-home measurement →</Link>
            </div>
          </div>
        </div>
      </section>

      <CTASection title="Get Kitchen Cabinets Professionally Installed" description="Tell us where the project is, what stage it is in, and which cabinet styles you are considering. SELA will identify the right next step." variant="dark" />
    </>
  )
}
