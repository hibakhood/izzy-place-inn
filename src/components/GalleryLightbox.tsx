import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import type { GalleryImage } from "@/types";

interface GalleryLightboxProps {
  images: GalleryImage[];
  columns?: number;
}

export default function GalleryLightbox({ images, columns = 3 }: GalleryLightboxProps) {
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const prev = useCallback(
    () => setActive((i) => (i === null ? null : (i - 1 + images.length) % images.length)),
    [images.length]
  );
  const next = useCallback(
    () => setActive((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.body.classList.add("lightbox-open");
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("lightbox-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [active, close, prev, next]);

  return (
    <>
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {images.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setActive(i)}
            className="group relative aspect-square overflow-hidden rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`Open image: ${img.alt}`}
          >
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-between bg-forest-950/0 p-3 transition-colors group-hover:bg-forest-950/40">
              <ZoomIn className="mt-3 h-6 w-6 text-ivory-soft opacity-0 transition-opacity group-hover:opacity-100" />
              <span className="mb-1 w-full truncate rounded bg-forest-950/70 px-2 py-1 text-center text-xs font-semibold uppercase tracking-wide text-ivory-soft opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                {img.alt}
              </span>
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-forest-950/95 p-4"
            onClick={close}
          >
            <button
              onClick={close}
              aria-label="Close lightbox"
              className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-ivory/10 text-ivory-soft transition-colors hover:bg-ivory/20"
            >
              <X className="h-6 w-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/10 text-ivory-soft transition-colors hover:bg-ivory/20 sm:left-8"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next image"
              className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/10 text-ivory-soft transition-colors hover:bg-ivory/20 sm:right-8"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <motion.figure
              key={active}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="max-h-[85vh] max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[active].src}
                alt={images[active].alt}
                className="max-h-[80vh] w-auto rounded-lg object-contain"
              />
              <figcaption className="mt-4 text-center text-sm text-cream-200/80">
                {images[active].alt} · {active + 1} / {images.length}
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
