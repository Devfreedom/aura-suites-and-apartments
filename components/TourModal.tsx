"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";

interface TourModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

const galleryImages = [
  {
    url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=2000&q=80",
    title: "Grand Banquet Hall",
    description: "Spacious main hall configured for gala banquets and presidential events.",
  },
  {
    url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=2000&q=80",
    title: "Wedding Reception Setup",
    description: "Custom table settings, crystal centerpieces, and warm ambient lighting.",
  },
  {
    url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=2000&q=80",
    title: "Conference & Stage Setup",
    description: "Ultra-HD LED screens and concert-grade audio for high-impact presentations.",
  },
  {
    url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=2000&q=80",
    title: "Evening Lighting & Ambiance",
    description: "Dynamic moving head lights and programmable color washes.",
  },
  {
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=80",
    title: "Executive VIP Suite",
    description: "Private dressing and holding lounge with luxury vanity mirrors.",
  },
];

export default function TourModal({ isOpen, onClose, initialIndex = 0 }: TourModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  if (!isOpen) return null;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-lg animate-fade-in">
      
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 py-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-3 text-white">
          <ImageIcon className="w-5 h-5 text-gold" />
          <span className="font-serif font-semibold text-lg">
            {galleryImages[currentIndex].title}
          </span>
          <span className="text-xs text-gray-400">
            ({currentIndex + 1} of {galleryImages.length})
          </span>
        </div>
        <button
          onClick={onClose}
          className="min-h-[44px] min-w-[44px] p-3 rounded-full bg-white/10 hover:bg-gold text-white flex items-center justify-center transition-colors"
          aria-label="Close Lightbox"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Image Display */}
      <div className="relative w-full h-[75vh] max-w-6xl mx-auto px-4 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-contain bg-center bg-no-repeat transition-all duration-500"
          style={{ backgroundImage: `url(${galleryImages[currentIndex].url})` }}
        />

        {/* Navigation Arrows */}
        <button
          onClick={prevImage}
          className="absolute left-4 sm:left-6 min-h-[44px] min-w-[44px] p-3 rounded-full bg-navy/80 hover:bg-gold text-white flex items-center justify-center backdrop-blur-md transition-all shadow-2xl z-20 border border-white/20"
          aria-label="Previous Image"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 sm:right-6 min-h-[44px] min-w-[44px] p-3 rounded-full bg-navy/80 hover:bg-gold text-white flex items-center justify-center backdrop-blur-md transition-all shadow-2xl z-20 border border-white/20"
          aria-label="Next Image"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>

      {/* Bottom Description & Thumbnails */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-5 sm:pt-6 pb-5 sm:pb-6 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-4 text-center">
          <p className="text-gray-300 text-sm font-light">
            {galleryImages[currentIndex].description}
          </p>

          {/* Thumbnails */}
          <div className="flex items-center justify-center gap-3 overflow-x-auto pb-2">
            {galleryImages.map((img, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex ? "border-gold scale-105 shadow-lg" : "border-white/30 opacity-60 hover:opacity-100"
                }`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${img.url})` }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
