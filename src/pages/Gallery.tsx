import { useState } from "react";
import Seo from "@/components/Seo";
import PageHero from "@/components/PageHero";
import GalleryLightbox from "@/components/GalleryLightbox";
import CallToAction from "@/components/CallToAction";
import { galleryImages } from "@/data/content";
import { cn, asset } from "@/lib/utils";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "rooms", label: "Rooms & Suites" },
  { id: "facilities", label: "Facilities" },
] as const;

export default function Gallery() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const images = filter === "all" ? galleryImages : galleryImages.filter((i) => i.category === filter);

  return (
    <>
      <Seo
        title="Gallery"
        description="See photos of the rooms, suites, kitchens, lobby and exterior at Izzy Place Inn & Suites."
        keywords="Izzy Place Inn gallery, Ibadan hotel photos, hotel rooms Ibadan, suites pictures Ibadan"
        path="/gallery"
      />

      <PageHero
        eyebrow="Gallery"
        title="A look inside Izzy Place"
        description="Explore our rooms, fitted kitchens, welcoming lobby and the house itself."
        image={asset("/images/facilities/lobby-3.jpg")}
      />

      <section className="container-site py-12 md:py-16">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={cn(
                "rounded-sm border px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors",
                filter === f.id
                  ? "border-forest-950 bg-forest-950 text-ivory-soft"
                  : "border-line bg-transparent text-ink hover:border-line"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          <GalleryLightbox images={images} columns={3} />
        </div>
      </section>

      <CallToAction
        title="See it in person"
        subtitle="Contact reception if you would like to visit and see the rooms."
      />
    </>
  );
}
