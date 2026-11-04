import type { Metadata } from "next";
import PricingContent from "@/components/PricingContent";

export const metadata: Metadata = {
  title: "Suites & Rates | Aura Suites & Apartments",
  description: "Explore transparent nightly rates for Deluxe Studios (₦20,000), Executive 2-Bedroom Suites (₦44,000), and Presidential Penthouse (₦88,000) in Jos.",
};

export default function PricingPage() {
  return <PricingContent />;
}
