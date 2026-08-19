import type { Metadata } from 'next'
import Link from 'next/link'
import { Ruler, ScanLine, CheckCircle } from 'lucide-react'

import { createPageSocialMetadata } from '@/components/seo/page-social-metadata'
import { CTASection } from '@/components/sections/cta-section'
import { Button } from '@/components/ui/button'

const title = 'In-Home Cabinet Measurement in Metro Detroit'
const description = 'Prepare a Metro Detroit kitchen cabinet plan with in-home measurements of walls, openings, appliances, utilities, access, and existing conditions.'
const path = '/services/in-home-cabinet-measurement'

export const metadata: Metadata = {
  title: 'In-Home Cabinet Measurement in Metro Detroit',
  description: 'Prepare a Metro Detroit kitchen cabinet plan with in-home measurements of walls, openings, appliances, utilities, access, and existing conditions.',
  alternates: { canonical: '/services/in-home-cabinet-measurement' },
  ...createPageSocialMetadata({ title, description, path }),
}

const measurementAreas = [
  'Wall lengths, ceiling height, and room geometry',
  'Doors, windows, trim, and passage clearances',
  'Appliance locations and available manufacturer dimensions',
  'Plumbing, electrical, vents, and other visible utility conditions',
  'Floor, wall, corner, and soffit conditions that affect cabinet layout',
  'Delivery access and installation constraints visible during the visit',
]

export default function InHomeCabinetMeasurementPage() {
  return (
    <>
      <section className="section-padding bg-charcoal-900 text-white">
        <div className="container-wide grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
          <div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-wood-300">In-home cabinet measurement</p><h1 className="mt-4 font-display text-4xl font-bold md:text-5xl">Start the Cabinet Layout With the Actual Kitchen</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-charcoal-300">Cabinet planning depends on more than a rough wall length. SELA records kitchen dimensions and visible site conditions so the cabinet layout, ordering decisions, and installation scope can be reviewed against the real space.</p><div className="mt-8 flex flex-col gap-4 sm:flex-row"><Link href="/book"><Button size="lg">Plan My Kitchen</Button></Link><Link href="/estimate"><Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white hover:text-charcoal-900">Start an Estimate</Button></Link></div></div>
          <aside className="rounded-2xl border border-charcoal-700 bg-charcoal-800 p-7"><Ruler className="h-10 w-10 text-wood-300" /><h2 className="mt-5 font-display text-2xl font-semibold">Measurement supports the cabinet plan</h2><p className="mt-3 leading-7 text-charcoal-300">The visit records dimensions and visible conditions. It does not replace licensed evaluation of concealed structural, plumbing, electrical, or other trade conditions.</p></aside>
        </div>
      </section>

      <section className="section-padding bg-white"><div className="container-wide grid gap-12 lg:grid-cols-2"><div><ScanLine className="h-9 w-9 text-primary" /><h2 className="mt-4 font-display text-3xl font-bold text-charcoal-900">What We Measure and Record</h2><p className="mt-4 leading-7 text-charcoal-600">The exact checklist varies by kitchen, but the purpose is consistent: document the room details that affect cabinet size, location, clearance, delivery, and installation planning.</p><ul className="mt-6 space-y-4">{measurementAreas.map((item) => <li key={item} className="flex gap-3 text-charcoal-700"><CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><span>{item}</span></li>)}</ul></div><div><h2 className="font-display text-3xl font-bold text-charcoal-900">What to Prepare Before the Visit</h2><p className="mt-4 leading-7 text-charcoal-600">If available, gather appliance model numbers or dimensions, photographs of the room, inspiration images, known countertop plans, and a list of storage problems you want the new kitchen to address. Identify any walls, flooring, plumbing, electrical, windows, or appliances that may change before installation.</p><p className="mt-4 leading-7 text-charcoal-600">You do not need a finished design before measurement. The visit is intended to replace assumptions with usable information and expose decisions that need to be made before ordering.</p></div></div></section>

      <section className="section-padding bg-charcoal-50"><div className="container-wide"><div className="mx-auto max-w-3xl text-center"><h2 className="font-display text-3xl font-bold text-charcoal-900 md:text-4xl">From Measurements to a Cabinet Estimate</h2><p className="mt-4 leading-7 text-charcoal-600">Measurements become useful when they are connected to a cabinet layout and project scope. SELA reviews cabinet sizes, openings, panels, fillers, trim, appliance clearances, delivery access, and installation responsibilities before selections are finalized.</p></div><div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-3">{[['1', 'Record the kitchen', 'Measure the room and note visible conditions.'], ['2', 'Review the layout', 'Connect cabinet sizes and clearances to the measured space.'], ['3', 'Prepare the estimate', 'Price the selected cabinets and confirmed project scope.']].map(([number, heading, copy]) => <article key={number} className="rounded-2xl bg-white p-7 shadow-sm"><p className="text-sm font-bold text-primary">{number}</p><h3 className="mt-2 font-display text-xl font-semibold text-charcoal-900">{heading}</h3><p className="mt-3 text-charcoal-600">{copy}</p></article>)}</div></div></section>

      <section className="section-padding bg-white"><div className="container-wide grid gap-10 lg:grid-cols-2"><div><h2 className="font-display text-3xl font-bold text-charcoal-900">Measurements Can Change</h2><p className="mt-4 leading-7 text-charcoal-600">Demolition, wall repairs, flooring changes, appliance substitutions, plumbing work, and other project changes can affect dimensions. Measurements and cabinet plans should be reviewed again when the room or selected equipment changes before ordering or installation.</p></div><div><h2 className="font-display text-3xl font-bold text-charcoal-900">Serving Metro Detroit Homes</h2><p className="mt-4 leading-7 text-charcoal-600">SELA provides cabinet planning and measurement across its confirmed Metro Detroit service area. Appointment availability and travel coverage are confirmed when the project location and requested service are reviewed.</p><div className="mt-6 flex flex-wrap gap-4"><Link href="/service-areas/metro-detroit" className="font-semibold text-primary hover:underline">View the service area →</Link><Link href="/services/kitchen-cabinet-supply-detroit" className="font-semibold text-primary hover:underline">Review cabinet supply →</Link></div></div></div></section>

      <CTASection title="Schedule the Next Cabinet-Planning Step" description="Tell us where the project is located and what stage you’re in. We’ll confirm whether an in-home measurement, planning call, or estimate review should come next." variant="dark" />
    </>
  )
}
