"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Loader2,
  AlertCircle,
  Calendar,
  Users,
  ChevronLeft,
  ChevronRight,
  MapPin,
  CheckCircle2,
  Phone,
  Mail,
  Clock,
  Star,
} from "lucide-react";
import type { Suite } from "@/types/suite";
import SuiteDetailsModal from "@/components/SuiteDetailsModal";
import { ToastContainer, useToast } from "@/components/ui/Toast";

interface SuiteDetailsClientProps {
  initialSuite: Suite;
}

const NAIRA_FORMATTER = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 0,
});

function formatPrice(amount: number) {
  return NAIRA_FORMATTER.format(amount);
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-NG", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function NightsBadge({ nights }: { nights: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy/10 text-navy border border-navy/20 text-sm font-medium">
      <Calendar className="w-3 h-3" />
      {nights} night{nights !== 1 ? "s" : ""}
    </span>
  );
}

function ImageGallery({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-video rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
        <BedPlaceholder />
      </div>
    );
  }

  return (
    <div className="relative aspect-video rounded-2xl overflow-hidden border border-gray-200 bg-white">
      <Image
        src={images[currentIndex]}
        alt=""
        fill
        className="object-cover transition-opacity duration-300 ease-in-out"
        sizes="(max-width: 768px) 100vw, 80vw"
        priority={currentIndex === 0}
      />

      {images.length > 1 && (
        <>
          <button
            onClick={() =>
              setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1))
            }
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-navy shadow-md hover:bg-white transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() =>
              setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1))
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-navy shadow-md hover:bg-white transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentIndex === i
                  ? "bg-navy"
                  : "bg-white/60 hover:bg-white/80"
              }`}
              aria-label={`Image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function BedPlaceholder() {
  return (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1}
        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
      />
    </svg>
  );
}

const AMENITY_ICONS: Record<string, typeof import("lucide-react").CheckCircle2> = {
  Wifi: CheckCircle2,
  "Air Conditioning": CheckCircle2,
  "Free Parking": CheckCircle2,
  Kitchen: CheckCircle2,
  "Swimming Pool": CheckCircle2,
  Gym: CheckCircle2,
  "Room Service": CheckCircle2,
  "Smart TV": CheckCircle2,
  "Mini Bar": CheckCircle2,
  "Breakfast Included": CheckCircle2,
};

function AmenityChip({ name }: { name: string }) {
  const Icon = AMENITY_ICONS[name] || CheckCircle2;
  return (
    <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50/50 text-xs font-medium text-navy">
      <Icon className="w-3 h-3" />
      {name}
    </span>
  );
}

export default function SuiteDetailsClient({
  initialSuite,
}: SuiteDetailsClientProps) {
  const suite = initialSuite;
  const { toasts, showToast, dismissToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Booking form state
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [nights, setNights] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [cleaningFee] = useState(25000); // ₦25,000 cleaning fee
  const [total, setTotal] = useState(0);
  const [isBooking, setIsBooking] = useState(false);
  // Full-screen gallery modal (opened by clicking the hero image)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // Recalculate nights and price when dates change
  useEffect(() => {
    if (!checkIn || !checkOut) {
      setNights(0);
      setSubtotal(0);
      setTotal(0);
      return;
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      setNights(diffDays);
      setSubtotal(diffDays * suite.price);
      setTotal(diffDays * suite.price + cleaningFee);
    } else {
      setNights(0);
      setSubtotal(0);
      setTotal(0);
    }
  }, [checkIn, checkOut, suite, cleaningFee]);

  const minCheckOutDate = useMemo(() => {
    if (!checkIn) return "";
    const d = new Date(checkIn);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  }, [checkIn]);

  const maxGuests = suite.guests;

  const handleBookNow = async () => {
    if (!suite) return;
    if (!checkIn || !checkOut || guests < 1) {
      showToast({
        title: "Incomplete details",
        description:
          "Please select check-in, check-out dates and guest count.",
        type: "error",
      });
      return;
    }

    setIsBooking(true);

    try {
      const reference = `AURA_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;

      const response = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "",
          amount: total * 100, // Paystack expects kobo
          reference,
          callback_url: `${window.location.origin}/booking/verify`,
          metadata: {
            customer_name: "Guest",
            customer_email: "",
            suite_type: suite.name,
            suite_id: suite.id,
            check_in: checkIn,
            check_out: checkOut,
            guest_count: guests,
            nights,
            total_amount: total,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.status || !data.authorization_url) {
        throw new Error(data.message || "Failed to initialize payment.");
      }

      window.location.href = data.authorization_url;
    } catch (error) {
      setIsBooking(false);
      showToast({
        title: "Payment initialization failed",
        description:
          error instanceof Error ? error.message : "Unknown error.",
        type: "error",
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast Container */}
      <ToastContainer />

      {loadError && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p>{loadError}</p>
        </div>
      )}

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <Link
          href="/suites"
          className="hover:text-gold transition-colors"
        >
          Suites
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-navy font-medium">{suite.name}</span>
      </nav>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left: Image Gallery (click to open full-screen modal) */}
        <div className="lg:col-span-7 space-y-6">
          <button
            type="button"
            onClick={() => setIsGalleryOpen(true)}
            aria-label="Open full gallery view"
            className="block w-full cursor-zoom-in text-left"
          >
            <ImageGallery images={suite.images} />
          </button>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {suite.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                className="w-16 h-16 rounded-xl object-cover border-2 cursor-pointer opacity-50 hover:opacity-100 transition-opacity"
              />
            ))}
          </div>
        </div>

        {/* Right: Details & Booking Card */}
        <div className="lg:col-span-5 space-y-6">
          {/* Suite Info */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              {suite.images.length > 0 && (
                <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                  Available
                </span>
              )}
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                {suite.tier}
              </span>
            </div>
            <h1 className="font-serif font-bold text-3xl text-navy mb-2 leading-tight">
              {suite.name}
            </h1>
            <p className="text-gray-500 text-sm mb-4">
              {suite.category} • {suite.guests} guest{
                suite.guests !== 1 ? "s" : ""
              } • {suite.bathrooms} bath{suite.bathrooms !== 1 ? "s" : ""}
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-navy/10 text-navy flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-navy">Location</p>
                  <p className="text-sm text-gray-500">
                    No. 5 Kashim Ibrahim Road, Jos, Plateau State
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-navy/10 text-navy flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-navy">Host Contact</p>
                  <p className="text-sm text-gray-500">+234 (0) 800 AURA STAY</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-navy/10 text-navy flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-navy">Email</p>
                  <p className="text-sm text-gray-500">
                    reservations@aurasuitessapartments.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="font-serif font-bold text-lg text-navy mb-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-gold" />
              Amenities
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {suite.amenities.map((amenity) => (
                <AmenityChip key={amenity} name={amenity} />
              ))}
              {suite.amenities.length === 0 && (
                <p className="col-span-2 text-sm text-gray-400 italic">
                  No amenities listed.
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="font-serif font-bold text-lg text-navy mb-3">
              About this suite
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {suite.description || "No description available."}
            </p>
          </div>

          {/* Booking Card */}
          <div className="rounded-3xl border border-gold/20 bg-white p-6 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gold" />

            <h3 className="font-serif font-bold text-xl text-navy mb-5">
              Book Your Stay
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-navy">
                    Check-in
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-navy outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-navy">
                    Check-out
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={minCheckOutDate}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-navy outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-navy">
                  Guests
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-sm text-navy bg-gray-50/50"
                >
                  {[...Array(maxGuests)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} guest{i + 1 !== 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Nightly rate</span>
                  <span className="text-navy font-medium">
                    {formatPrice(suite.price)}
                  </span>
                </div>
                {nights > 0 && (
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">
                      {nights} night{nights !== 1 ? "s" : ""}
                    </span>
                    <span className="text-navy font-medium">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Cleaning fee</span>
                  <span className="text-navy font-medium">
                    {formatPrice(cleaningFee)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-navy pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={handleBookNow}
                disabled={isBooking || !checkIn || !checkOut || total === 0}
                className={`w-full px-6 py-4 rounded-xl font-medium text-lg transition-all disabled:opacity-60 ${
                  total > 0 && !isBooking
                    ? "bg-navy text-white hover:bg-navy/90 shadow-md hover:shadow-lg"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {isBooking ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Processing…
                  </>
                ) : (
                  <>
                    Pay Now <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>

              {total > 0 && (
                <p className="text-xs text-gray-500 text-center">
                  You will be redirected to Paystack to complete payment.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Full-screen suite gallery modal (unified overlay styling) */}
      <SuiteDetailsModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        images={suite.images}
        suiteName={suite.name}
      />
    </div>
  );
}
