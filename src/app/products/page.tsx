import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  cabinetConstruction,
  handleCatalog,
  productsCatalog,
  type CabinetProduct,
} from '@/config/products-catalog'

export const metadata: Metadata = {
  title: 'Kitchen Cabinet Styles in Metro Detroit',
  description:
    'Explore 21 framed cabinet styles, 8 frameless cabinet styles, construction details, and available cabinet hardware from SELA Cabinets.',
  alternates: {
    canonical: '/products',
  },
}

function StyleCard({ product }: { product: CabinetProduct }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-charcoal-200 bg-white shadow-sm">
      <div className="aspect-square bg-charcoal-50 p-4 sm:p-6">
        <Image
          src={product.image}
          alt={`${product.name} ${product.construction} cabinet door style`}
          width={900}
          height={900}
          className="h-full w-full object-contain"
          sizes="(min-width: 1280px) 23vw, (min-width: 768px) 31vw, 46vw"
        />
      </div>
      <div className="border-t border-charcoal-100 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          {product.construction}
        </p>
        <h3 className="mt-1 font-display text-xl font-semibold text-charcoal-900">
          {product.name}
        </h3>
      </div>
    </article>
  )
}

function SpecificationList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-6 space-y-3 text-charcoal-700">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span
            aria-hidden="true"
            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export default function ProductsPage() {
  return (
    <>
      <section className="bg-charcoal-900 py-16 text-white sm:py-20 lg:py-24">
        <div className="container-wide">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-wood-300">
              Cabinet Collections
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl lg:text-6xl">
              Find the cabinet style that fits your kitchen
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-charcoal-200">
              Compare our current framed and frameless collections, review how
              each cabinet is built, and choose the finishing hardware during
              your planning appointment.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold">
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2">
                21 framed styles
              </span>
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2">
                8 frameless styles
              </span>
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2">
                Hardware available
              </span>
            </div>
          </div>
        </div>
      </section>

      <nav
        aria-label="Cabinet catalog sections"
        className="sticky top-[72px] z-40 border-b border-charcoal-200 bg-white/95 shadow-sm backdrop-blur"
      >
        <div className="container-wide overflow-x-auto">
          <div className="flex min-w-max gap-2 py-3">
            {[
              ['Framed Styles', '#framed-styles'],
              ['Frameless Styles', '#frameless-styles'],
              ['Construction', '#construction'],
              ['Handles & Hardware', '#hardware'],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="rounded-full px-4 py-2 text-sm font-semibold text-charcoal-700 transition-colors hover:bg-charcoal-100 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <div>
        <section id="framed-styles" className="scroll-mt-36 bg-white py-16 sm:py-20">
          <div className="container-wide">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
                21 collections
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-charcoal-900 sm:text-4xl">
                Framed Cabinet Styles
              </h2>
              <p className="mt-4 text-lg leading-8 text-charcoal-600">
                Traditional face-frame construction with styles ranging from
                classic Shaker and Charleston doors to slim contemporary profiles.
              </p>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {productsCatalog.framed.map((product) => (
                <StyleCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        <section
          id="frameless-styles"
          className="scroll-mt-36 bg-charcoal-50 py-16 sm:py-20"
        >
          <div className="container-wide">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
                8 collections
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-charcoal-900 sm:text-4xl">
                Frameless Cabinet Styles
              </h2>
              <p className="mt-4 text-lg leading-8 text-charcoal-600">
                Full-access European-style construction with high-gloss, glass,
                matte, and wood-look finishes.
              </p>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {productsCatalog.frameless.map((product) => (
                <StyleCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        <section id="construction" className="scroll-mt-36 bg-white py-16 sm:py-20">
          <div className="container-wide">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
                Compare the cabinet boxes
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-charcoal-900 sm:text-4xl">
                Cabinet Construction
              </h2>
              <p className="mt-4 text-lg leading-8 text-charcoal-600">
                Both collections include soft-close hardware. The main difference
                is the traditional hardwood face frame versus a full-access
                frameless box.
              </p>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <article className="rounded-2xl border border-charcoal-200 bg-charcoal-50 p-6 sm:p-8">
                <h3 className="font-display text-2xl font-bold text-charcoal-900">
                  Framed Construction
                </h3>
                <SpecificationList items={cabinetConstruction.framed} />
              </article>
              <article className="rounded-2xl border border-charcoal-200 bg-charcoal-50 p-6 sm:p-8">
                <h3 className="font-display text-2xl font-bold text-charcoal-900">
                  Frameless Construction
                </h3>
                <SpecificationList items={cabinetConstruction.frameless} />
              </article>
            </div>
            <p className="mt-6 text-sm leading-6 text-charcoal-700">
              Specifications and availability can change by collection. We confirm
              the current cabinet specification before your order is finalized.
            </p>
          </div>
        </section>

        <section id="hardware" className="scroll-mt-36 bg-wood-50 py-16 sm:py-20">
          <div className="container-wide">
            <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-wood-200 bg-white p-6 shadow-sm">
                <Image
                  src={handleCatalog[0].image}
                  alt="Black 96 millimeter cabinet handle"
                  width={900}
                  height={900}
                  className="aspect-square h-auto w-full object-contain"
                  sizes="(min-width: 1024px) 36vw, 80vw"
                />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
                  Finishing details
                </p>
                <h2 className="mt-2 font-display text-3xl font-bold text-charcoal-900 sm:text-4xl">
                  Handles & Hardware
                </h2>
                <p className="mt-5 text-lg leading-8 text-charcoal-700">
                  Complete the cabinet design with coordinated handles and
                  soft-close hardware. The current handle collection includes
                  {` ${handleCatalog[0].name}.`} We confirm finish, size, and
                  availability as part of your kitchen plan.
                </p>
                <Button asChild size="lg" className="mt-8">
                  <Link href="/book">Plan My Kitchen</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-charcoal-900 py-16 text-white sm:py-20">
          <div className="container-wide text-center">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              See cabinet finishes before choosing
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-charcoal-200">
              Screen colors can vary. We help you compare samples, measurements,
              and layout options before the cabinet order is finalized.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link href="/book">Plan My Kitchen</Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  )
}
