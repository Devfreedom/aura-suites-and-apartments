"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import { Check, Calendar, Sparkles } from "lucide-react";

const packages = [
  {
    name: "Standard Hall Rental",
    price: "₦500,000",
    period: "Per Day",
    description: "Ideal for private celebrations, seminars, and mid-sized receptions.",
    features: [
      "Full Day Access (8:00 AM - 12:00 AM)",
      "Capacity for up to 500 Guests",
      "Central Air Conditioning",
      "100% Uninterrupted Power Supply",
      "Standard Banquet Seating & Tables",
      "Secure On-site Parking (150+ Vehicles)",
    ],
    highlighted: false,
  },
  {
    name: "Grand Wedding Package",
    price: "₦750,000",
    period: "Per Day",
    description: "The ultimate luxury experience for unforgettable wedding receptions.",
    features: [
      "Everything in Standard Hall Rental",
      "Extended Capacity up to 700 Guests",
      "VIP Dressing & Holding Suites",
      "Ultra-HD LED Screen Display Included",
      "Concert-Grade Sound System & Microphones",
      "Dedicated Event Concierge & Security",
    ],
    highlighted: true,
  },
  {
    name: "Corporate Summit & Gala",
    price: "₦650,000",
    period: "Per Day",
    description: "Tailored for high-end corporate conferences, product launches, and awards.",
    features: [
      "Full Day Access with Early Setup",
      "Advanced Presentation Stage & Lighting",
      "Enterprise High-Speed Wi-Fi for Attendees",
      "Ultra-HD LED Screens for Keynotes",
      "Professional Technical Support Team",
      "Executive Boardroom Access",
    ],
    highlighted: false,
  },
];

const addOns = [
  { name: "Ultra-HD LED Screen Package", price: "₦150,000" },
  { name: "Concert-Grade Sound System & DJ", price: "₦120,000" },
  { name: "Luxury Floral & Stage Decor Styling", price: "₦200,000" },
  { name: "Professional Valet Parking Service", price: "₦50,000" },
];

export default function PricingContent() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <main className="min-h-screen bg-white flex flex-col selection:bg-gold selection:text-white">
      <Navbar />

      {/* Pricing Header */}
      <section className="bg-navy py-20 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-gold/20 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold/20 text-gold text-xs font-semibold tracking-widest uppercase">
            Transparent Luxury
          </div>
          <h1 className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight">
            Pricing & Packages
          </h1>
          <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto font-light">
            Uncompromising elegance with transparent pricing. Explore our standard hall rental and tailored packages designed for flawless celebrations.
          </p>
        </div>
      </section>

      {/* Pricing Cards Section */}
      <section className="py-24 bg-gray-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
                  pkg.highlighted
                    ? "bg-navy text-white shadow-2xl ring-2 ring-gold transform lg:-translate-y-2"
                    : "bg-white text-navy border border-gray-200 shadow-lg hover:shadow-xl"
                }`}
              >
                {pkg.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gold text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-md">
                    Most Popular
                  </div>
                )}
                
                <div className="space-y-6">
                  <div>
                    <h3 className={`font-serif font-bold text-2xl mb-2 ${pkg.highlighted ? "text-white" : "text-navy"}`}>
                      {pkg.name}
                    </h3>
                    <p className={`text-sm font-light ${pkg.highlighted ? "text-gray-300" : "text-gray-600"}`}>
                      {pkg.description}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="font-serif font-bold text-4xl sm:text-5xl text-gold">
                      {pkg.price}
                    </span>
                    <span className={`text-xs uppercase tracking-wider ${pkg.highlighted ? "text-gray-300" : "text-gray-500"}`}>
                      / {pkg.period}
                    </span>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-gray-200/20">
                    <p className={`text-xs font-semibold uppercase tracking-wider ${pkg.highlighted ? "text-gold" : "text-gray-500"}`}>
                      Package Includes:
                    </p>
                    <ul className="space-y-3 text-sm font-light">
                      {pkg.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-start gap-3">
                          <Check className={`w-4 h-4 shrink-0 mt-0.5 ${pkg.highlighted ? "text-gold" : "text-emerald-600"}`} />
                          <span className={pkg.highlighted ? "text-gray-200" : "text-gray-700"}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-8">
                  <button
                    onClick={() => setIsBookingOpen(true)}
                    className={`w-full py-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                      pkg.highlighted
                        ? "bg-gold hover:bg-[#C5A028] text-white"
                        : "bg-navy hover:bg-navy/90 text-white"
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    Reserve This Package
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add-ons Section */}
          <div className="mt-20 bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-xl max-w-4xl mx-auto">
            <div className="text-center space-y-3 mb-10">
              <h3 className="font-serif font-bold text-2xl sm:text-3xl text-navy">
                Optional Add-On Services
              </h3>
              <p className="text-gray-600 text-sm font-light">
                Enhance your event experience with our professional add-on packages.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {addOns.map((addon, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-sm font-medium text-navy">{addon.name}</span>
                  <span className="text-sm font-bold text-gold">{addon.price}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <button
                onClick={() => setIsBookingOpen(true)}
                className="inline-flex items-center gap-2 bg-gold hover:bg-[#C5A028] text-white px-8 py-4 rounded-xl font-medium shadow-lg transition-all text-sm"
              >
                <Sparkles className="w-4 h-4" />
                Customize & Book Your Event
              </button>
            </div>
          </div>

        </div>
      </section>

      <Footer />
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </main>
  );
}
