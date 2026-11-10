"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  ArrowLeft,
  CreditCard,
  Clock,
  Mail,
  Phone,
  MapPin,
  XCircle,
  Mail as MailIcon,
  Check as CheckIcon,
} from "lucide-react";

interface TransactionData {
  reference: string;
  status: string;
  amount: number;
  customer: { email: string };
  metadata?: {
    customer_name?: string;
    customer_phone?: string;
    suite_type?: string;
    check_in?: string;
    check_out?: string;
    guest_count?: number;
    nights?: number;
    [key: string]: unknown;
  };
}

interface VerifyPageClientProps {
  searchParams: { reference?: string };
}

export default function VerifyPageClient({ searchParams }: VerifyPageClientProps) {
  const reference = searchParams.reference;
  const router = useRouter();
  const [status, setStatus] = useState<"pending" | "success" | "error">("pending");
  const [transaction, setTransaction] = useState<TransactionData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [confirmationError, setConfirmationError] = useState<string>("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const sendConfirmationEmail = useCallback(async (tx: TransactionData) => {
    setIsSendingEmail(true);

    try {
      const meta = tx.metadata || {};
      const response = await fetch("/api/booking/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference: tx.reference,
          email: tx.customer.email,
          guestName: meta.customer_name || "Guest",
          guestPhone: meta.customer_phone || "",
          suiteName: meta.suite_type || "Suite",
          checkIn: meta.check_in || "",
          checkOut: meta.check_out || "",
          guests: meta.guest_count || 1,
          nights: meta.nights || 1,
          totalAmount: tx.amount / 100,
          address:
            process.env.NEXT_PUBLIC_HOST_ADDRESS ||
            "No. 5 Kashim Ibrahim Road, Jos, Plateau State",
          hostContact:
            process.env.NEXT_PUBLIC_HOST_CONTACT_NUMBER ||
            "+234 (0) 800 AURA STAY",
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setConfirmationSent(true);
      } else {
        setConfirmationError(data.error || "Failed to send confirmation email.");
      }
    } catch {
      setConfirmationError("Unable to send confirmation email. Please contact support.");
    } finally {
      setIsSendingEmail(false);
    }
  }, []);

  const hasVerified = useRef(false);

  useEffect(() => {
    // Guard against double-invocation (React Strict Mode in development).
    if (hasVerified.current) return;
    hasVerified.current = true;

    if (!reference) {
      setStatus("error");
      setErrorMessage(
        "No payment reference was provided. Please return to your booking to complete payment, or contact our reservations desk."
      );
      setLoading(false);
      return;
    }

    async function verifyPayment() {
      try {
        const response = await fetch(
          `/api/paystack/verify?reference=${encodeURIComponent(reference as string)}`,
          { method: "GET" }
        );
        const data = await response.json();

        if (response.ok && data.status && data.data.status === "success") {
          setStatus("success");
          setTransaction(data.data);

          // Trigger confirmation email after successful verification
          await sendConfirmationEmail(data.data);

          // Redirect to dashboard after successful payment
          setTimeout(() => {
            router.replace("/admin");
          }, 1500);
        } else {
          setStatus("error");
          setErrorMessage(data.message || "Payment verification failed.");
        }
      } catch {
        setStatus("error");
        setErrorMessage("Unable to verify payment. Please contact support.");
      } finally {
        setLoading(false);
      }
    }

    verifyPayment();
  }, [reference, sendConfirmationEmail]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex flex-col items-center justify-center py-20 selection:bg-gold selection:text-white">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
            <CreditCard className="w-8 h-8 text-gold animate-spin" />
          </div>
          <h2 className="font-serif font-bold text-2xl text-navy mb-2">
            Processing Payment…
          </h2>
          <p className="text-gray-500 text-sm">Please wait while we verify your transaction.</p>
        </div>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="min-h-screen bg-white flex flex-col items-center justify-center py-20 selection:bg-gold selection:text-white">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="font-serif font-bold text-2xl text-navy mb-2">
            Payment Verification Failed
          </h2>
          <p className="text-gray-600 mb-6">{errorMessage}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gold text-white px-8 py-3 rounded-xl font-medium hover:bg-[#C5A028] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Homepage
          </Link>
        </div>
      </main>
    );
  }

  if (status === "success" && transaction) {
    return (
      <main className="min-h-screen bg-white flex flex-col selection:bg-gold selection:text-white">
        {/* Header */}
        <header className="bg-navy py-8 border-b border-gold/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-serif font-bold text-xl text-white">AURA</span>
              <span className="text-gold text-sm font-medium tracking-wider">Suites & Apartments</span>
            </Link>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-gold" />
            </div>
            <h1 className="font-serif font-bold text-3xl sm:text-4xl text-navy mb-3">
              Payment Successful!
            </h1>
            <p className="text-gray-600 text-lg">
              Thank you for choosing Aura Suites & Apartments. Your reservation is confirmed.
            </p>
          </div>

          {/* Email Confirmation Status */}
          {confirmationError && (
            <div className="mb-8 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3">
              <MailIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Confirmation Email</p>
                <p className="text-xs">{confirmationError}</p>
              </div>
            </div>
          )}
          {!confirmationError && confirmationSent && (
            <div className="mb-8 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-3">
              <CheckIcon className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Confirmation Email Sent</p>
                <p className="text-xs">
                  A confirmation email with your booking details has been sent to{" "}
                  <span className="font-medium">{transaction.customer.email}</span>
                </p>
              </div>
            </div>
          )}
          {isSendingEmail && !confirmationSent && !confirmationError && (
            <div className="mb-8 p-4 rounded-xl bg-gold/10 border border-gold/20 text-gold/80 flex items-center gap-3">
              <MailIcon className="w-5 h-5 text-gold animate-spin flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Sending Confirmation Email…</p>
                <p className="text-xs">Please wait while we prepare your confirmation.</p>
              </div>
            </div>
          )}

          {/* Receipt Card */}
          <div className="bg-gray-50 rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-xl mb-12">
            <h2 className="font-serif font-bold text-2xl text-navy mb-6 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-gold" />
              Reservation Receipt
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-2 border-b border-gray-200 pb-4">
                <div>
                  <p className="text-sm text-gray-500 font-light">Reservation ID</p>
                  <p className="font-medium text-navy break-words">{transaction.reference}</p>
                </div>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                  CONFIRMED
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex justify-between items-center flex-wrap gap-2 border-b border-gray-200 pb-4 last:border-0">
                  <span className="text-gray-500 font-light">Guest Name</span>
                  <span className="font-medium text-navy break-words">{transaction.metadata?.customer_name || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center flex-wrap gap-2 border-b border-gray-200 pb-4 last:border-0">
                  <span className="text-gray-500 font-light">Email</span>
                  <span className="font-medium text-navy break-words">{transaction.customer.email}</span>
                </div>
                <div className="flex justify-between items-center flex-wrap gap-2 border-b border-gray-200 pb-4 last:border-0">
                  <span className="text-gray-500 font-light">Suite</span>
                  <span className="font-medium text-navy break-words">{transaction.metadata?.suite_type || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center flex-wrap gap-2 border-b border-gray-200 pb-4 last:border-0">
                  <span className="text-gray-500 font-light">Check-in</span>
                  <span className="font-medium text-navy break-words">{transaction.metadata?.check_in || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center flex-wrap gap-2 border-b border-gray-200 pb-4 last:border-0">
                  <span className="text-gray-500 font-light">Check-out</span>
                  <span className="font-medium text-navy break-words">{transaction.metadata?.check_out || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center flex-wrap gap-2 border-b border-gray-200 pb-4 last:border-0">
                  <span className="text-gray-500 font-light">Guests</span>
                  <span className="font-medium text-navy break-words">{transaction.metadata?.guest_count || "N/A"}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center flex-wrap gap-2 bg-white rounded-2xl p-4 shadow-sm">
                <div>
                  <p className="text-sm text-gray-500 font-light">Total Amount</p>
                  <p className="font-serif font-bold text-xl text-navy">
                    ₦{(transaction.amount / 100).toLocaleString()}
                  </p>
                </div>
                <span className="bg-gold text-white px-4 py-2 rounded-lg font-medium text-sm">
                  Paid via Paystack
                </span>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-navy rounded-3xl p-8 sm:p-12 text-white mb-12">
            <h3 className="font-serif font-bold text-2xl text-white mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gold" />
              Need Assistance?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3 min-w-0">
                <Phone className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-sm text-gray-300 font-light">Reservations Desk</p>
                  <p className="text-sm font-medium text-white">+234 (0) 800 AURA STAY</p>
                </div>
              </div>
              <div className="flex items-start gap-3 min-w-0">
                <Mail className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-sm text-gray-300 font-light">Email Support</p>
                  <a
                    href="mailto:reservations@aurasuitessapartments.com"
                    className="block text-sm font-medium text-white break-words"
                  >
                    reservations@<wbr />
                    aurasuitessapartments.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3 min-w-0">
                <Clock className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-sm text-gray-300 font-light">Office Hours</p>
                  <p className="text-sm font-medium text-white">Daily: 8:00 AM - 10:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-gold text-white px-10 py-4 rounded-xl font-medium hover:bg-[#C5A028] transition-all shadow-lg shadow-gold/30"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Homepage
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return null;
}
