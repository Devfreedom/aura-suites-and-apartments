"use client";

import { MessageCircle, Calendar } from "lucide-react";
import { useState } from "react";
import BookingModal from "./BookingModal";

export default function FloatingConcierge() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        {/* WhatsApp Quick Chat Button */}
        <a
          href="https://wa.me/2348000000000?text=Hello%20Aura%20Event%20Center,%20I%20would%20like%20to%20inquire%20about%20booking%20the%20venue."
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-2xl transition-all transform hover:scale-110 group relative"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-7 h-7" />
          <span className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-navy text-white text-xs px-3 py-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-medium">
            Chat with Concierge
          </span>
        </a>

        {/* Quick Booking Trigger Button */}
        <button
          onClick={() => setIsBookingOpen(true)}
          className="w-14 h-14 rounded-full bg-gold hover:bg-[#C5A028] text-white flex items-center justify-center shadow-2xl transition-all transform hover:scale-110 group relative"
          aria-label="Book Venue"
        >
          <Calendar className="w-6 h-6" />
          <span className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-navy text-white text-xs px-3 py-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-medium">
            Book Venue
          </span>
        </button>
      </div>

      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </>
  );
}
