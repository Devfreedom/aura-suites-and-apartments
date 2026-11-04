"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Search,
  Calendar,
  ArrowRight,
  Sparkles,
  X,
} from "lucide-react";
import BookingModal from "@/components/BookingModal";
import SuiteDetailModal from "@/components/SuiteDetailModal";

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
  bathrooms: number;
  squareFeet: number;
  category: SuiteCategory;
  description: string;
  houseRules: string[];
  amenities: string[];
  image: string;
  gallery: string[];
  suiteType: SuiteType;
}

const apartments: Apartment[] = [
  {
    id: 1,
    tier: "Deluxe Studio",
    title: "Executive Deluxe Studio",
    price: "20,000",
    guests: "2 Guests",
    guestCount: 2,
    bathrooms: 1,
    squareFeet: 450,
    category: "Studio",
    description: "A stylish and compact executive studio perfect for solo travelers or couples. Features a king bed, kitchenette, and floor-to-ceiling windows with city views. Thoughtfully designed with premium finishes throughout.",
    houseRules: [
      "Check-in: 2:00 PM | Check-out: 11:00 AM",
      "No smoking inside the suite",
      "No pets allowed",
      "Quiet hours: 10:00 PM - 7:00 AM",
      "Maximum 2 guests",
    ],
    amenities: [
      "24/7 Solar & Generator Power",
      "Treated Running Water",
      "High-Speed Fiber WiFi",
      "Smart TV with Streaming",
      "Air Conditioning",
      "Daily Housekeeping",
      "Kitchenette",
      "Concierge Service",
    ],
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502691876337-7551876055a2?auto=format&fit=crop&w=800&q=80",
    ],
    suiteType: "Deluxe Studio",
  },
  {
    id: 2,
    tier: "Royal 1-Bedroom Suite",
    title: "Royal 1-Bedroom Suite",
    price: "32,000",
    guests: "2 Guests",
    guestCount: 2,
    bathrooms: 1,
    squareFeet: 650,
    category: "1-Bedroom",
    description: "A spacious one-bedroom suite with a super king bed, private balcony, and separate living room. Elegant furnishings and modern amenities make this ideal for extended stays.",
    houseRules: [
      "Check-in: 2:00 PM | Check-out: 11:00 AM",
      "No smoking inside the suite",
      "No pets allowed",
      "Quiet hours: 10:00 PM - 7:00 AM",
      "Maximum 2 guests",
    ],
    amenities: [
      "24/7 Solar & Generator Power",
      "Treated Running Water",
      "High-Speed Fiber WiFi",
      "Smart TV with Streaming",
      "Air Conditioning",
      "Daily Housekeeping",
      "Private Balcony",
      "Concierge Service",
    ],
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502691876337-7551876055a2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
    ],
    suiteType: "Royal 1-Bedroom Suite",
  },
  {
    id: 3,
    tier: "Executive 2-Bedroom Suite",
    title: "Executive 2-Bedroom Suite",
    price: "44,000",
    guests: "4 Guests",
    guestCount: 4,
    bathrooms: 2,
    squareFeet: 850,
    category: "2-Bedroom",
    description: "Spacious two-bedroom executive suite with ensuite rooms, gourmet kitchen, and smart home automation. Perfect for business travelers or families needing extra space and comfort.",
    houseRules: [
      "Check-in: 2:00 PM | Check-out: 11:00 AM",
      "No smoking inside the suite",
      "No pets allowed",
      "Quiet hours: 10:00 PM - 7:00 AM",
      "Maximum 4 guests",
    ],
    amenities: [
      "24/7 Solar & Generator Power",
      "Treated Running Water",
      "High-Speed Fiber WiFi",
      "Smart TV with Streaming",
      "Air Conditioning",
      "Daily Housekeeping",
      "Gourmet Kitchen",
      "Smart Home Automation",
      "Concierge Service",
    ],
    image:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    ],
    suiteType: "Executive 2-Bedroom Suite",
  },
  {
    id: 4,
    tier: "Grand Family 2-Bedroom",
    title: "Grand Family 2-Bedroom",
    price: "56,000",
    guests: "4 Guests",
    guestCount: 4,
    bathrooms: 2,
    squareFeet: 950,
    category: "2-Bedroom",
    description: "A family-friendly suite with pool view, dining area, and dedicated workspace. Perfect for families traveling together with separate sleeping areas and ample living space.",
    houseRules: [
      "Check-in: 2:00 PM | Check-out: 11:00 AM",
      "No smoking inside the suite",
      "No pets allowed",
      "Quiet hours: 10:00 PM - 7:00 AM",
      "Maximum 4 guests",
    ],
    amenities: [
      "24/7 Solar & Generator Power",
      "Treated Running Water",
      "High-Speed Fiber WiFi",
      "Smart TV with Streaming",
      "Air Conditioning",
      "Daily Housekeeping",
      "Dining Area",
      "Dedicated Workspace",
      "Pool View",
      "Concierge Service",
    ],
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    ],
    suiteType: "Grand Family 2-Bedroom",
  },
  {
    id: 5,
    tier: "Diplomatic 3-Bedroom Suite",
    title: "Diplomatic 3-Bedroom Suite",
    price: "72,000",
    guests: "6 Guests",
    guestCount: 6,
    bathrooms: 3,
    squareFeet: 1200,
    category: "3-Bedroom",
    description: "An executive diplomatic suite with VIP lounge access, private chef kitchen, and 24/7 butler service. Designed for dignitaries and executives who expect the highest level of service.",
    houseRules: [
      "Check-in: 2:00 PM | Check-out: 11:00 AM",
      "No smoking inside the suite",
      "No pets allowed",
      "Quiet hours: 11:00 PM - 7:00 AM",
      "Maximum 6 guests",
    ],
    amenities: [
      "24/7 Solar & Generator Power",
      "Treated Running Water",
      "High-Speed Fiber WiFi",
      "Smart TV with Streaming",
      "Air Conditioning",
      "Daily Housekeeping",
      "Private Chef Kitchen",
      "VIP Lounge Access",
      "24/7 Butler Service",
      "Concierge Service",
    ],
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502691876337-7551876055a2?auto=format&fit=crop&w=800&q=80",
    ],
    suiteType: "Diplomatic 3-Bedroom Suite",
  },
  {
    id: 6,
    tier: "Presidential Penthouse",
    title: "Presidential Penthouse",
    price: "88,000",
    guests: "6 Guests",
    guestCount: 6,
    bathrooms: 3,
    squareFeet: 1500,
    category: "Penthouse",
    description: "The pinnacle of luxury living with top floor panoramic views, private jacuzzi, and express airport transfer. Exclusive penthouse experience with premium finishes throughout.",
    houseRules: [
      "Check-in: 2:00 PM | Check-out: 11:00 AM",
      "No smoking inside the suite",
      "No pets allowed",
      "Quiet hours: 11:00 PM - 7:00 AM",
      "Maximum 6 guests",
    ],
    amenities: [
      "24/7 Solar & Generator Power",
      "Treated Running Water",
      "High-Speed Fiber WiFi",
      "Smart TV with Streaming",
      "Air Conditioning",
      "Daily Housekeeping",
      "Private Jacuzzi",
      "Panoramic Views",
      "Airport Transfer",
      "Butler Service",
      "Concierge Service",
    ],
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    ],
    suiteType: "Presidential Penthouse",
  },
  {
    id: 7,
    tier: "Deluxe Studio",
    title: "Royal Deluxe Studio",
    price: "22,000",
    guests: "2 Guests",
    guestCount: 2,
    bathrooms: 1,
    squareFeet: 420,
    category: "Studio",
    description: "A cozy deluxe studio with queen bed and mini kitchen. Perfect for solo travelers or couples seeking comfort and convenience at an accessible price point.",
    houseRules: [
      "Check-in: 2:00 PM | Check-out: 11:00 AM",
      "No smoking inside the suite",
      "No pets allowed",
      "Quiet hours: 10:00 PM - 7:00 AM",
      "Maximum 2 guests",
    ],
    amenities: [
      "24/7 Solar & Generator Power",
      "Treated Running Water",
      "High-Speed Fiber WiFi",
      "Smart TV with Streaming",
      "Air Conditioning",
      "Daily Housekeeping",
      "Mini Kitchen",
      "Concierge Service",
    ],
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
    ],
    suiteType: "Deluxe Studio",
  },
  {
    id: 8,
    tier: "Royal 1-Bedroom Suite",
    title: "Imperial 1-Bedroom Suite",
    price: "34,000",
    guests: "2 Guests",
    guestCount: 2,
    bathrooms: 1,
    squareFeet: 700,
    category: "1-Bedroom",
    description: "An imperial one-bedroom suite with king bed and city view balcony. Separate living area provides additional space for relaxation or work.",
    houseRules: [
      "Check-in: 2:00 PM | Check-out: 11:00 AM",
      "No smoking inside the suite",
      "No pets allowed",
      "Quiet hours: 10:00 PM - 7:00 AM",
      "Maximum 2 guests",
    ],
    amenities: [
      "24/7 Solar & Generator Power",
      "Treated Running Water",
      "High-Speed Fiber WiFi",
      "Smart TV with Streaming",
      "Air Conditioning",
      "Daily Housekeeping",
      "Private Balcony",
      "Separate Living Area",
      "Concierge Service",
    ],
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
    ],
    suiteType: "Royal 1-Bedroom Suite",
  },
  {
    id: 9,
    tier: "Executive 2-Bedroom Suite",
    title: "Prestige 2-Bedroom Suite",
    price: "48,000",
    guests: "4 Guests",
    guestCount: 4,
    bathrooms: 2,
    squareFeet: 900,
    category: "2-Bedroom",
    description: "A prestige two-bedroom suite with 2 king beds and smart home automation. Full kitchen and elegant living space for extended stays or business travel.",
    houseRules: [
      "Check-in: 2:00 PM | Check-out: 11:00 AM",
      "No smoking inside the suite",
      "No pets allowed",
      "Quiet hours: 10:00 PM - 7:00 AM",
      "Maximum 4 guests",
    ],
    amenities: [
      "24/7 Solar & Generator Power",
      "Treated Running Water",
      "High-Speed Fiber WiFi",
      "Smart TV with Streaming",
      "Air Conditioning",
      "Daily Housekeeping",
      "Full Kitchen",
      "Smart Home System",
      "Concierge Service",
    ],
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    ],
    suiteType: "Executive 2-Bedroom Suite",
  },
  {
    id: 10,
    tier: "Grand Family 2-Bedroom",
    title: "Heritage Family Suite",
    price: "58,000",
    guests: "4 Guests",
    guestCount: 4,
    bathrooms: 2,
    squareFeet: 980,
    category: "2-Bedroom",
    description: "A heritage family suite with garden view and formal dining area. Spacious layout with executive desk for those who need to work while traveling with family.",
    houseRules: [
      "Check-in: 2:00 PM | Check-out: 11:00 AM",
      "No smoking inside the suite",
      "No pets allowed",
      "Quiet hours: 10:00 PM - 7:00 AM",
      "Maximum 4 guests",
    ],
    amenities: [
      "24/7 Solar & Generator Power",
      "Treated Running Water",
      "High-Speed Fiber WiFi",
      "Smart TV with Streaming",
      "Air Conditioning",
      "Daily Housekeeping",
      "Formal Dining",
      "Dedicated Workspace",
      "Garden View",
      "Concierge Service",
    ],
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    ],
    suiteType: "Grand Family 2-Bedroom",
  },
  {
    id: 11,
    tier: "Diplomatic 3-Bedroom Suite",
    title: "Ambassador 3-Bedroom Suite",
    price: "76,000",
    guests: "6 Guests",
    guestCount: 6,
    bathrooms: 3,
    squareFeet: 1300,
    category: "3-Bedroom",
    description: "An ambassador suite with VIP lounge access, private chef kitchen, and 24/7 butler service. Ultimate luxury for discerning travelers and dignitaries.",
    houseRules: [
      "Check-in: 2:00 PM | Check-out: 11:00 AM",
      "No smoking inside the suite",
      "No pets allowed",
      "Quiet hours: 11:00 PM - 7:00 AM",
      "Maximum 6 guests",
    ],
    amenities: [
      "24/7 Solar & Generator Power",
      "Treated Running Water",
      "High-Speed Fiber WiFi",
      "Smart TV with Streaming",
      "Air Conditioning",
      "Daily Housekeeping",
      "Private Chef Kitchen",
      "VIP Lounge Access",
      "24/7 Butler Service",
      "Concierge Service",
    ],
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    ],
    suiteType: "Diplomatic 3-Bedroom Suite",
  },
  {
    id: 12,
    tier: "Presidential Penthouse",
    title: "Empire Presidential Penthouse",
    price: "92,000",
    guests: "6 Guests",
    guestCount: 6,
    bathrooms: 4,
    squareFeet: 1800,
    category: "Penthouse",
    description: "The empire penthouse with skyline views, marble jacuzzi, and limo transfer service. The ultimate luxury experience at Aura Suites & Apartments.",
    houseRules: [
      "Check-in: 2:00 PM | Check-out: 11:00 AM",
      "No smoking inside the suite",
      "No pets allowed",
      "Quiet hours: 11:00 PM - 7:00 AM",
      "Maximum 6 guests",
    ],
    amenities: [
      "24/7 Solar & Generator Power",
      "Treated Running Water",
      "High-Speed Fiber WiFi",
      "Smart TV with Streaming",
      "Air Conditioning",
      "Daily Housekeeping",
      "Private Jacuzzi",
      "Skyline Views",
      "Limo Transfer",
      "Butler Service",
      "Concierge Service",
    ],
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    ],
    suiteType: "Presidential Penthouse",
  },
];

type SortOption = "featured" | "price-low" | "price-high";
type GuestCapacity = "any" | "2-plus" | "4-plus" | "6-plus";
type SuiteFilter = "all" | "Studio" | "1-Bedroom" | "2-Bedroom" | "3-Bedroom" | "Penthouse";

interface ApartmentShowcaseProps {
  limit?: number;
}

export default function ApartmentShowcase({ limit }: ApartmentShowcaseProps = {}) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedSuite, setSelectedSuite] = useState<SuiteType>("Deluxe Studio");
  const [selectedDetailSuite, setSelectedDetailSuite] = useState<Apartment | null>(null);

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
                        setSelectedDetailSuite(apt);
                        setIsDetailOpen(true);
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
        <SuiteDetailModal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          onReserve={() => setIsBookingOpen(true)}
          suite={selectedDetailSuite!}
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
