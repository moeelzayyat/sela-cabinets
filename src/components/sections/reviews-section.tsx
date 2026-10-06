import { customerReviews } from '@/config/social-proof'

export function ReviewsSection() {
  if (customerReviews.length === 0) return null

  return (
    <section className="section-padding bg-charcoal-50" aria-labelledby="customer-reviews-title">
      <div className="container-wide">
        <h2 id="customer-reviews-title" className="font-display text-3xl font-bold text-charcoal-900 md:text-4xl">
          What SELA Customers Say
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {customerReviews.map((review) => (
            <figure key={review.id} className="rounded-2xl border border-charcoal-200 bg-white p-6">
              <blockquote className="leading-7 text-charcoal-700">“{review.reviewText}”</blockquote>
              <figcaption className="mt-4 font-semibold text-charcoal-900">{review.reviewerName}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
