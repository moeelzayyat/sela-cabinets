import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, Layers, PackageCheck } from 'lucide-react'

import { createPageSocialMetadata } from '@/components/seo/page-social-metadata'
import { CTASection } from '@/components/sections/cta-section'
import { Button } from '@/components/ui/button'

const title = 'Kitchen Cabinet Supply in Metro Detroit'
const description = 'Compare kitchen cabinet styles and construction options in Metro Detroit with measurement, layout, ordering, delivery, and installation coordination.'
const path = '/services/kitchen-cabinet-supply-detroit'

export const metadata: Metadata = {
  title: 'Kitchen Cabinet Supply in Metro Detroit',
  description: 'Compare kitchen cabinet styles and construction options in Metro Detroit with measurement, layout, ordering, delivery, and installation coordination.',
  alternates: { canonical: '/services/kitchen-cabinet-supply-detroit' },
  ...createPageSocialMetadata({ title, description, path }),
}

const decisions = [
  ['Construction', 'Compare framed and frameless cabinet construction in relation to the layout, storage goals, visible proportions, and installation conditions.'],
  ['Door style and finish', 'Review door profiles, colors, wood looks, and how samples relate to lighting, flooring, countertops, and other fixed finishes.'],
  ['Cabinet layout', 'Match cabinet widths, heights, depths, fillers, panels, and trim to measured walls, appliances, corners, windows, and circulation.'],
  ['Storage details', 'Plan drawers, roll-outs, waste storage, pantry use, and other functional choices before the cabinet list is finalized.'],
  ['Ordering and inspection', 'Confirm selections in writing, coordinate the order, and inspect delivered cabinet components before installation scheduling.'],
  ['Replacement planning', 'Document visible freight damage, shortages, or incorrect components and coordinate the applicable replacement process before installation.'],
]

export default function KitchenCabinetSupplyDetroitPage() {
  return (
    <>
      <section className="section-padding bg-charcoal-900 text-white">
        <div className="container-wide grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-wood-300">Cabinet supply for Metro Detroit kitchens</p>
            <h1 className="mt-4 font-display text-4xl font-bold md:text-5xl">Choose Cabinets as Part of a Measured Kitchen Plan</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-charcoal-300">SELA helps homeowners compare cabinet construction, styles, finishes, storage choices, and layout requirements before an order is finalized. Cabinet availability, specifications, and timing are confirmed during project planning rather than assumed from a gallery image.</p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row"><Link href="/products"><Button size="lg">Explore Cabinet Styles</Button></Link><Link href="/estimate"><Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white hover:text-charcoal-900">Request a Cabinet Estimate</Button></Link></div>
          </div>
          <aside className="rounded-2xl border border-charcoal-700 bg-charcoal-800 p-7">
            <PackageCheck className="h-9 w-9 text-wood-300" />
            <h2 className="mt-5 font-display text-2xl font-semibold">A cabinet list tied to the room</h2>
            <p className="mt-3 leading-7 text-charcoal-300">A useful cabinet quote is more than a door color and a total. It should connect measurements, cabinet sizes, panels, fillers, trim, hardware choices, delivery, and the installation scope.</p>
          </aside>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl text-center"><h2 className="font-display text-3xl font-bold text-charcoal-900 md:text-4xl">Cabinet Decisions We Review Before Ordering</h2><p className="mt-4 text-charcoal-600">The right cabinet package depends on the kitchen and the approved project plan. These decisions are reviewed before selections become an order.</p></div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{decisions.map(([heading, copy]) => <article key={heading} className="rounded-2xl border border-charcoal-200 p-7"><CheckCircle className="h-6 w-6 text-primary" /><h3 className="mt-4 font-display text-xl font-semibold text-charcoal-900">{heading}</h3><p className="mt-3 leading-7 text-charcoal-600">{copy}</p></article>)}</div>
        </div>
      </section>

      <section className="section-padding bg-charcoal-50">
        <div className="container-wide grid gap-10 lg:grid-cols-2">
          <div><Layers className="h-9 w-9 text-primary" /><h2 className="mt-4 font-display text-3xl font-bold text-charcoal-900">Framed and Frameless Options</h2><p className="mt-4 leading-7 text-charcoal-600">Framed cabinets have a face frame at the front of the cabinet box. Frameless cabinets use a different box and hinge arrangement with direct access at the cabinet opening. Neither label alone determines whether a cabinet is right for a project. Layout, desired appearance, storage use, available sizes, installation conditions, and current product specifications all matter.</p><Link href="/products" className="mt-5 inline-block font-semibold text-primary hover:underline">Compare current cabinet styles →</Link></div>
          <div><h2 className="font-display text-3xl font-bold text-charcoal-900">How Cabinet Estimates Are Built</h2><p className="mt-4 leading-7 text-charcoal-600">Cabinet pricing depends on the measured layout, selected cabinet family, required sizes, panels, fillers, trim, accessories, delivery conditions, and installation scope. SELA prepares an estimate from the project details instead of publishing an unsupported one-size price.</p><p className="mt-4 leading-7 text-charcoal-600">Final selections and availability are confirmed during planning. A style shown online should be treated as a selection starting point, not an inventory promise.</p><Link href="/pricing" className="mt-5 inline-block font-semibold text-primary hover:underline">See how estimates work →</Link></div>
        </div>
      </section>

      <section className="section-padding bg-white"><div className="container-wide"><div className="mx-auto max-w-3xl"><h2 className="font-display text-3xl font-bold text-charcoal-900">From Selection to Installation</h2><p className="mt-4 leading-7 text-charcoal-600">Cabinet supply works best when measurement, layout review, ordering, delivery inspection, and installation planning remain connected. If you already have measurements, bring them to the planning call. SELA will still identify which dimensions and site conditions must be verified before an order can be treated as final.</p><div className="mt-6 flex flex-wrap gap-4"><Link href="/services/in-home-cabinet-measurement" className="font-semibold text-primary hover:underline">In-home measurement →</Link><Link href="/services/kitchen-cabinet-installation-detroit" className="font-semibold text-primary hover:underline">Installation planning →</Link></div></div></div></section>

      <CTASection title="Build a Cabinet Plan for Your Kitchen" description="Share your layout, style preferences, and project stage. We’ll help determine the measurements and selection decisions needed for a detailed cabinet estimate." variant="wood" />
    </>
  )
}
