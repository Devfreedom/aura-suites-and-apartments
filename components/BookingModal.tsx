"use client";

import { useState } from "react";
import { X, Calendar, CheckCircle, ArrowRight, ArrowLeft, Shield, Sparkles } from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [eventType, setEventType] = useState("Wedding Reception");
  const [eventDate, setEventDate] = useState("");
  const [guestCount, setGuestCount] = useState("500");
  const [addons, setAddons] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    notes: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleAddonChange = (addon: string) => {
    if (addons.includes(addon)) {
      setAddons(addons.filter((a) => a !== addon));
    } else {
      setAddons([...addons, addon]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const resetAndClose = () => {
    setStep(1);
    setIsSubmitted(false);
    setAddons([]);
    setFormData({ fullName: "", phone: "", email: "", notes: "" });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gold/30">
        
        {/* Modal Header */}
        <div className="bg-navy px-8 py-6 text-white flex items-center justify-between relative">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-gold/20 to-transparent pointer-events-none" />
          <div className="space-y-1 relative z-10">
            <span className="text-gold uppercase tracking-widest text-[10px] font-semibold">
              Aura Event Center
            </span>
            <h3 className="font-serif font-bold text-2xl">
              {isSubmitted ? "Reservation Confirmed" : "Secure Your Event Date"}
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
                  Thank you, <span className="font-semibold text-navy">{formData.fullName}</span>. Our concierge team has received your request for <span className="font-semibold text-navy">{eventType}</span> on <span className="font-semibold text-navy">{eventDate || "Selected Date"}</span>. We will contact you within 2 hours.
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
                      {s === 1 ? "Event Details" : s === 2 ? "Add-ons & Capacity" : "Contact & Summary"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Step 1: Event Type & Date */}
              {step === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-navy">
                      Select Event Type
                    </label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-navy bg-gray-50/50"
                    >
                      <option value="Wedding Reception">Wedding Reception</option>
                      <option value="Corporate Conference">Corporate Conference & Summit</option>
                      <option value="Gala & Awards Night">Gala & Awards Night</option>
                      <option value="Birthday Celebration">Luxury Birthday Celebration</option>
                      <option value="Religious / Cultural Event">Religious / Cultural Event</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-navy">
                      Preferred Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        required
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-navy bg-gray-50/50"
                      />
                      <Calendar className="absolute right-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                    <Shield className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800 leading-relaxed">
                      Standard Hall Rental Rate is <span className="font-bold">₦500,000 / Day</span>. Includes 100% uninterrupted power supply, standard banquet chairs, and central air conditioning.
                    </p>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      disabled={!eventDate}
                      className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-medium text-white transition-all shadow-md ${
                        eventDate ? "bg-gold hover:bg-[#C5A028]" : "bg-gray-300 cursor-not-allowed"
                      }`}
                    >
                      Next: Add-ons
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Guest Count & Add-on Services */}
              {step === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-navy">
                      Estimated Guest Count
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {["200 - 300", "300 - 500", "500 - 700"].map((count) => (
                        <button
                          key={count}
                          type="button"
                          onClick={() => setGuestCount(count)}
                          className={`py-3 px-4 rounded-xl border font-medium text-sm transition-all ${
                            guestCount === count
                              ? "bg-navy text-gold border-navy shadow-md"
                              : "border-gray-200 hover:border-gold text-gray-700 bg-gray-50"
                          }`}
                        >
                          {count} Guests
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-navy">
                      Optional Add-On Services
                    </label>
                    <div className="space-y-2.5">
                      {[
                        { id: "catering", name: "Premium Catering & Chef Services", price: "Custom Quote" },
                        { id: "led", name: "Ultra-HD LED Screen Display Package", price: "₦150,000" },
                        { id: "dj", name: "Concert-Grade Sound & Professional DJ", price: "₦120,000" },
                        { id: "decor", name: "Luxury Floral & Stage Styling", price: "₦200,000" },
                      ].map((addon) => (
                        <label
                          key={addon.id}
                          className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                            addons.includes(addon.name)
                              ? "border-gold bg-gold/5 shadow-sm"
                              : "border-gray-200 hover:border-gray-300 bg-gray-50/50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={addons.includes(addon.name)}
                              onChange={() => handleAddonChange(addon.name)}
                              className="w-4 h-4 text-gold rounded border-gray-300 focus:ring-gold"
                            />
                            <span className="text-sm font-medium text-navy">{addon.name}</span>
                          </div>
                          <span className="text-xs font-semibold text-gold">{addon.price}</span>
                        </label>
                      ))}
                    </div>
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
                      Next: Contact Info
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Contact & Summary */}
              {step === 3 && (
                <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-2 text-xs">
                    <div className="flex justify-between font-semibold text-navy border-b border-gray-200 pb-2">
                      <span>Summary</span>
                      <span className="text-gold">Aura Event Center</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Event:</span>
                      <span className="font-medium text-navy">{eventType}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Date:</span>
                      <span className="font-medium text-navy">{eventDate}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Guests:</span>
                      <span className="font-medium text-navy">{guestCount} Guests</span>
                    </div>
                    {addons.length > 0 && (
                      <div className="flex justify-between text-gray-600">
                        <span>Add-ons:</span>
                        <span className="font-medium text-navy text-right">{addons.join(", ")}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-navy pt-2 border-t border-gray-200 text-sm">
                      <span>Base Hall Fee:</span>
                      <span className="text-gold">₦500,000 / Day</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-navy">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Dr. & Mrs. Terhemba"
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
                      placeholder="Any specific layout or VIP requirements..."
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
                      Submit Booking Inquiry
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
