"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react";

export default function ContactContent() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-white flex flex-col selection:bg-gold selection:text-white">
      <Navbar />

      {/* Contact Header */}
      <section className="bg-navy py-20 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-gold/20 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold/20 text-gold text-xs font-semibold tracking-widest uppercase">
            Get in Touch
          </div>
          <h1 className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight">
            Contact & Location
          </h1>
          <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto font-light">
            We invite you to schedule a private tour or consult with our event coordinators in Makurdi.
          </p>
        </div>
      </section>

      {/* Contact Content Grid */}
      <section className="py-24 bg-gray-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Contact Info Cards */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-md space-y-6">
                <h3 className="font-serif font-bold text-2xl text-navy">
                  Concierge Desk
                </h3>
                
                <ul className="space-y-6 text-sm text-gray-600">
                  <li className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-navy">Physical Address</p>
                      <p className="text-gray-500 font-light mt-0.5">No. 5 Kashim Ibrahim Road, Makurdi, Benue State</p>
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-navy">Telephone</p>
                      <p className="text-gray-500 font-light mt-0.5">+234 (0) 800 AURA EVENT</p>
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-navy">Email Address</p>
                      <p className="text-gray-500 font-light mt-0.5">concierge@auraeventcenter.com</p>
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center shrink-0">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-navy">Opening & Tour Hours</p>
                      <p className="text-gray-500 font-light mt-0.5">Mon - Sat: 8:00 AM - 12:00 AM</p>
                      <p className="text-gray-400 text-xs font-light mt-1">Private tours available by appointment.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Interactive Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-xl">
                {submitted ? (
                  <div className="text-center py-16 space-y-6">
                    <div className="w-20 h-20 bg-gold/20 text-gold rounded-full flex items-center justify-center mx-auto shadow-inner">
                      <CheckCircle2 className="w-10 h-10 text-gold" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-serif font-bold text-3xl text-navy">
                        Message Sent Successfully!
                      </h3>
                      <p className="text-gray-600 max-w-md mx-auto text-sm font-light">
                        Thank you, <span className="font-semibold text-navy">{form.name}</span>. Our concierge team has received your message and will respond within 2 hours.
                      </p>
                    </div>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="bg-gold hover:bg-[#C5A028] text-white px-8 py-3.5 rounded-xl font-medium shadow-lg transition-all text-sm"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <span className="text-gold uppercase tracking-widest text-xs font-semibold">
                        Send a Message
                      </span>
                      <h3 className="font-serif font-bold text-2xl sm:text-3xl text-navy">
                        How Can We Assist You?
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-navy">Full Name</label>
                        <input
                          type="text"
                          required
                          placeholder="Dr. Terhemba"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-navy bg-gray-50/50 text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-navy">Phone Number</label>
                        <input
                          type="tel"
                          required
                          placeholder="+234 803 000 0000"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-navy bg-gray-50/50 text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-navy">Email Address</label>
                        <input
                          type="email"
                          required
                          placeholder="terhemba@example.com"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-navy bg-gray-50/50 text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-navy">Subject / Inquiry Type</label>
                        <select
                          value={form.subject}
                          onChange={(e) => setForm({ ...form, subject: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-navy bg-gray-50/50 text-sm"
                        >
                          <option value="General Inquiry">General Inquiry</option>
                          <option value="Schedule Venue Tour">Schedule Venue Tour</option>
                          <option value="Wedding Booking">Wedding Booking</option>
                          <option value="Corporate Event">Corporate Event Summit</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-navy">Your Message</label>
                      <textarea
                        rows={4}
                        required
                        placeholder="Tell us about your event date, expected guest count, and any specific requirements..."
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-navy bg-gray-50/50 text-sm resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gold hover:bg-[#C5A028] text-white py-4 rounded-xl font-medium shadow-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      <Send className="w-5 h-5" />
                      Send Message to Concierge
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
