import { asset, cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  light?: boolean;
  footer?: boolean;
}

export default function Logo({ className, light = false, footer = false }: LogoProps) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <img
        src={asset("/images/brand/izzy-logo-forest-gold.png")}
        alt=""
        aria-hidden="true"
        width={64}
        height={43}
        className={cn("h-11 w-16 shrink-0 rounded-sm object-contain", light && "bg-ivory")}
      />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-aptos text-lg font-semibold uppercase tracking-tight",
            footer ? "text-charcoal" : light ? "text-ivory-soft" : "text-ink"
          )}
        >
          Izzy Place
        </span>
        <span
          className={cn(
            "mt-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.24em]",
            footer ? "text-muted-foreground" : light ? "text-brass-300" : "text-gold-deep"
          )}
        >
          Inn &amp; Suites
        </span>
      </span>
    </span>
  );
}
