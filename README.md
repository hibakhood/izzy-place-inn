# Izzy Place Inn & Suites

React/Vite hotel website and installable PWA. The application uses a local room catalog and **no database**. Booking requests and contact messages are emailed through a server API.

## Run and build

- `npm install`
- `npm run dev` starts Vite and the local email API (port 3001).
- `npm test` runs security and install-policy tests.
- `npm run build` checks types, builds the PWA and prerenders public pages.
- `npm run preview` serves the production build locally. Native installation should be tested on this build or the HTTPS deployment; the development server intentionally does not register a service worker.

The local base path is `/izzy-place-inn/`; Vercel builds use `/`. Both manifest and service worker respect the application path. Existing Supabase SQL files are historical and are not part of this setup. No database credentials or migration is required.

## Secure email setup

Use `.env.example` as the configuration guide. Set server secrets in your hosting environment or an ignored local `.env.local`, never in source control or `VITE_` variables. `RESEND_FROM_EMAIL` must be a verified sender. Notifications go to **izzyplaceinn@gmail.com** and **info@izzyplaceinn.com**, plus optional ADMIN_EMAIL recipients. Do not paste secrets into chat.

Create a Cloudflare Turnstile widget restricted to your website hostname. Set its public `VITE_TURNSTILE_SITE_KEY` and server-only `TURNSTILE_SECRET_KEY`. Set `SITE_ORIGIN` to the deployed HTTPS origin (or your local origin for local verification). Contact verification checks success, an explicitly trusted hostname and the contact action. Booking requests do not use Turnstile. Missing email settings fail closed and give guests the reception phone option.

Set independent long random `BOOKING_REFERENCE_SECRET` and `RATE_LIMIT_SECRET` values. A bounded, hashed-IP per-process throttle supplements Turnstile; it is not a global limit across serverless instances. Configure hosting firewall limits and email-provider spend/usage alerts for additional protection. Origin checks, body limits, schema validation, HTML escaping and fixed hotel recipients remain enforced. The retired queue worker returns 410 and cannot send email.

## Booking behavior without a database

The server calculates room estimates from the shared catalog. Booking notifications are sent only to **info@izzyplaceinn.com** and must be accepted by the email provider before the app shows success. Guest email remains required and is included in hotel booking details, but no booking email is sent to the guest. Guests can print their request confirmation or download a PDF; availability and payment must be confirmed by hotel staff. There is no automatic inventory reservation, persisted guest record or background retry queue.

Unchanged retries use the same reference and provider idempotency keys. The browser keeps only a digest and random request key in session storage, not guest details. Provider duplicate protection lasts 24 hours; it is not permanent storage. If the hotel email fails, the guest sees an error and can retry with unchanged details or call reception. Check provider delivery history before a manual resend. Email acceptance is not proof of inbox delivery. Test the info@izzyplaceinn.com booking inbox with production credentials before launch.

## PWA installation and privacy

The page offers installation to visitors who have not already installed it. A native prompt can only open after a user taps Install and the browser has supplied `beforeinstallprompt`. Browser rules, prior dismissal, private mode and embedded browsers may prevent that event. Manual instructions remain available through Install app. On iPhone/iPad, use the browser Share menu and Add to Home Screen. Installed apps do not show the promotion. Dismissal is respected for the session.

Serve production over HTTPS. PWA caching is limited to public application assets. Email API requests and guest data are not cached or queued offline; photos/video are excluded from bulk precaching. No push-notification permission, tracking SDK or personal data is needed for installation. The production Content Security Policy restricts scripts, frames and connections to the app and its required providers. The hotel should confirm its email retention and privacy practices.

Booking requests do not require Turnstile. Contact requests still use Turnstile. Booking origin checks, input validation, server-owned totals, idempotency and per-process rate limits remain enforced. Email configuration and server secrets are still required.


Booking requests from an installed apex-domain app target the canonical www API directly. That API allows credential-free CORS only for explicit trusted origins, POST and the required request headers. No wildcard, opaque/null origin, arbitrary Vercel project or reflected Host header is trusted. Installed apps check for updates when focused; a refresh notice preserves in-progress booking details until the guest chooses to reload.
