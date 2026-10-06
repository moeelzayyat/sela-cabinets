export interface CompletedProject {
  slug: string
  city: string
  cabinetStyle: string
  description: string
  beforeImage: string
  afterImage: string
  imageAlt: string
}

export interface CustomerReview {
  id: string
  reviewerName: string
  reviewText: string
  rating: number
  sourceUrl?: string
}

// Keep these arrays empty until SELA has owner-approved evidence from real jobs.
export const completedProjects: readonly CompletedProject[] = []
export const customerReviews: readonly CustomerReview[] = []
