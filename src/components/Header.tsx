import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, ChevronDown } from "lucide-react";
import { navLinks } from "@/lib/site";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onHome = location.pathname === "/";
  const transparent = onHome && !scrolled;

  const navClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "group/nav relative px-1 py-2 text-[0.8rem] font-semibold uppercase tracking-[0.18em] transition-colors duration-300",
      "after:absolute after:bottom-0 after:left-1/2 after:h-[1.5px] after:-translate-x-1/2 after:bg-brass-400 after:transition-all after:duration-500 after:ease-[cubic-bezier(0.22,1,0.36,1)]",
      isActive ? "after:w-full" : "after:w-0 group-hover/nav:after:w-full",
      transparent
        ? isActive
          ? "text-white"
          : "text-cream-100/75 hover:text-white"
        : isActive
          ? "text-forest-950"
          : "text-forest-600 hover:text-forest-950"
    );

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-300",
        transparent
          ? "bg-transparent"
          : "border-b border-forest-950/5 bg-white/90 shadow-[0_12px_40px_-24px_rgba(5,28,16,0.4)] backdrop-blur-xl"
      )}
    >
      <div className="container-site flex h-[4.25rem] items-center justify-between md:h-20">
        <Link to="/" aria-label="Kakanfo Inn home">
          <Logo light={transparent} />
        </Link>

        <nav className="hidden items-center gap-10 lg:flex" aria-label="Main">
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.href} className="group relative">
                <NavLink to={link.href} className={navClass}>
                  {link.label}
                  <ChevronDown className="ml-1 inline h-2.5 w-2.5 transition-transform duration-300 group-hover:rotate-180" />
                </NavLink>
                <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 translate-y-1 pt-3 opacity-0 transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="min-w-[210px] rounded-xl border border-forest-950/5 bg-white p-1.5 shadow-lift">
                    {link.children.map((child) => (
                      <NavLink
                        key={child.href}
                        to={child.href}
                        className={({ isActive }) =>
                          cn(
                            "block rounded-lg px-4 py-2.5 text-[0.78rem] font-medium tracking-wide transition-colors duration-200",
                            isActive
                              ? "bg-forest-800 text-white"
                              : "text-forest-600 hover:bg-forest-50 hover:text-forest-950"
                          )
                        }
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <NavLink key={link.href} to={link.href} className={navClass}>
                {link.label}
              </NavLink>
            )
          )}
        </nav>

        <div className="flex items-center gap-3">
          <Button
            asChild
            className="hidden rounded-full px-7 text-[0.8rem] font-semibold uppercase tracking-[0.18em] sm:inline-flex"
          >
            <Link to="/booking">Book Now</Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant={transparent ? "ghost" : "outline"}
                size="icon"
                className={cn("lg:hidden", transparent && "text-cream-100 hover:bg-white/10")}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-80 flex-col border-l border-forest-950/5 bg-white">
              <SheetHeader className="border-b border-forest-950/5 pb-5">
                <SheetTitle className="text-left">
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-2 flex flex-1 flex-col divide-y divide-forest-950/5" aria-label="Mobile">
                {navLinks.map((link) =>
                  link.children ? (
                    <div key={link.href} className="py-1">
                      <NavLink
                        to={link.href}
                        className={({ isActive }) =>
                          cn(
                            "block px-2 py-3 text-[0.85rem] font-semibold uppercase tracking-[0.18em] transition-colors",
                            isActive ? "text-brass-600" : "text-forest-800"
                          )
                        }
                      >
                        {link.label}
                      </NavLink>
                      <div className="flex flex-col pb-2 pl-2">
                        {link.children.map((child) => (
                          <NavLink
                            key={child.href}
                            to={child.href}
                            className={({ isActive }) =>
                              cn(
                                "border-l px-4 py-2 text-sm font-medium transition-colors",
                                isActive
                                  ? "border-brass-500 text-forest-950"
                                  : "border-forest-950/10 text-forest-500"
                              )
                            }
                          >
                            {child.label}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <NavLink
                      key={link.href}
                      to={link.href}
                      className={({ isActive }) =>
                        cn(
                          "block px-2 py-4 text-[0.85rem] font-semibold uppercase tracking-[0.18em] transition-colors",
                          isActive ? "text-brass-600" : "text-forest-800"
                        )
                      }
                    >
                      {link.label}
                    </NavLink>
                  )
                )}
              </nav>
              <div className="border-t border-forest-950/5 pt-5">
                <Button
                  asChild
                  className="w-full rounded-full text-[0.8rem] font-semibold uppercase tracking-[0.18em]"
                >
                  <Link to="/booking">Book Now</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
