"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Loader2,
  AlertCircle,
  Calendar,
  Users,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Mail,
  Phone,
  ArrowRight,
  X,
} from "lucide-react";
import { getSuiteById } from "@/lib/suites";
import type { Suite } from "@/types/suite";
import { ToastContainer, useToast } from "@/components/ui/Toast";

interface CheckoutFormProps {
  user: { id: string; email?: string };
  suiteId: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  total: string;
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

export default function CheckoutForm({
  user,
  suiteId,
  checkIn,
  checkOut,
  guests,
  total,
}: CheckoutFormProps) {
  const { toasts, showToast, dismissToast } = useToast();
  const [suite, setSuite] = useState<Suite | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const loadSuite = useCallback(async () => {
    if (!suiteId) {
      setLoadError("No suite selected.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const data = await getSuiteById(suiteId);
      setSuite(data ?? null);
      if (!data) {
        setLoadError("Suite not found.");
      }
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : "Failed to load suite."
      );
    } finally {
      setIsLoading(false);
    }
  }, [suiteId]);

  useEffect(() => {
    void loadSuite();
  }, [loadSuite]);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, [checkIn, checkOut]);

  const totalAmount = useMemo(() => {
    const parsed = Number(total);
    return Number.isFinite(parsed) ? parsed : 0;
  }, [total]);

  const guestCount = useMemo(() => {
    const parsed = Number(guests);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
  }, [guests]);

  const cleaningFee = 25000;
  const subtotal = useMemo(() => {
    if (!suite) return 0;
    return nights * suite.price;
  }, [nights, suite]);

  const handlePayNow = async () => {
    if (!suite) {
      showToast({
        title: "Suite not available",
        description: "Please select a valid suite.",
        type: "error",
      });
      return;
    }

    setIsProcessing(true);
    setPaymentStatus("processing");
    setPaymentError(null);

    try {
      const reference = `AURA_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;

      const response = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email || "",
          amount: Math.round(totalAmount * 100), // kobo
          reference,
          callback_url: `${window.location.origin}/booking/verify`,
          metadata: {
            customer_name: user.email?.split("@")[0] || "Guest",
            customer_email: user.email || "",
            suite_type: suite.name,
            suite_id: suite.id,
            user_id: user.id,
            check_in: checkIn,
            check_out: checkOut,
            guest_count: guestCount,
            nights,
            total_amount: totalAmount,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.status || !data.authorization_url) {
        throw new Error(data.message || "Failed to initialize payment.");
      }

      // Redirect to Paystack authorization URL
      window.location.href = data.authorization_url;
    } catch (error) {
      setIsProcessing(false);
      setPaymentStatus("error");
      setPaymentError(
        error instanceof Error ? error.message : "Payment initialization failed."
      );
      showToast({
        title: "Payment failed",
        description: paymentError || "Unable to initialize payment.",
        type: "error",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin mb-2" />
        <p className="text-sm">Loading checkout details…</p>
      </div>
    );
  }

  if (loadError || !suite) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-6">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="font-serif font-bold text-lg text-navy">
          {loadError || "Unable to load checkout"}
        </h3>
        <Link
          href="/suites"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-navy hover:text-gold transition-colors"
        >
          <ArrowRight className="w-3 h-3" />
          Browse suites
        </Link>
      </div>
    );
  }

  // Payment success state
  if (paymentStatus === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-6">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="font-serif font-bold text-lg text-navy">
          Payment Successful!
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Your booking has been confirmed. Redirecting to dashboard…
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-xl font-medium hover:bg-navy/90 transition-all"
          >
            Go to Dashboard <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Toast Container */}
      <ToastContainer />

      {paymentError && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p>{paymentError}</p>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-3xl text-navy">
            Checkout
          </h1>
          <p className="text-gray-600 mt-2">
            Complete your reservation for {suite.name}
          </p>
        </div>
        <Link
          href={`/suites/${suite.slug}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-navy hover:text-gold transition-colors"
        >
          <ArrowRight className="w-3 h-3" />
          Back to suite
        </Link>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left: Booking Review */}
        <div className="lg:col-span-8 space-y-6">
          {/* Suite Summary */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm overflow-hidden">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-gray-200">
                {suite.images?.[0] ? (
                  <Image
                    src={suite.images[0]}
                    alt={suite.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <BedIcon />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-serif font-bold text-lg text-navy leading-tight">
                  {suite.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {suite.category} • {suite.guests} guests
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4 border-t border-gray-200 pt-4">
              <div className="text-center">
                <p className="text-xs text-gray-400 uppercase font-medium">
                  Check-in
                </p>
                <p className="font-medium text-navy">
                  {formatDate(checkIn || "—")}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400 uppercase font-medium">
                  Check-out
                </p>
                <p className="font-medium text-navy">
                  {formatDate(checkOut || "—")}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400 uppercase font-medium">
                  Guests
                </p>
                <p className="font-medium text-navy">{guestCount}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400 uppercase font-medium">
                  Nights
                </p>
                <p className="font-medium text-navy">{nights}</p>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="font-serif font-bold text-lg text-navy mb-4">
              Price Breakdown
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  Nightly rate × {nights}
                </span>
                <span className="text-navy font-medium">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Cleaning fee</span>
                <span className="text-navy font-medium">
                  {formatPrice(cleaningFee)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-navy pt-3 border-t border-gray-100">
                <span>Total</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Guest Details */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="font-serif font-bold text-lg text-navy mb-4">
              Guest Details
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-navy/10 text-navy flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-navy">
                    {user.email || "No email"}
                  </p>
                  <p className="text-xs text-gray-500">Account email</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-navy/10 text-navy flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-navy">+234 ___ ___ ____</p>
                  <p className="text-xs text-gray-500">Phone number</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Payment Card */}
        <div className="lg:col-span-4">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sticky top-24">
            <h3 className="font-serif font-bold text-lg text-navy mb-6">
              Payment
            </h3>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center">
                    <CreditCardIcon />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-navy">
                      Paystack Secure Payment
                    </p>
                    <p className="text-xs text-gray-500">
                      Encrypted transaction
                    </p>
                  </div>
                </div>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Secure
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-navy/10 text-navy flex items-center justify-center">
                    <ShieldIcon />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-navy">
                      Buyer Protection
                    </p>
                    <p className="text-xs text-gray-500">
                      Your payment is protected
                    </p>
                  </div>
                </div>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Protected
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Amount to pay
                </p>
                <p className="font-serif font-bold text-2xl text-navy">
                  {formatPrice(totalAmount)}
                </p>
              </div>

              <button
                onClick={handlePayNow}
                disabled={isProcessing || totalAmount <= 0}
                className={`w-full px-6 py-4 rounded-xl font-semibold text-lg transition-all disabled:opacity-60 ${
                  totalAmount > 0 && !isProcessing
                    ? "bg-navy text-white hover:bg-navy/90 shadow-md hover:shadow-lg"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Processing…
                  </>
                ) : (
                  <>
                    Pay with Paystack <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                You'll be redirected to Paystack to complete payment securely.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BedIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1}
        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
      />
    </svg>
  );
}

function CreditCardIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1}
        d="M3 10h18a2 2 0 012 2v8a2 2 0 01-2 2H3a2 2 0 01-2-2v-8a2 2 0 012-2zM3 10h18"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  );
}
