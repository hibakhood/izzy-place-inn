# Izzy Place Inn & Suites

Official website for Izzy Place Inn & Suites, Ibadan — a full-service hotel and
suites on Old Ife Road. Rooms and suites, add-on services, and an online
booking flow.

## Stack

- **Frontend**: React 18 + Vite 5 + TypeScript, React Router v6, Tailwind CSS v3, shadcn/ui-style components, framer-motion, react-helmet-async (SEO), react-day-picker (date selection)
- **Backend**: Supabase (Postgres + RLS) for catalog + bookings; Vercel serverless functions (`/api`) for transactional email via Resend
- **Deployment**: Vercel (SPA rewrites in `vercel.json`)

## Getting started

```bash
npm install
npm run dev       # local dev server
npm run build     # typecheck + production build
```

Create `.env.local` from `.env.example` and add your Supabase and Resend keys.
Without keys the site runs in **fallback mode**: catalog is served from `src/data/*`
and bookings confirm without persisting to a database.

## Project structure

```
src/
  components/       UI + page components (BookingSummary, BookingWizard, ...)
  pages/            Route-level pages (Home, Rooms, Booking, Gallery, Contact, ...)
  data/             Fallback catalog (rooms, add-ons, content)
  hooks/            Data-loading hooks (useRooms)
  lib/              utils, site config, supabase client, booking/email helpers
api/                Vercel serverless functions (send-booking-emails, contact)
lib/base44/         base44.integrations.Core email integration (Resend)
supabase/           schema.sql + seed.sql
```

## Booking flow

1. Choose a **room or suite** (`/#/booking?slug=deluxe-room` pre-selects)
2. Pick **dates** + number of guests/rooms
3. Enter **guest details**
4. Add optional **add-on services**
5. Confirm → booking saved to Supabase `bookings`, confirmation screen shows instantly,
   and guest + admin emails are sent in the background (`/api/send-booking-emails`)

## Deploying

- Push to GitHub and import in Vercel (framework preset: Vite).
- Add `RESEND_API_KEY`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` to project env vars.
- Run `supabase/schema.sql` and `supabase/seed.sql` in the Supabase SQL editor.

## Content note

Brand, positioning and amenity copy was written for Izzy Place Inn & Suites, and all
photography is staged in `public/images/`. Room **prices, size estimates and the add-on
catalogue are reasonable estimates** pending final figures from the hotel — they live in
`src/data/*` (and `supabase/seed.sql`) and are easy to swap for the real numbers.
Room-category counts total 25 and are approximate. Testimonials are illustrative
placeholders.
