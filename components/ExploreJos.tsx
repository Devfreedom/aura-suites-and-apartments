"use client";

import { useState } from "react";
import SafeImage from "@/components/ui/SafeImage";
import {
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Sparkles,
} from "lucide-react";

interface Landmark {
  id: number;
  name: string;
  description: string;
  distance: string;
  travelTime: string;
  image: string;
  category: string;
}

const landmarks: Landmark[] = [
  {
    id: 1,
    name: "Rayfield Golf Club",
    description:
      "One of West Africa's premier golf destinations, featuring an 18-hole championship course set amidst Jos's scenic highland terrain with cool climate and lush fairways.",
    distance: "4.2 km",
    travelTime: "12 min drive",
    image:
      "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=800&q=80",
    category: "Golf & Leisure",
  },
  {
    id: 2,
    name: "Jos Wildlife Park",
    description:
      "A sprawling savanna sanctuary home to lions, antelopes, ostriches, and native Nigerian wildlife. Perfect for nature walks, photography, and family outings in the heart of Plateau State.",
    distance: "6.8 km",
    travelTime: "18 min drive",
    image:
      "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=800&q=80",
    category: "Nature & Wildlife",
  },
  {
    id: 3,
    name: "Riyom Rock Formations",
    description:
      "Spectacular natural rock pillars and balancing stones rising dramatically from the landscape. A geological wonder and iconic landmark of Jos offering breathtaking views and hiking adventures.",
    distance: "25 km",
    travelTime: "45 min drive",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    category: "Adventure & Geology",
  },
  {
    id: 4,
    name: "Ten Commandment Monument",
    description:
      "A towering spiritual landmark featuring the Ten Commandments inscribed on stone tablets, surrounded by peaceful gardens. A place of reflection and cultural significance in Jos.",
    distance: "3.1 km",
    travelTime: "9 min drive",
    image:
      "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=800&q=80",
    category: "Culture & Heritage",
  },
];

const WHATSAPP_NUMBER = "234800AURASTAY";

export default function ExploreJos() {
  const [isDispatchOpen, setIsDispatchOpen] = useState(false);
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(null);

  const dispatchWhatsApp = (landmark: Landmark) => {
    const message = encodeURIComponent(
      `Hello Aura Suites & Apartments Concierge,\n\nI would like to book a chauffeur ride to:\n\n📍 ${landmark.name}\n📏 Distance: ${landmark.distance}\n⏱️ Estimated travel time: ${landmark.travelTime}\n\nPlease confirm availability and pickup time. Thank you!`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
  };

  return (
    <section className="py-12 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold/10 text-gold text-xs font-semibold tracking-widest uppercase">
            <Sparkles className="w-4 h-4 text-gold" />
            Local Concierge
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-navy tracking-tight">
            Explore Jos & Plateau State
          </h2>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed font-light">
            Discover the beauty of Jos from Aura Suites & Apartments. Our concierge team arranges seamless chauffeur-driven excursions to the city&apos;s finest landmarks and natural wonders.
          </p>
        </div>

        {/* Landmarks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {landmarks.map((landmark) => (
            <div
              key={landmark.id}
              className="group relative bg-white border border-navy/20 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="relative w-full h-48 overflow-hidden">
                {/* Dark overlay for badge legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <SafeImage
                  src={landmark.image}
                  alt={landmark.name}
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={landmark.id === 1}
                />
                <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-navy text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                  {landmark.category}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-end p-4">
                  <button
                    onClick={() => {
                      setSelectedLandmark(landmark);
                      setIsDispatchOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gold text-white font-medium hover:bg-[#C5A028] transition-all shadow-lg"
                  >
                    <Phone className="w-4 h-4" />
                    Book Chauffeur
                  </button>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-serif font-bold text-lg text-navy mb-2">
                  {landmark.name}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed font-light mb-4 flex-1">
                  {landmark.description}
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm mt-auto">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gold shrink-0" />
                    <span className="text-navy font-medium">{landmark.distance}</span>
                  </div>
                  <div className="flex items-center gap-2 text-right">
                    <Clock className="w-4 h-4 text-gold shrink-0" />
                    <span className="text-navy font-medium">{landmark.travelTime}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dispatch Info Banner */}
        <div className="mt-12 bg-navy rounded-3xl p-8 sm:p-12 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="flex items-center gap-3">
              <Phone className="w-6 h-6 text-gold shrink-0" />
              <div>
                <p className="text-sm text-gray-300 font-light">Chauffeur Desk</p>
                <p className="font-medium text-white">+234 (0) 800 AURA STAY</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MessageCircle className="w-6 h-6 text-gold shrink-0" />
              <div>
                <p className="text-sm text-gray-300 font-light">WhatsApp Booking</p>
                <p className="font-medium text-white">Scan or tap to message</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-gold shrink-0" />
              <div>
                <p className="text-sm text-gray-300 font-light">Service Hours</p>
                <p className="font-medium text-white">Daily: 6:00 AM - 10:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dispatch Confirmation Modal */}
        {isDispatchOpen && selectedLandmark && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gold/30">
              <div className="bg-navy px-8 py-6 text-white">
                <h3 className="font-serif font-bold text-xl text-white">
                  Chauffeur Ride Request
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Destination</p>
                  <p className="font-medium text-navy">{selectedLandmark.name}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Distance</p>
                  <p className="font-medium text-navy">{selectedLandmark.distance}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Estimated Travel Time</p>
                  <p className="font-medium text-navy">{selectedLandmark.travelTime}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      dispatchWhatsApp(selectedLandmark);
                      setIsDispatchOpen(false);
                    }}
                    className="flex-1 bg-gold text-white py-3 rounded-xl font-medium hover:bg-[#C5A028] transition-all"
                  >
                    Send via WhatsApp
                  </button>
                  <button
                    onClick={() => setIsDispatchOpen(false)}
                    className="flex-1 bg-gray-100 text-navy py-3 rounded-xl font-medium hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}