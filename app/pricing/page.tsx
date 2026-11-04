import type { Metadata } from "next";
import PricingContent from "@/components/PricingContent";

export const metadata: Metadata = {
  title: "Suites & Rates | Aura Suites & Apartments",
  description: "Explore transparent nightly rates for Deluxe Studios (₦50,000), Executive 2-Bedroom Suites (₦110,000), and Presidential Penthouse (₦220,000) in Makurdi.",
};

export default function PricingPage() {
  return <PricingContent />;
}
