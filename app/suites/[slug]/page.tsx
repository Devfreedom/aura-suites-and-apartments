import type { Metadata } from "next";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { supabaseUrl, supabaseAnonKey } from "@/lib/supabase/config";
import { getSuiteBySlug } from "@/lib/suites";
import SuiteDetailsClient from "./suite-details-client";

interface SuiteDetailsPageProps {
  params: Promise<{ slug: string }>;
}

export const metadata: Metadata = {
  title: "Suite Details | Aura Suites & Apartments",
  description: "View suite details and book your stay at Aura Suites & Apartments.",
};

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

  // Optional: verify suite exists and is published
  const suite = await getSuiteBySlug(slug);

  if (!suite) {
    return null; // Will show 404
  }

  return <SuiteDetailsClient initialSuite={suite} />;
}
