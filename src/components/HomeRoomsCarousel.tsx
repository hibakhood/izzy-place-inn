import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Loader2, Maximize, Users } from "lucide-react";
import { useRooms } from "@/hooks/useCatalog";
import { formatNaira } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/SectionHeading";
import type { RoomCategory } from "@/types";

const roomIntroductions: Record<string, string> = {
  "classic-room": "A comfortable room with a kitchenette and every essential for a restful stay.",
  "deluxe-room": "More space to relax, with a kitchenette and private bathroom.",
  "executive-suite": "A separate living area and full kitchen, with space to work, rest and unwind.",
  "family-room": "A bedroom and living area for your family to settle in.",
};

function cardAmenities(room: RoomCategory) {
  const preferred = [
    { match: /air conditioning/i, label: "Air conditioning" },
    { match: /wi-fi/i, label: "Free Wi-Fi" },
    { match: /smart tv/i, label: "Smart TV" },
    { match: /bathroom/i, label: "Private bathroom" },
    { match: /refrigerator/i, label: "Refrigerator" },
  ];
  return preferred.filter(({ match }) => room.amenities.some((amenity) => match.test(amenity)));
}

export default function HomeRoomsCarousel() {
  const { rooms, loading } = useRooms();
  const rail = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ start: true, end: false });

  useEffect(() => {
    const element = rail.current;
    if (!element) return;
    const update = () => setPosition({
      start: element.scrollLeft <= 2,
      end: element.scrollLeft + element.clientWidth >= element.scrollWidth - 2,
    });
    update();
    element.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => {
      element.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [loading, rooms]);

  const slide = (direction: number) => {
    const element = rail.current;
    const card = element?.firstElementChild;
    if (!element || !card) return;
    const gap = parseFloat(getComputedStyle(element).columnGap) || 0;
    element.scrollBy({
      left: direction * (card.getBoundingClientRect().width + gap),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  };

  return (
    <section className="bg-mist py-14 md:py-20" aria-label="Rooms and suites">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-6 pb-9 md:pb-12">
          <SectionHeading
            eyebrow="Rooms & suites"
            title="Choose your room"
            description="Four ways to stay, from a comfortable room for two to space for the whole family."
            className="!mb-0"
          />
          {!loading && !!rooms?.length && (
            <div className="flex gap-3" aria-label="Room carousel controls">
              <Button variant="outline" size="icon" aria-label="Previous room" aria-controls="home-room-cards" disabled={position.start} onClick={() => slide(-1)}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" aria-label="Next room" aria-controls="home-room-cards" disabled={position.end} onClick={() => slide(1)}>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        {loading ? (
          <div className="flex justify-center py-20" role="status">
            <Loader2 className="h-8 w-8 animate-spin motion-reduce:animate-none text-gold-deep" aria-hidden="true" />
            <span className="sr-only">Loading rooms</span>
          </div>
        ) : !rooms?.length ? (
          <p className="py-8 text-muted-foreground">Please contact reception for room availability.</p>
        ) : (
          <>
            <div
              id="home-room-cards"
              ref={rail}
              role="region"
              aria-label="Room categories. Use the arrow keys or swipe to browse."
              aria-roledescription="carousel"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.target !== event.currentTarget) return;
                if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                  event.preventDefault();
                  slide(event.key === "ArrowLeft" ? -1 : 1);
                }
              }}
              className="flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain pb-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass-500 md:gap-6 [scrollbar-width:thin] [scrollbar-color:#c5a46d_transparent]"
            >
              {rooms.map((room, index) => (
                <article key={room.id} aria-label={`${index + 1} of ${rooms.length}: ${room.name}`} className="flex w-[88%] shrink-0 snap-start flex-col overflow-hidden rounded-[16px] border border-brass-500/25 bg-ivory sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-3rem)/3)]">
                  <Link to={`/rooms/${room.slug}`} className="block shrink-0 overflow-hidden rounded-t-[50%_85%] bg-cream-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-brass-500">
                    <img src={room.images[0]} alt={room.name} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                  </Link>
                  <div className="flex flex-1 flex-col p-5 md:p-6 xl:p-7">
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-gold-deep">Sleeps {room.max_guests}</p>
                    <h3 className="mt-3 font-display text-[1.8rem] font-normal leading-tight text-ink xl:text-[2.2rem]">
                      <Link to={`/rooms/${room.slug}`} className="hover:text-gold-deep focus-visible:outline-brass-500">{room.name}</Link>
                    </h3>
                    <p className="mt-3 min-h-[4.5rem] line-clamp-3 text-sm leading-6 text-muted-foreground">{roomIntroductions[room.slug] ?? room.description}</p>
                    <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-2"><Users className="h-4 w-4" aria-hidden="true" />{room.max_guests} guests</span>
                      <span className="inline-flex items-center gap-2"><Maximize className="h-4 w-4" aria-hidden="true" />{room.size_sqm} m²</span>
                    </div>
                    <ul className="my-6 grid grid-cols-2 gap-x-3 gap-y-3 border-t border-brass-500/25 pt-5 text-xs leading-5 text-muted-foreground xl:text-sm">
                      {cardAmenities(room).map(({ label }) => <li key={label} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" aria-hidden="true" />{label}</li>)}
                    </ul>
                    <div className="mt-auto flex flex-wrap items-end justify-between gap-4 border-t border-brass-500/25 pt-5">
                      <div><p className="text-xs text-muted-foreground">From, per night</p><p className="mt-1 font-display text-2xl text-ink xl:text-3xl">{formatNaira(room.price_per_night)}</p></div>
                      <Button asChild variant="outline" className="px-4"><Link to={`/booking?type=room&slug=${room.slug}`} aria-label={`Check dates for ${room.name}`}>Check dates</Link></Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 text-sm">
              <p className="text-muted-foreground">Swipe or use the arrows to explore all four rooms.</p>
              <Link to="/rooms" className="inline-flex items-center gap-2 font-semibold text-ink underline-offset-4 hover:underline">Explore all rooms <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
