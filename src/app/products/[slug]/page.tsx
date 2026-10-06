import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Check, Palette, PanelsTopLeft } from 'lucide-react'

import { BreadcrumbSchema } from '@/components/seo/SchemaMarkup'
import { createPageSocialMetadata } from '@/components/seo/page-social-metadata'
import { Button } from '@/components/ui/button'
import {
  allCabinetProducts,
  cabinetConstruction,
  cabinetProductBySlug,
} from '@/config/products-catalog'

export const dynamicParams = false

export function generateStaticParams() {
  return allCabinetProducts.map((product) => ({ slug: product.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = cabinetProductBySlug.get(slug)
  if (!product) return {}

  const title = `${product.name} Kitchen Cabinets`
  const description = `${product.name} ${product.construction} kitchen cabinets for Metro Detroit homes. Review construction, design character, pairings, and request an estimate.`
  const path = `/products/${product.id}`

  return {
    title,
    description,
    alternates: { canonical: path },
    ...createPageSocialMetadata({
      title,
      description,
      path,
      image: product.image,
      imageWidth: 900,
      imageHeight: 900,
    }),
  }
}

export default async function CabinetStylePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = cabinetProductBySlug.get(slug)
  if (!product) notFound()

  const specs = cabinetConstruction[product.construction]
  const path = `/products/${product.id}`

  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: '/' },
        { name: 'Cabinet Styles', url: '/products' },
        { name: product.name, url: path },
      ]} />

      <section className="section-padding bg-charcoal-50">
        <div className="container-wide grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-charcoal-200 bg-white">
            <Image
              src={product.image}
              alt={`${product.name} kitchen cabinet door style sample`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-6"
            />
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">{product.construction} cabinet collection</p>
            <h1 className="mt-4 font-display text-4xl font-bold text-charcoal-900 md:text-5xl">{product.name} Kitchen Cabinets</h1>
            <p className="mt-6 text-lg leading-8 text-charcoal-700">{product.designCharacter}</p>
            <p className="mt-4 text-lg leading-8 text-charcoal-700">
              This style can suit {product.suits}. View the physical sample with your room lighting,
              counters, flooring, and backsplash before final selection.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg"><Link href={`/estimate?style=${encodeURIComponent(product.id)}`}>Get a Quote for This Style</Link></Button>
              <Button asChild size="lg" variant="outline"><Link href="/products">Compare All Styles</Link></Button>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-wide grid gap-8 lg:grid-cols-2">
          <article className="rounded-2xl border border-charcoal-200 p-7 sm:p-8">
            <PanelsTopLeft className="h-8 w-8 text-primary" aria-hidden="true" />
            <h2 className="mt-4 font-display text-2xl font-semibold text-charcoal-900">{product.construction === 'framed' ? 'Framed' : 'Frameless'} Construction</h2>
            <ul className="mt-5 space-y-3">
              {specs.map((spec) => (
                <li key={spec} className="flex gap-3 text-charcoal-700"><Check className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" /><span>{spec}</span></li>
              ))}
            </ul>
            <p className="mt-5 text-sm leading-6 text-charcoal-600">Construction details and current availability are reconfirmed before ordering.</p>
          </article>

          <article className="rounded-2xl border border-charcoal-200 bg-wood-50 p-7 sm:p-8">
            <Palette className="h-8 w-8 text-primary" aria-hidden="true" />
            <h2 className="mt-4 font-display text-2xl font-semibold text-charcoal-900">Pairing Ideas</h2>
            <p className="mt-5 leading-7 text-charcoal-700">{product.pairingSuggestions}</p>
            <p className="mt-4 leading-7 text-charcoal-700">
              Hardware is selected during consultation so scale, finish, comfort, and placement can be compared with the cabinet sample.
            </p>
          </article>
        </div>
      </section>

      <section className="section-padding bg-charcoal-900 text-white">
        <div className="container-wide max-w-4xl text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">See how {product.name} fits your kitchen</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-charcoal-300">
            Request an in-home measurement and written estimate for cabinets and professional installation.
          </p>
          <Button asChild size="lg" className="mt-8"><Link href={`/estimate?style=${encodeURIComponent(product.id)}`}>Request a {product.name} Estimate</Link></Button>
        </div>
      </section>
    </>
  )
}
