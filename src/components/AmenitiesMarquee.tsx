import { amenitiesList } from "@/data/content";
import { iconMap } from "@/lib/icons";
import { cn } from "@/lib/utils";

type Amenity = (typeof amenitiesList)[number];

function MarqueeRow({
  items,
  offset = false,
}: {
  items: Amenity[];
  offset?: boolean;
}) {
  // 4 copies: translating -50% shifts exactly 2 sets for a seamless loop
  const loop = [...items, ...items, ...items, ...items];
  return (
    <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] motion-reduce:overflow-x-auto">
      <div
        className={cn(
          "flex w-max gap-4 py-2 pr-4 animate-marquee-right hover:[animation-play-state:paused] motion-reduce:animate-none",
          offset && "[animation-delay:-22.5s]"
        )}
      >
        {loop.map((a, i) => {
          const Icon = iconMap[a.icon] ?? null;
          return (
            <article
              key={`${a.name}-${i}`}
              aria-hidden={i >= items.length}
              className="w-[62vw] shrink-0 rounded-md border border-forest-950/10 bg-white p-5 shadow-soft transition-colors hover:border-brass-500/50 sm:w-[40vw] md:w-[30vw] lg:w-[19vw] xl:w-[13.5vw]"
            >
              <div className="flex min-h-[132px] flex-col">
                {Icon && <Icon className="h-5 w-5 text-brass-500" />}
                <h3 className="mt-4 font-display text-base font-medium leading-snug text-forest-950">
                  {a.name}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                  {a.description}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default function AmenitiesMarquee() {
  const mid = Math.ceil(amenitiesList.length / 2);
  return (
    <div className="flex flex-col gap-4">
      <MarqueeRow items={amenitiesList.slice(0, mid)} />
      <MarqueeRow items={amenitiesList.slice(mid)} offset />
    </div>
  );
}
