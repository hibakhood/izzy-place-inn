import { cn, asset } from "@/lib/utils";

interface LogoProps {
  className?: string;
  light?: boolean;
}

export default function Logo({ className, light = false }: LogoProps) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <img
        src={asset("/logo.png")}
        alt="Kakanfo Inn & Conference Centre logo"
        className="h-10 w-10 object-contain"
      />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-aptos text-lg font-semibold uppercase tracking-tight",
            light ? "text-cream-100" : "text-forest-900"
          )}
        >
          KAKANFO INN
        </span>
        <span
          className={cn(
            "mt-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.24em]",
            light ? "text-brass-300" : "text-brass-600"
          )}
        >
          &amp; Conference Centre
        </span>
      </span>
    </span>
  );
}
