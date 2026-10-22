import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, Loader2, CheckCircle2 } from "lucide-react";
import Seo from "@/components/Seo";
import PageHero from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { asset } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { siteConfig } from "@/lib/site";

const ENQUIRY_TYPES = [
  "Room & suite enquiry",
  "Dining & restaurant",
  "Corporate partnership",
  "Feedback",
  "Other",
];

const CONTACTS = [
  {
    icon: Phone,
    title: "Call us",
    lines: [siteConfig.phones[0], siteConfig.phones[1]],
    note: `${siteConfig.reception}, ${siteConfig.address.city}`,
    href: `tel:${siteConfig.phones[0].replace(/[^+\d]/g, "")}`,
  },
  {
    icon: Mail,
    title: "Email us",
    lines: [siteConfig.emails.reservations, siteConfig.emails.info],
    note: "We reply within a few hours",
    href: `mailto:${siteConfig.emails.reservations}`,
  },
  {
    icon: MapPin,
    title: "Find us",
    lines: [
      siteConfig.address.line1,
      siteConfig.address.line2,
      `${siteConfig.address.city}, ${siteConfig.address.state}`,
    ],
    note: siteConfig.address.country,
    href: siteConfig.directionsUrl,
  },
  {
    icon: Clock,
    title: "Reception",
    lines: ["Open 24 hours", "Every day of the year"],
    note: "Walk-ins welcome",
  },
];

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: ENQUIRY_TYPES[0],
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Could not send your message.");
      }
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Could not send your message.");
    }
  };

  return (
    <>
      <Seo
        title="Contact Us"
        description="Get in touch with Izzy Place Inn & Suites, Ibadan. Call our 24-hour reception on Old Ife Road, email us, or send an enquiry and we will reply within a few hours."
        keywords="contact Izzy Place Inn, Izzy Place Inn Ibadan address, hotel phone number Ibadan, room booking enquiry"
        path="/contact"
      />

      <PageHero
        eyebrow="Contact"
        title="We are always in"
        description="Reception runs around the clock, so there is always a human on the other end. Reach us however suits you."
        image={asset("/images/facilities/lobby.jpg")}
      />

      <section className="container-site py-12 md:py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CONTACTS.map((c) => {
            const Icon = c.icon;
            const inner = (
              <>
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-ink">{c.title}</h3>
                {c.lines.map((l) => (
                  <p key={l} className="mt-1 text-sm text-ink">
                    {l}
                  </p>
                ))}
                <p className="mt-2 text-xs text-muted-foreground">{c.note}</p>
              </>
            );
            return c.href ? (
              <a
                key={c.title}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel={c.href.startsWith("http") ? "noreferrer" : undefined}
                className="block rounded-lg border border-border/70 bg-card p-6 transition-colors hover:border-primary/40"
              >
                {inner}
              </a>
            ) : (
              <div key={c.title} className="rounded-lg border border-border/70 bg-card p-6">
                {inner}
              </div>
            );
          })}
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">Send us an enquiry</h2>
            <p className="mt-2 text-muted-foreground">
              Send us your question and we will get back to you.
            </p>

            {status === "sent" ? (
              <div className="mt-8 rounded-lg border border-primary/30 bg-primary/5 p-8 text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />
                <h3 className="mt-4 font-display text-xl font-semibold text-ink">Message sent</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Thank you, {form.name.split(" ")[0]}. We have received your enquiry and will reply to{" "}
                  <strong>{form.email}</strong> shortly.
                </p>
                <Button
                  className="mt-6"
                  variant="outline"
                  onClick={() => {
                    setStatus("idle");
                    setForm({ name: "", email: "", phone: "", subject: ENQUIRY_TYPES[0], message: "" });
                  }}
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">Full name</Label>
                    <Input
                      id="contact-name"
                      required
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      autoComplete="name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Email address</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      autoComplete="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-phone">Phone (optional)</Label>
                    <Input
                      id="contact-phone"
                      type="tel"
                      placeholder="e.g. 0803 000 0000"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      autoComplete="tel"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Enquiry type</Label>
                    <Select value={form.subject} onValueChange={(v) => setForm({ ...form, subject: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ENQUIRY_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="contact-message">Message</Label>
                    <Textarea
                      id="contact-message"
                      required
                      rows={6}
                      placeholder="Dates, number of guests, what you need..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />
                  </div>
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button type="submit" size="lg" disabled={status === "sending"} className="min-w-44">
                  {status === "sending" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" /> Send message
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>

          <div className="overflow-hidden rounded-lg border border-border/70">
            <iframe
              title="Izzy Place Inn & Suites location"
              src={siteConfig.mapEmbed}
              className="h-full min-h-[420px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>
    </>
  );
}
