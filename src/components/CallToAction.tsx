import { Link } from "react-router-dom";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";
import { asset } from "@/lib/utils";

interface CallToActionProps {
  title?: string;
  subtitle?: string;
}

export default function CallToAction({
  title = "Plan your stay in Ibadan",
  subtitle = "Book a room or call us for help. Reception is open 24 hours a day.",
}: CallToActionProps) {
  return (
    <section className="relative overflow-hidden bg-forest-950 py-24 md:py-32">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            `url(${asset("/images/facilities/outdoor-2.jpg")})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brass-500/60 to-transparent" />
      <div className="container-site relative text-center">
        <p className="eyebrow-rule justify-center text-brass-300">
          <span className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-brass-300">
            Izzy Place Inn &amp; Suites
          </span>
        </p>
        <h2 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-light leading-[1.06] text-ivory-soft sm:text-5xl">
          {title}
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-cream-200/70">
          {subtitle}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="bg-cream-100 text-ink hover:bg-ivory">
            <Link to="/booking">Book Now</Link>
          </Button>
          <a
            href={`tel:+234${siteConfig.phoneDisplay[0].slice(1)}`}
            className="inline-flex h-12 items-center gap-2 px-8 text-[0.95rem] font-semibold text-ivory-soft underline-offset-4 transition-colors hover:text-brass-300 hover:underline"
          >
            <Phone className="h-4 w-4 text-brass-400" />
            {siteConfig.phoneDisplay[0]}
          </a>
        </div>
      </div>
    </section>
  );
}
