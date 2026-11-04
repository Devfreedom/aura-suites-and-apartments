import type { Metadata } from "next";
import PricingContent from "@/components/PricingContent";

export const metadata: Metadata = {
  title: "Pricing & Packages | Aura Event Center",
  description: "Explore transparent pricing for our standard hall rental (₦500,000/day), wedding packages, and corporate summits.",
};

export default function PricingPage() {
  return <PricingContent />;
}
