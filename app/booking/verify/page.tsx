import type { Metadata } from "next";
import VerifyPageClient from "./VerifyPageClient";

export const metadata: Metadata = {
  title: "Payment Verification | Aura Suites & Apartments",
  description: "Verify your payment and confirm your luxury suite reservation.",
};

// Paystack returns the guest here with a live `?reference=` query parameter, so
// this route must render on demand rather than from a prerendered shell.
export const instant = false;

interface VerifyPageProps {
  searchParams: Promise<{ reference?: string }>;
}

export default async function VerifyPage({ searchParams }: VerifyPageProps) {
  const { reference } = await searchParams;

  return <VerifyPageClient searchParams={{ reference }} />;
}
