import { Wifi, ShieldCheck, Zap, Utensils, Sparkles, Tv, Lightbulb, BedDouble, MapPin, Award } from "lucide-react";

const amenities = [
  {
    icon: BedDouble,
    title: "Luxury Bedding & Linens",
    description: "Premium mattresses, Egyptian cotton sheets, hypoallergenic pillows, and plush duvets for restorative sleep.",
  },
  {
    icon: Wifi,
    title: "High-Speed Fiber WiFi",
    description: "Dedicated enterprise-grade fiber connectivity ensuring seamless remote work, video calls, and 4K streaming.",
  },
  {
    icon: Zap,
    title: "24/7 Uninterrupted Power",
    description: "Dual silent industrial generators with automated transfer switches guaranteeing continuous power supply.",
  },
  {
    icon: Utensils,
    title: "Gourmet Kitchen",
    description: "Fully equipped with modern appliances, premium cookware, dinnerware, and dining essentials for self-catering.",
  },
  {
    icon: Sparkles,
    title: "Daily Housekeeping",
    description: "Professional daily cleaning service with fresh linen changes, towel replacement, and amenity replenishment.",
  },
  {
    icon: Tv,
    title: "Smart Entertainment",
    description: "55\" 4K Smart TVs with premium streaming subscriptions, Bluetooth audio, and high-speed casting.",
  },
  {
    icon: Lightbulb,
    title: "Smart Climate & Lighting",
    description: "App-controlled air conditioning, automated blackout curtains, and programmable mood lighting scenes.",
  },
  {
    icon: ShieldCheck,
    title: "24/7 Security & Concierge",
    description: "Controlled access, CCTV surveillance, on-site security personnel, and dedicated concierge for all requests.",
  },
];

export default function Amenities() {
  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold/10 text-gold text-xs font-semibold tracking-widest uppercase">
            <Award className="w-4 h-4 text-gold" />
            Aura Standard Amenities
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-navy tracking-tight">
            Designed for Unrivaled Comfort
          </h2>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed font-light">
            Every detail at Aura Apartments is meticulously crafted to elevate your stay, blending timeless architectural elegance with cutting-edge technology and premium hospitality.
          </p>
        </div>

        {/* Amenities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {amenities.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white hover:bg-navy hover:text-white border border-gray-100 hover:border-gold/50 rounded-2xl p-8 transition-all duration-300 group shadow-sm hover:shadow-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-xl bg-gold/10 group-hover:bg-gold text-gold group-hover:text-white flex items-center justify-center mb-6 transition-colors shadow-sm">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-serif font-bold text-xl text-navy group-hover:text-white mb-3 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 group-hover:text-gray-300 text-sm leading-relaxed font-light transition-colors">
                    {item.description}
                  </p>
                </div>
                
                <div className="mt-8 pt-4 border-t border-gray-100 group-hover:border-white/10 flex items-center justify-between text-xs font-medium text-gold">
                  <span>Aura Standard</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">✦</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
