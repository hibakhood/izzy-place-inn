# Izzy Place Inn & Suites: security and SEO audit

Date: 22 October 2026 (Africa/Lagos)

## Scope and evidence

Reviewed the current local source, database schema, API handlers, dependency lockfile, build output and rendered homepage metadata. Ran `npm audit --json` against the npm advisory registry and `npm run build`. No live bookings, email sends, production database queries or exploit attempts were performed. No application changes were made as part of this audit.

The security skill's dedicated dependency, SAST and HoundDog scanners are unavailable in this session. The substitute package audit succeeded; static/dataflow findings below are manual code-review findings, not results from those unavailable scanners. Production deployment, actual database grants/policies, HTTPS, response headers, Google indexing, Search Console and real-user performance were not verified. Code findings describe behavior if the supplied implementation is deployed with the corresponding services enabled.

## Overall assessment

Address booking integrity and email abuse before accepting production reservations. The largest SEO obstacle is hash routing combined with canonical URLs that describe different paths. The app builds successfully, but that does not establish security or search readiness.

## Security findings

### S1. High: visitors control trusted booking fields

Evidence: `src/lib/booking.ts:36` inserts the browser-supplied payload directly into Supabase. `src/pages/Booking.tsx:122` supplies total_amount and status fields. `supabase/schema.sql:95` allows public inserts with `with check (true)`. The schema accepts a zero total and a supplied paid/confirmed status; it does not enforce positive quantities, checkout after check-in or available inventory. Client form validation cannot protect direct API requests.

Impact: a caller can bypass displayed prices and create forged payment/booking records or invalid reservations, subject to deployed grants. No financial charge or actual inventory theft was tested.

Fix: create bookings through a server endpoint or carefully restricted database function. Derive prices, totals, statuses and references on the server; validate dates and quantities and check inventory transactionally. Remove unrestricted public table inserts after the replacement flow is ready. If guest login is added, restrict owner updates to safe fields; the current owner policy does not limit which columns may change.

### S2. High: public booking email endpoint can send forged confirmations

Evidence: `api/send-booking-emails.ts:17-30` trusts an arbitrary recipient, reference, room description, totals and statuses. It does not look up a persisted booking, verify a server-generated token, rate limit or deduplicate requests. Contact email also has no application-level abuse protection (`api/contact.ts:21-50`). Hosting-provider protections, if any, were not checked.

Impact: spam, forged hotel confirmations, inbox flooding and email-provider quota/cost abuse when Resend is configured.

Fix: send confirmations from the server only after a validated booking is committed. Look up the booking by trusted internal identity, use an outbox or deduplication key, and add durable rate limiting and bot controls to public forms. An Origin check alone is insufficient against direct requests.

### S3. Medium: unescaped HTML in emails and weak input validation

Evidence: `api/contact.ts:34-37` interpolates user fields into HTML. `lib/email-templates.ts:47,61` and other template fields do the same. TypeScript casts do not validate runtime JSON. Handlers primarily check presence, without string types, lengths, recipient format or request shape.

Impact: attacker-controlled email content and links can be inserted into hotel-branded messages. This is HTML injection in emails; JavaScript execution in email clients was not demonstrated. Oversized or malformed requests can also cause errors or abuse resources.

Fix: validate request schemas and length/body limits, then escape every dynamic text value at the HTML boundary. Return safe, generic errors instead of provider exception details (`api/contact.ts:56`, `api/send-booking-emails.ts:47`).

### S4. High dependency advisories require remediation planning

Registry audit: **12 affected package entries: 0 critical, 7 high, 5 moderate, 0 low**. Entries include vulnerable parent/transitive dependency paths and are not 12 distinct exploitable attacks.

High entries: braces, chokidar, fast-glob, micromatch, source-map-js, tailwindcss, vite. Moderate entries: esbuild, postcss-nested, postcss-selector-parser, react-router, react-router-dom.

Much of the exposure is build/dev tooling. Several Vite advisories require specific operating systems, editors or server configurations; the Router SSR advisory is not established as applicable to this client-only app. Do not describe these as confirmed production exploits.

Fix: first apply compatible updates to affected packages or their direct parents, rerun the audit and test the app. The audit's proposed Tailwind 4 and Vite 8 fixes are major upgrades and need migration checks. Do not run forced upgrades blindly. Keep development servers private.

Selected advisory evidence:
- https://github.com/advisories/GHSA-vfj7-8cjw-p6xm
- https://github.com/advisories/GHSA-68fv-2mgg-jv7q
- https://github.com/advisories/GHSA-4w7w-66w2-5vf9
- https://github.com/advisories/GHSA-jjmj-jmhj-qwj2

### S5. Medium reliability/trust issue: success without persistence or delivery

Evidence: `src/lib/booking.ts:31-33` reports success with no Supabase configuration. `lib/base44/integrations/core.ts:26-29` returns an empty email ID when the key is absent; contact can still report success. Booking emails are fire-and-forget, and fetch HTTP failures are not inspected.

Impact: guests may believe reservations or messages have been received when nothing was saved or delivered.

Fix: restrict demo behavior to explicit development mode. Fail closed in production on missing configuration. Persist booking requests and track email status with retries. Do not promise successful email delivery before it is known.

### S6. Lower priority: defense in depth and privacy

`vercel.json` configures nosniff, Referrer-Policy and X-Frame-Options, which is useful, but no Content-Security-Policy is configured there. Design a CSP around the Google Maps iframe, fonts, Supabase and generated scripts; test in report-only mode first. Verify HTTPS/HSTS at the production host rather than assuming they are absent. API error logs may contain provider or guest information; review redaction and retention. No privacy-policy route is defined in `src/App.tsx`, despite guest name, email, phone and special-request collection. Add clear data-use and retention information, without treating this audit as legal advice.

No obvious private-key/service-role credential literals were found in the scoped source search. Only `.env.example` appeared in tracked environment filenames. This was not a complete Git-history secret scan. Supabase's public anon key is not itself a secret; database permissions are what must protect data.

## SEO findings

### E1. High: hash routes conflict with canonical URLs

Evidence: `src/main.tsx:3,12` uses HashRouter. Browser links are `#/rooms` and `#/rooms/classic-room`, while `src/components/Seo.tsx:24-31` emits canonical URLs such as `https://izzyplaceinn.com/rooms`. A request to an ordinary path without a hash is not routed to that page by HashRouter. The Vercel rewrite serves the SPA shell but does not correct this application-level mismatch.

Impact: room pages may not be discovered/indexed as independent pages, and canonical/structured-data URLs may resolve to homepage content.

Fix: use ordinary path routing with correct hosting rewrites and a configured base path. Prefer prerendering or server rendering for marketing and room pages. Redirect legacy hash links in the browser. Choose the actual production host/base before migration. Google recommends History API routing instead of fragments for distinct content:
https://developers.google.com/search/docs/crawling-indexing/url-structure
https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics

### E2. Medium: duplicate descriptions and social metadata

Evidence: rendered homepage has two description tags: the fixed `index.html` description and a different Helmet description. Static OG/Twitter tags also coexist with runtime ones (`index.html`, `src/components/Seo.tsx:28-44`). The initial shell contains no route-specific rendered page content.

Fix: emit one authoritative set per route, ideally in prerendered HTML. Avoid expecting all social-preview bots to execute JavaScript. Use an informative homepage title/H1 that naturally identifies a hotel in Ibadan, without keyword stuffing.

### E3. Medium: no sitemap or robots file in source

`public/robots.txt` and `public/sitemap.xml` do not exist. Missing robots.txt alone does not block crawling. Missing sitemap is a discovery opportunity, not proof of deindexing.

Fix: after routing is corrected, add a sitemap of real canonical marketing/room URLs and a robots.txt pointing to it. Exclude booking parameters and confirmation content from the sitemap. Verify actual responses and submit through Search Console. No Search Console data was available.

### E4. Medium: invalid room URLs never finish loading

Evidence: `src/pages/RoomDetail.tsx:22-36` leaves room null when a slug is not found and renders a spinner indefinitely. The catch-all route does not catch `/rooms/nonexistent` because it matches the dynamic route. The global SPA rewrite can also return HTTP 200 for missing pages.

Fix: distinguish loading, not-found and error states. Render a useful 404 with noindex for invalid rooms; configure real 404 status handling in the chosen rendering/hosting approach.

### E5. Medium: large initial load and aggressive service-worker caching

Measured build: main JS approximately **812 kB / 245 kB gzip**. PWA precache: **59 entries, approximately 25,157 KiB (24.6 MiB)**. `vite.config.ts:42` includes all matching photos and MP4s in the precache. The source also contains duplicate includeAssets keys, reported by the build. `public/images` is about 16 MB and videos about 7 MB. Multiple unused legacy photos remain in public assets.

Impact: unnecessary downloads and service-worker installation/storage cost, with possible performance impact on mobile. These are bundle/cache measurements, not measured LCP/INP/CLS or proof of a Core Web Vitals failure.

Fix: split routes, optimize/compress images with responsive sources, remove genuinely unused assets after a reference audit, and exclude large videos/photos from installation precache. Use selective runtime caching. Test installed-service-worker updates and disable development PWA behavior unless needed. Measure field/lab performance on the deployed site afterward.

### E6. Medium/low: room share images and local trust information

`src/pages/RoomDetail.tsx:49` passes base-relative asset paths into OG/Twitter metadata; `Seo.tsx` does not resolve them to absolute production URLs. Resolve all social images against the verified site origin. Room offers always state InStock without inventory verification (`RoomDetail.tsx:75`); remove that claim or derive it from actual availability.

Positive: rendered Hotel JSON-LD is present, with hotel name, address, phones, amenities and check-in/out times. Homepage has one H1. Real room photographs and contact details are available. Validate room and hotel structured data with Google's Rich Results Test after deployment. Ensure the Google Business Profile matches the same name, address, phone and canonical website. No Business Profile or indexing verification was performed.

## Recommended order

1. Move booking creation and confirmation email ownership to the server; validate all inputs, derive totals/statuses, restrict database writes and protect public forms from abuse.
2. Escape email output; stop reporting successful saves/sends when services are unconfigured.
3. Patch compatible dependencies, then separately plan and test any major tooling upgrades.
4. Choose one production URL strategy and replace hash routing; prerender marketing/room pages.
5. Deduplicate metadata, handle invalid rooms, add sitemap/robots and use absolute share-image URLs.
6. Reduce PWA precache and bundle/media sizes; check production headers, Search Console, Rich Results and mobile performance.

Security references:
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/docs/guides/database/secure-data
- https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html
- https://cheatsheetseries.owasp.org/cheatsheets/Email_Validation_and_Verification_Cheat_Sheet.html
