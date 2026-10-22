import { cn } from "@/lib/utils";
import WovenDivider from "./WovenDivider";
import Reveal from "./Reveal";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  light?: boolean;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  light = false,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "mb-12 max-w-2xl md:mb-16",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.3em]",
            align === "center" ? "text-gold-deep" : "eyebrow-rule text-gold-deep",
            light && "text-brass-300"
          )}
        >
          <span>{eyebrow}</span>
        </p>
      )}
      <h2
        className={cn(
          "font-display text-3xl font-normal leading-[1.08] tracking-tight sm:text-4xl md:text-[2.75rem]",
          light ? "text-ivory-soft" : "text-ink"
        )}
      >
        {title}
      </h2>
      <div
        className={cn(
          "mt-6",
          align === "center" ? "flex justify-center" : ""
        )}
      >
        <WovenDivider className="w-24" />
      </div>
      {description && (
        <p
          className={cn(
            "mt-6 text-base leading-relaxed sm:text-lg",
            light ? "text-cream-200/70" : "text-muted-foreground"
          )}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
