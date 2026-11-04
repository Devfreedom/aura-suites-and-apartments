import type { Metadata } from "next";
import PricingContent from "@/components/PricingContent";
import ApartmentShowcase from "@/components/ApartmentShowcase";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Suites & Rates | Aura Suites & Apartments",
  description: "Explore transparent nightly rates for Deluxe Studios (₦20,000), Executive 2-Bedroom Suites (₦44,000), and Presidential Penthouse (₦88,000) in Jos.",
};

export default function PricingPage() {
  return (
    <>
      <PricingContent />
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-navy">
              All Suites & Apartments
            </h2>
            <p className="text-gray-600 text-base mt-2">
              Browse our complete collection of luxury suites and apartments.
            </p>
          </div>
          <ApartmentShowcase />
        </div>
      </section>
      <Footer />
    </>
  );
}
