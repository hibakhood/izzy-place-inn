import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import FloatingWhatsApp from "./FloatingWhatsApp";

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-forest-950 focus:px-4 focus:py-2 focus:text-cream-100 focus:outline-none"
      >
        Skip to main content
      </a>
      <div className="print:hidden">
        <Header />
      </div>
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <div className="print:hidden">
        <Footer />
      </div>
      <FloatingWhatsApp />
    </div>
  );
}
