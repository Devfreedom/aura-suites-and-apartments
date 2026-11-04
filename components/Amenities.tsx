import { Sparkles, Tv, Volume2, ShieldCheck, AirVent, Lightbulb, Wifi, KeyRound } from "lucide-react";

const amenities = [
  {
    icon: Sparkles,
    title: "Banquet Seating",
    description: "Luxurious circular & theater setups adorned with premium chiavari chairs, custom linens, and crystal table centerpieces.",
  },
  {
    icon: Tv,
    title: "HD LED Screens",
    description: "State-of-the-art ultra-HD visual displays strategically positioned for immersive presentations, live feeds, and cinematic slide shows.",
  },
  {
    icon: Volume2,
    title: "Concert-grade Audio",
    description: "Immaculate acoustic engineering, professional line-array sound systems, and wireless microphones for pristine speech and music clarity.",
  },
  {
    icon: KeyRound,
    title: "Private Suites",
    description: "Exquisite VIP dressing rooms and executive holding lounges equipped with private restrooms and luxury vanity mirrors.",
  },
  {
    icon: AirVent,
    title: "Climate Control",
    description: "Advanced central air conditioning systems ensuring optimal ambient comfort for all guests throughout your event.",
  },
  {
    icon: Lightbulb,
    title: "Dynamic Lighting",
    description: "Programmable ambient mood lighting and intelligent moving head fixtures to transition effortlessly from ceremony to reception.",
  },
  {
    icon: Wifi,
    title: "High-Speed Connectivity",
    description: "Dedicated enterprise-grade Wi-Fi network ensuring seamless live streaming and digital connectivity for all attendees.",
  },
  {
    icon: ShieldCheck,
    title: "Maximum Security",
    description: "Professional security personnel, perimeter surveillance, and controlled gate access providing complete peace of mind.",
  },
];

export default function Amenities() {
  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold/10 text-gold text-xs font-semibold tracking-widest uppercase">
            World-Class Facilities
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-navy tracking-tight">
            Designed for Flawless Execution
          </h2>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed font-light">
            Every detail at Aura Event Center is meticulously crafted to elevate your event, blending timeless architectural elegance with cutting-edge technology.
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
