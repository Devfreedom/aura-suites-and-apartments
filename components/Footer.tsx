"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock, Calendar } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-navy text-white pt-20 pb-12 border-t border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-white/10">
          
          {/* Brand & Bio */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/aura_horizontal_logo.png"
                alt="Aura Event Center"
                width={180}
                height={48}
                className="h-10 w-auto object-contain filter brightness-0 invert"
              />
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed font-light">
              Makurdi&apos;s premier luxury shortlet destination, offering fully furnished executive suites, 24/7 power & security, high-speed fiber WiFi, and impeccable hospitality for discerning travelers.
            </p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-gold hover:bg-[#C5A028] text-white px-5 py-2.5 rounded-md font-medium text-xs tracking-wider uppercase transition-colors shadow-md"
              >
                <Calendar className="w-3.5 h-3.5" />
                Reserve Suite Now
              </Link>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-lg text-gold tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>
                <Link href="/" className="hover:text-gold transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gold transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-gold transition-colors">Pricing & Packages</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold transition-colors">Contact & Location</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-lg text-gold tracking-wide">
              Contact Us
            </h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <span>No. 5 Kashim Ibrahim Road, Makurdi, Benue State</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <span>+234 (0) 800 AURA STAY</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <span>reservations@auraapartments.com</span>
              </li>
            </ul>
          </div>

          {/* Office Hours */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-lg text-gold tracking-wide">
              Office & Tours
            </h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Reservations Desk</p>
                  <p className="text-gray-400">Daily: 8:00 AM - 10:00 PM</p>
                </div>
              </li>
              <li className="pt-2">
                <p className="text-xs text-gray-400 font-light italic">
                  24/7 Self Check-in Available • Concierge On-Call
                </p>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© 2026 Aura Apartments. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-gold transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gold transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-gold transition-colors cursor-pointer">Booking Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
