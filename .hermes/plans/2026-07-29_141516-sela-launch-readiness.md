# SELA Cabinets Launch-Readiness Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task. Every delegated change requires independent diff review, spec review, code-quality review, and local verification before acceptance.

**Goal:** Make SELA Cabinets safe, truthful, measurable, accessible, and conversion-ready for a homeowner-focused Metro Detroit cabinet-service launch while keeping the private upstream supplier completely absent from the public website.

**Architecture:** Preserve `main` as the production-copy baseline and implement in an isolated `launch-readiness` worktree created from `local-improvements`. Centralize environment validation, admin authorization, public marketing copy, cabinet-style data, metadata, and analytics instead of duplicating logic. Launch only one homeowner journey—`Plan My Kitchen` → one verified 15-minute project call or short durable lead form—and keep account/trade features disabled until their security and operating policies mature.

**Tech Stack:** Next.js/React/TypeScript, Tailwind CSS, PostgreSQL, `jose`, Zod, Resend, Vitest/Testing Library, Playwright, Axe, Yarn/Corepack, Docker/Coolify.

---

## 1. Non-Negotiable Decisions

1. **Launch audience:** Metro Detroit homeowners replacing kitchen cabinets.
2. **Core promise:** “A measured plan for a kitchen that works better.”
3. **Core message:** “Plan your kitchen with confidence. SELA Cabinets helps Metro Detroit homeowners choose, measure, and install cabinetry that makes the room look better and work better—with clear guidance at every step.”
4. **Primary CTA:** `Plan My Kitchen` everywhere.
5. **Primary conversion:** one verified 15-minute project-call event; `Call SELA` is secondary.
6. **Initial form:** name, one contact method, ZIP, project type, timing, optional message, privacy acknowledgment. Remove photo upload and exact street address at launch.
7. **Customer portal:** disabled and noindexed for launch; revisit only after email verification, password reset, authorization, and data-isolation tests exist.
8. **Supplier confidentiality:** no upstream supplier name, domain, dealer status, portal link, credentials, pricing, SKU mapping, or hotlinked asset may appear in public source, browser bundles, HTML, metadata, schema, image URLs, or copy.
9. **Catalog truth:** public styles come from a neutral SELA catalog. Publish only styles, construction details, descriptions, and assets whose current availability and usage rights have been verified privately.
10. **Claims:** no ratings, review counts, warranties, lead times, price ranges, licensing/insurance, financing, “in stock,” “premium,” “best,” or completed-project claims without evidence.
11. **Deployment:** no direct container editing. Push, Coolify changes, staging deployment, production deployment, and marketing launch each require Hamada’s separate explicit approval.
12. **Paid traffic:** prohibited until every Green Launch Gate item passes.

## 2. Verified Starting Point

- Repository: `C:\Project\Selacabinets\server-copy`
- Working branch: `local-improvements`; `main` remains baseline.
- Git worktree is clean and has no remote.
- Fresh lint/build passes, but eight React Hook warnings remain.
- Strict TypeScript fails with nine errors; `next.config.js` bypasses type and ESLint failures.
- Current Next.js `14.1.0` has a critical middleware authorization advisory.
- Production audit found multiple unauthenticated CRM/operations APIs and inconsistent browser bearer authorization.
- Public admin registration and fixed credential/secret fallbacks exist.
- All three configured scheduler events return 404.
- Estimate handling can report success after persistence/email failure, does not store uploaded photos, and can log personal data.
- Sitemap contains 14 broken service-area URLs; valid location/blog pages are missing or canonicalized to the homepage.
- Automated route testing found serious contrast and unnamed-control issues plus mobile fixed-widget overlap.
- Current public cabinet code lists 24 style families and hotlinks upstream assets.
- Authenticated Chicago-catalog verification found 29 style families. Five are absent locally: Lunar Gray, Rustic Wood, Slim Amber Oak, Slim Iron Black, and Sage Breeze. Two local labels use `Matt` where the verified catalog uses `Matte`.
- Dealer authentication, Chicago location selection, Save and Exit, and `/products.html` access were verified successfully on 2026-07-29. No prices, orders, account records, cart activity, or credentials were captured in the sanitized catalog result.
- Upstream image reuse, descriptions, specifications, current dealer availability, discontinuation status, and public naming rights remain unverified.

## 3. Definition of Done

SELA is ready for a controlled soft launch only when:

- Every unauthorized admin/CRM method returns 401/403/404 and automated coverage enumerates all protected route methods.
- No fallback credential/secret remains; production startup fails closed on missing required secrets.
- No public admin registration or launch-enabled customer portal remains.
- The framework and production dependencies have no unmitigated critical/high advisories.
- Strict typecheck, lint, unit/integration tests, E2E, accessibility checks, build, and dependency audit pass without bypass.
- One scheduler completes an authorized desktop/mobile booking and records success/error analytics.
- Estimate success requires one durable lead record; notification failures remain visible to operators without exposing PII.
- Privacy and Terms pages are published and linked at collection points.
- Public catalog exactly matches a privately verified active-style set and contains no upstream identity or network dependency.
- Unverified claims/schema are removed; authentic proof is used only with approval.
- Unique canonicals, clean sitemap, redirects, utility noindex, OG metadata, and useful location content pass crawl checks.
- Mobile controls do not cover forms/scheduler/chat; WCAG AA automated and manual checks pass.
- Private Git source, Coolify source/branch, staging, backup, health check, and rollback are verified.
- Hamada separately approves deployment and then marketing launch.

---

# Phase 0 — Approval Inputs and Isolation

### Task 1: Record business-content gates before implementation

**Objective:** Prevent developers from inventing supplier, legal, operating, or trust facts.

**Files:**
- Create: `.hermes/launch-inputs.example.md` only if Hamada approves a nonsecret project checklist; otherwise keep the checklist in Obsidian and reference it during implementation.
- Do **not** put portal URLs, supplier identity, credentials, dealer pricing, or private product mapping in Git.

**Steps:**
1. Use only the protected dealer login; Chicago processing location and catalog access are already verified. Rotate the chat-exposed credential when practical and never place it in the repository.
2. Privately verify the active style families, construction category, exact public display name, availability policy, and discontinued items.
3. Obtain written confirmation that style names, descriptions, specifications, and each image may be used publicly by SELA.
4. Confirm one valid 15-minute scheduler event, owner calendar, availability, timezone, confirmation/reminder flow, and fallback phone owner.
5. Confirm legal entity/privacy contact, verified service area, hours, service boundaries, installation responsibility, warranty, damage/missing-item procedure, accepted payment types, qualifications/insurance, response SLA, and review sources.
6. Collect approved owner/team photo and real project assets, or explicitly approve a transparent “new business / style inspiration” launch with no fake proof.

**Gate:** Implementation can begin without all content inputs, but catalog publication, proof publication, staging approval, and launch remain blocked until their relevant facts are verified.

### Task 2: Create an isolated launch-readiness worktree

**Objective:** Keep the baseline and current working copy untouched while implementation proceeds.

**Files:**
- Worktree: `C:\Project\Selacabinets\worktrees\launch-readiness`
- Branch: `launch-readiness`

**Steps:**
1. Recheck `git status --short --branch`, branches, remotes, and recent history.
2. Require a clean `local-improvements` tree.
3. Run:
   ```bash
   git worktree add ../worktrees/launch-readiness -b launch-readiness local-improvements
   ```
4. Recheck the new worktree branch and clean status.
5. Do not add a remote or push without Hamada’s explicit approval.

**Expected:** `launch-readiness` is clean and `main`/`local-improvements` are unchanged.

---

# Phase 1 — Quality Gates Before Fixes

### Task 3: Add repeatable test tooling and scripts

**Objective:** Make every later fix test-first and CI-ready.

**Files:**
- Modify: `package.json`
- Modify: `yarn.lock`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `tests/setup.ts`
- Create: `tests/unit/smoke.test.ts`
- Create: `tests/e2e/public-smoke.spec.ts`

**Steps:**
1. Add Vitest, jsdom, Testing Library, Playwright Test, and Axe as development dependencies.
2. Add scripts: `typecheck`, `test`, `test:watch`, `test:e2e`, `test:a11y`, `audit:prod`, and `verify`.
3. Configure `@/` alias and test setup.
4. Write one failing unit smoke test and one public-route E2E smoke test.
5. Run each test to prove RED.
6. Add the minimal configuration and rerun to GREEN.
7. Commit: `test: establish launch readiness quality gates`.

**Verification:**
```bash
export PATH="$HERMES_HOME/node:$PATH"
corepack.cmd yarn typecheck
corepack.cmd yarn test --run
corepack.cmd yarn test:e2e
```

### Task 4: Build a route-authentication contract manifest

**Objective:** Ensure no API route or HTTP method is missed.

**Files:**
- Create: `tests/security/protected-route-manifest.ts`
- Create: `tests/security/admin-api-auth.spec.ts`
- Create: `scripts/check-api-auth-coverage.mjs`
- Modify: `package.json`

**Steps:**
1. Enumerate all 40 `src/app/api/**/route.ts` files and their exported HTTP methods.
2. Classify each method as public, admin-only, authenticated-customer, or disabled-for-launch.
3. Write a test that fails when a route/method is absent from the manifest.
4. Write unauthenticated contract tests expecting 401/403/404 for all protected methods.
5. Run to capture the intended baseline failures.
6. Add `test:auth` and `check:auth-coverage` scripts.
7. Commit: `test: define api authorization contract`.

**Acceptance:** Adding any future API method without an authorization classification fails the test suite.

---

# Phase 2 — Emergency Security Containment

### Task 5: Centralize required environment validation

**Objective:** Remove fixed fallback credentials/secrets and fail closed in production.

**Files:**
- Create: `src/lib/env.ts`
- Modify: `src/lib/auth.ts`
- Modify: `src/lib/user-auth.ts`
- Modify: `src/lib/admin-users.ts`
- Modify: `env.example.txt`
- Test: `tests/unit/env.test.ts`

**Steps:**
1. Write tests for missing/invalid production secrets and optional local-only settings.
2. Implement a server-only Zod environment schema.
3. Remove all fallback passwords and fixed JWT/session secrets.
4. Require minimum secret lengths and distinct admin/user signing secrets.
5. Expand `env.example.txt` to every source-used key with descriptions and no values.
6. Verify no secret reaches `NEXT_PUBLIC_*` unless it is intentionally public.
7. Commit: `security: validate environment and remove fallback secrets`.

**Acceptance:** Production startup fails with a safe variable-name-only error when required configuration is missing.

### Task 6: Centralize server-side admin authorization

**Objective:** Make route handlers deny by default without relying only on vulnerable middleware.

**Files:**
- Create: `src/lib/authorization.ts`
- Modify: `src/lib/auth.ts`
- Modify: `src/middleware.ts`
- Test: `tests/unit/authorization.test.ts`

**Steps:**
1. Write tests for missing session, expired session, wrong role, valid admin, and disabled account.
2. Implement `requireAdminSession()` and `requireCustomerSession()` returning typed outcomes.
3. Enforce secure HttpOnly/SameSite cookies and production-only `Secure` behavior.
4. Keep middleware as UX routing only; require authorization again inside every private route.
5. Remove browser API-key comparison as an authorization mechanism.
6. Commit: `security: add deny by default server authorization`.

### Task 7: Protect every CRM/admin API method

**Objective:** Close unauthenticated data reads and writes across the full manifest.

**Files:**
- Modify: all admin/CRM families under `src/app/api/`, especially `customers`, `contacts`, `appointments`, `estimates`, `jobs`, `products`, `leads`, `quotes`, `invoices`, `chat-logs`, `chatbot-config`, and `admin/users`.
- Test: `tests/security/admin-api-auth.spec.ts`

**Steps for each route family:**
1. Run the one-family auth test and confirm unauthorized failure.
2. Add `requireAdminSession()` before body parsing or database access.
3. Add role/ownership checks where needed.
4. Validate route parameters and request bodies with Zod.
5. Return 401/403 without data-dependent detail.
6. Run unauthorized and authorized tests for every exported method.
7. Commit one family at a time, e.g. `security: protect customer and contact routes`.

**Acceptance:** The route manifest and live local E2E prove every unauthorized private method returns 401/403/404 before any query/mutation.

### Task 8: Disable public admin registration and launch-time customer portal

**Objective:** Remove unnecessary account attack surface for launch.

**Files:**
- Modify: `src/app/admin/register/page.tsx`
- Modify: `src/app/api/admin/register/route.ts`
- Modify: `src/app/account/register/page.tsx`
- Modify: `src/app/api/auth/register/route.ts`
- Modify: `src/app/account/page.tsx`
- Modify: `src/app/api/account/jobs/route.ts`
- Modify: `src/app/api/account/invoices/route.ts`
- Modify: `src/components/layout/header.tsx`
- Test: `tests/e2e/disabled-account-surfaces.spec.ts`

**Steps:**
1. Write tests expecting 404/noindex and no navigation links.
2. Make admin provisioning an explicit server-side operational process, not public self-registration.
3. Add a server-side `ENABLE_CUSTOMER_PORTAL=false` launch gate and fail closed.
4. Hide account links and return 404 for disabled portal routes/APIs.
5. Commit: `security: disable public registration and launch portal`.

### Task 9: Upgrade framework/dependencies and remove bypasses

**Objective:** Eliminate the critical middleware advisory and establish supported dependencies.

**Files:**
- Modify: `package.json`
- Modify: `yarn.lock`
- Modify: affected framework compatibility files
- Modify: `next.config.js`

**Steps:**
1. Read the current Next.js security guidance and select a currently supported patched release compatible with the app; do not guess a version.
2. Upgrade in a focused commit and run route/auth/PDF/build regression tests.
3. Resolve production dependency advisories; document any unavoidable mitigated advisory.
4. Fix the nine strict TypeScript errors and eight React Hook warnings.
5. Remove `typescript.ignoreBuildErrors` and `eslint.ignoreDuringBuilds`.
6. Turn image optimization on unless a measured regression requires a documented exception.
7. Commit: `chore: upgrade framework and enforce build checks`.

**Acceptance:** `yarn audit --groups dependencies --level high`, strict typecheck, lint, tests, and build pass with no bypass.

### Task 10: Add abuse protection, headers, and safe observability

**Objective:** Reduce brute force, spam, browser abuse, and sensitive logging.

**Files:**
- Create: `src/lib/rate-limit.ts`
- Create: `src/lib/safe-logger.ts`
- Create: `tests/security/headers.spec.ts`
- Modify: auth/chat/form routes
- Modify: `next.config.js`

**Steps:**
1. Write rate-limit tests for login, chat, estimate, and contact endpoints.
2. Implement a multi-instance-safe rate limiter using the project database or approved shared service; do not use process memory as the production control.
3. Add request/body limits and optional Turnstile verification once approved keys exist.
4. Replace PII/body logging with event IDs and redacted structured fields.
5. Add and test HSTS, CSP, frame ancestors, nosniff, Referrer-Policy, Permissions-Policy, and secure cookie behavior.
6. Start CSP in report-only mode locally/staging, remove violations, then enforce.
7. Commit: `security: add abuse protection headers and safe logging`.

---

# Phase 3 — Make the Conversion Funnel Real

### Task 11: Replace estimate handling with durable lead capture

**Objective:** Never report success until one lead is durably stored.

**Files:**
- Modify: `src/app/estimate/page.tsx`
- Modify: `src/app/actions/estimate.ts`
- Modify: `src/lib/lead-capture.ts`
- Create: `src/lib/estimate-schema.ts`
- Test: `tests/unit/estimate-schema.test.ts`
- Test: `tests/integration/estimate-action.test.ts`

**Steps:**
1. Write validation tests for name, either phone or email, ZIP, project type, timing, consent, and length limits.
2. Remove exact address and photos from the launch form.
3. Add accessible labels, descriptions, and field-specific errors.
4. Persist the lead first and return a non-PII event/lead ID.
5. Return failure when persistence fails; never log submitted fields.
6. Send owner/customer notifications after persistence and record delivery status separately.
7. Make notification failure visible to operators without changing durable customer success.
8. Add idempotency to prevent duplicate records on retry.
9. Commit: `fix: make estimate capture durable and truthful`.

**Acceptance:** One authorized test submission creates exactly one local/staging lead, returns success only after commit, and produces no PII log.

### Task 12: Publish privacy and terms foundations

**Objective:** Explain data collection before accepting personal information.

**Files:**
- Create: `src/app/privacy/page.tsx`
- Create: `src/app/terms/page.tsx`
- Modify: `src/components/layout/footer.tsx`
- Modify: form consent copy
- Test: `tests/e2e/legal-pages.spec.ts`

**Steps:**
1. Draft plain-language privacy/terms content based only on confirmed operations.
2. Mark legal review as required before launch; do not claim attorney approval.
3. Explain fields collected, purpose, retention, processors, contact, and customer choices.
4. Link the policies in the footer and beside form consent.
5. Test route status, metadata, keyboard access, and links.
6. Commit: `feat: add privacy and terms pages`.

### Task 13: Replace three broken booking choices with one project call

**Objective:** Give homeowners one reliable next step.

**Files:**
- Modify: `src/app/book/page.tsx`
- Modify: `src/config/site.ts`
- Modify: `src/lib/analytics.ts`
- Modify: `src/components/layout/mobile-call-button.tsx`
- Modify: `src/components/ChatBot.tsx`
- Test: `tests/e2e/booking.spec.ts`

**Steps:**
1. Obtain and manually validate one real 15-minute event URL.
2. Write a test that fails when the configured event returns an error or placeholder.
3. Replace the three-option UI with one project-call explanation and one scheduler.
4. Load the widget once, listen for confirmed booking messages, and show an accessible error/fallback state.
5. Suppress/reflow chat and sticky-call controls on scheduler/form routes.
6. Track scheduler view, load error, slot interaction when available, and confirmed booking.
7. Run one authorized desktop/mobile staging booking including confirmation, reminder, reschedule, and cancel.
8. Commit: `fix: replace broken booking flow with one project call`.

---

# Phase 4 — Private Catalog Accuracy, Public SELA Presentation

### Task 14: Verify and approve the active cabinet-style dataset privately

**Objective:** Build an authoritative nonpublic input before editing public catalog data.

**Files:**
- No credential, portal, price, order, or supplier mapping file may be created in Git.
- Use protected local notes/processes only; output a sanitized approved-style checklist with no supplier identity.

**Steps:**
1. Use the verified authenticated Chicago catalog or an authorized sanitized catalog export; never store the login/session in Git.
2. Treat the verified 29-family Chicago result as the launch comparison baseline and recheck it immediately before catalog publication.
3. Add the five verified missing families: Lunar Gray, Rustic Wood, Slim Amber Oak, Slim Iron Black, and Sage Breeze.
4. Confirm whether `Iron Black` and `Slim Iron Black` are separate active styles.
5. Confirm `Matte Black`/`Matte Ivory` spelling and every other exact display name.
6. Verify framed/frameless classification, door profile, material/construction details, finish, image, active/discontinued status, and public-usage rights.
7. Do not capture/export dealer costs, cart state, customer/account data, orders, inventory promises, or private terms into the website project.

**Gate:** Do not publish additions/specifications/assets until all listed fields and rights are verified.

### Task 15: Replace supplier-coupled code with a neutral SELA catalog

**Objective:** Ensure the website presents only SELA branding and carries no upstream identity/network dependency.

**Files:**
- Modify: `src/config/products-catalog.ts`
- Modify: `src/app/products/page.tsx`
- Modify: `next.config.js`
- Create: `public/images/cabinet-styles/*` only for approved assets
- Create: `tests/unit/products-catalog.test.ts`
- Create: `scripts/check-public-supplier-leaks.mjs`

**Steps:**
1. Write a failing test that rejects upstream names/domains in `src`, public asset paths, rendered HTML, metadata, schema, and browser network requests.
2. Rename supplier-specific TypeScript interfaces/comments to neutral `CabinetStyle` language.
3. Model only public fields: `id`, `name`, `description`, `tags`, `construction`, `image`, `alt`, and optional verified `status`.
4. Remove all hotlinked upstream image URLs and the upstream image-domain allowlist.
5. Self-host only usage-approved images with neutral SELA filenames and accurate alt text; otherwise use approved original/paid assets or omit the image.
6. Generate framed/frameless counts dynamically; do not hard-code 16/8/24.
7. Remove `NEW`, `Popular`, construction, and availability claims unless verified and dated.
8. Phrase availability as “confirmed during project planning,” never “in stock,” unless real synchronization exists.
9. Add the five missing styles only after Task 14 passes.
10. Add `check:supplier-confidentiality` to `package.json` and CI.
11. Commit: `feat: publish a verified sela cabinet style catalog`.

**Acceptance:** Public source/build/browser checks contain zero upstream supplier names/domains, and every style matches the approved private checklist.

---

# Phase 5 — Apply the Customer Avatar and Core Message

### Task 16: Centralize homeowner messaging and CTA configuration

**Objective:** Prevent copy drift and make one offer/action consistent site-wide.

**Files:**
- Create: `src/config/marketing.ts`
- Modify: `src/config/site.ts`
- Test: `tests/unit/marketing-config.test.ts`

**Steps:**
1. Encode the primary avatar, core message, hero headline/subheadline, primary CTA label/href, secondary call CTA, process steps, service scope, and prohibited-claim words.
2. Write tests asserting one primary CTA and no launch messaging for investor/contractor/designer programs.
3. Keep assumptions and unverified proof out of the published config.
4. Commit: `content: centralize homeowner launch messaging`.

### Task 17: Rebuild the homepage around the transformation

**Objective:** Move from product/features to confidence, organization, and accountable guidance.

**Files:**
- Modify: `src/components/sections/hero-section.tsx`
- Modify: `src/components/sections/trust-section.tsx`
- Modify: `src/components/sections/services-preview.tsx`
- Modify: `src/components/sections/process-section.tsx`
- Modify: `src/components/sections/cta-section.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/components/layout/header.tsx`
- Test: `tests/e2e/home-messaging.spec.ts`

**Homepage order:**
1. Hero: “A kitchen that works better starts with a measured plan.”
2. Primary `Plan My Kitchen` CTA and secondary call.
3. Verified facts-only proof strip; hide empty proof slots.
4. Before problem: cabinet planning should not be a guessing game.
5. After outcome: organized, beautiful, easier daily use.
6. Exact cabinet service scope.
7. Verified six-step process.
8. Style options and construction education.
9. Real project proof only, otherwise clearly labeled Style Inspiration.
10. Priority FAQ and final CTA.

**Steps:**
1. Write assertions for headline, core message, CTA destination, and forbidden claims.
2. Implement using `marketing.ts`.
3. Verify mobile hierarchy, keyboard focus, and CTA analytics.
4. Commit: `content: apply homeowner transformation to homepage`.

### Task 18: Align service, pricing, FAQ, About, and gallery content

**Objective:** Answer homeowner objections truthfully without inventing proof.

**Files:**
- Modify: `src/app/services/page.tsx`
- Modify: `src/app/pricing/page.tsx`
- Modify: `src/app/faqs/page.tsx`
- Modify: `src/app/about/page.tsx`
- Modify: `src/app/gallery/page.tsx`
- Test: `tests/e2e/trust-content.spec.ts`

**Steps:**
1. Define cabinet supply, measurement, design guidance, delivery coordination, installation, exclusions, and next step.
2. Replace unverified pricing/ranges with factors affecting price and a measured-estimate explanation until approved examples exist.
3. Add FAQ answers for scope, measurement responsibility, construction/warranty, estimate changes, timing, damage/missing items, other trades, qualifications, payments, and service areas—only with verified facts.
4. Correct owner copy to verified “Detroit-based” wording and use an approved real photo.
5. Rename visible Gallery presentation to `Style Inspiration`; remove invented Michigan project names and locations.
6. Add real case studies only with customer permission and source evidence.
7. Commit: `content: make public trust and service claims truthful`.

### Task 19: Remove unsupported schema and establish a proof registry

**Objective:** Make every trust claim traceable to evidence.

**Files:**
- Modify: `src/components/seo/SchemaMarkup.tsx`
- Modify: `src/components/seo/json-ld.tsx`
- Create: `src/config/verified-proof.ts`
- Test: `tests/unit/schema.test.ts`

**Steps:**
1. Write failing tests for unsupported aggregate rating, social profiles, coordinates, hours, payments, stock availability, warranty, and “premium/expert” claims.
2. Remove unsupported `AggregateRating` immediately.
3. Publish only verified LocalBusiness/Service fields from `verified-proof.ts`.
4. Hide optional schema fields when evidence is absent.
5. Add source/date/review-owner comments in the server-only proof registry without customer PII.
6. Commit: `fix: restrict schema to verified business facts`.

---

# Phase 6 — SEO, Accessibility, Mobile, and Performance

### Task 20: Repair canonical, sitemap, redirects, and noindex behavior

**Objective:** Make indexation match real useful routes.

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: metadata exports on public pages
- Modify: `src/app/sitemap.ts`
- Modify: `src/app/robots.ts`
- Modify: `next.config.js` or approved proxy config for redirects
- Create: `src/lib/metadata.ts`
- Test: `tests/e2e/seo.spec.ts`

**Steps:**
1. Write crawl tests for status, unique title/H1, self-canonical, robots, sitemap membership, and utility noindex.
2. Add a metadata helper that generates page-specific canonicals and OG/Twitter fields.
3. Replace broken `/service-areas/*` sitemap entries with approved `/locations/*` routes.
4. Add approved blog pages; omit admin/account/auth/private routes.
5. Add 301s from retired service-area URLs and `www` to the preferred apex host; verify at the deployment layer if host redirects cannot be trusted in-app.
6. Add approved OG assets.
7. Keep only location pages with original useful content and verified service coverage; no city-name swaps.
8. Commit: `seo: align canonicals sitemap redirects and indexing`.

### Task 21: Fix WCAG and mobile conversion blockers

**Objective:** Pass automated and manual accessibility checks without obscuring conversion controls.

**Files:**
- Modify: `src/app/globals.css`
- Modify: `tailwind.config.ts`
- Modify: `src/app/estimate/page.tsx`
- Modify: `src/components/layout/mobile-call-button.tsx`
- Modify: `src/components/ChatBot.tsx`
- Modify: affected components from Axe results
- Test: `tests/e2e/accessibility.spec.ts`

**Steps:**
1. Turn the 147 serious contrast findings and four unnamed controls into regression cases.
2. Adjust tokens to WCAG AA, preserving the charcoal/green/wood direction.
3. Add labels, descriptions, names, field-specific errors, focus management, and error summary.
4. Make chat a bounded dialog with close control, focus trap, escape behavior, and reduced-motion support.
5. Reflow/hide fixed chat/call controls on form and scheduler routes.
6. Test desktop/mobile, keyboard, screen reader names, 200% zoom, touch targets, and reduced motion.
7. Commit: `a11y: fix contrast forms and mobile overlays`.

### Task 22: Optimize and own public imagery

**Objective:** Reduce the 2.8 MiB homepage payload and eliminate misleading/third-party visual dependencies.

**Files:**
- Modify: `src/config/images.ts`
- Modify: `next.config.js`
- Modify: image-using pages/components
- Create: approved files under `public/images/`
- Test: Lighthouse budget in `tests/performance/`

**Steps:**
1. Inventory every image by owner, rights, represented subject, size, and page.
2. Remove stock people presented as SELA team and supplier imagery presented as completed local work.
3. Convert approved assets to responsive AVIF/WebP with meaningful filenames/alt text.
4. Configure `next/image` sizes and restore optimization.
5. Add budgets for total transfer, largest image, LCP, CLS, and broken image requests.
6. Commit: `perf: replace and optimize public imagery`.

---

# Phase 7 — Measurement and Operations

### Task 23: Implement privacy-safe conversion analytics

**Objective:** Measure the whole funnel without logging form contents.

**Files:**
- Modify: `src/components/analytics/google-analytics.tsx`
- Modify: `src/lib/analytics.ts`
- Modify: CTA/form/booking components
- Create: `src/lib/analytics-events.ts`
- Test: `tests/e2e/analytics.spec.ts`

**Events:** `primary_cta_click`, `phone_click`, `lead_form_start`, `lead_validation_error`, `durable_lead_created`, `lead_server_error`, `scheduler_view`, `scheduler_error`, `booking_confirmed`.

**Steps:**
1. Define typed event names and non-PII payloads.
2. Disable analytics when configuration/consent policy requires it.
3. Emit durable-lead success server-side only after commit.
4. Preserve source/medium/campaign without sending names, emails, phones, addresses, notes, or dealer information.
5. Verify events in staging debug mode.
6. Commit: `analytics: measure the launch funnel without pii`.

### Task 24: Define lead ownership and customer follow-through

**Objective:** Make the website promise operationally real.

**Files:**
- Update operational documentation outside public code; do not include customer data.
- Modify customer confirmation templates only after approval.

**Steps:**
1. Assign lead owner and business-hours response SLA.
2. Create consultation preparation, measurement responsibility, selection approval, order update, delivery readiness, installation, punch-list, and warranty handoff templates.
3. Define notification-failure monitoring and daily unworked-lead check.
4. Define when review requests are permitted: only after verified completion.
5. Test one synthetic staging lead through the full workflow and remove it only with explicit deletion approval.

---

# Phase 8 — Reproducible Source and Controlled Deployment

### Task 25: Make builds deterministic and environment documentation complete

**Objective:** Ensure local, CI, Docker, and Coolify build the same application.

**Files:**
- Modify: `Dockerfile`
- Modify: `docker-compose.yaml`
- Modify: `env.example.txt`
- Modify: `package.json`
- Create: `.dockerignore` if missing
- Create: `src/app/api/health/route.ts`
- Test: container health and smoke suite

**Steps:**
1. Use Corepack/Yarn and `yarn install --frozen-lockfile` in Docker; remove npm fallback.
2. Use multi-stage build, non-root runtime, minimal copied output, and health check.
3. Document all environment names, required/optional status, and consumers without values.
4. Health endpoint must reveal no version, secret, DB details, or customer data.
5. Build twice from the same lockfile and compare functional smoke results.
6. Commit: `build: make container deployment deterministic`.

### Task 26: Add CI after a private remote is approved

**Objective:** Prevent unsafe code from becoming deployable.

**Files:**
- Create: `.github/workflows/ci.yml` or equivalent for the approved private host.

**Required jobs:** install frozen lockfile, supplier-confidentiality scan, API auth coverage, typecheck, lint, unit/integration tests, production audit, build, Playwright public/security/SEO/a11y smoke, and artifact retention without secrets.

**Gate:** Creating/configuring a remote and pushing require Hamada’s explicit approval.

### Task 27: Verify Coolify source, staging, backup, and rollback

**Objective:** Ensure an old upstream cannot overwrite the corrected site.

**Steps:**
1. With explicit approval, create/confirm a private authoritative remote and push `main`, `local-improvements`, and reviewed `launch-readiness` as directed.
2. Read-only verify Coolify repository, branch, build context, Dockerfile, environment-key presence, domains, health check, and rollback target.
3. Create/confirm isolated staging without production/customer data.
4. Verify database backup and migration rollback before any schema change.
5. Deploy staging only after separate approval.
6. Run the complete Green Launch Gate against staging.
7. Prepare production release/rollback commands but do not execute without explicit production approval.

---

# Phase 9 — Soft Launch and Expansion

### Task 28: Conduct controlled soft launch

**Objective:** Validate real operations before paid acquisition.

**Steps:**
1. Obtain explicit production deployment approval.
2. Deploy through approved Git/Coolify workflow.
3. Run unauthenticated security tests, public smoke, booking, estimate, analytics, SEO, a11y, headers, and health checks.
4. Send only known/referral traffic initially.
5. Manually monitor every lead/booking and response SLA for an agreed observation window.
6. Confirm no sensitive logs, duplicate leads, scheduler failures, or catalog mismatch.
7. Obtain separate approval before paid search or retargeting.

### Task 29: Defer secondary audiences until operations are real

**Objective:** Avoid diluting the homeowner launch or promising unsupported programs.

**Post-launch only:**
- Investor packages after repeat pricing, availability, capacity, and reorder policy are defined.
- Contractor program after responsibility matrix, trade terms, client-contact boundaries, and SLAs are defined.
- Designer program after samples, specifications, visualizations, finish control, and fulfillment support are verified.
- Financing only after an approved provider and compliant terms exist.
- Customer portal only after complete security/privacy maturity.

---

## 4. Full Verification Command Set

Run from the isolated worktree:

```bash
export PATH="$HERMES_HOME/node:$PATH"
corepack.cmd yarn install --frozen-lockfile
corepack.cmd yarn check:supplier-confidentiality
corepack.cmd yarn check:auth-coverage
corepack.cmd yarn typecheck
corepack.cmd yarn lint
corepack.cmd yarn test --run
corepack.cmd yarn test:e2e
corepack.cmd yarn test:a11y
corepack.cmd yarn audit:prod
corepack.cmd yarn build
```

Then run the Docker build/health smoke and confirm:

- No secret, `.env`, customer data, dealer information, or production log is tracked/staged.
- No upstream supplier identity/domain appears in public source, build, metadata, schema, assets, or browser requests.
- Git diff contains only intended changes.
- `main` remains untouched.
- No remote push/deploy occurred without approval.

## 5. Primary Risks and Tradeoffs

- **Catalog access is verified, but rights remain gated:** The authenticated Chicago catalog confirms 29 visible style families but does not by itself prove image/description reuse rights, specifications, stock promises, current terms, or long-term availability.
- **Credential exposure:** The pasted dealer credential should be rotated. Protected runtime storage exists, but 1Password backup was not completed because CLI access was unavailable.
- **Framework upgrade risk:** Moving from the vulnerable Next.js release may surface compatibility issues; isolate and regression-test before combining with content work.
- **Legacy CRM scope:** Protecting all 40 route files is safer than patching only observed endpoints but requires disciplined route-manifest testing.
- **Proof shortage:** A truthful early site may have less social proof. This is preferable to fictional ratings/projects.
- **Location-page quality:** Removing thin pages can temporarily reduce URL count but prevents weak doorway-page SEO.
- **Photo upload removal:** Reduces initial lead detail but removes a false feature and privacy/security risk. Photos can be requested after qualification.
- **Single scheduler:** Reduces choice but improves reliability and matches the primary avatar’s desired clear next step.

## 6. Open Questions Requiring Hamada/Business Approval

1. When will the chat-exposed dealer credential be rotated and the protected runtime/backup copies updated?
2. May SELA publicly offer all 29 Chicago catalog style families, or should launch use a smaller curated subset?
3. May SELA reuse and self-host upstream images/descriptions/specifications under its own presentation?
4. What must remain private beyond supplier identity—style names, manufacturer documents, or only the supplier relationship/pricing?
5. Who owns the 15-minute project call and what hours/timezone are offered?
6. What exact cabinet/install services, exclusions, qualifications, insurance, warranties, lead times, payment methods, and response SLA are verified?
7. Are there three real projects and five verified reviews with publication permission, or should launch use transparent Style Inspiration only?
8. Which private Git host/repository should become authoritative?
9. Should Coolify use `launch-readiness` for staging and a reviewed release branch/tag for production?

## 7. Recommended Commit Sequence

1. `test: establish launch readiness quality gates`
2. `test: define api authorization contract`
3. `security: validate environment and remove fallback secrets`
4. `security: add deny by default server authorization`
5. One security commit per API family
6. `security: disable public registration and launch portal`
7. `chore: upgrade framework and enforce build checks`
8. `security: add abuse protection headers and safe logging`
9. `fix: make estimate capture durable and truthful`
10. `feat: add privacy and terms pages`
11. `fix: replace broken booking flow with one project call`
12. `feat: publish a verified sela cabinet style catalog`
13. `content: centralize homeowner launch messaging`
14. `content: apply homeowner transformation to homepage`
15. `content: make public trust and service claims truthful`
16. `fix: restrict schema to verified business facts`
17. `seo: align canonicals sitemap redirects and indexing`
18. `a11y: fix contrast forms and mobile overlays`
19. `perf: replace and optimize public imagery`
20. `analytics: measure the launch funnel without pii`
21. `build: make container deployment deterministic`
22. `ci: enforce launch readiness gates`

Do not squash away the security/content separation before review; each stage should remain independently auditable and reversible.
