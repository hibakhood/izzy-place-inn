import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import Seo from "@/components/Seo";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import CallToAction from "@/components/CallToAction";
import HeroShowreel from "@/components/HeroShowreel";
import HomeRoomsCarousel from "@/components/HomeRoomsCarousel";
import { Button } from "@/components/ui/button";
import { amenitiesList } from "@/data/content";
import { siteConfig } from "@/lib/site";
import { cn, asset } from "@/lib/utils";
import AmenitiesMarquee from "@/components/AmenitiesMarquee";

function BookingBar() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({ type: "room" });
    if (checkIn) params.set("checkin", checkIn);
    if (checkOut) params.set("checkout", checkOut);
    params.set("guests", String(guests));
    navigate(`/booking?${params.toString()}`);
  };

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 1, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto mt-14 grid max-w-4xl grid-cols-1 overflow-hidden rounded-md border border-white/25 bg-ivory/95 shadow-lift backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-[1fr_1fr_0.8fr_auto]"
    >
      <label className="group flex flex-col gap-1 border-b border-line px-6 py-5 sm:border-b-0 sm:border-r">
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gold-deep">
          Check-in
        </span>
        <input
          type="date"
          required
          min={today}
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="w-full bg-transparent text-sm font-semibold text-ink outline-none [color-scheme:light]"
        />
      </label>
      <label className="flex flex-col gap-1 border-b border-line px-6 py-5 sm:border-b-0 sm:border-r">
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gold-deep">
          Check-out
        </span>
        <input
          type="date"
          required
          min={checkIn || today}
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="w-full bg-transparent text-sm font-semibold text-ink outline-none [color-scheme:light]"
        />
      </label>
      <label className="flex flex-col gap-1 border-b border-line px-6 py-5 sm:border-b-0 sm:border-r">
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gold-deep">
          Guests
        </span>
        <select
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="w-full cursor-pointer appearance-none bg-transparent text-sm font-semibold text-ink outline-none"
        >
          {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? "guest" : "guests"}
            </option>
          ))}
        </select>
      </label>
      <div className="flex sm:flex-col">
        <Button type="submit" size="lg" className="flex-1 rounded-none bg-charcoal text-ivory-soft hover:bg-forest sm:h-full sm:px-8">
          Check availability
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </motion.form>
  );
}

export default function Home() {
  return (
    <>
      <Seo
        title={`${siteConfig.name}. ${siteConfig.tagline}`}
        description="Book a room at Izzy Place Inn & Suites in Ibadan. Enjoy free Wi-Fi, air conditioning, helpful staff and reception open 24 hours a day."
        keywords="Izzy Place Inn, Izzy Place Inn and Suites, hotel Ibadan, suites Ibadan, affordable hotel Ibadan, Old Ife Road hotel"
        path="/"
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Hotel",
          name: siteConfig.name,
          description: siteConfig.description,
          url: siteConfig.url,
          telephone: siteConfig.phoneDisplay.map((p) => `+234${p.slice(1)}`),
          email: siteConfig.emails.info,
          address: {
            "@type": "PostalAddress",
            streetAddress: `${siteConfig.address.line1}, ${siteConfig.address.line2}`,
            addressLocality: siteConfig.address.city,
            addressRegion: siteConfig.address.state,
            addressCountry: siteConfig.address.country,
          },
          amenityFeature: amenitiesList.map((a) => ({
            "@type": "LocationFeatureSpecification",
            name: a.name,
            value: true,
          })),
          checkinTime: "14:00",
          checkoutTime: "12:00",
          priceRange: "₦₦",
        }}
      />

      {/* HERO */}
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2.4, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <HeroShowreel />
        </motion.div>
        <div className="hero-scrim absolute inset-0" />

        <div className="hero-copy container-site relative z-10 pb-40 pt-28 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="eyebrow-rule mx-auto justify-center"
          >
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-brass-300">
              Old Ife Road · Ibadan · Nigeria
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="mx-auto mt-8 max-w-4xl font-display text-[2.75rem] font-light leading-[1.02] text-ivory-soft sm:text-6xl md:text-7xl"
          >
            Your Comfort,{" "}
            <em className="font-normal italic text-brass-300">Our Priority.</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6 }}
            className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-cream-200/85 sm:text-lg"
          >
            Comfortable rooms, friendly staff and a secure place to stay in Ibadan.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.8 }}
            className="mx-auto mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button asChild size="lg" className="bg-cream-100 text-ink hover:bg-ivory">
              <Link to="/booking">Book your stay</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="border border-cream-100/40 bg-transparent text-ivory-soft hover:border-brass-300 hover:text-brass-200"
            >
              <Link to="/rooms">
                Explore rooms &amp; suites
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          <BookingBar />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-32 left-1/2 z-10 hidden -translate-x-1/2 text-cream-200/60 lg:block"
        >
          <ChevronDown className="h-6 w-6 animate-bounce" />
        </motion.div>
      </section>

      {/* STATS */}
      <section className="border-y border-line bg-background">
        <div className="container-site grid grid-cols-2 md:grid-cols-4">
          {[
            [String(siteConfig.rooms), "Rooms & Suites"],
            ["4", "Room Categories"],
            ["3", "Dining Venues"],
            ["24/7", "Reception & Security"],
          ].map(([value, label], i) => (
            <Reveal
              key={label}
              delay={i * 0.08}
              className={cn(
                "px-6 py-10 text-center md:py-12",
                i % 2 === 1 && "border-l border-line",
                i >= 2 && "border-t border-line md:border-t-0",
                i >= 1 && "md:border-l md:border-line"
              )}
            >
              <p className="font-display text-4xl font-light text-ink md:text-5xl">{value}</p>
              <p className="mt-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {label}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* AMENITIES */}
      <section className="py-14 md:py-20">
        <div className="container-site">
          <SectionHeading
            align="center"
            eyebrow="Amenities"
            title="Amenities for a comfortable stay"
            description="Enjoy free Wi-Fi, air conditioning and a kitchen or kitchenette during your stay."
          />
        </div>
        <AmenitiesMarquee />
      </section>

      {/* ABOUT */}
      <section aria-labelledby="about-house-title" className="overflow-hidden bg-ivory py-16 text-ink md:py-20 lg:py-24">
        <div className="container-site grid items-center gap-12 lg:grid-cols-[1.08fr_1fr] lg:gap-20">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-deep">
              Make yourself at home
            </p>
            <h2 id="about-house-title" className="mt-7 font-display text-[2.6rem] font-normal leading-[1.08] tracking-[-0.025em] sm:text-5xl xl:text-[4rem]">
              A little more comfort.
              <span className="mt-2 block italic text-gold-deep">A little closer to home.</span>
            </h2>
            <div className="mt-9 space-y-6 text-base leading-[1.8] text-muted-foreground md:text-lg">
              <p>
                Stay at Izzy Place Inn &amp; Suites, off Old Ife Road in Ibadan.
                Our rooms have free Wi-Fi, air conditioning and a kitchen or
                kitchenette to help you feel at home.
              </p>
              <p>
                Whether you are in town for business or family, you will find quiet
                rooms, helpful staff and a secure place to stay.
              </p>
            </div>
            <Link to="/about" className="mt-10 inline-flex min-h-11 items-center gap-3 border-b border-gold pb-1 text-sm font-semibold tracking-wide transition-colors hover:text-gold-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-deep md:mt-12 md:text-base">
              Get to know Izzy Place
              <ArrowRight className="h-4 w-4 -rotate-45" aria-hidden="true" />
            </Link>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="relative isolate px-3 pt-0 sm:px-5">
              <div aria-hidden="true" className="absolute inset-x-0 bottom-0 top-5 -z-10 rounded-t-xl border border-line" />
              <img
                src={asset("/images/facilities/outdoor-image.jpg")}
                alt="Exterior of Izzy Place Inn & Suites"
                loading="lazy"
                className="aspect-[4/5] w-full rounded-t-[50%_42%] object-cover lg:aspect-[4/5.3]"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <HomeRoomsCarousel />

      {/* HOTEL PHOTOS */}
      <section aria-labelledby="hotel-photos-title" className="bg-ivory py-14 md:py-20">
        <h2 id="hotel-photos-title" className="sr-only">A look around Izzy Place</h2>
        <div className="container-site grid grid-cols-2 items-start gap-4 md:grid-cols-4 md:gap-5 lg:gap-6">
          {[
            { src: "/images/facilities/outdoor-image.jpg", alt: "The outside of Izzy Place Inn & Suites" },
            { src: "/images/rooms/classic-room-view-4.jpg", alt: "Classic Room with a bed and sitting area" },
            { src: "/images/rooms/executive-suite-view-3.jpg", alt: "Executive Suite with a kitchen and space to relax" },
            { src: "/images/rooms/family-living-room-2.jpg", alt: "Living room in the Family Room" },
          ].map((photo, index) => (
            <figure key={photo.src} className={cn(index % 2 === 1 && "mt-8 lg:mt-12")}>
              <img
                src={asset(photo.src)}
                alt={photo.alt}
                loading="lazy"
                width={600}
                height={800}
                className="aspect-[3/4] w-full rounded-t-[50%_38%] object-cover"
              />
            </figure>
          ))}
        </div>
      </section>

      <CallToAction />
    </>
  );
}
