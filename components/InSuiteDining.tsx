"use client";

import { useState } from "react";
import SafeImage from "@/components/ui/SafeImage";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Jos Beef Suya Platter",
    description:
      "Succulent skewers of premium beef marinated in traditional suya spice, grilled over open flame and served with sliced onions, tomatoes, and yaji spice dust.",
    price: 6500,
    category: "Local Specialties",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "Masa & Spicy Goat Meat Pepper Soup",
    description:
      "Northern Nigerian rice cakes (masa) served with a fiery, aromatic goat meat pepper soup infused with local herbs and spices. A comforting Plateau State classic.",
    price: 7500,
    category: "Local Specialties",
    image:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "Fresh Plateau Produce Basket",
    description:
      "A curated selection of fresh, locally-sourced fruits and vegetables from Jos farms - including strawberries, apples, carrots, and seasonal greens. Perfect for health-conscious guests.",
    price: 12000,
    category: "Fresh Produce",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    name: "In-Suite Private Chef Prep",
    description:
      "Our executive chef prepares a bespoke multi-course meal in the privacy of your suite. Includes menu consultation, ingredient sourcing, tableside preparation, and wine pairing recommendations.",
    price: 15000,
    category: "Chef Services",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
  },
];

interface OrderFormData {
  guestName: string;
  suiteNumber: string;
  selectedItems: Record<number, number>;
  specialRequests: string;
}

export default function InSuiteDining() {
  const [isOrderSent, setIsOrderSent] = useState(false);
  const [formData, setFormData] = useState<OrderFormData>({
    guestName: "",
    suiteNumber: "",
    selectedItems: {},
    specialRequests: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleItem = (itemId: number) => {
    setFormData((prev) => {
      const newSelected = { ...prev.selectedItems };
      if (newSelected[itemId]) {
        if (newSelected[itemId] > 1) {
          newSelected[itemId] -= 1;
        } else {
          delete newSelected[itemId];
        }
      } else {
        newSelected[itemId] = 1;
      }
      return { ...prev, selectedItems: newSelected };
    });
  };

  const getItemQuantity = (itemId: number) => {
    return formData.selectedItems[itemId] || 0;
  };

  const getTotal = () => {
    return menuItems.reduce((total, item) => {
      const qty = getItemQuantity(item.id);
      return total + item.price * qty;
    }, 0);
  };

  const getItemCount = () => {
    return Object.values(formData.selectedItems).reduce(
      (sum, qty) => sum + qty,
      0
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate order dispatch to hospitality desk
    setTimeout(() => {
      setIsOrderSent(true);
      setIsSubmitting(false);
    }, 1500);
  };

  const sendWhatsAppOrder = () => {
    const itemsSummary = Object.entries(formData.selectedItems)
      .map(([id, qty]) => {
        const item = menuItems.find((i) => i.id === parseInt(id));
        if (!item) return "";
        return `- ${item.name} x${qty} (₦${(item.price * qty).toLocaleString()})`;
      })
      .filter(Boolean)
      .join("\n");

    const message = encodeURIComponent(
      `Hello Aura Suites & Apartments Hospitality Desk,\n\nI would like to place an in-suite dining order:\n\n👤 Guest: ${formData.guestName}\n🏨 Suite: ${formData.suiteNumber}\n\n🍽️ Order:\n${itemsSummary}\n\n💰 Total: ₦${getTotal().toLocaleString()}\n\n${formData.specialRequests ? `📝 Special Requests: ${formData.specialRequests}\n\n` : ""}Please confirm delivery time. Thank you!`
    );
    window.open(`https://wa.me/234800AURASTAY?text=${message}`, "_blank");
  };

  const menuCategories = [...new Set(menuItems.map((item) => item.category))];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold/10 text-gold text-xs font-semibold tracking-widest uppercase">
            <Sparkles className="w-4 h-4 text-gold" />
            In-Suite Dining
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-navy tracking-tight">
            Dine in Luxury
          </h2>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed font-light">
            Enjoy Plateau State&apos;s finest flavors from the comfort of your suite. Our culinary team delivers fresh, authentic dishes directly to your door.
          </p>
        </div>

        {/* Order Status Modal */}
        {isOrderSent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gold/30">
              <div className="bg-navy px-8 py-6 text-white">
                <h3 className="font-serif font-bold text-xl text-white">
                  Order Confirmed
                </h3>
              </div>
              <div className="p-6 space-y-4 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <p className="font-medium text-navy">
                  Your order has been sent to the hospitality desk.
                </p>
                <p className="text-sm text-gray-600">
                  Estimated delivery: 30-45 minutes
                </p>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      setIsOrderSent(false);
                      sendWhatsAppOrder();
                    }}
                    className="flex-1 bg-gold text-white py-3 rounded-xl font-medium hover:bg-[#C5A028] transition-all"
                  >
                    Track via WhatsApp
                  </button>
                  <button
                    onClick={() => setIsOrderSent(false)}
                    className="flex-1 bg-gray-100 text-navy py-3 rounded-xl font-medium hover:bg-gray-200 transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Menu Categories Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {menuCategories.map((category) => (
            <button
              key={category}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all border border-navy/30 text-navy hover:bg-navy hover:text-white"
            >
              {category}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white border border-navy/20 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="relative w-full h-48 overflow-hidden">
                {/* Dark overlay for badge legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <SafeImage
                  src={item.image}
                  alt={item.name}
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={item.id === 1}
                />
                <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                  {item.category}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col gap-4">
                <div className="flex items-baseline gap-1.5 mb-2">
                  <span className="font-serif font-bold text-xl text-navy">
                    ₦{item.price.toLocaleString()}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-lg text-navy mb-2">
                  {item.name}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed font-light mb-4">
                  {item.description}
                </p>

                {/* Quantity Selector + Add to Order — pinned to bottom via mt-auto */}
                <div className="mt-auto flex flex-col gap-3">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleItem(item.id)}
                      disabled={getItemQuantity(item.id) === 1}
                      className="w-8 h-8 rounded-lg border border-navy/30 text-navy flex items-center justify-center hover:bg-navy hover:text-white transition-all disabled:opacity-50"
                    >
                      <span className="text-[14px] leading-none">-</span>
                    </button>
                    <span className="w-8 text-center font-medium text-navy">
                      {getItemQuantity(item.id)}
                    </span>
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="w-8 h-8 rounded-lg border border-navy/30 text-navy flex items-center justify-center hover:bg-navy hover:text-white transition-all"
                    >
                      <span className="text-[14px] leading-none">+</span>
                    </button>
                  </div>

                  {/* Add to Order Button */}
                  <button
                    onClick={() => toggleItem(item.id)}
                    disabled={getItemQuantity(item.id) > 0}
                    className={`w-full py-3 rounded-xl font-medium text-sm transition-all ${
                      getItemQuantity(item.id) > 0
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-gold text-white hover:bg-[#C5A028] shadow-lg hover:shadow-gold/20"
                    }`}
                  >
                    {getItemQuantity(item.id) > 0 ? "Added" : "Add to Order"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Form */}
        <div className="mt-16 bg-navy rounded-3xl p-8 sm:p-12 text-white">
          <div className="max-w-xl mx-auto">
            <h2 className="font-serif font-bold text-2xl text-white mb-6">
              Place Your Order
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Guest Name
                  </label>
                  <input
                    type="text"
                    placeholder="Dr. Amina Ibrahim"
                    value={formData.guestName}
                    onChange={(e) =>
                      setFormData({ ...formData, guestName: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-white/20 text-white focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none bg-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Suite Number
                  </label>
                  <input
                    type="text"
                    placeholder="Suite 402"
                    value={formData.suiteNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, suiteNumber: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-white/20 text-white focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none bg-white/10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Special Requests
                </label>
                <textarea
                  rows={2}
                  placeholder="Dietary requirements, delivery time, extra napkins..."
                  value={formData.specialRequests}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specialRequests: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-white/20 text-white focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none bg-white/10 resize-none"
                />
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-sm text-gray-300">Order Total</span>
                <span className="font-serif font-bold text-2xl text-gold">
                  ₦{getTotal().toLocaleString()}
                </span>
              </div>
              <button
                type="submit"
                disabled={
                  !formData.guestName ||
                  !formData.suiteNumber ||
                  getItemCount() === 0 ||
                  isSubmitting
                }
                className={`w-full py-4 rounded-xl font-medium transition-all ${
                  !formData.guestName ||
                  !formData.suiteNumber ||
                  getItemCount() === 0
                    ? "bg-gray-500 text-white cursor-not-allowed"
                    : "bg-gold text-white hover:bg-[#C5A028] shadow-lg hover:shadow-gold/20"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <ArrowRight className="w-4 h-4 animate-spin" />
                    Sending Order…
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-4 h-4" />
                    Dispatch to Hospitality Desk
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}