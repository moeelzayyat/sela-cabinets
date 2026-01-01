# SELA Cabinets — Read-Only Build Spec (DO NOT EDIT)

## 0) Non-Negotiables
- You MUST NOT claim there is a showroom.
- You MUST NOT invent licenses, certifications, awards, or warranties.
- You MUST NOT add fake reviews or fake star ratings.
- Phone number must be: 313-246-7903
- Location must be: Detroit, Michigan
- Brand name must be: SELA Cabinets
- Primary CTA must always be: “Book a Consultation” and “Get an Estimate”
- Scheduling MUST be done via Calendly (no custom scheduler).

## 1) Required Pages (exact)
1. Home (`/`)
2. Services (`/services`)
3. Products (`/products`)
4. Gallery (`/gallery`)
5. About (`/about`)
6. FAQs (`/faqs`)
7. Get an Estimate (`/estimate`)
8. Book (`/book`)
9. Contact (`/contact`)

Each page must have:
- Clear H1
- CTA block (Book + Estimate)
- SEO metadata (title/description)

## 2) Calendly Integration Rules
- Must support 3 appointment types:
  A) Free Phone Consultation (15 min)
  B) In-home Measurement Visit (30–45 min)
  C) Virtual Design Planning (30 min)

- Calendly links must be configurable in ONE place:
  Either env vars or a single config file (preferred: `src/config/site.ts`).
- The booking hub page `/book` must display:
  - 3 cards explaining each option
  - Buttons that open an embed section or modal
  - Backup link that opens Calendly in a new tab

## 3) Lead Capture (Estimate) Rules
- Estimate page must include a form with:
  - Name (required)
  - Phone (required)
  - Email (required)
  - Address, City, ZIP (required for in-home jobs)
  - Timeline (select)
  - Budget range (select)
  - Style preference (select)
  - Notes (textarea)
  - File uploads (at least 3 images)
- Submission must:
  - Store data (DB) AND store uploaded files (storage)
  - Send an email notification to the owner
  - Show a success screen with next steps + Book button

## 4) UI/UX Requirements
- Premium, modern style:
  - White + charcoal base, warm wood accent
  - Large typography and spacing
  - Strong photo-first sections
- Mobile-first:
  - Sticky bottom call button on mobile (“Call 313-246-7903”)
  - Click-to-call enabled
- Trust without lies:
  - Allowed: “Experienced installers”, “In-home measurement”, “Serving Detroit”
  - Not allowed: “Licensed & insured” unless set as a placeholder label like “Ask us about licensing/insurance”

## 5) Content Requirements
- Must include service area section: “Serving Detroit and surrounding areas”
- Must highlight the process:
  1) Book consultation
  2) In-home measurement
  3) Design & quote
  4) Delivery & installation
- Must include an FAQ section that answers:
  - How long does it take?
  - Do you do measurement?
  - What info do I need for a quote?
  - Do you remove old cabinets?
  - What areas do you serve?
  - Can you help with design?

## 6) Tech Stack Requirements
- Next.js App Router + TypeScript
- Tailwind + ShadCN UI
- Use a single source of truth config: `src/config/site.ts`
- Add basic analytics placeholders (GA4) and conversion events:
  - “book_click”
  - “estimate_submit”
  - “call_click”
- Add structured data (LocalBusiness + Service) in JSON-LD.

## 7) Deliverables Checklist
- All pages complete and navigable
- Responsive header/footer
- Fast load, optimized images
- README with:
  - Local dev steps
  - ENV variables list
  - How to update Calendly links
  - How to update service areas, photos, copy
- Acceptance test list included in README

## 8) Output Format Requirement
When delivering work, provide:
- Folder tree
- Key files with code
- Setup instructions
- A short “How to edit content” section
