# PWA and database-free changes

The runtime no longer imports or connects to Supabase. Catalog rates are local/shared with the server. No database, migrations or queue worker is required. Historical SQL files are not used. Dependencies for Supabase and the unused Resend SDK were removed; server mail uses the provider HTTPS API.

Booking requests are validated and priced on the server. Both hotel mailboxes must be accepted by the provider before the guest receipt is attempted. Requests are explicitly pending hotel confirmation because there is no database inventory reservation. There is no background retry queue. Stable request references and provider idempotency keys support unchanged retries within the provider's 24-hour window. Missing email or security configuration fails closed.

Cloudflare Turnstile is required for online email forms, verified server-side for success, hostname and action. Public site key is intentionally visible; email, reference, throttle and bot secrets remain server-only. Added tests for wrong hostname/action and missing configuration. A bounded hashed-IP process throttle supplements verification; configure hosting firewall limits for global abuse protection. No guest details are put in browser storage, logs or the PWA cache.

The install experience captures beforeinstallprompt early, offers a branded accessible install dialog on secure uninstalled visits, and opens the native prompt only on the Install action. Manual browser and iPhone/iPad instructions are supplied where that API is unavailable. Session dismissal is respected and the footer can reopen instructions. Installed app mode hides the promotion. No push permission or analytics is requested.

Manifest identity, scope and start URL are relative to support both the local subfolder and production root. Verified 192/512 PNG sizes, manifest fields, generated service-worker registration and install hooks. Production build/prerender and automated tests pass. Browser-secret exclusion checks passed. Development service workers stay disabled; native installation should be checked on a production build or HTTPS deployment in a supporting browser.

Follow-up visual verification completed: the preview recovered and loaded normally. Confirmed automatic promotion on a fresh browser-tab visit, footer Install app reopening, dismissal surviving reload in the same session, and a 320px-wide phone layout fitting within the viewport. No browser errors were recorded during the check. Screenshot: screenshots/pwa-install-mobile.png. The in-app browser used manual instructions; no native installation or real emails were triggered. Native device installation still requires a supporting browser and production deployment check.

Configure the email service and Turnstile using .env.example and README before accepting live online requests. Do not put server secrets in VITE_ variables or chat. Real mailbox delivery and device installation remain deployment checks.
