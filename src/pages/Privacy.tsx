import Seo from "@/components/Seo";
import { siteConfig } from "@/lib/site";

export default function Privacy() {
  return <>
    <Seo title="Privacy" path="/privacy" description="How Izzy Place Inn & Suites uses booking and contact information, and how to contact us about your data." />
    <article className="container-site max-w-3xl py-28 text-ink sm:py-32">
      <h1 className="font-display text-4xl">Your privacy</h1>
      <p className="mt-6 leading-relaxed">When you book or contact us, we collect the details you provide, such as your name, email, phone number, stay dates, guest numbers and requests. Please avoid including sensitive personal information in requests.</p>
      <h2 className="mt-8 font-display text-2xl">How we use your information</h2>
      <p className="mt-3 leading-relaxed">We use these details to handle your booking, answer enquiries and arrange your stay. Booking requests, including your email address, are sent to our hotel team. You can print or download a request confirmation on the website; we do not email booking confirmations to guests. The hotel confirms availability separately.</p>
      <h2 className="mt-8 font-display text-2xl">Services that help us</h2>
      <p className="mt-3 leading-relaxed">Our website uses hosting, bot verification and email providers to process these requests. The embedded Google Map and web fonts connect to Google when they load. These providers may receive technical information such as your IP address. Cloudflare Turnstile checks requests for automated abuse. Your browser may store public website files and an install dismissal preference. A digest and random retry key may be kept for booking retries; guest details are not saved in browser storage.</p>
      <h2 className="mt-8 font-display text-2xl">Keeping and managing your details</h2>
      <p className="mt-3 leading-relaxed">We keep booking and enquiry records as needed to manage stays and meet applicable record keeping obligations. Contact us to ask about access, corrections or deletion. Some records may need to be kept for legal or accounting reasons.</p>
      <p className="mt-8 leading-relaxed">For privacy questions, email <a className="text-gold-deep underline [overflow-wrap:anywhere]" href={`mailto:${siteConfig.emails.reservations}`}>{siteConfig.emails.reservations}</a>.</p>
    </article>
  </>;
}
