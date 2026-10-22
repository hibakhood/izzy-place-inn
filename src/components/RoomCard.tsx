import { Link } from "react-router-dom";
import { ArrowRight, BedDouble, Maximize, Users } from "lucide-react";
import type { RoomCategory } from "@/types";
import { formatNaira } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface RoomCardProps {
  room: RoomCategory;
}

export default function RoomCard({ room }: RoomCardProps) {
  return (
    <article className="group flex h-full flex-col">
      <Link
        to={`/rooms/${room.slug}`}
        className="relative block aspect-[4/3] overflow-hidden rounded-sm bg-forest-100"
      >
        <img
          src={room.images[0]}
          alt={room.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 via-transparent to-transparent" />
        {room.featured && (
          <span className="absolute left-5 top-5 flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-ivory-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-brass-400" />
            Featured
          </span>
        )}
        <p className="absolute bottom-5 left-5 rounded-sm bg-forest-950/70 px-4 py-2.5 text-ivory-soft backdrop-blur-sm">
          <span className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-cream-200/80">
            From{" "}
          </span>
          <span className="font-display text-xl font-normal">
            {formatNaira(room.price_per_night)}
          </span>
          <span className="text-xs text-cream-200/80"> /night</span>
        </p>
      </Link>

      <div className="flex flex-1 flex-col pt-6">
        <Link to={`/rooms/${room.slug}`} className="group/title">
          <h3 className="font-display text-[1.35rem] font-normal leading-snug text-ink underline-offset-4 transition-colors group-hover/title:text-primary">
            {room.name}
          </h3>
        </Link>

        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-gold-deep" /> {room.max_guests} guests
          </span>
          <span className="flex items-center gap-1.5">
            <Maximize className="h-3.5 w-3.5 text-gold-deep" /> {room.size_sqm} m²
          </span>
          <span className="flex items-center gap-1.5">
            <BedDouble className="h-3.5 w-3.5 text-gold-deep" /> {room.total_rooms} rooms
          </span>
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {room.description}
        </p>

        <div className="mt-5 flex items-center justify-between border-t border-line pt-5">
          <Link
            to={`/rooms/${room.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline-offset-4 transition-colors hover:text-primary hover:underline"
          >
            View room
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Button asChild size="sm" variant="outline">
            <Link to={`/booking?type=room&slug=${room.slug}`}>Book</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
