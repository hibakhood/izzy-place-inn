import type { ReactNode } from "react";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description?: string;
  image?: string;
  children?: ReactNode;
}

export default function PageHero({ eyebrow, title, description, image, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-forest-950">
      {image && (
        <>
          <img
            src={image}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-forest-950/70 via-forest-950/60 to-forest-950" />
        </>
      )}
      <div className="container-site relative pb-20 pt-36 text-center md:pb-24 md:pt-44">
        <p className="eyebrow-rule mx-auto justify-center text-brass-300">
          <span className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-brass-300">
            {eyebrow}
          </span>
        </p>
        <h1 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-light leading-[1.05] text-ivory-soft sm:text-5xl md:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-cream-200/75 sm:text-lg">
            {description}
          </p>
        )}
        {children && <div className="mx-auto mt-9">{children}</div>}
      </div>
      <div className="relative h-px w-full bg-gradient-to-r from-brass-500/60 via-brass-500/25 to-transparent" />
    </section>
  );
}
