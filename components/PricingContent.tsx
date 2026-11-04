"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import { Check, Calendar } from "lucide-react";

const packages = [
  {
    name: "Deluxe Studio",
    price: "₦50,000",
    period: "Per Night",
    description: "Perfect for solo travelers or couples seeking luxury and convenience.",
    features: [
      "King-size Bed with Premium Linens",
      "Fully Equipped Kitchenette",
      "55\" 4K Smart TV with Streaming",
      "High-Speed Fiber WiFi",
      "24/7 Power & Climate Control",
      "Daily Housekeeping Service",
    ],
    highlighted: false,
  },
  {
    name: "Executive 2-Bedroom Suite",
    price: "₦110,000",
    period: "Per Night",
    description: "Spacious suite ideal for families or business travelers needing extra space.",
    features: [
      "Master King Suite + Guest Queen Room",
      "Full Gourmet Kitchen & Dining Area",
      "Separate Living Room with Smart TV",
      "High-Speed Fiber WiFi & Work Desk",
      "24/7 Power, Security & Concierge",
      "Daily Housekeeping & Turndown Service",
    ],
    highlighted: true,
  },
  {
    name: "Presidential Penthouse",
    price: "₦220,000",
    period: "Per Night",
    description: "The pinnacle of luxury living with panoramic views and exclusive amenities.",
    features: [
      "Master King Suite + 2 Guest Rooms",
      "Private Rooftop Terrace & Lounge",
      "Full Chef's Kitchen & Wine Cooler",
      "Home Theater System & Gaming Console",
      "Private Elevator Access & Butler Service",
      "Airport Shuttle & Complimentary Breakfast",
    ],
    highlighted: false,
  },
];

const includedPerks = [
  { name: "Check-in / Check-out Times", included: ["3:00 PM", "3:00 PM", "3:00 PM"] },
  { name: "Complimentary Daily Breakfast", included: [false, true, true] },
  { name: "Airport Shuttle Service", included: [false, true, true] },
  { name: "Daily Housekeeping & Turndown", included: [true, true, true] },
  { name: "24/7 Concierge & Security", included: [true, true, true] },
  { name: "High-Speed Fiber WiFi", included: [true, true, true] },
  { name: "Uninterrupted Power Supply", included: [true, true, true] },
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
            Suites & Nightly Rates
          </h1>
          <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto font-light">
            Uncompromising elegance with transparent nightly pricing. Explore our executive studios, luxury suites, and penthouse residences.
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
                    Reserve a Suite
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Included Perks Comparison */}
          <div className="mt-20 bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-xl max-w-4xl mx-auto">
            <div className="text-center space-y-3 mb-10">
              <h3 className="font-serif font-bold text-2xl sm:text-3xl text-navy">
                Included Perks & Amenities
              </h3>
              <p className="text-gray-600 text-sm font-light">
                Compare what&apos;s included across our suite categories.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-navy">Perk / Detail</th>
                    {packages.map((pkg) => (
                      <th key={pkg.name} className={`text-center py-3 px-4 font-semibold ${pkg.highlighted ? "text-white" : "text-navy"}`}>
                        {pkg.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {includedPerks.map((perk, pIndex) => (
                    <tr key={pIndex} className="border-b border-gray-100 hover:bg-gray-50/50">
                      <td className="py-3 px-4 font-medium text-navy">{perk.name}</td>
                      {perk.included.map((inc, i) => (
                        <td key={i} className="text-center py-3 px-4">
                          {typeof inc === "string" ? (
                            <span className="text-gray-600 font-medium">{inc}</span>
                          ) : inc ? (
                            <span className="inline-flex items-center justify-center gap-1 text-emerald-600 font-medium">
                              <Check className="w-4 h-4" />
                              Included
                            </span>
                          ) : (
                            <span className="text-gray-400 font-light">—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-10 text-center">
              <button
                onClick={() => setIsBookingOpen(true)}
                className="inline-flex items-center gap-2 bg-gold hover:bg-[#C5A028] text-white px-8 py-4 rounded-xl font-medium shadow-lg transition-all text-sm"
              >
                <Calendar className="w-4 h-4" />
                Reserve a Suite
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
