"use client";

import { useState, useEffect } from "react";
import { X, Calendar, CheckCircle, ArrowRight, ArrowLeft, Sparkles, Home, Users, ChevronDown } from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SuiteType = "Executive Studio" | "2-Bedroom Luxury Suite" | "Penthouse Suite";

const suiteOptions: { type: SuiteType; price: number; maxGuests: number; description: string }[] = [
  { type: "Executive Studio", price: 65000, maxGuests: 2, description: "King bed, kitchenette, perfect for solo/couple" },
  { type: "2-Bedroom Luxury Suite", price: 120000, maxGuests: 4, description: "Master king + guest queen, full kitchen, living area" },
  { type: "Penthouse Suite", price: 250000, maxGuests: 6, description: "3 bedrooms, rooftop terrace, butler service, chef's kitchen" },
];

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [suiteType, setSuiteType] = useState<SuiteType>("Executive Studio");
  const [guestCount, setGuestCount] = useState(2);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    notes: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Calculate nights and total price
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = end.getTime() - start.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights();
  const selectedSuite = suiteOptions.find(s => s.type === suiteType);
  const nightlyRate = selectedSuite?.price || 65000;
  const totalPrice = nights > 0 ? nightlyRate * nights : 0;

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setIsSubmitted(false);
      setCheckIn("");
      setCheckOut("");
      setSuiteType("Executive Studio");
      setGuestCount(2);
      setFormData({ fullName: "", phone: "", email: "", notes: "" });
    }
  }, [isOpen]);

  // Set min dates for check-in/check-out
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const resetAndClose = () => {
    setStep(1);
    setIsSubmitted(false);
    setCheckIn("");
    setCheckOut("");
    setSuiteType("Executive Studio");
    setGuestCount(2);
    setFormData({ fullName: "", phone: "", email: "", notes: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gold/30">
        
        {/* Modal Header */}
        <div className="bg-navy px-8 py-6 text-white flex items-center justify-between relative">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-gold/20 to-transparent pointer-events-none" />
          <div className="space-y-1 relative z-10">
            <span className="text-gold uppercase tracking-widest text-[10px] font-semibold">
              Aura Apartments
            </span>
            <h3 className="font-serif font-bold text-2xl">
              {isSubmitted ? "Reservation Confirmed" : "Reserve Your Luxury Suite"}
            </h3>
          </div>
          <button
            onClick={resetAndClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-gold text-white flex items-center justify-center transition-colors relative z-10"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-8">
          {isSubmitted ? (
            <div className="text-center py-12 space-y-6">
              <div className="w-20 h-20 bg-gold/20 text-gold rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-10 h-10 text-gold" />
              </div>
              <div className="space-y-2">
                <h4 className="font-serif font-bold text-3xl text-navy">
                  Inquiry Received Successfully!
                </h4>
                <p className="text-gray-600 max-w-md mx-auto text-sm">
                  Thank you, <span className="font-semibold text-navy">{formData.fullName}</span>. Our concierge team has received your reservation request for <span className="font-semibold text-navy">{suiteType}</span> from <span className="font-semibold text-navy">{checkIn}</span> to <span className="font-semibold text-navy">{checkOut}</span> ({nights} night{nights !== 1 ? "s" : ""}). We will contact you within 2 hours to confirm.
                </p>
              </div>
              <div className="pt-4">
                <button
                  onClick={resetAndClose}
                  className="bg-gold hover:bg-[#C5A028] text-white px-8 py-3.5 rounded-xl font-medium shadow-lg transition-all"
                >
                  Return to Homepage
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Step Indicators */}
              <div className="flex items-center justify-between mb-8 px-2">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                        step === s
                          ? "bg-gold text-white shadow-md ring-4 ring-gold/20"
                          : step > s
                          ? "bg-navy text-gold"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {step > s ? "✓" : s}
                    </div>
                    <span
                      className={`text-xs font-medium hidden sm:inline ${
                        step === s ? "text-navy font-bold" : "text-gray-400"
                      }`}
                    >
                      {s === 1 ? "Dates & Suite" : s === 2 ? "Guests & Summary" : "Contact Details"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Step 1: Check-in/Check-out & Suite Selection */}
              {step === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-navy">
                        Check-in Date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          required
                          min={today}
                          value={checkIn}
                          onChange={(e) => {
                            setCheckIn(e.target.value);
                            // Auto-set check-out to next day if not set or before check-in
                            if (!checkOut || e.target.value >= checkOut) {
                              const nextDay = new Date(e.target.value);
                              nextDay.setDate(nextDay.getDate() + 1);
                              setCheckOut(nextDay.toISOString().split("T")[0]);
                            }
                          }}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-navy bg-gray-50/50"
                        />
                        <Calendar className="absolute right-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-navy">
                        Check-out Date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          required
                          min={checkIn || tomorrow}
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-navy bg-gray-50/50"
                        />
                        <Calendar className="absolute right-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {nights > 0 && (
                    <div className="bg-gold/10 border border-gold/30 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-gold" />
                        <span className="font-medium text-navy">
                          {nights} night{nights !== 1 ? "s" : ""} stay
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-navy">
                      Select Suite Type
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      {suiteOptions.map((suite) => (
                        <button
                          key={suite.type}
                          type="button"
                          onClick={() => {
                            setSuiteType(suite.type);
                            // Adjust guest count to max if current exceeds new suite's max
                            if (guestCount > suite.maxGuests) {
                              setGuestCount(suite.maxGuests);
                            }
                          }}
                          className={`p-4 rounded-xl border text-left transition-all ${
                            suiteType === suite.type
                              ? "bg-navy text-white border-navy shadow-md"
                              : "border-gray-200 hover:border-gold bg-gray-50"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-lg">{suiteType === suite.type ? "text-white" : "text-navy"}">{suite.type}</span>
                                <span className="text-sm font-bold text-gold">₦{suite.price.toLocaleString()}/night</span>
                              </div>
                              <p className="text-sm text-gray-600">{suite.description}</p>
                            </div>
                            {suiteType === suite.type && (
                              <CheckCircle className="w-5 h-5 text-gold flex-shrink-0" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      disabled={!checkIn || !checkOut}
                      className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-medium text-white transition-all shadow-md ${
                        checkIn && checkOut ? "bg-gold hover:bg-[#C5A028]" : "bg-gray-300 cursor-not-allowed"
                      }`}
                    >
                      Next: Guests & Summary
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Guest Count & Summary */}
              {step === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-navy">
                      Number of Guests
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-2 bg-gray-50">
                        <button
                          type="button"
                          onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                          disabled={guestCount <= 1}
                          className="text-navy hover:text-gold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronDown className="w-5 h-5" />
                        </button>
                        <span className="text-xl font-bold text-navy w-12 text-center">{guestCount}</span>
                        <button
                          type="button"
                          onClick={() => setGuestCount(Math.min(selectedSuite?.maxGuests || 6, guestCount + 1))}
                          disabled={guestCount >= (selectedSuite?.maxGuests || 6)}
                          className="text-navy hover:text-gold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronDown className="w-5 h-5 rotate-180" />
                        </button>
                      </div>
                      <span className="text-sm text-gray-500">
                        Max {selectedSuite?.maxGuests || 6} guests for {suiteType}
                      </span>
                    </div>
                  </div>

                  {/* Summary Card */}
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 space-y-3">
                    <div className="flex justify-between font-semibold text-navy border-b border-gray-200 pb-3">
                      <span>Reservation Summary</span>
                      <span className="text-gold">Aura Apartments</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span className="flex items-center gap-2"><Home className="w-4 h-4" /> Suite:</span>
                      <span className="font-medium text-navy">{suiteType}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Check-in:</span>
                      <span className="font-medium text-navy">{checkIn}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Check-out:</span>
                      <span className="font-medium text-navy">{checkOut}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Nights:</span>
                      <span className="font-medium text-navy">{nights} night{nights !== 1 ? "s" : ""}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Guests:</span>
                      <span className="font-medium text-navy">{guestCount}</span>
                    </div>
                    <div className="flex justify-between font-bold text-navy pt-3 border-t border-gray-200 text-lg">
                      <span>Nightly Rate:</span>
                      <span className="text-gold">₦{nightlyRate.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-navy text-lg">
                      <span>Total Stay:</span>
                      <span className="text-gold text-xl">₦{totalPrice.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                      Includes: Daily housekeeping, 24/7 power & security, high-speed fiber WiFi, concierge service
                    </p>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-gray-200 hover:border-navy text-navy font-medium transition-all"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-medium text-white bg-gold hover:bg-[#C5A028] shadow-md transition-all"
                    >
                      Next: Contact Details
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Contact Details */}
              {step === 3 && (
                <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-2 text-xs">
                    <div className="flex justify-between font-semibold text-navy border-b border-gray-200 pb-2">
                      <span>Final Summary</span>
                      <span className="text-gold">Aura Apartments</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>{suiteType}</span>
                      <span className="font-medium text-navy">{nights} night{nights !== 1 ? "s" : ""} • {guestCount} guest{guestCount !== 1 ? "s" : ""}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>{checkIn} → {checkOut}</span>
                      <span className="font-medium text-navy">₦{nightlyRate.toLocaleString()}/night</span>
                    </div>
                    <div className="flex justify-between font-bold text-navy pt-2 border-t border-gray-200 text-sm">
                      <span>Total:</span>
                      <span className="text-gold">₦{totalPrice.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-navy">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Dr. Terhemba"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-sm text-navy bg-gray-50/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-navy">Phone Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="+234 803 000 0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-sm text-navy bg-gray-50/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-navy">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="terhemba@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-sm text-navy bg-gray-50/50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-navy">Special Requests or Notes</label>
                    <textarea
                      rows={2}
                      placeholder="Airport pickup, early check-in, dietary requirements..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-sm text-navy bg-gray-50/50 resize-none"
                    />
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 hover:border-navy text-navy font-medium text-sm transition-all"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-8 py-3 rounded-xl font-medium text-white bg-gold hover:bg-[#C5A028] shadow-lg transition-all"
                    >
                      <Sparkles className="w-4 h-4" />
                      Submit Reservation Request
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
