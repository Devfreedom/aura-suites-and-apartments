"use client";

import { useState } from "react";
import Image from "next/image";
import {
  BedDouble,
  Users,
  Wifi,
  Utensils,
  Mountain,
  Settings,
  Droplets,
  Table,
  Laptop,
  Shield,
  User,
  Eye,
  Bath,
  Car,
  Calendar,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import BookingModal from "@/components/BookingModal";
import TourModal from "@/components/TourModal";

type SuiteType =
  | "Deluxe Studio"
  | "Royal 1-Bedroom Suite"
  | "Executive 2-Bedroom Suite"
  | "Grand Family 2-Bedroom"
  | "Diplomatic 3-Bedroom Suite"
  | "Presidential Penthouse";

interface Apartment {
  id: number;
  tier: string;
  title: string;
  price: string;
  guests: string;
  features: { icon: React.ElementType; label: string }[];
  image: string;
  suiteType: SuiteType;
  tourIndex: number;
}

const apartments: Apartment[] = [
  {
    id: 1,
    tier: "Deluxe Studio",
    title: "Executive Deluxe Studio",
    price: "50,000",
    guests: "2 Guests",
    features: [
      { icon: BedDouble, label: "King Bed" },
      { icon: Users, label: "2 Guests" },
      { icon: Wifi, label: "High-Speed WiFi" },
      { icon: Utensils, label: "Kitchenette" },
    ],
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
    suiteType: "Deluxe Studio",
    tourIndex: 0,
  },
  {
    id: 2,
    tier: "Royal 1-Bedroom Suite",
    title: "Royal 1-Bedroom Suite",
    price: "80,000",
    guests: "2 Guests",
    features: [
      { icon: BedDouble, label: "Super King Bed" },
      { icon: Users, label: "2 Guests" },
      { icon: Mountain, label: "Private Balcony" },
      { icon: HomeIcon, label: "Living Room" },
    ],
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    suiteType: "Royal 1-Bedroom Suite",
    tourIndex: 1,
  },
  {
    id: 3,
    tier: "Executive 2-Bedroom Suite",
    title: "Executive 2-Bedroom Suite",
    price: "110,000",
    guests: "4 Guests",
    features: [
      { icon: BedDouble, label: "2 Ensuite Rooms" },
      { icon: Users, label: "4 Guests" },
      { icon: Utensils, label: "Gourmet Kitchen" },
      { icon: Settings, label: "Smart Automation" },
    ],
    image:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80",
    suiteType: "Executive 2-Bedroom Suite",
    tourIndex: 2,
  },
  {
    id: 4,
    tier: "Grand Family 2-Bedroom",
    title: "Grand Family 2-Bedroom",
    price: "140,000",
    guests: "4 Guests",
    features: [
      { icon: Users, label: "4 Guests" },
      { icon: Droplets, label: "Pool View" },
      { icon: Table, label: "Dining Area" },
      { icon: Laptop, label: "Dedicated Workspace" },
    ],
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    suiteType: "Grand Family 2-Bedroom",
    tourIndex: 3,
  },
  {
    id: 5,
    tier: "Diplomatic 3-Bedroom Suite",
    title: "Diplomatic 3-Bedroom Suite",
    price: "180,000",
    guests: "6 Guests",
    features: [
      { icon: Users, label: "6 Guests" },
      { icon: Shield, label: "VIP Lounge Access" },
      { icon: Utensils, label: "Private Chef Kitchen" },
      { icon: User, label: "24/7 Butler" },
    ],
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    suiteType: "Diplomatic 3-Bedroom Suite",
    tourIndex: 4,
  },
  {
    id: 6,
    tier: "Presidential Penthouse",
    title: "Presidential Penthouse",
    price: "220,000",
    guests: "6 Guests",
    features: [
      { icon: Users, label: "6 Guests" },
      { icon: Eye, label: "Panoramic View" },
      { icon: Bath, label: "Private Jacuzzi" },
      { icon: Car, label: "Airport Transfer" },
    ],
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80",
    suiteType: "Presidential Penthouse",
    tourIndex: 5,
  },
];

function HomeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12l10-10L19 12H5z" />
      <path d="M19 12V22H5V12z" />
    </svg>
  );
}

export default function ApartmentShowcase() {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedSuite, setSelectedSuite] = useState<SuiteType>("Deluxe Studio");

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold/10 text-gold text-xs font-semibold tracking-widest uppercase">
            <Sparkles className="w-4 h-4 text-gold" />
            Featured Apartments
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-navy tracking-tight">
            Our Luxury Suites & Apartments
          </h2>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed font-light">
            Discover your perfect stay at Aura Suites & Apartments, No. 5 Kashim Ibrahim Road, Makurdi.
          </p>
        </div>

        {/* Grid of Apartment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {apartments.map((apt) => (
            <div
              key={apt.id}
              className="group relative bg-white border border-navy/20 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Image with tier badge and hover overlay */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={apt.image}
                  alt={apt.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={apt.id === 1}
                />
                <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                  {apt.tier}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-end p-4">
                  <span className="text-gold font-serif font-bold text-xl mb-1">
                    ₦{apt.price}
                  </span>
                  <span className="text-xs text-gray-200 font-light">per night</span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <div className="flex items-baseline gap-1.5 mb-2">
                  <span className="font-serif font-bold text-xl text-navy">
                    ₦{apt.price}
                  </span>
                  <span className="text-xs text-gray-400 font-light">/ night</span>
                </div>
                <h3 className="font-serif font-bold text-lg text-navy mb-3">{apt.title}</h3>

                <div className="flex items-center gap-2 mb-5">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {apt.guests}
                  </span>
                </div>

                {/* Feature Icons */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {apt.features.map((feat, idx) => {
                    const Icon = feat.icon;
                    return (
                      <div key={idx} className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-gold shrink-0" />
                        <span className="text-xs text-gray-600 font-light leading-none">
                          {feat.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setSelectedSuite(apt.suiteType);
                      setIsTourOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-navy/30 bg-white text-navy text-sm font-medium hover:bg-navy hover:text-white transition-all"
                  >
                    View Details
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedSuite(apt.suiteType);
                      setIsBookingOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gold text-white text-sm font-medium hover:bg-[#C5A028] shadow-lg hover:shadow-gold/20 transition-all"
                  >
                    Book Suite
                    <Calendar className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <TourModal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        initialIndex={0}
      />
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        defaultSuiteType={selectedSuite}
      />
    </section>
  );
}
