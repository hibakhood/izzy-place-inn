import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Rooms from "./pages/Rooms";
import RoomDetail from "./pages/RoomDetail";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Booking from "./pages/Booking";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";

export function renderPage(path: string, base: string) {
  const context: { helmet?: any } = {};
  const html = renderToString(
    <HelmetProvider context={context}>
      <StaticRouter location={`${base.replace(/\/$/, "")}${path}`} basename={base}>
        <Routes><Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:slug" element={<RoomDetail />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Route></Routes>
      </StaticRouter>
    </HelmetProvider>,
  );
  const helmet = context.helmet;
  return { html, head: [helmet.title, helmet.meta, helmet.link, helmet.script].map((part) => part.toString()).join("\n") };
}
