import { Metadata } from 'next'
import Link from 'next/link'
import { CTASection } from '@/components/sections/cta-section'

export const metadata: Metadata = {
  title: 'Kitchen Cabinet Tips & Guides | SELA Cabinets Blog Detroit',
  description: 'Expert advice on kitchen cabinets, remodeling tips, cost guides, and design inspiration for Detroit homeowners.',
}

const blogPosts = [
  {
    id: 'kitchen-cabinet-costs-detroit',
    title: 'How Much Do Kitchen Cabinets Cost in Detroit? (2025 Guide)',
    excerpt: 'Get real numbers for kitchen cabinet costs in the Detroit area. From budget-friendly options to premium custom installations.',
    date: 'February 3, 2025',
    category: 'Pricing',
    slug: 'kitchen-cabinet-costs-detroit',
  },
  {
    id: 'framed-vs-frameless',
    title: 'Framed vs Frameless Cabinets: Which is Right for Your Detroit Home?',
    excerpt: 'Understanding the difference between framed and frameless cabinet construction, and which works best for your kitchen style.',
    date: 'February 3, 2025',
    category: 'Education',
    slug: 'framed-vs-frameless-cabinets-detroit',
  },
  {
    id: 'cabinet-color-trends-2025',
    title: '5 Kitchen Cabinet Color Trends Michigan Homeowners Love in 2025',
    excerpt: 'From timeless whites to bold navy blues, these are the cabinet colors dominating Detroit kitchens this year.',
    date: 'February 3, 2025',
    category: 'Design',
    slug: 'kitchen-cabinet-color-trends-2025',
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
              Expert tips, cost guides, and design inspiration for Detroit homeowners.
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
                <div className="flex flex-wrap items-center gap-3 text-sm text-charcoal-500">
                  <span className="rounded-full bg-wood-100 px-3 py-1 text-wood-700">
                    {post.category}
                  </span>
                  <span>{post.date}</span>
                </div>
                <h2 className="mt-4 font-display text-2xl font-bold text-charcoal-900 group-hover:text-wood-600">
                  {post.title}
                </h2>
                <p className="mt-2 text-charcoal-600">{post.excerpt}</p>
                <span className="mt-4 inline-flex items-center text-wood-600 group-hover:text-wood-700">
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
