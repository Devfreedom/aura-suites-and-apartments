import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import ApartmentShowcase from "@/components/ApartmentShowcase";
import Amenities from "@/components/Amenities";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/NewsletterSignup";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col selection:bg-gold selection:text-white">
      <Hero />
      <AboutSection />
      <ApartmentShowcase limit={6} />
      <div className="py-16 text-center">
        <Link
          href="/pricing"
          className="inline-flex items-center gap-2 bg-gold text-white px-10 py-4 rounded-xl font-medium hover:bg-[#C5A028] transition-all shadow-lg shadow-gold/30"
        >
          View All 12 Suites
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <Amenities />
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl border border-gold/20 bg-gradient-to-br from-[#FBF7EC] via-white to-[#F6F1E3] p-8 shadow-sm sm:p-12">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
              <div>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-gold">
                  <Mail className="h-5 w-5" />
                </div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold">
                  The Aura Circle
                </p>
                <h2 className="font-serif text-3xl font-bold text-navy sm:text-4xl">
                  Exclusive offers, delivered quietly.
                </h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-600">
                  Be the first to hear about seasonal packages, new suites, and
                  curated experiences in Jos. Thoughtful emails only.
                </p>
              </div>
              <div className="lg:pl-8">
                <NewsletterSignup variant="light" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
