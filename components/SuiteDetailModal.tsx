"use client";

import { useState } from "react";
import Image from "next/image";
import {
  X,
  Calendar,
  Users,
  BedDouble,
  Zap,
  Wifi,
  Utensils,
  Droplets,
  ShieldCheck,
  Sparkles,
  MapPin,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

interface SuiteDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  suite: {
    id: number;
    tier: string;
    title: string;
    price: string;
    guests: string;
    guestCount: number;
    bathrooms: number;
    squareFeet: number;
    category: string;
    description: string;
    houseRules: string[];
    amenities: string[];
    image: string;
    gallery: string[];
    suiteType: string;
  };
}

const DEFAULT_AMENITIES = [
  "24/7 Solar & Generator Power",
  "Treated Running Water",
  "High-Speed Fiber WiFi",
  "Smart TV with Streaming",
  "Air Conditioning",
  "Daily Housekeeping",
  "Kitchenette / Kitchen",
  "Concierge Service",
];

const categoryColors: Record<string, string> = {
  Studio: "bg-emerald-100 text-emerald-700",
  "1-Bedroom": "bg-blue-100 text-blue-700",
  "2-Bedroom": "bg-purple-100 text-purple-700",
  "3-Bedroom": "bg-amber-100 text-amber-700",
  Penthouse: "bg-navy text-gold",
};

export default function SuiteDetailModal({
  isOpen,
  onClose,
  suite,
}: SuiteDetailModalProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const handleReserve = () => {
    setIsDetailOpen(false);
    setIsBookingOpen(true);
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in ${
          !isOpen ? "hidden" : ""
        }`}
      >
        <div className="relative w-full max-w-6xl bg-white rounded-4xl overflow-hidden border border-gold/30 shadow-2xl max-h-[95vh] flex flex-col">
          {/* Modal Header */}
          <div className="bg-navy px-8 py-6 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex flex-col gap-2">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${categoryColors[suite.category]} text-xs font-bold uppercase tracking-wider shadow-sm`}>
                {suite.category}
              </div>
              <h1 className="font-serif font-bold text-3xl sm:text-4xl text-white tracking-tight">
                {suite.title}
              </h1>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif font-bold text-2xl text-gold">
                  ₦{suite.price}
                </span>
                <span className="text-sm text-gray-300 font-light">/ night</span>
              </div>
            </div>
          </div>

          {/* Gallery */}
          <div className="relative h-[400px]">
            <div className="relative h-full overflow-hidden bg-gray-100">
              <Image
                src={suite.gallery[activeImage] || suite.image}
                alt={suite.title}
                fill
                className="object-cover transition-opacity duration-300 ease-in-out"
                priority
              />
              {/* Thumbnails */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {suite.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-10 h-10 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === idx
                        ? "border-gold"
                        : "border-white/60 hover:border-gold"
                    }`}
                  >
                    <img
                      src={img}
                      alt={suite.title}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12 overflow-y-auto max-h-[calc(95vh-240px)]">
            {/* Specs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
                <div className="w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center mx-auto mb-3">
                  <Users className="w-5 h-5" />
                </div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Guests
                </p>
                <p className="font-serif font-bold text-lg text-navy">
                  {suite.guestCount}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
                <div className="w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center mx-auto mb-3">
                  <BedDouble className="w-5 h-5" />
                </div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Bedrooms
                </p>
                <p className="font-serif font-bold text-lg text-navy">
                  {suite.category === "Studio" ? "Studio" : suite.category}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
                <div className="w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Bathrooms
                </p>
                <p className="font-serif font-bold text-lg text-navy">
                  {suite.bathrooms}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
                <div className="w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center mx-auto mb-3">
                  <MapPin className="w-5 h-5" />
                </div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Size
                </p>
                <p className="font-serif font-bold text-lg text-navy">
                  {suite.squareFeet.toLocaleString()} sq ft
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="font-serif font-bold text-xl text-navy mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold" />
                About This Suite
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed font-light">
                {suite.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="mb-8">
              <h3 className="font-serif font-bold text-xl text-navy mb-4 flex items-center gap-2">
                <Droplets className="w-5 h-5 text-gold" />
                Suite Amenities
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suite.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-xl border border-navy/20 bg-gray-50 hover:border-gold/50 hover:bg-navy/5 transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gold/10 text-gold flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-navy">
                      {amenity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* House Rules */}
            <div className="mb-8">
              <h3 className="font-serif font-bold text-xl text-navy mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-navy" />
                House Rules & Policies
              </h3>
              <div className="space-y-3">
                {suite.houseRules.map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gold/10 text-gold flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-sm text-gray-600 font-light leading-relaxed">
                      {rule}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Action Bar */}
          <div className="bg-white border-t border-navy/20 p-6 md:p-8 sticky bottom-0 z-10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Stay Price</p>
                <p className="font-serif font-bold text-2xl text-navy">
                  ₦{suite.price} / night
                </p>
              </div>
              <button
                onClick={handleReserve}
                className="flex-1 bg-gold text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#C5A028] transition-all shadow-lg shadow-gold/30 flex items-center justify-center gap-2"
              >
                <ArrowRight className="w-5 h-5" />
                Reserve This Suite Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed inset-0 z-50 hidden"></div>
    </>
  );
}