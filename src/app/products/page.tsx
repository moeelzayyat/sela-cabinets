import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CTASection } from '@/components/sections/cta-section'
import { siteConfig } from '@/config/site'
import { alineProducts } from '@/config/aline-products'

export const metadata: Metadata = {
  title: 'Kitchen Cabinet Styles Detroit | 24+ Colors & Finishes | SELA',
  description: 'Browse our cabinet styles: Shaker, Charleston, Slim & more. 16 framed + 8 frameless styles. White, gray, navy, oak finishes. Serving Detroit metro area.',
}

export default function ProductsPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-padding bg-charcoal-900 text-white">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl font-bold md:text-5xl lg:text-6xl">
              Cabinet Styles
            </h1>
            <p className="mt-6 text-lg text-charcoal-300 md:text-xl">
              Quality kitchen cabinets for your home. Two construction types, 
              24 beautiful styles, endless possibilities for your Detroit kitchen.
            </p>
          </div>
        </div>
      </section>

      {/* Products Tabs */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <Tabs defaultValue="framed" className="w-full">
            <div className="flex justify-center">
              <TabsList className="h-auto p-1">
                <TabsTrigger value="framed" className="px-6 py-3 text-base">
                  Framed Cabinets
                  <span className="ml-2 text-xs text-charcoal-500">(16 styles)</span>
                </TabsTrigger>
                <TabsTrigger value="frameless" className="px-6 py-3 text-base">
                  Frameless Cabinets
                  <span className="ml-2 text-xs text-charcoal-500">(8 styles)</span>
                </TabsTrigger>
                <TabsTrigger value="specs" className="px-6 py-3 text-base">
                  Specifications
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Framed Tab */}
            <TabsContent value="framed" className="mt-12">
              <div className="mb-8 rounded-xl bg-wood-50 p-6">
                <h2 className="font-display text-2xl font-bold text-charcoal-900">
                  Framed Cabinet Construction
                </h2>
                <p className="mt-2 text-charcoal-600">
                  Traditional American style with a solid wood face frame. Features full overlay panels, 
                  soft-close hinges, and dovetail drawers. Classic craftsmanship for timeless kitchens.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {alineProducts.framed.map((style) => (
                  <div
                    key={style.id}
                    className="group overflow-hidden rounded-2xl border border-charcoal-200 bg-white transition-all hover:border-wood-300 hover:shadow-lg"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-charcoal-100">
                      <Image
                        src={style.image}
                        alt={style.name}
                        width={800}
                        height={600}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <h3 className="font-display text-xl font-semibold text-charcoal-900">
                          {style.name}
                        </h3>
                        {style.isNew && (
                          <span className="rounded-full bg-wood-500 px-2 py-1 text-xs font-semibold text-white">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-charcoal-600">
                        {style.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {style.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-charcoal-100 px-3 py-1 text-xs text-charcoal-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Frameless Tab */}
            <TabsContent value="frameless" className="mt-12">
              <div className="mb-8 rounded-xl bg-charcoal-50 p-6">
                <h2 className="font-display text-2xl font-bold text-charcoal-900">
                  Frameless Cabinet Construction
                </h2>
                <p className="mt-2 text-charcoal-600">
                  European-style frameless design for a sleek, modern look. Features full-access storage, 
                  clean lines, and contemporary finishes. Perfect for modern kitchens.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {alineProducts.frameless.map((style) => (
                  <div
                    key={style.id}
                    className="group overflow-hidden rounded-2xl border border-charcoal-200 bg-white transition-all hover:border-wood-300 hover:shadow-lg"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-charcoal-100">
                      <Image
                        src={style.image}
                        alt={style.name}
                        width={800}
                        height={600}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <h3 className="font-display text-xl font-semibold text-charcoal-900">
                          {style.name}
                        </h3>
                        {style.isNew && (
                          <span className="rounded-full bg-wood-500 px-2 py-1 text-xs font-semibold text-white">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-charcoal-600">
                        {style.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {style.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-charcoal-100 px-3 py-1 text-xs text-charcoal-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Specifications Tab */}
            <TabsContent value="specs" className="mt-12">
              <div className="grid gap-8 md:grid-cols-2">
                <div className="rounded-2xl border border-charcoal-200 bg-white p-8">
                  <h3 className="font-display text-2xl font-bold text-charcoal-900">
                    Framed Construction
                  </h3>
                  <ul className="mt-6 space-y-4 text-charcoal-600">
                    <li className="flex gap-3">
                      <span className="text-wood-600">•</span>
                      Full overlay panel door and drawer front
                    </li>
                    <li className="flex gap-3">
                      <span className="text-wood-600">•</span>
                      ¾ inch thick solid wood frame with MDF center
                    </li>
                    <li className="flex gap-3">
                      <span className="text-wood-600">•</span>
                      ¾ inch thick cabinet-grade plywood shelving
                    </li>
                    <li className="flex gap-3">
                      <span className="text-wood-600">•</span>
                      Dovetail drawers with solid wood on all sides
                    </li>
                    <li className="flex gap-3">
                      <span className="text-wood-600">•</span>
                      ½ inch cabinet-grade plywood box, UV coated interior
                    </li>
                    <li className="flex gap-3">
                      <span className="text-wood-600">•</span>
                      Concealed undermount soft-close drawer glides
                    </li>
                    <li className="flex gap-3">
                      <span className="text-wood-600">•</span>
                      6-way adjustable European-style soft-close hinges
                    </li>
                    <li className="flex gap-3">
                      <span className="text-wood-600">•</span>
                      Door bumpers included
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-charcoal-200 bg-white p-8">
                  <h3 className="font-display text-2xl font-bold text-charcoal-900">
                    Frameless Construction
                  </h3>
                  <ul className="mt-6 space-y-4 text-charcoal-600">
                    <li className="flex gap-3">
                      <span className="text-wood-600">•</span>
                      Frameless European-style door and drawer front
                    </li>
                    <li className="flex gap-3">
                      <span className="text-wood-600">•</span>
                      ¾ inch thick MDF flat door, melamine paper finish
                    </li>
                    <li className="flex gap-3">
                      <span className="text-wood-600">•</span>
                      ¾ inch particle board box, melamine both sides
                    </li>
                    <li className="flex gap-3">
                      <span className="text-wood-600">•</span>
                      Finished exteriors with wood-color interior
                    </li>
                    <li className="flex gap-3">
                      <span className="text-wood-600">•</span>
                      Dovetail drawers with ⅝ inch solid wood sides
                    </li>
                    <li className="flex gap-3">
                      <span className="text-wood-600">•</span>
                      Concealed undermount soft-close drawer glides
                    </li>
                    <li className="flex gap-3">
                      <span className="text-wood-600">•</span>
                      DTC European-style soft-close hinges
                    </li>
                    <li className="flex gap-3">
                      <span className="text-wood-600">•</span>
                      Full access storage — no face frame
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-charcoal-200 bg-charcoal-50 p-8">
                <h3 className="font-display text-xl font-bold text-charcoal-900">
                  Handles & Hardware
                </h3>
                <p className="mt-2 text-charcoal-600">
                  Complete your kitchen with our selection of premium handles and hardware. 
                  From modern bar pulls to classic knobs, available in brushed nickel, 
                  matte black, brass, and chrome finishes.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-charcoal-50">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold text-charcoal-900">
              See These Styles in Person
            </h2>
            <p className="mt-4 text-charcoal-600">
              We bring cabinet samples to your home. See colors, feel the quality, 
              and get expert advice on what works best for your kitchen.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/book">
                <Button size="lg" className="bg-wood-600 hover:bg-wood-500">
                  Book Free Consultation
                </Button>
              </Link>
              <Link href="/estimate">
                <Button size="lg" variant="outline">
                  Get an Estimate
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CTASection variant="wood" />
    </>
  )
}
