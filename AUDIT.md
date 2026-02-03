# SELA Cabinets Website Audit & Improvement Plan

## Current State Analysis

### What's Working
- Clean, modern design with good color palette (charcoal + warm wood)
- Mobile-responsive with sticky call button
- Proper technical SEO structure (JSON-LD, meta tags, OpenGraph)
- Fast loading (Next.js 14 + optimized build)
- All required pages exist per instructions.md

### Critical Issues

#### 1. CONTENT IS PLACEHOLDER
**Problem:** The site is 90% template content.
- Hero: "TEMP PLACEHOLDER – REPLACE WITH REAL SELA CABINETS PHOTOS"
- Gallery: Placeholder images with fake locations
- Cabinet styles: Generic descriptions, not Aline's actual catalog
- About page: No story, no personality

**Fix:** Replace with Hamada's actual story, real project photos, and Aline's real product line.

#### 2. NO DIFFERENTIATION
**Problem:** Reads like every other cabinet company.
- "Experienced installers" — everyone says this
- "Quality cabinets" — meaningless without specifics
- No unique selling proposition

**Fix:** Add "Why SELA" section with Hamada's actual approach:
- "I personally measure every kitchen"
- "Direct from Aline — no middleman markup"
- "Detroit-born, Detroit-focused"

#### 3. WEAK HEADLINES
**Current:** "Premium Kitchen Cabinets, Expertly Installed"
**Better:** "Your Detroit Kitchen, Transformed"
**Best:** "Finally — Cabinets That Fit Your Space & Budget"

#### 4. MISSING SOCIAL PROOF
**Problem:** No reviews, no testimonials, no "before/after" gallery.
**Fix:** Add testimonials section (even if empty for now with "Be our first review!")

#### 5. FORM FRICTION
**Problem:** Estimate form asks for too much upfront.
**Current flow:** Name → Phone → Email → Address → City → ZIP → Timeline → Budget → Style → Notes → Photos
**Better flow:** Name → Phone → Email → Upload photos → (optional details)

#### 6. GENERIC TRUST SECTION
**Current:** "Serving Detroit," "Experienced Team" — bland corporate speak.
**Better:** Specific, local details:
- "15+ metro Detroit cities served"
- "Free measurements within 30 miles of Detroit"
- "Same-week appointments available"

---

## Priority Improvements

### Phase 1: Fix the Fluff (High Impact, Low Effort)

1. **Rewrite Hero Section**
   - New headline: "Your Detroit Kitchen, Redesigned"
   - Subhead: "Quality cabinets from Aline. Expert measuring. Clean installation. Done right the first time."
   - CTA: "See Your New Kitchen" (instead of "Book a Consultation")

2. **Replace Trust Section**
   - From 4 generic cards → 3 specific statements with numbers
   - "Serving 15+ Detroit-area cities"
   - "Free in-home measuring" 
   - "Installs in 1-3 days"

3. **Fix Process Section Copy**
   - Step 1: "Let's Talk" → "Tell us about your kitchen"
   - Step 2: "We Measure" → "We come to you (free)"
   - Step 3: "Design & Quote" → "See your price, no surprises"
   - Step 4: "Install" → "Your new kitchen, done"

### Phase 2: Add Personality (Medium Effort)

1. **About Page Rewrite**
   - Hamada's story: Why cabinets? Why Detroit?
   - Personal touch: "I started SELA because..."
   - Photo of Hamada (professional but approachable)

2. **Services Page**
   - Lead with benefit, not feature
   - "Get cabinets that actually fit" not "Professional measurement"
   - Add pricing context: "Most kitchens $8K–$15K installed"

3. **Add "Why SELA" Section to Homepage**
   - What makes you different from big box stores?
   - What's your actual promise?

### Phase 3: Visual Polish (Medium Effort)

1. **Logo Design** — See logo-concepts.svg
2. **Add Real Photos** — When you have them
3. **Improve Typography** — Larger headlines, better hierarchy
4. **Add Micro-interactions** — Hover states, subtle animations

---

## Copy Improvements (Specific Changes)

### Hero Section
```
OLD:
"Premium Kitchen Cabinets, Expertly Installed"
"Transform your kitchen with quality cabinets and professional installation."

NEW:
"Your Detroit Kitchen, Redesigned"
"Semi-custom cabinets from Aline, professionally measured and installed. No showroom. No pressure. Just results."
```

### Services Preview
```
OLD:
"What We Offer"
"Everything you need for your kitchen cabinet project"

NEW:
"Simple. Straightforward. Done Right."
"Cabinets, measuring, installation — we handle it all."
```

### CTA Section
```
OLD:
"Ready to Transform Your Kitchen?"
"Let's discuss your cabinet project."

NEW:
"See What Your Kitchen Could Look Like"
"Book a free consultation. Get a real quote. No obligation."
```

---

## Technical Improvements

1. **Add sitemap.xml** — Already exists, verify it's working
2. **Add robots.txt** — Already exists, good
3. **Page speed** — Run Lighthouse, optimize images when real ones arrive
4. **Schema markup** — Already good, verify FAQ schema on /faqs

---

## Logo Direction

See logo-concepts.svg for 3 options:
1. **Minimal** — Clean wordmark, modern
2. **Badge** — Classic craftsmanship feel
3. **Icon** — Cabinet silhouette + SELA

All use your existing color palette.

---

## What We Need From You

1. **Photos** — Any kitchen shots, even phone pics
2. **Your story** — Why did you start SELA? What's your background?
3. **Aline catalog** — Exact product names so we can update the Products page
4. **Pricing guidance** — Rough ranges you want advertised
5. **Service area priority** — Which 3-5 cities are most important?

---

## Next Steps

1. [ ] Approve logo direction
2. [ ] Provide real photos or approve stock temp images
3. [ ] Approve copy rewrites or suggest changes
4. [ ] Get Aline product list for Products page update
5. [ ] Restart gateway so I can browse Aline site

I'll start implementing the copy changes and create the logo files now.
