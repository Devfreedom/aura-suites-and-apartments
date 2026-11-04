"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Search,
  Building2,
  Users,
  Sliders,
  Sort,
  BedDouble,
  Wifi,
  Utensils,
  Mountain,
  Settings,
  Droplets,
  Table,
  Laptop,
  Shield,
  Eye,
  Bath,
  Car,
  Calendar,
  ArrowRight,
  Sparkles,
  X,
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

type SuiteCategory = "Studio" | "1-Bedroom" | "2-Bedroom" | "3-Bedroom" | "Penthouse";

interface Apartment {
  id: number;
  tier: string;
  title: string;
  price: string;
  guests: string;
  guestCount: number;
  category: SuiteCategory;
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
    price: "20,000",
    guests: "2 Guests",
    guestCount: 2,
    category: "Studio",
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
    price: "32,000",
    guests: "2 Guests",
    guestCount: 2,
    category: "1-Bedroom",
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
    price: "44,000",
    guests: "4 Guests",
    guestCount: 4,
    category: "2-Bedroom",
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
    price: "56,000",
    guests: "4 Guests",
    guestCount: 4,
    category: "2-Bedroom",
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
    price: "72,000",
    guests: "6 Guests",
    guestCount: 6,
    category: "3-Bedroom",
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
    price: "88,000",
    guests: "6 Guests",
    guestCount: 6,
    category: "Penthouse",
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
  {
    id: 7,
    tier: "Deluxe Studio",
    title: "Royal Deluxe Studio",
    price: "22,000",
    guests: "2 Guests",
    guestCount: 2,
    category: "Studio",
    features: [
      { icon: BedDouble, label: "Queen Bed" },
      { icon: Users, label: "2 Guests" },
      { icon: Wifi, label: "High-Speed WiFi" },
      { icon: Utensils, label: "Mini Kitchen" },
    ],
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    suiteType: "Deluxe Studio",
    tourIndex: 6,
  },
  {
    id: 8,
    tier: "Royal 1-Bedroom Suite",
    title: "Imperial 1-Bedroom Suite",
    price: "34,000",
    guests: "2 Guests",
    guestCount: 2,
    category: "1-Bedroom",
    features: [
      { icon: BedDouble, label: "King Bed" },
      { icon: Users, label: "2 Guests" },
      { icon: Mountain, label: "City View Balcony" },
      { icon: HomeIcon, label: "Separate Living Area" },
    ],
    image:
      "https://images.unsplash.com/photo-1500381977722-92b92969380a?auto=format&fit=crop&w=800&q=80",
    suiteType: "Royal 1-Bedroom Suite",
    tourIndex: 7,
  },
  {
    id: 9,
    tier: "Executive 2-Bedroom Suite",
    title: "Prestige 2-Bedroom Suite",
    price: "48,000",
    guests: "4 Guests",
    guestCount: 4,
    category: "2-Bedroom",
    features: [
      { icon: BedDouble, label: "2 King Beds" },
      { icon: Users, label: "4 Guests" },
      { icon: Utensils, label: "Full Kitchen" },
      { icon: Settings, label: "Smart Home System" },
    ],
    image:
      "https://images.unsplash.com/photo-1500513371427-a45477dcde55?auto=format&fit=crop&w=800&q=80",
    suiteType: "Executive 2-Bedroom Suite",
    tourIndex: 8,
  },
  {
    id: 10,
    tier: "Grand Family 2-Bedroom",
    title: "Heritage Family Suite",
    price: "58,000",
    guests: "4 Guests",
    guestCount: 4,
    category: "2-Bedroom",
    features: [
      { icon: Users, label: "4 Guests" },
      { icon: Droplets, label: "Garden View" },
      { icon: Table, label: "Formal Dining" },
      { icon: Laptop, label: "Executive Desk" },
    ],
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    suiteType: "Grand Family 2-Bedroom",
    tourIndex: 9,
  },
  {
    id: 11,
    tier: "Diplomatic 3-Bedroom Suite",
    title: "Ambassador 3-Bedroom Suite",
    price: "76,000",
    guests: "6 Guests",
    guestCount: 6,
    category: "3-Bedroom",
    features: [
      { icon: Users, label: "6 Guests" },
      { icon: Shield, label: "Private Lounge" },
      { icon: Utensils, label: "Chef's Kitchen" },
      { icon: User, label: "Personal Butler" },
    ],
    image:
      "https://images.unsplash.com/photo-1517365382445-40b7f90df4e5?auto=format&fit=crop&w=800&q=80",
    suiteType: "Diplomatic 3-Bedroom Suite",
    tourIndex: 10,
  },
  {
    id: 12,
    tier: "Presidential Penthouse",
    title: "Empire Presidential Penthouse",
    price: "92,000",
    guests: "6 Guests",
    guestCount: 6,
    category: "Penthouse",
    features: [
      { icon: Users, label: "6 Guests" },
      { icon: Eye, label: "Skyline View" },
      { icon: Bath, label: "Marble Jacuzzi" },
      { icon: Car, label: "Limo Transfer" },
    ],
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80",
    suiteType: "Presidential Penthouse",
    tourIndex: 11,
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

type SortOption = "featured" | "price-low" | "price-high";
type GuestCapacity = "any" | "2-plus" | "4-plus" | "6-plus";
type SuiteFilter = "all" | "Studio" | "1-Bedroom" | "2-Bedroom" | "3-Bedroom" | "Penthouse";

interface ApartmentShowcaseProps {
  limit?: number;
}

export default function ApartmentShowcase({ limit }: ApartmentShowcaseProps = {}) {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedSuite, setSelectedSuite] = useState<SuiteType>("Deluxe Studio");

  // Filter & Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [suiteCategory, setSuiteCategory] = useState<SuiteFilter>("all");
  const [guestCapacity, setGuestCapacity] = useState<GuestCapacity>("any");
  const [sortOption, setSortOption] = useState<SortOption>("featured");

  // Filtered and sorted apartments
  const filteredApartments = useMemo(() => {
    let result = [...apartments];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (apt) =>
          apt.title.toLowerCase().includes(query) ||
          apt.tier.toLowerCase().includes(query) ||
          apt.features.some((f) => f.label.toLowerCase().includes(query))
      );
    }

    // Suite category filter
    if (suiteCategory !== "all") {
      result = result.filter((apt) => apt.category === suiteCategory);
    }

    // Guest capacity filter
    if (guestCapacity !== "any") {
      result = result.filter((apt) => {
        if (guestCapacity === "2-plus") return apt.guestCount >= 2;
        if (guestCapacity === "4-plus") return apt.guestCount >= 4;
        if (guestCapacity === "6-plus") return apt.guestCount >= 6;
        return true;
      });
    }

    // Sort
    result.sort((a, b) => {
      const priceA = parseInt(a.price.replace(/,/g, ""));
      const priceB = parseInt(b.price.replace(/,/g, ""));
      if (sortOption === "price-low") return priceA - priceB;
      if (sortOption === "price-high") return priceB - priceA;
      return 0; // featured = original order
    });

    // Apply limit if provided
    if (limit && result.length > limit) {
      result = result.slice(0, limit);
    }

    return result;
  }, [searchQuery, suiteCategory, guestCapacity, sortOption, limit]);

  const isFiltering =
    searchQuery.trim() !== "" ||
    suiteCategory !== "all" ||
    guestCapacity !== "any" ||
    sortOption !== "featured";

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold/10 text-gold text-xs font-semibold tracking-widest uppercase">
            <Sparkles className="w-4 h-4 text-gold" />
            Featured Apartments
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-navy tracking-tight">
            Our Luxury Suites & Apartments
          </h2>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed font-light">
            Discover your perfect stay at Aura Suites & Apartments, No. 5 Kashim Ibrahim Road, Jos.
          </p>
        </div>

        {/* Search, Filter & Sort Control Bar */}
        <div className="bg-white border border-navy/20 rounded-3xl p-6 shadow-sm mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search suites, features…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-navy/30 text-sm text-navy focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none bg-gray-50/50"
              />
            </div>

            {/* Suite Category */}
            <div>
              <label className="block text-xs font-medium text-navy uppercase tracking-wider mb-2">
                Suite Category
              </label>
              <select
                value={suiteCategory}
                onChange={(e) => setSuiteCategory(e.target.value as SuiteFilter)}
                className="w-full px-4 py-3 rounded-xl border border-navy/30 text-sm text-navy focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none bg-white cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="Studio">Studio</option>
                <option value="1-Bedroom">1-Bedroom</option>
                <option value="2-Bedroom">2-Bedroom</option>
                <option value="3-Bedroom">3-Bedroom</option>
                <option value="Penthouse">Penthouse</option>
              </select>
            </div>

            {/* Guest Capacity */}
            <div>
              <label className="block text-xs font-medium text-navy uppercase tracking-wider mb-2">
                Guest Capacity
              </label>
              <select
                value={guestCapacity}
                onChange={(e) => setGuestCapacity(e.target.value as GuestCapacity)}
                className="w-full px-4 py-3 rounded-xl border border-navy/30 text-sm text-navy focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none bg-white cursor-pointer"
              >
                <option value="any">Any Capacity</option>
                <option value="2-plus">2+ Guests</option>
                <option value="4-plus">4+ Guests</option>
                <option value="6-plus">6+ Guests</option>
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-end">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="w-full px-4 py-3 rounded-xl border border-navy/30 text-sm text-navy focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none bg-white cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Clear filters if any active */}
          {isFiltering && (
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSuiteCategory("all");
                  setGuestCapacity("any");
                  setSortOption("featured");
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-navy/30 text-xs text-navy hover:bg-navy hover:text-white transition-all"
              >
                <X className="w-3 h-3" />
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Results Counter */}
        <div className="mb-8 flex items-center justify-between">
          <p className="text-sm text-gray-600 font-medium">
            Showing{" "}
            <span className="font-bold text-navy">{filteredApartments.length}</span>{" "}
            of {apartments.length} available suites
          </p>
        </div>

        {/* Grid of Apartment Cards or Empty State */}
        {filteredApartments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-serif font-bold text-xl text-navy mb-2">
              No suites match your criteria
            </h3>
            <p className="text-gray-600 text-sm max-w-sm mx-auto mb-8">
              Try adjusting your search, category, guest capacity, or sort options.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSuiteCategory("all");
                setGuestCapacity("any");
                setSortOption("featured");
              }}
              className="bg-gold text-white px-8 py-3 rounded-xl font-medium hover:bg-[#C5A028] transition-all shadow-lg"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredApartments.map((apt) => (
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
        )}

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
      </div>
    </section>
  );
}
