import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, Phone } from 'lucide-react'

import { createPageSocialMetadata } from '@/components/seo/page-social-metadata'
import { CTASection } from '@/components/sections/cta-section'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/config/site'

const title = 'Kitchen Cabinet Installation in Metro Detroit'
const description = 'Plan kitchen cabinet installation in Metro Detroit with clear site-readiness, delivery, placement, alignment, adjustment, and project-scope guidance.'
const path = '/services/kitchen-cabinet-installation-detroit'

export const metadata: Metadata = {
  title: 'Kitchen Cabinet Installation in Metro Detroit',
  description: 'Plan kitchen cabinet installation in Metro Detroit with clear site-readiness, delivery, placement, alignment, adjustment, and project-scope guidance.',
  alternates: { canonical: '/services/kitchen-cabinet-installation-detroit' },
  ...createPageSocialMetadata({ title, description, path }),
}

const installationSteps = [
  ['Confirm the project scope', 'We document which cabinets are included, what removal work is included, and which surrounding trades remain outside the cabinet scope.'],
  ['Inspect the space', 'Measurements, walls, floors, utilities, access, and delivery conditions are reviewed before installation is scheduled.'],
  ['Review the cabinet plan', 'Cabinet locations, fillers, panels, trim, clearances, and appliance openings are checked before ordering and again before work begins.'],
  ['Coordinate delivery and readiness', 'Installation is scheduled after the ordered cabinets are available, inspected, and the kitchen is ready for the agreed work.'],
  ['Install and adjust', 'Cabinets are placed, leveled, aligned, secured, and adjusted according to the approved layout and installation scope.'],
  ['Complete the cabinet walkthrough', 'The installed cabinet work is reviewed for alignment, operation, visible damage, and remaining punch-list items.'],
]

export default function KitchenCabinetInstallationDetroitPage() {
  return (
    <>
      <section className="section-padding bg-charcoal-900 text-white">
        <div className="container-wide grid gap-10 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-wood-300">Metro Detroit cabinet installation</p>
            <h1 className="mt-4 font-display text-4xl font-bold md:text-5xl">Kitchen Cabinet Installation Planned Around the Actual Space</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-charcoal-300">SELA coordinates cabinet installation after the kitchen has been measured, the cabinet layout and scope have been reviewed, the order has arrived, and site readiness is confirmed. That sequence helps identify layout, access, and responsibility questions before installation day.</p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/estimate"><Button size="lg">Request an Installation Estimate</Button></Link>
              <a href={siteConfig.phoneLink}><Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white hover:text-charcoal-900"><Phone className="mr-2 h-5 w-5" />Call {siteConfig.phoneFormatted}</Button></a>
            </div>
          </div>
          <aside className="rounded-2xl border border-charcoal-700 bg-charcoal-800 p-7">
            <h2 className="font-display text-2xl font-semibold">Typical cabinet-installation scope</h2>
            <ul className="mt-5 space-y-3 text-charcoal-300">
              {['Cabinet placement and secure attachment', 'Leveling and alignment', 'Door and drawer adjustment', 'Panels, fillers, and trim included in the approved scope', 'A final cabinet walkthrough and punch-list review'].map((item) => <li key={item} className="flex gap-3"><CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-wood-300" /><span>{item}</span></li>)}
            </ul>
          </aside>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold text-charcoal-900 md:text-4xl">How SELA Prepares for Cabinet Installation</h2>
            <p className="mt-4 text-charcoal-600">Cabinet installation is one part of a larger project. These checkpoints keep cabinet ordering, delivery, site preparation, and installation responsibilities connected.</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {installationSteps.map(([step, detail], index) => <article key={step} className="rounded-2xl border border-charcoal-200 p-7"><p className="text-sm font-semibold text-primary">Step {index + 1}</p><h3 className="mt-2 font-display text-xl font-semibold text-charcoal-900">{step}</h3><p className="mt-3 leading-7 text-charcoal-600">{detail}</p></article>)}
          </div>
        </div>
      </section>

      <section className="section-padding bg-charcoal-50">
        <div className="container-wide grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold text-charcoal-900">What Must Be Confirmed Before Installation</h2>
            <p className="mt-4 leading-7 text-charcoal-600">The final estimate depends on the cabinet layout, room conditions, removal scope, delivery access, trim requirements, and coordination with countertops, appliances, plumbing, electrical, flooring, and other trades. Those surrounding services are not assumed to be included unless they appear in the written project scope.</p>
            <p className="mt-4 leading-7 text-charcoal-600">When cabinet removal is included, removed cabinets remain at the property for customer disposal. Any different disposal arrangement must be confirmed in writing before work begins.</p>
          </div>
          <div>
            <h2 className="font-display text-3xl font-bold text-charcoal-900">Start With Measurements, Not Assumptions</h2>
            <p className="mt-4 leading-7 text-charcoal-600">A planning call helps determine whether the next step is an in-home measurement, cabinet selection review, or a more detailed estimate. We do not promise an installation date before cabinet availability, inspection, and site readiness are confirmed.</p>
            <div className="mt-6 flex flex-wrap gap-4"><Link href="/services/in-home-cabinet-measurement" className="font-semibold text-primary hover:underline">Review in-home measurement →</Link><Link href="/services/kitchen-cabinet-supply-detroit" className="font-semibold text-primary hover:underline">Explore cabinet supply →</Link></div>
          </div>
        </div>
      </section>

      <CTASection title="Plan Your Metro Detroit Cabinet Installation" description="Tell us about the kitchen, the cabinet stage, and the work you need coordinated. We’ll identify the next planning step before promising scope or timing." variant="dark" />
    </>
  )
}
