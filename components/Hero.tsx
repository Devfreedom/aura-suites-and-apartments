"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Calendar, ArrowRight } from "lucide-react";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80",
    subtitle: "WELCOME TO AURA SUITES & APARTMENTS",
    title: "Experience Unrivaled Elegance & Comfort in Jos",
    description: "Discover Jos's premier luxury shortlet apartments and executive suites at No. 5 Kashim Ibrahim Road.",
  },
  {
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=80",
    subtitle: "EXECUTIVE & PRESIDENTIAL SUITES",
    title: "Bespoke Living for Discerning Guests",
    description: "Fully furnished deluxe studios, executive 2-bedroom suites, and presidential penthouse residences with gourmet kitchens and premium finishes.",
  },
  {
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=2000&q=80",
    subtitle: "WORLD-CLASS AMENITIES",
    title: "24/7 Power, High-Speed Fiber WiFi & Daily Housekeeping",
    description: "Uninterrupted power supply, enterprise-grade connectivity, round-the-clock security, and concierge services for a seamless stay.",
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play slider every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative h-[90vh] min-h-[600px] max-h-[900px] w-full overflow-hidden bg-navy flex items-center">
      {/* Background Slides with Dark Gradient Overlays */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-10000 ease-out"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          {/* Luxurious Dark Navy Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/80 to-navy/50" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ))}

      {/* Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl space-y-6 pt-4">
          
          {/* Subtitle Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs sm:text-sm font-semibold tracking-widest uppercase backdrop-blur-sm animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
            {slides[currentSlide].subtitle}
          </div>

          {/* Main Headline */}
          <h1 className="font-serif font-bold text-3xl sm:text-5xl lg:text-6xl xl:text-7xl text-white tracking-tight leading-[1.1] break-words">
            {slides[currentSlide].title}
          </h1>

          {/* Description */}
          <p className="text-gray-200 text-sm sm:text-base lg:text-lg font-light max-w-2xl leading-relaxed">
            {slides[currentSlide].description}
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-[#C5A028] text-white px-6 py-4 rounded-lg font-medium text-sm sm:text-base shadow-xl hover:shadow-gold/20 transition-all transform hover:-translate-y-0.5 min-h-[48px]"
            >
              <Calendar className="w-5 h-5" />
              Reserve a Suite
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/80 hover:border-gold hover:bg-gold/10 text-white px-6 py-4 rounded-lg font-medium text-sm sm:text-base backdrop-blur-sm transition-all min-h-[48px]"
            >
              Explore Apartments
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

        </div>
      </div>

      {/* Carousel Navigation Controls */}
      <div className="absolute bottom-8 right-8 z-30 hidden sm:flex items-center gap-3">
        <button
          onClick={prevSlide}
          className="w-12 h-12 rounded-full bg-navy/80 hover:bg-gold border border-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-lg min-h-[44px] min-w-[44px]"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="w-12 h-12 rounded-full bg-navy/80 hover:bg-gold border border-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-lg min-h-[44px] min-w-[44px]"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex items-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 transition-all rounded-full ${
              index === currentSlide ? "w-8 bg-gold" : "w-2 bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
