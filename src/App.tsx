import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
const Home = lazy(() => import("@/pages/Home"));
const Rooms = lazy(() => import("@/pages/Rooms"));
const RoomDetail = lazy(() => import("@/pages/RoomDetail"));
const Booking = lazy(() => import("@/pages/Booking"));
const Gallery = lazy(() => import("@/pages/Gallery"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const NotFound = lazy(() => import("@/pages/NotFound"));

export default function App() {
  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center" role="status">Loading page…</div>}>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/rooms/:slug" element={<RoomDetail />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
    </Suspense>
  );
}
