import type { Metadata } from "next";
import ContactContent from "@/components/ContactContent";

export const metadata: Metadata = {
  title: "Contact & Location | Aura Event Center",
  description: "Get in touch with Aura Event Center in Makurdi. Schedule a private tour or send an inquiry to our concierge.",
};

export default function ContactPage() {
  return <ContactContent />;
}
