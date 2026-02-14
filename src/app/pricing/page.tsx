import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CTASection } from '@/components/sections/cta-section'
import { Check, X } from 'lucide-react'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Kitchen Cabinet Pricing Detroit | SELA Cabinets Cost Guide',
  description: 'Transparent kitchen cabinet pricing for Detroit metro. 10x10 kitchens from $3,999 installed. See how we compare to Home Depot, Lowe\'s, and custom shops.',
  keywords: ['kitchen cabinet prices Detroit', 'cabinet installation cost', 'SELA Cabinets pricing', 'Detroit kitchen remodel cost', 'affordable cabinets Michigan'],
}

export default function PricingPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-padding bg-charcoal-900 text-white">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl font-bold md:text-5xl lg:text-6xl">
              Transparent Cabinet Pricing
            </h1>
            <p className="mt-6 text-lg text-charcoal-300 md:text-xl">
              No showroom markup. No hidden fees. Just fair prices on quality cabinets 
              with professional installation. See exactly how we compare.
            </p>
          </div>
        </div>
      </section>

      {/* Price Comparison */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center font-display text-3xl font-bold text-charcoal-900">
              10x10 Kitchen Price Comparison
            </h2>
            <p className="mt-4 text-center text-charcoal-600">
              Typical U-shaped kitchen with cabinets on 3 walls. Shaker-style, white finish.
            </p>

            <div className="mt-12 overflow-hidden rounded-2xl border border-charcoal-200">
              {/* Header */}
              <div className="grid grid-cols-4 gap-4 bg-charcoal-900 p-6 text-white">
                <div className="font-semibold">Source</div>
                <div className="font-semibold">Cabinets</div>
                <div className="font-semibold">Installation</div>
                <div className="font-semibold">Total Cost</div>
              </div>

              {/* Home Depot */}
              <div className="grid grid-cols-4 gap-4 border-b border-charcoal-100 p-6">
                <div className="font-medium text-charcoal-900">Home Depot</div>
                <div className="text-charcoal-600">$4,500 - $6,000</div>
                <div className="text-charcoal-600">$2,000 - $3,500</div>
                <div className="font-semibold text-charcoal-900">$6,500 - $9,500</div>
              </div>

              {/* Lowe&apos;s */}
              <div className="grid grid-cols-4 gap-4 border-b border-charcoal-100 p-6">
                <div className="font-medium text-charcoal-900">Lowe&apos;s</div>
                <div className="text-charcoal-600">$4,000 - $5,500</div>
                <div className="text-charcoal-600">$1,800 - $3,000</div>
                <div className="font-semibold text-charcoal-900">$5,800 - $8,500</div>
              </div>

              {/* Custom Shop */}
              <div className="grid grid-cols-4 gap-4 border-b border-charcoal-100 p-6">
                <div className="font-medium text-charcoal-900">Local Custom Shop</div>
                <div className="text-charcoal-600">$8,000+</div>
                <div className="text-charcoal-600">Usually included</div>
                <div className="font-semibold text-charcoal-900">$8,000 - $15,000</div>
              </div>

              {/* IKEA */}
              <div className="grid grid-cols-4 gap-4 border-b border-charcoal-100 p-6">
                <div className="font-medium text-charcoal-900">IKEA</div>
                <div className="text-charcoal-600">$2,500 - $4,000</div>
                <div className="text-charcoal-600">DIY or $1,500+</div>
                <div className="font-semibold text-charcoal-900">$2,500 - $5,500</div>
              </div>

              {/* SELA - Highlighted */}
              <div className="grid grid-cols-4 gap-4 bg-wood-50 p-6">
                <div className="font-bold text-wood-700">SELA Cabinets</div>
                <div className="text-wood-600">Included</div>
                <div className="text-wood-600">Included</div>
                <div className="font-bold text-2xl text-wood-700">$3,999</div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-charcoal-600">
                <span className="font-semibold text-wood-600">Save $1,800 - $5,500</span> compared to big box stores, 
                with faster lead times and local service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SELA Pricing Tiers */}
      <section className="section-padding bg-charcoal-50">
        <div className="container-wide">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold text-charcoal-900">Our Pricing</h2>
            <p className="mt-4 text-charcoal-600">All prices include cabinets, delivery, and professional installation.</p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {/* Starter */}
            <div className="rounded-2xl border border-charcoal-200 bg-white p-8">
              <h3 className="font-display text-xl font-semibold text-charcoal-900">Starter Kitchen</h3>
              <p className="mt-2 text-charcoal-600">8×8 feet, galley style</p>
              <div className="mt-6">
                <span className="text-4xl font-bold text-charcoal-900">$3,199</span>
              </div>
              <ul className="mt-6 space-y-3">
                {[
                  '10-12 cabinet boxes',
                  'Shaker or flat panel styles',
                  'Choice of 24+ colors',
                  'Soft-close hinges included',
                  'Professional installation',
                  '2-year warranty',
                ].map((feature) => (
                  <li key={feature} className="flex gap-3">
                    <Check className="h-5 w-5 shrink-0 text-wood-500" />
                    <span className="text-charcoal-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link href="/book">
                  <Button className="w-full bg-wood-600 hover:bg-wood-500">Get Quote</Button>
                </Link>
              </div>
            </div>

            {/* Popular */}
            <div className="relative rounded-2xl border-2 border-wood-500 bg-white p-8">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-wood-500 px-4 py-1 text-sm font-medium text-white">
                Most Popular
              </div>
              <h3 className="font-display text-xl font-semibold text-charcoal-900">Standard Kitchen</h3>
              <p className="mt-2 text-charcoal-600">10×10 feet, U-shaped</p>
              <div className="mt-6">
                <span className="text-4xl font-bold text-charcoal-900">$3,999</span>
              </div>
              <ul className="mt-6 space-y-3">
                {[
                  '15-18 cabinet boxes',
                  'All 24+ styles available',
                  'Framed or frameless',
                  'Soft-close hinges & drawers',
                  'Professional installation',
                  '2-year warranty',
                ].map((feature) => (
                  <li key={feature} className="flex gap-3">
                    <Check className="h-5 w-5 shrink-0 text-wood-500" />
                    <span className="text-charcoal-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link href="/book">
                  <Button className="w-full bg-wood-600 hover:bg-wood-500">Get Quote</Button>
                </Link>
              </div>
            </div>

            {/* Large */}
            <div className="rounded-2xl border border-charcoal-200 bg-white p-8">
              <h3 className="font-display text-xl font-semibold text-charcoal-900">Large Kitchen</h3>
              <p className="mt-2 text-charcoal-600">12×12 feet, with island</p>
              <div className="mt-6">
                <span className="text-4xl font-bold text-charcoal-900">$5,999</span>
              </div>
              <ul className="mt-6 space-y-3">
                {[
                  '22-26 cabinet boxes',
                  'All 24+ styles available',
                  'Island cabinets included',
                  'Soft-close throughout',
                  'Professional installation',
                  '2-year warranty',
                ].map((feature) => (
                  <li key={feature} className="flex gap-3">
                    <Check className="h-5 w-5 shrink-0 text-wood-500" />
                    <span className="text-charcoal-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link href="/book">
                  <Button className="w-full bg-wood-600 hover:bg-wood-500">Get Quote</Button>
                </Link>
              </div>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-charcoal-500">
            Prices are estimates for typical layouts. Final price depends on exact measurements and options.
            <Link href="/book" className="text-wood-600 hover:underline">Book a free measurement</Link> for an exact quote.
          </p>
        </div>
      </section>

      {/* What's Included */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-bold text-charcoal-900">What&apos;s Included</h2>
              <p className="mt-4 text-charcoal-600">
                Every SELA cabinet project includes everything you need for a complete kitchen transformation.
              </p>
              
              <ul className="mt-8 space-y-4">
                {[
                  'In-home measurement and design consultation',
                  'All cabinet boxes, doors, and drawer fronts',
                  'Soft-close hinges and drawer glides',
                  'Professional delivery',
                  'Expert installation by our team',
                  'Cleanup and debris removal',
                  '2-year warranty on all work',
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <Check className="h-6 w-6 shrink-0 text-wood-500" />
                    <span className="text-charcoal-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-charcoal-900 p-8 text-white">
              <h3 className="font-display text-2xl font-bold">Optional Add-Ons</h3>
              
              <ul className="mt-6 space-y-4">
                {[
                  { name: 'Cabinet removal/disposal', price: '$500 - $800' },
                  { name: 'Crown molding', price: '$15 - $25/ft' },
                  { name: 'Under-cabinet lighting', price: '$30 - $50/ft' },
                  { name: 'Glass door inserts', price: '$75 - $150 each' },
                  { name: 'Custom organizers', price: '$50 - $200 each' },
                  { name: 'Extended warranty (5-year)', price: '$299' },
                ].map((item) => (
                  <li key={item.name} className="flex justify-between border-b border-charcoal-700 pb-4 last:border-0">
                    <span className="text-charcoal-300">{item.name}</span>
                    <span className="font-semibold">{item.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why We're Different */}
      <section className="section-padding bg-wood-50">
        <div className="container-wide">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold text-charcoal-900">Why Our Prices Are Better</h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-wood-100">
                <span className="text-2xl font-bold text-wood-600">66%</span>
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold text-charcoal-900">Direct Pricing</h3>
              <p className="mt-2 text-charcoal-600">
                We work directly with our supplier, passing wholesale savings to you. 
                No showroom overhead. No middlemen.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-wood-100">
                <span className="text-2xl font-bold text-wood-600">2-5</span>
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold text-charcoal-900">Fast Lead Times</h3>
              <p className="mt-2 text-charcoal-600">
                Cabinets ready in 2-5 business days vs 4-8 weeks at big box stores. 
                Less waiting, faster transformation.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-wood-100">
                <span className="text-2xl font-bold text-wood-600">Local</span>
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold text-charcoal-900">Local Service</h3>
              <p className="mt-2 text-charcoal-600">
                Detroit-based team that knows local homes. Personal service from 
                consultation to installation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CTASection 
        title="Get Your Exact Quote"
        description="Every kitchen is different. Book a free in-home measurement and we'll provide a detailed, no-pressure quote for your specific project."
      />
    </>
  )
}
