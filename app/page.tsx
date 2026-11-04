import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import ApartmentShowcase from "@/components/ApartmentShowcase";
import Amenities from "@/components/Amenities";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col selection:bg-gold selection:text-white">
      <Navbar />
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
      <Footer />
    </main>
  );
}
