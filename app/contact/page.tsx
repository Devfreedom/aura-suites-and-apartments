import type { Metadata } from "next";
import ContactContent from "@/components/ContactContent";

export const metadata: Metadata = {
  title: "Contact & Reservations | Aura Apartments",
  description: "Get in touch with Aura Apartments in Makurdi. Reserve your luxury suite or send an inquiry to our reservations team.",
};

export default function ContactPage() {
  return <ContactContent />;
}
