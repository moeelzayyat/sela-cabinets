import { Metadata } from 'next'
import Link from 'next/link'
import { CTASection } from '@/components/sections/cta-section'
import { createPageSocialMetadata } from '@/components/seo/page-social-metadata'

export const metadata: Metadata = {
  title: 'Kitchen Cabinet Planning Guides for Detroit',
  description: 'Practical guidance on cabinet planning, measurements, styles, storage, and installation coordination for Metro Detroit homeowners.',
  alternates: { canonical: '/blog' },
  ...createPageSocialMetadata({
    title: 'Kitchen Cabinet Planning Guides for Detroit',
    description: 'Practical guidance on cabinet planning, measurements, styles, storage, and installation coordination for Metro Detroit homeowners.',
    path: '/blog',
  }),
}

const blogPosts = [
  {
    id: 'kitchen-cabinet-planning-detroit',
    title: 'How to Plan a Kitchen Cabinet Project in Detroit',
    excerpt: 'Learn what shapes a successful kitchen cabinet project, from measurements and construction to finishes, storage, and installation planning.',
    date: 'July 30, 2026',
    category: 'Planning',
    slug: 'kitchen-cabinet-planning-detroit',
  },

]

export default function BlogPage() {
  return (
    <>
      <section className="section-padding bg-charcoal-900 text-white">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl font-bold md:text-5xl lg:text-6xl">
              Kitchen Cabinet Blog
            </h1>
            <p className="mt-6 text-lg text-charcoal-300">
              Expert tips, planning guidance, and design inspiration for Detroit homeowners.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="grid gap-8">
            {blogPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group block rounded-2xl border border-charcoal-200 p-8 transition-all hover:border-wood-300 hover:shadow-lg"
              >
                <div className="flex flex-wrap items-center gap-3 text-sm text-charcoal-600">
                  <span className="rounded-full bg-wood-100 px-3 py-1 text-wood-700">
                    {post.category}
                  </span>
                  <span>{post.date}</span>
                </div>
                <h2 className="mt-4 font-display text-2xl font-bold text-charcoal-900 group-hover:text-primary">
                  {post.title}
                </h2>
                <p className="mt-2 text-charcoal-600">{post.excerpt}</p>
                <span className="mt-4 inline-flex items-center text-primary group-hover:text-[#184A47]">
                  Read more →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTASection variant="wood" />
    </>
  )
}
