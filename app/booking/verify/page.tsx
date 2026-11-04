import type { Metadata } from "next";
import VerifyPageClient from "./VerifyPageClient";

export const metadata: Metadata = {
  title: "Payment Verification | Aura Suites & Apartments",
  description: "Verify your payment and confirm your luxury suite reservation.",
};

export default function VerifyPage({ searchParams }: { searchParams: { reference?: string } }) {
  return <VerifyPageClient searchParams={searchParams} />;
}
