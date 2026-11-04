import type { Metadata } from "next";
import InSuiteDining from "@/components/InSuiteDining";

export const metadata: Metadata = {
  title: "In-Suite Dining | Aura Suites & Apartments",
  description: "Order luxury in-suite dining from Jos's finest kitchen. Jos Beef Suya, Masa & Pepper Soup, Fresh Plateau Produce, and Private Chef services.",
};

export default function DiningPage() {
  return <InSuiteDining />;
}
