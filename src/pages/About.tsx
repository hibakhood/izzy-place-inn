import { Link } from "react-router-dom";
import { Award, ArrowRight, MapPin, Phone } from "lucide-react";
import Seo from "@/components/Seo";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import CallToAction from "@/components/CallToAction";
import { Button } from "@/components/ui/button";
import { cn, asset } from "@/lib/utils";
import { iconMap } from "@/lib/icons";
import { amenitiesList, coreValues, mission, vision } from "@/data/content";
import { siteConfig } from "@/lib/site";

const STATS = [
  { value: String(siteConfig.rooms), label: "Rooms & suites" },
  { value: "4", label: "Room categories" },
  { value: "3", label: "Dining venues" },
  { value: "24/7", label: "Reception & security" },
];

export default function About() {
  return (
    <>
      <Seo
        title="About Us"
        description="Stay at Izzy Place Inn & Suites on Old Ife Road in Ibadan. Enjoy comfortable rooms, friendly service and security day and night."
        keywords="about Izzy Place Inn, Izzy Place Inn and Suites, hotel in Ibadan, Old Ife Road hotel, rooms and suites Ibadan"
        path="/about"
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About Izzy Place Inn & Suites",
          url: `${siteConfig.url}/about`,
          description:
            "Comfortable rooms and suites with friendly service in Ibadan, Oyo State.",
        }}
      />

      <PageHero
        eyebrow="Our Story"
        title="A comfortable place to stay in Ibadan"
        description="You will find Izzy Place Inn & Suites off Old Ife Road in Ibadan. We offer comfortable rooms, friendly service and good value for short visits and longer stays."
        image={asset("/images/facilities/outdoor-2.jpg")}
      />

      {/* INTRO */}
      <section className="container-site py-12 md:py-16">
        <div className="grid items-start gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <div className="space-y-5 leading-relaxed text-muted-foreground">
              <p>
                Izzy Place Inn &amp; Suites offers comfortable rooms for short visits,
                family trips and longer stays. Our staff are here to help you settle in
                and feel at home.
              </p>
              <p>
                Choose from Classic Rooms, Deluxe Rooms, Executive Suites and Family
                Rooms. Each comes with the basics you need for a comfortable stay.
              </p>
              <p>
                Settle in with air-conditioned rooms, free high-speed Wi-Fi, Smart
                TVs and fitted kitchens or kitchenettes that let you feel at home.
                Dedicated spaces for relaxing and working make longer stays easier,
                while backup power and round-the-clock security offer peace of mind.
                Our concierge can help with local recommendations and everyday
                requests, and our 24-hour reception is always ready to welcome you.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid grid-cols-2 border-t border-line">
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  className={cn(
                    "px-6 py-9",
                    i % 2 === 1 && "border-l border-line",
                    i >= 2 && "border-t border-line"
                  )}
                >
                  <p className="font-display text-4xl font-light text-primary">{s.value}</p>
                  <p className="mt-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex items-start gap-4 border-t border-line pt-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-brass-500/40 bg-brass-500/10 text-gold-deep">
                <Award className="h-5 w-5" />
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                <span className="font-semibold text-ink">Our four promises.</span>{" "}
                Comfort, luxury, security and affordability. Every part of the house is
                built to deliver all four, and every rate is quoted with the last two in
                mind.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* VISION & MISSION */}
      <section className="border-y border-line bg-background py-12 md:py-16">
        <div className="container-site grid gap-12 md:grid-cols-2 md:gap-16">
          <Reveal>
            <p className="eyebrow-rule text-gold-deep">
              <span className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-gold-deep">
                Our Vision
              </span>
            </p>
            <p className="mt-6 font-display text-2xl font-light leading-snug text-ink sm:text-[1.75rem]">
              {vision}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="eyebrow-rule text-gold-deep">
              <span className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-gold-deep">
                Our Mission
              </span>
            </p>
            <p className="mt-6 font-display text-2xl font-light leading-snug text-ink sm:text-[1.75rem]">
              {mission}
            </p>
          </Reveal>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="container-site py-12 md:py-16">
        <SectionHeading
          eyebrow="Our Four Promises"
          title="What matters to us"
          description="Comfort, good service, security and fair prices."
        />
        <div className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
          {coreValues.map((v, i) => (
            <Reveal key={v.name} delay={i * 0.08}>
              <div className="h-full border-t border-line pt-6">
                <p className="font-display text-sm font-normal tracking-[0.3em] text-gold-deep">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 font-display text-xl font-normal text-ink">{v.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{v.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* LOCATION */}
      <section className="bg-forest-950 py-12 md:py-16">
        <div className="container-site grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-20">
          <Reveal>
            <SectionHeading
              eyebrow="Find Us"
              title="Find us off Old Ife Road"
              description="Use our map to find the hotel and plan your journey. Contact reception if you need directions."
              light
            />
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <Button asChild className="bg-cream-100 text-ink hover:bg-ivory">
                <Link to="/contact">
                  Get directions
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <a
                href={`tel:+234${siteConfig.phoneDisplay[0].slice(1)}`}
                className="inline-flex h-12 items-center gap-2 px-4 text-[0.95rem] font-semibold text-ivory-soft underline-offset-4 transition-colors hover:text-brass-300 hover:underline"
              >
                <Phone className="h-4 w-4 text-brass-400" />
                {siteConfig.phoneDisplay[0]}
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="border-t border-white/15 pt-8">
              <div className="flex items-start gap-4">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-brass-400" />
                <div>
                  <p className="font-display text-xl font-normal leading-snug text-ivory-soft">
                    {siteConfig.address.line1}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-cream-200/70">
                    {siteConfig.address.line2}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-cream-200/70">
                    {siteConfig.address.city}, {siteConfig.address.state},{" "}
                    {siteConfig.address.country}
                  </p>
                </div>
              </div>
              <div className="mt-8 flex items-start gap-4 border-t border-white/10 pt-6">
                <Phone className="mt-1 h-5 w-5 shrink-0 text-brass-400" />
                <div>
                  <p className="font-display text-xl font-normal leading-snug text-ivory-soft">
                    {siteConfig.phoneDisplay.join(" / ")}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-cream-200/70">
                    {siteConfig.reception}. Walk-ins welcome.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* AMENITIES */}
      <section className="border-t border-line bg-background py-12 md:py-16">
        <div className="container-site">
          <SectionHeading
            eyebrow="Amenities"
            title="Our amenities"
            description="The facilities and services available during your stay."
          />
          <div className="mt-12 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
            {amenitiesList.map((a, i) => {
              const Icon = iconMap[a.icon] ?? null;
              return (
                <Reveal key={a.name} delay={(i % 4) * 0.07}>
                  <div className="group flex h-full flex-col border-t border-line pt-6">
                    {Icon && (
                      <Icon className="h-5 w-5 text-primary transition-colors group-hover:text-gold-deep" />
                    )}
                    <h3 className="mt-4 font-display text-lg font-medium text-ink">{a.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.description}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <CallToAction
        title="Come and see for yourself"
        subtitle="Call reception to arrange a visit or ask about our rooms."
      />
    </>
  );
}
