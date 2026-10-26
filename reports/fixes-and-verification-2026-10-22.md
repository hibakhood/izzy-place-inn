# Security, SEO and responsive changes

## Booking and hotel notifications

The browser submits guest fields only. The server validates inputs and the database transaction derives the price, total, reference and unpaid status, checks each night's inventory under a room-category lock, and saves an email outbox record atomically. Anonymous booking writes and owner status/payment updates are revoked by the migration.

Both izzyplaceinn@gmail.com and info@izzyplaceinn.com receive the hotel notification before any guest confirmation is attempted. Provider acceptance and queue progress must succeed before advancing. Failures remain queued; a protected scheduled worker retries using stable provider idempotency keys. Same-request retries do not create another booking. Automated retries stop before the provider's 24-hour deduplication window expires; old or exhausted records require reviewed recovery.

This verifies message construction and ordering, not delivery into real inboxes. No live service credentials were available and no production migration or real test reservation was performed. Apply the migration, configure secrets and the scheduled worker, then verify a real reservation and mailbox delivery before launch. See README.md.

## Security and SEO

Added strict input/body limits, HTML escaping, durable hashed-IP rate limits, safe errors, server-only email recipients, origin checks, protected worker and fail-closed missing configuration. Updated dependencies: registry audit has zero vulnerabilities. CSP is report-only for deployment validation.

Replaced hash routes with ordinary paths and legacy link migration. Prerendered 12 pages with unique metadata, absolute social images, safer structured data, sitemap and robots. Booking/404 pages are noindex; Vercel serves real files first and unknown URLs return 404. Added a privacy page and deployment/retention review notes.

Split page code and reduced service-worker precache from about 24.6 MiB to 869 KiB; development service workers are disabled. Photos and video are excluded from precaching.

## Verification

- Production build and 12-page prerender pass.
- Seven security tests pass, including malicious input, email escaping, hotel-before-guest ordering, failure handling and request limits.
- An isolated embedded PostgreSQL run applied schema, seed and migration, and verified authoritative pricing/status, outbox persistence, retry deduplication, capacity, adjacent stays, guest limits, rate limits, exclusive notification claims and denied anonymous access. No hotel database was touched.
- Responsive changes cover menu scrolling/navigation, wrapping date calendars, booking columns/summary/actions, gallery, contact addresses/footer and 16px phone form inputs. Browser checks at 320, 390, 768 and 1440 pixels found no document overflow on Home, Rooms, all four room details, About, Gallery, Contact and Privacy. Booking review/add-ons and date calendars also fit all four sizes. Tested date selection, guest-form progression, mobile menu navigation and the visible unavailable-email error. No false confirmation appeared. Room gallery intrinsic-width overflow discovered during testing was fixed and retested. Screenshot: screenshots/room-mobile.png.

## Remaining deployment checks

Configure production secrets, apply SQL, schedule and monitor worker, confirm inventory quantities, verify sender and hotel inboxes, test actual email delivery, inspect CSP violations before enforcement, and validate production HTTPS, 404 responses, Search Console and structured data. Hotel management must confirm operational data retention.
