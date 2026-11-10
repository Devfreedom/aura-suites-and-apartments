"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Loader2,
  AlertCircle,
  Calendar,
  Users,
  SlidersHorizontal,
  ChevronRight,
  MapPin,
  Bed,
  Bath,
} from "lucide-react";
import { getSuites } from "@/lib/suites";
import type { Suite } from "@/types/suite";
import { ToastContainer, useToast } from "@/components/ui/Toast";

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3.5 text-sm text-navy outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/20 min-h-[44px]";

const filterPillClass = (active: boolean) =>
  active
    ? "bg-navy text-white border-navy"
    : "bg-white border-gray-200 text-gray-600 hover:border-gold hover:text-gold";

const NAIRA_FORMATTER = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 0,
});

function formatPrice(amount: number) {
  return NAIRA_FORMATTER.format(amount);
}

interface SuiteCardProps {
  suite: Suite;
}

function SuiteCard({ suite }: SuiteCardProps) {
  const firstImage = suite.images?.[0];
  const pricePerNight = suite.price;

  return (
    <Link
      href={`/suites/${suite.slug}`}
      className="group block overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-gray-300"
    >
      <div className="relative h-48 overflow-hidden">
        {firstImage ? (
          <Image
            src={firstImage}
            alt={suite.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        ) : (
          <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400">
            <Bed className="w-12 h-12" />
          </div>
        )}
        <div className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 text-navy font-medium text-xs shadow-sm border border-white/80">
          <Bed className="w-3 h-3" />
          {suite.category}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-serif font-bold text-2xl text-navy">
            {formatPrice(pricePerNight)}
          </span>
          <span className="text-sm text-gray-500">per night</span>
        </div>
        <h3 className="font-serif font-bold text-lg text-navy mb-2 leading-tight">
          {suite.name}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">
          {suite.description}
        </p>

        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 mb-4">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {suite.guests} guests
          </span>
          <span className="flex items-center gap-1">
            <Bath className="w-3 h-3" />
            {suite.bathrooms} bath
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {suite.squareFeet} sqft
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full border border-white bg-gold text-xs font-bold text-white flex items-center justify-center shadow-sm"
              >
                {i}
              </div>
            ))}
          </div>
          <button
            className="flex items-center gap-2 text-sm font-medium text-navy hover:text-gold transition-colors px-3 py-2 min-h-[40px]"
          >
            View details <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </Link>
  );
}

function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={`h-4 bg-gray-200 rounded w-full mb-2 ${className || ""}`} />
  );
}

function LoadingSuiteCard() {
  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm animate-pulse">
      <div className="h-48 bg-gray-100" />
      <div className="p-5">
        <div className="flex items-baseline gap-2 mb-1">
          <LoadingSkeleton className="h-10 w-24" />
          <LoadingSkeleton className="h-5 w-16" />
        </div>
        <LoadingSkeleton className="h-5 w-3/4" />
        <LoadingSkeleton className="h-4 w-full mb-4" />
        <div className="flex gap-2">
          <LoadingSkeleton className="h-5 w-16" />
          <LoadingSkeleton className="h-5 w-16" />
          <LoadingSkeleton className="h-5 w-16" />
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex -space-x-2">
            {[1, 2, 3].map(() => (
              <div className="w-6 h-6 rounded-full bg-gray-200" />
            ))}
          </div>
          <LoadingSkeleton className="h-5 w-24" />
        </div>
      </div>
    </div>
  );
}

export default function SuitesPage() {
  const { toasts, showToast, dismissToast } = useToast();
  const [suites, setSuites] = useState<Suite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Filter state
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 1000000,
  });
  const [guestCount, setGuestCount] = useState<number | "all">("all");
  const [amenitiesFilter, setAmenitiesFilter] = useState<string[]>([]);

  const loadSuites = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const data = await getSuites();
      setSuites(data);
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : "Failed to load suites."
      );
      showToast({
        title: "Failed to load suites",
        description:
          error instanceof Error ? error.message : "Unknown error.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    void loadSuites();
  }, [loadSuites]);

  // Extract all unique amenities from loaded suites
  const allAmenities = useMemo(() => {
    const set = new Set<string>();
    suites.forEach((s) => s.amenities.forEach((a) => set.add(a)));
    return Array.from(set).sort();
  }, [suites]);

  // Filtered suites
  const filteredSuites = useMemo(() => {
    return suites.filter((suite) => {
      const matchPrice =
        suite.price >= priceRange.min && suite.price <= priceRange.max;
      const matchGuests =
        guestCount === "all" || suite.guests >= Number(guestCount);
      const matchAmenities =
        amenitiesFilter.length === 0 ||
        amenitiesFilter.every((a) => suite.amenities.includes(a));
      return matchPrice && matchGuests && matchAmenities;
    });
  }, [suites, priceRange, guestCount, amenitiesFilter]);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="font-serif font-bold text-3xl text-navy">
            Explore Our Suites
          </h1>
          <p className="text-gray-600 mt-2">
            Discover luxury accommodations in Jos, Plateau State
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <LoadingSuiteCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="font-serif font-bold text-3xl text-navy">
            Explore Our Suites
          </h1>
        </div>
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p>{loadError}</p>
        </div>
      </div>
    );
  }

  // Mock fallback data if no suites exist
  const displaySuites = filteredSuites.length > 0 ? filteredSuites : [];

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

      {/* Page Header */}
      <div>
        <h1 className="font-serif font-bold text-3xl text-navy">
          Explore Our Suites
        </h1>
        <p className="text-gray-600 mt-2">
          Discover luxury accommodations in Jos, Plateau State
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
          <div className="flex-1 lg:flex-none">
            <label className="block text-sm font-medium text-navy mb-3">
              Price Range (per night)
            </label>
            <div className="flex gap-3">
              <input
                type="number"
                placeholder="Min"
                value={priceRange.min === 0 ? "" : priceRange.min}
                onChange={(e) =>
                  setPriceRange({
                    ...priceRange,
                    min: Number(e.target.value) || 0,
                  })
                }
                className={inputClass}
              />
              <input
                type="number"
                placeholder="Max"
                value={priceRange.max === 1000000 ? "" : priceRange.max}
                onChange={(e) =>
                  setPriceRange({
                    ...priceRange,
                    max: Number(e.target.value) || 1000000,
                  })
                }
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex-1 lg:flex-none">
            <label className="block text-sm font-medium text-navy mb-2">
              Guests
            </label>
            <div className="flex gap-2">
              {(["all", 1, 2, 3, 4, 6] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGuestCount(g)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors min-h-[40px] ${
                    filterPillClass(guestCount === g)
                  }`}
                >
                  {g === "all" ? "All" : g + " guests"}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 lg:flex-none">
            <label className="block text-sm font-medium text-navy mb-2">
              Amenities
            </label>
            <div className="flex flex-wrap gap-2">
              {allAmenities.map((amenity) => (
                <button
                  key={amenity}
                  onClick={() => {
                    if (amenitiesFilter.includes(amenity)) {
                      setAmenitiesFilter(
                        amenitiesFilter.filter((a) => a !== amenity)
                      );
                    } else {
                      setAmenitiesFilter([...amenitiesFilter, amenity]);
                    }
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors min-h-[40px] ${
                    filterPillClass(amenitiesFilter.includes(amenity))
                  }`}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {displaySuites.length} suite{
            displaySuites.length !== 1 ? "s" : ""
          } found
        </p>
      </div>

      {/* Suite Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displaySuites.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="w-16 h-16 rounded-full bg-gold/10 text-gold flex items-center justify-center mb-4">
              <SlidersHorizontal className="w-8 h-8" />
            </div>
            <h3 className="font-serif font-bold text-lg text-navy">
              No suites found
            </h3>
            <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
              Try adjusting your filters, or there are no suites available yet.
            </p>
          </div>
        ) : (
          displaySuites.map((suite) => (
            <SuiteCard key={suite.id} suite={suite} />
          ))
        )}
      </div>
    </div>
  );
}
