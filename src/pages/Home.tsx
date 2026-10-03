import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import Seo from "@/components/Seo";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import CallToAction from "@/components/CallToAction";
import HeroShowreel from "@/components/HeroShowreel";
import { Button } from "@/components/ui/button";
import { amenitiesList, diningVenues } from "@/data/content";
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
      className="mx-auto mt-14 grid max-w-4xl grid-cols-1 overflow-hidden rounded-md border border-white/25 bg-white/95 shadow-lift backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-[1fr_1fr_0.8fr_auto]"
    >
      <label className="group flex flex-col gap-1 border-b border-forest-950/10 px-6 py-5 sm:border-b-0 sm:border-r">
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brass-600">
          Check-in
        </span>
        <input
          type="date"
          required
          min={today}
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="w-full bg-transparent text-sm font-semibold text-forest-950 outline-none [color-scheme:light]"
        />
      </label>
      <label className="flex flex-col gap-1 border-b border-forest-950/10 px-6 py-5 sm:border-b-0 sm:border-r">
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brass-600">
          Check-out
        </span>
        <input
          type="date"
          required
          min={checkIn || today}
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="w-full bg-transparent text-sm font-semibold text-forest-950 outline-none [color-scheme:light]"
        />
      </label>
      <label className="flex flex-col gap-1 border-b border-forest-950/10 px-6 py-5 sm:border-b-0 sm:border-r">
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brass-600">
          Guests
        </span>
        <select
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="w-full cursor-pointer appearance-none bg-transparent text-sm font-semibold text-forest-950 outline-none"
        >
          {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? "guest" : "guests"}
            </option>
          ))}
        </select>
      </label>
      <div className="flex sm:flex-col">
        <Button type="submit" size="lg" className="flex-1 rounded-none bg-forest-950 text-cream-100 hover:bg-forest-800 sm:h-full sm:px-8">
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
        title={`${siteConfig.shortName} & Conference Centre — ${siteConfig.tagline}`}
        description="Book rooms and event spaces at Kakanfo Inn & Conference Centre, Ibadan. Ninety-five rooms and suites, a 2,000 guest conference hall, three dining venues and 24-hour service."
        keywords="Kakanfo Inn, hotel Ibadan, conference centre Ibadan, book hotel Ibadan, event venue Ibadan, wedding venue Ibadan"
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
            addressCountry: siteConfig.address.country,
          },
          amenityFeature: amenitiesList.map((a) => ({
            "@type": "LocationFeatureSpecification",
            name: a.name,
            value: true,
          })),
          checkinTime: "14:00",
          checkoutTime: "12:00",
          priceRange: "₦₦₦",
          starRating: { "@type": "Rating", ratingValue: "4" },
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
        <div className="absolute inset-0 bg-forest-950/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950/50 via-transparent to-forest-950/80" />

        <div className="container-site relative z-10 pb-40 pt-28 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="eyebrow-rule mx-auto justify-center"
          >
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-brass-300">
              Ring Road · Ibadan · Nigeria
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="mx-auto mt-8 max-w-4xl font-display text-[2.75rem] font-light leading-[1.02] text-cream-100 sm:text-6xl md:text-7xl"
          >
            Where Ibadan{" "}
            <em className="font-normal italic text-brass-300">welcomes</em>{" "}
            the world
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6 }}
            className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-cream-200/85 sm:text-lg"
          >
            Stylish rooms, a business class conference centre, and warm Yoruba
            hospitality at the heart of the city.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.8 }}
            className="mx-auto mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button asChild size="lg" className="bg-cream-100 text-forest-950 hover:bg-white">
              <Link to="/booking">Book your stay</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="border border-cream-100/40 bg-transparent text-cream-100 hover:border-brass-300 hover:text-brass-200"
            >
              <Link to="/rooms">
                Explore rooms
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
      <section className="border-y border-forest-950/10 bg-background">
        <div className="container-site grid grid-cols-2 md:grid-cols-4">
          {[
            ["95", "Rooms, Suites & Villas"],
            ["8", "Conference Halls & Venues"],
            ["2,000", "Guests in the Lekan Are Hall"],
            ["24/7", "Reception & Security"],
          ].map(([value, label], i) => (
            <Reveal
              key={label}
              delay={i * 0.08}
              className={cn(
                "px-6 py-10 text-center md:py-12",
                i % 2 === 1 && "border-l border-forest-950/10",
                i >= 2 && "border-t border-forest-950/10 md:border-t-0",
                i >= 1 && "md:border-l md:border-forest-950/10"
              )}
            >
              <p className="font-display text-4xl font-light text-forest-950 md:text-5xl">{value}</p>
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
            title="Everything you need, all under one roof"
            description="From a cooling pool to a business centre, every detail is designed around a comfortable stay and a productive event."
          />
        </div>
        <AmenitiesMarquee />
      </section>

      {/* ABOUT */}
      <section className="bg-forest-950 py-14 md:py-20">
        <div className="container-site grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <div className="relative">
              <img
                src={asset("/images/facilities/lobby.jpg")}
                alt="Kakanfo Inn lobby"
                className="aspect-[4/5] w-full rounded-sm object-cover"
              />
              <div className="absolute -bottom-6 -right-4 hidden rounded-sm bg-brass-500 px-7 py-5 text-white shadow-lift sm:block lg:-right-8">
                <p className="font-display text-2xl font-light">Est. Ibadan</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-brass-100">
                  Hospitality with heritage
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="eyebrow-rule text-brass-300">
              <span className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-brass-300">
                About the house
              </span>
            </p>
            <h2 className="mt-6 font-display text-3xl font-light leading-[1.08] text-cream-100 sm:text-4xl md:text-[2.75rem]">
              A name built on courage, carried with hospitality
            </h2>
            <p className="mt-7 leading-relaxed text-cream-200/75">
              “Kakanfo” is the historic title of the generalissimo of the Yoruba army — a
              warrior leader trusted to command when it mattered most. We carry that name with
              the same sense of duty: guests and events under our care are treated like nothing
              less than honoured guests of the house.
            </p>
            <p className="mt-5 leading-relaxed text-cream-200/75">
              Since October 1988 we have grown from forty-two rooms to ninety-five beautifully
              crafted modern rooms and suites, alongside world class conference halls — a
              prestigious, ISO certified house of 5-star comfort on Ring Road, in the heart of
              Ibadan.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <Button asChild className="bg-cream-100 text-forest-950 hover:bg-white">
                <Link to="/about">Our story</Link>
              </Button>
              <Button asChild variant="ghost" className="text-brass-300 hover:bg-white/10 hover:text-brass-200">
                <Link to="/events">
                  Conference &amp; events
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* DINING */}
      <section className="container-site py-14 md:py-20">
        <SectionHeading
          eyebrow="Dining"
          title="Three ways to eat well in Ibadan"
          description="From full-service international dining at Bisi Restaurant to poolside bites and cocktail evenings in Bawa Continent Garden — plus takeaway, corporate lunch delivery and outdoor catering."
        />
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {diningVenues.map((v, i) => (
            <Reveal key={v.name} delay={i * 0.07}>
              <article className="group">
                <div className="relative overflow-hidden rounded-sm">
                  <img
                    src={v.image}
                    alt={v.name}
                    loading="lazy"
                    className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950/70 via-transparent to-transparent" />
                  <h3 className="absolute bottom-4 left-5 right-5 font-display text-xl font-normal leading-snug text-cream-100">
                    {v.name}
                  </h3>
                </div>
                <div className="mt-5 border-t border-forest-950/10 pt-4">
                  <div className="flex items-center justify-between text-[0.68rem] font-semibold uppercase tracking-[0.16em]">
                    <span className="text-brass-600">{v.cuisine}</span>
                    <span className="text-muted-foreground">{v.hours}</span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{v.description}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="border-y border-forest-950/10 bg-background py-14 md:py-20">
        <div className="container-site">
          <SectionHeading
            align="center"
            eyebrow="Guest Stories"
            title="Guests and hosts keep coming back"
          />
          <TestimonialsCarousel />
        </div>
      </section>

      <CallToAction />
    </>
  );
}
