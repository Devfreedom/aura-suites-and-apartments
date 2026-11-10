import type { Metadata } from "next";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { supabaseUrl, supabaseAnonKey } from "@/lib/supabase/config";
import type { Suite } from "@/types/suite";
import SuiteDetailsClient from "./suite-details-client";

interface SuiteDetailsPageProps {
  params: Promise<{ slug: string }>;
}

export const metadata: Metadata = {
  title: "Suite Details | Aura Suites & Apartments",
  description: "View suite details and book your stay at Aura Suites & Apartments.",
};

export const instant = false;

interface SuiteRow {
  id: string;
  slug: string;
  name: string;
  tier: string | null;
  category: string | null;
  description: string | null;
  price: number | string | null;
  guests: number | null;
  bathrooms: number | null;
  square_feet: number | null;
  amenities: string[] | null;
  house_rules: string[] | null;
  images: string[] | null;
  is_published: boolean | null;
  created_at: string;
  updated_at: string;
}

function mapRow(row: SuiteRow): Suite {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tier: row.tier ?? "",
    category: (row.category ?? "Studio") as Suite["category"],
    description: row.description ?? "",
    price: Number(row.price ?? 0),
    guests: Number(row.guests ?? 0),
    bathrooms: Number(row.bathrooms ?? 0),
    squareFeet: Number(row.square_feet ?? 0),
    amenities: row.amenities ?? [],
    houseRules: row.house_rules ?? [],
    images: row.images ?? [],
    isPublished: row.is_published ?? true,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export default async function SuiteDetailsPage({
  params,
}: SuiteDetailsPageProps) {
  const { slug } = await params;

  const cookieStore = await cookies();
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {
        // Read-only in Server Component
      },
    },
  });

  const { data, error } = await supabase
    .from("suites")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return <SuiteDetailsClient initialSuite={mapRow(data as SuiteRow)} />;
}
