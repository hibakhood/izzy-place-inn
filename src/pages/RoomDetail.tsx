import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronRight, Users, Maximize, BedDouble, Check, ArrowRight, Loader2 } from "lucide-react";
import Seo from "@/components/Seo";
import JsonLd from "@/components/JsonLd";
import NotFound from "@/pages/NotFound";
import CallToAction from "@/components/CallToAction";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { roomsFallback } from "@/data/rooms";
import { canonicalRoomSlug, getRoomBySlug } from "@/lib/data";
import { formatNaira, cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";
import type { RoomCategory } from "@/types";

export default function RoomDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [room, setRoom] = useState<RoomCategory | null>(() => roomsFallback.find((r) => r.slug === canonicalRoomSlug(slug ?? "")) ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    setRoom(null);
    getRoomBySlug(slug ?? "").then((r) => {
      if (active) {
        setRoom(r ?? null);
        setLoading(false);
        setActiveImage(0);
      }
    }).catch(() => {
      if (active) { setError(true); setLoading(false); }
    });
    return () => {
      active = false;
    };
  }, [slug]);

  if (error) return <section className="container-site py-32" role="alert"><Seo title="Room unavailable" noindex /><h1 className="font-display text-3xl">We could not load this room</h1><p className="mt-4">Please refresh the page or contact our team for help.</p><Link to="/rooms" className="mt-6 inline-block underline">Browse rooms</Link></section>;
  if (!loading && !room) return <NotFound />;

  if (loading || !room) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const gallery = room.images.length > 0 ? room.images : [room.images[0]];

  return (
    <>
      <Seo
        title={`${room.name}. ${siteConfig.shortName}`}
        description={room.description}
        keywords={`${room.name}, hotel room Ibadan, ${room.name.toLowerCase()} price`}
        image={room.images[0]}
        path={`/rooms/${room.slug}`}
        type="article"
      />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${siteConfig.url}/` },
              { "@type": "ListItem", position: 2, name: "Rooms & Suites", item: `${siteConfig.url}/rooms` },
              { "@type": "ListItem", position: 3, name: room.name, item: `${siteConfig.url}/rooms/${room.slug}` },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "HotelRoom",
            name: room.name,
            description: room.description,
            url: `${siteConfig.url}/rooms/${room.slug}`,
            image: room.images.map((image) => new URL(image.replace(import.meta.env.BASE_URL, "/"), siteConfig.url).href),
            offers: {
              "@type": "Offer",
              price: room.price_per_night,
              priceCurrency: "NGN",
            },
          },
        ]}
      />

      <div className="border-b border-line pb-8 pt-24 md:pt-28">
        <div className="container-site">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to="/rooms" className="hover:text-primary">Rooms &amp; Suites</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-semibold text-ink">{room.name}</span>
          </nav>
        </div>
      </div>

      <section className="container-site grid min-w-0 grid-cols-1 gap-10 py-12 lg:grid-cols-2 lg:gap-14">
        {/* Gallery */}
        <div className="min-w-0">
          <div className="overflow-hidden rounded-sm">
            <img
              key={activeImage}
              src={gallery[activeImage]}
              alt={`${room.name}. Photo ${activeImage + 1}`}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          {gallery.length > 1 && (
            <div className="mt-3 flex max-w-full gap-3 overflow-x-auto overscroll-x-contain pb-2">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  aria-label={`Show photo ${i + 1}`}
                  className={cn(
                    "w-24 shrink-0 overflow-hidden rounded-sm border-2 transition-all",
                    i === activeImage ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
                  )}
                >
                  <img src={img} alt="" className="aspect-[4/3] w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="brass">Room or Suite</Badge>
            {room.featured && <Badge>Featured</Badge>}
          </div>
          <h1 className="mt-4 font-display text-3xl font-normal text-ink sm:text-4xl">{room.name}</h1>
          <p className="mt-4 leading-relaxed text-muted-foreground">{room.description}</p>

          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-4 text-sm">
            <span className="flex items-center gap-2 text-ink">
              <Users className="h-4 w-4 text-primary" /> Up to {room.max_guests} guests
            </span>
            <span className="flex items-center gap-2 text-ink">
              <Maximize className="h-4 w-4 text-primary" /> {room.size_sqm} m²
            </span>
            <span className="flex items-center gap-2 text-ink">
              <BedDouble className="h-4 w-4 text-primary" /> {room.total_rooms} of this category
            </span>
          </div>

          <Separator className="my-7" />

          <h2 className="font-display text-xl font-medium text-ink">Room &amp; suite amenities</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {room.amenities.map((a) => (
              <li key={a} className="flex items-center gap-2.5 text-sm">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="h-3 w-3" />
                </span>
                {a}
              </li>
            ))}
          </ul>

          <Separator className="my-7" />

          <div className="relative flex flex-wrap items-end justify-between gap-4 overflow-hidden rounded-sm bg-forest-950 p-7">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-brass-500/70 via-brass-500/40 to-transparent" />
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-cream-200/60">Per night</p>
              <p className="mt-1 font-display text-3xl font-light text-ivory-soft">
                {formatNaira(room.price_per_night)}
              </p>
            </div>
            <Button asChild size="lg">
              <Link to={`/booking?type=room&slug=${room.slug}`}>
                Book Now
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <CallToAction
        title={`Make ${room.name} yours`}
        subtitle="Reserve now and our 24-hour reception will take care of the rest."
      />
    </>
  );
}
