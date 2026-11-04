import type { Metadata } from "next";
import ExploreJos from "@/components/ExploreJos";

export const metadata: Metadata = {
  title: "Explore Jos | Aura Suites & Apartments",
  description: "Discover Jos landmarks and attractions with our luxury chauffeur service. Rayfield Golf Club, Jos Wildlife Park, Riyom Rock Formations, and more.",
};

export default function ExplorePage() {
  return <ExploreJos />;
}
