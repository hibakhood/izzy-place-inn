import { MessageCircle } from "lucide-react";

export default function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/2347055828309?text=Hello%20Kakanfo%20Inn%2C%20I%20would%20like%20to%20make%20an%20enquiry."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Kakanfo Inn on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lift transition-transform duration-300 hover:scale-110 print:hidden motion-reduce:transition-none"
    >
      <MessageCircle className="h-6 w-6" fill="currentColor" />
    </a>
  );
}
