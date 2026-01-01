import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CTASection } from '@/components/sections/cta-section'
import { siteConfig } from '@/config/site'
import { styleImages, type StyleImageKey } from '@/config/images'

export const metadata: Metadata = {
  title: 'Cabinet Products',
  description: 'Browse our selection of premium kitchen cabinet styles and finishes. From classic shaker to modern flat-panel designs in various colors and wood tones.',
}

export default function ProductsPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-padding bg-charcoal-50">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl font-bold text-charcoal-900 md:text-5xl lg:text-6xl">
              Cabinet Products
            </h1>
            <p className="mt-6 text-lg text-charcoal-600 md:text-xl">
              Explore our curated selection of kitchen cabinet styles and finishes. 
              Quality materials, beautiful designs, and options for every budget.
            </p>
          </div>
        </div>
      </section>

      {/* Products Tabs */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <Tabs defaultValue="styles" className="w-full">
            <div className="flex justify-center">
              <TabsList className="h-auto p-1">
                <TabsTrigger value="styles" className="px-6 py-3 text-base">
                  Cabinet Styles
                </TabsTrigger>
                <TabsTrigger value="finishes" className="px-6 py-3 text-base">
                  Finishes & Colors
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Styles Tab */}
            {/* TEMP PLACEHOLDER – REPLACE WITH REAL SELA CABINETS PHOTOS */}
            <TabsContent value="styles" className="mt-12">
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {siteConfig.cabinetStyles.map((style) => {
                  const styleImage = styleImages[style.id as StyleImageKey]
                  return (
                    <div
                      key={style.id}
                      className="group overflow-hidden rounded-2xl border border-charcoal-200 bg-white transition-shadow hover:shadow-lg"
                    >
                      <div className="aspect-[4/3] overflow-hidden bg-charcoal-100">
                        {styleImage ? (
                          <Image
                            src={styleImage.src}
                            alt={styleImage.alt}
                            width={600}
                            height={450}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-charcoal-400">
                            <span className="text-sm">Style Image</span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="font-display text-xl font-semibold text-charcoal-900">
                          {style.name}
                        </h3>
                        <p className="mt-2 text-charcoal-600">
                          {style.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </TabsContent>

            {/* Finishes Tab */}
            <TabsContent value="finishes" className="mt-12">
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {siteConfig.cabinetFinishes.map((finish) => (
                  <div
                    key={finish.id}
                    className="group rounded-2xl border border-charcoal-200 bg-white p-6 transition-shadow hover:shadow-lg"
                  >
                    <div
                      className="mx-auto h-20 w-20 rounded-full border-4 border-white shadow-lg"
                      style={{ backgroundColor: finish.hex }}
                    />
                    <h3 className="mt-4 text-center font-display text-lg font-semibold text-charcoal-900">
                      {finish.name}
                    </h3>
                    <p className="mt-2 text-center text-sm text-charcoal-600">
                      {finish.description}
                    </p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Note about pricing */}
      <section className="border-y border-charcoal-200 bg-charcoal-50 py-12">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-2xl font-bold text-charcoal-900 md:text-3xl">
              Ready to See Pricing?
            </h2>
            <p className="mt-4 text-charcoal-600">
              Cabinet pricing depends on your kitchen size, style choice, and configuration. 
              Request an estimate or book a consultation to discuss your specific project 
              and get accurate pricing.
            </p>
            <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/estimate">
                <Button size="lg">Get an Estimate</Button>
              </Link>
              <Link href="/book">
                <Button size="lg" variant="outline">
                  Book a Consultation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How to Choose */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center font-display text-3xl font-bold text-charcoal-900 md:text-4xl">
              How to Choose Your Cabinets
            </h2>
            <div className="mt-12 space-y-8">
              <div className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-charcoal-900 text-white">
                  1
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-charcoal-900">
                    Consider Your Style
                  </h3>
                  <p className="mt-2 text-charcoal-600">
                    Think about your home&apos;s overall aesthetic. Modern homes suit flat-panel 
                    doors, while traditional homes pair well with shaker or raised-panel styles.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-charcoal-900 text-white">
                  2
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-charcoal-900">
                    Choose Your Colors
                  </h3>
                  <p className="mt-2 text-charcoal-600">
                    White and gray remain popular for their versatility. Wood tones add warmth, 
                    while bold colors like navy can create a stunning focal point.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-charcoal-900 text-white">
                  3
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-charcoal-900">
                    Plan Your Layout
                  </h3>
                  <p className="mt-2 text-charcoal-600">
                    Consider cabinet configurations like corner solutions, pantry units, and 
                    drawer bases. Our design consultation can help optimize your space.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-charcoal-900 text-white">
                  4
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-charcoal-900">
                    Get Expert Help
                  </h3>
                  <p className="mt-2 text-charcoal-600">
                    Not sure where to start? Book a consultation and we&apos;ll help you choose 
                    the perfect cabinets for your kitchen and budget.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection variant="dark" />
    </>
  )
}

