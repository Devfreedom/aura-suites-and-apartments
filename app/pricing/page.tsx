import type { Metadata } from "next";
import PricingContent from "@/components/PricingContent";

export const metadata: Metadata = {
  title: "Suites & Rates | Aura Apartments",
  description: "Explore transparent nightly rates for Executive Studios (₦65,000), 2-Bedroom Luxury Suites (₦120,000), and Penthouse Suites (₦250,000) in Makurdi.",
};

export default function PricingPage() {
  return <PricingContent />;
}
