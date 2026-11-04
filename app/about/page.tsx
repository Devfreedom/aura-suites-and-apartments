import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Shield, Zap, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Aura Suites & Apartments",
  description: "Learn about Aura Suites & Apartments' heritage, architecture, and prime location at No. 5 Kashim Ibrahim Road, Makurdi.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col selection:bg-gold selection:text-white">
      <Navbar />

      {/* About Header */}
      <section className="bg-navy py-20 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-gold/20 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold/20 text-gold text-xs font-semibold tracking-widest uppercase">
            Our Heritage & Story
          </div>
          <h1 className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight">
            About Aura Suites &amp; Apartments
          </h1>
          <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto font-light">
            Redefining luxury shortlet hospitality and residential elegance in the heart of Makurdi, Benue State.
          </p>
        </div>
      </section>

      {/* Heritage & Vision */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-semibold tracking-widest uppercase">
                Excellence Redefined
              </div>
              <h2 className="font-serif font-bold text-3xl sm:text-4xl text-navy">
                Where Architectural Grandeur Meets Flawless Hospitality
              </h2>
              <p className="text-gray-600 leading-relaxed font-light">
                Established with a singular vision to provide world-class executive accommodation, Aura Suites &amp; Apartments has grown to become Makurdi&apos;s most prestigious destination for luxury shortlet stays, executive suites, and discerning travelers.
              </p>
              <p className="text-gray-600 leading-relaxed font-light">
                Our commitment extends beyond providing a magnificent physical space. We curate seamless, unforgettable experiences supported by a dedicated concierge team, state-of-the-art acoustics, and uncompromising safety standards.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gold shrink-0" />
                  <span className="text-sm font-medium text-navy">500 - 700 Guest Capacity</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gold shrink-0" />
                  <span className="text-sm font-medium text-navy">100% Uninterrupted Power</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gold shrink-0" />
                  <span className="text-sm font-medium text-navy">Prime Central Location</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-gold shrink-0" />
                  <span className="text-sm font-medium text-navy">Secure On-site Parking</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-4/3 rounded-3xl overflow-hidden shadow-2xl relative border-2 border-gold/30">
                <div
                  className="absolute inset-0 bg-cover bg-center transform hover:scale-105 transition-transform duration-700"
                  style={{ backgroundImage: `url(https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80)` }}
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-navy text-white p-6 rounded-2xl shadow-xl hidden sm:block border border-gold/40">
                <div className="font-serif font-bold text-3xl text-gold mb-1">No. 5</div>
                <p className="text-xs uppercase tracking-wider text-gray-300">Kashim Ibrahim Road, Makurdi</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location & Infrastructure Specifications */}
      <section className="py-24 bg-gray-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-navy">
              World-Class Infrastructure
            </h2>
            <p className="text-gray-600 text-base font-light">
              Engineered for absolute reliability and supreme comfort.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-navy text-gold flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-xl text-navy">Prime Accessibility</h3>
              <p className="text-gray-600 text-sm font-light leading-relaxed">
                Centrally located at No. 5 Kashim Ibrahim Road, Makurdi, Benue State, offering swift transit access and prominent frontage for visiting guests.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-navy text-gold flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-xl text-navy">Power Guarantee</h3>
              <p className="text-gray-600 text-sm font-light leading-relaxed">
                Dual heavy-duty silent industrial generators with automated transfer switches guarantee 100% uninterrupted power throughout your event.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-navy text-gold flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-xl text-navy">Uncompromised Security</h3>
              <p className="text-gray-600 text-sm font-light leading-relaxed">
                Trained security personnel, perimeter surveillance, and controlled gate access ensure complete safety and privacy for high-profile attendees.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
