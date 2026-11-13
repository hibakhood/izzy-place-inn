# Booking and security audit

Date: 13 November 2026

## Scope and evidence

Reviewed the booking and contact APIs, Node deployment adapter, server-owned prices and validation, email recipients/templates, retries, browser storage, PWA caching/updates, deployment headers, guest confirmation/printing, dependency advisories and tracked files for credential patterns. Unrelated research files were excluded.

The browser initially loaded an old application bundle with obsolete footer and booking wording. A refresh loaded the current bundle. The apex API returns an HTTP 308 redirect to www. This is a confirmed redirect and cache problem; physical-device Safari behavior has not been observed directly.

A live, clearly marked test booking was submitted through the mobile-width browser form with no extras. The hotel email provider accepted the message and the page displayed reference IZ-59E04E1A4FF88285. The Download PDF control produced a one-page PDF. This verifies provider acceptance, not inbox delivery. The browser had no recorded errors or horizontal overflow at 390px. The print control is present; a physical printer was not tested.

## Fixes

- Booking requests from a cached apex app target the canonical HTTPS API directly, avoiding cross-domain POST redirects. Requests explicitly omit cookies and refuse redirects.
- Preflight and response CORS use the existing exact trusted-origin allowlist. Only POST, Content-Type and Idempotency-Key are allowed. No wildcard or credentials are enabled; null/opaque origins, unrelated Vercel projects and lookalike domains remain rejected.
- Worker updates bypass the browser's HTTP cache, are checked on return to the app, and display a refresh notice without automatically discarding a booking form. Service-worker HTTP responses are not cached; new workers claim clients and retire outdated caches.
- Contact bot verification recognizes trusted canonical hostname aliases while still verifying success and action.
- Booking requests time out instead of spinning indefinitely; existing retry/idempotency handling remains intact.
- Corrected guest-email wording and privacy text. Guest email remains required and is included in the hotel notification. Only info@izzyplaceinn.com receives booking email.
- Enforced the existing provider-restricted CSP, including the exact canonical API domain. Guest content is escaped and no arbitrary inline scripts are permitted. HTTPS, framing and MIME protections remain active.
- Extended environment-file ignore rules. Pattern scanning found no likely committed API/private keys; only .env.example is tracked. This is not proof that historical credentials or hosting settings were never exposed.
- Updated vulnerable glob/minimatch and serialize-javascript build dependencies. The glob override is validated by a complete production/PWA build.

## Validation

Automated tests cover server ESM execution, hotel-only delivery, required guest email, optional extras, rejected foreign origins, exact CORS preflight origins/headers, escaped email content, body bounds, server-owned rates/capacity, canonical API routing, network failure handling, confirmation content and PWA installation behavior. Production compilation and prerendering pass.

## Remaining limits

- npm production audit: no known vulnerabilities. Full audit: four low-severity entries in the build-only deepmerge dependency chain. The current release has no patched deepmerge version; npm proposes an obsolete PWA downgrade, which was not applied. No moderate/high/critical findings remain.
- Rate limiting is per process, not a global serverless quota. Configure Vercel firewall rate limits and email-provider usage alerts for global abuse protection. Neither the origin check nor CORS authenticates a public booking caller.
- No database or durable email queue is used. Provider idempotency is time-limited. A provider outage prevents a success confirmation; email acceptance is not proof of final inbox delivery. Check provider delivery history before manual resends.
- Contact submission still requires valid Turnstile configuration. No live CAPTCHA was completed during this audit.
- An installed app already running an old bundle needs to close/reopen or refresh once. New update behavior only runs after that updated bundle loads.
- No physical phone, hosting-account logs, mailbox access, historical forensics or penetration test was available. This review cannot certify absence of every vulnerability or breach.
