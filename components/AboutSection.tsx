import { Users, Clock, Zap, Car, MapPin, Award } from "lucide-react";

const stats = [
  {
    icon: Users,
    title: "Capacity",
    value: "500 - 700 Guests",
    description: "Spacious banquet hall accommodating grand celebrations and conferences.",
  },
  {
    icon: Clock,
    title: "Operating Hours",
    value: "8:00 AM - 12:00 AM",
    description: "Flexible scheduling to ensure your event proceeds without rush.",
  },
  {
    icon: Zap,
    title: "Uninterrupted Power",
    value: "100% Guaranteed",
    description: "Dual heavy-duty silent generators with instant automated failover.",
  },
  {
    icon: Car,
    title: "On-site Parking",
    value: "150+ Vehicles",
    description: "Secure, paved, and well-lit parking space with professional valet support.",
  },
];

export default function AboutSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold/10 text-gold text-xs font-semibold tracking-widest uppercase">
            <Award className="w-4 h-4 text-gold" />
            About Aura Event Center
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-navy tracking-tight">
            An Iconic Landmark of Luxury & Distinction
          </h2>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed font-light">
            Located at No. 5 Kashim Ibrahim Road, Makurdi, Benue State, Aura Event Center sets the definitive standard for upscale hospitality, architectural grandeur, and flawless event execution.
          </p>
        </div>

        {/* 4-Item Stats & Specifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-gray-50 hover:bg-navy/5 border border-gray-100 hover:border-gold/30 rounded-2xl p-8 transition-all duration-300 group shadow-sm hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-xl bg-navy text-gold flex items-center justify-center mb-6 shadow-md group-hover:bg-gold group-hover:text-white transition-colors">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-1">
                    {stat.title}
                  </h3>
                  <div className="font-serif font-bold text-2xl text-navy mb-3">
                    {stat.value}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed font-light">
                    {stat.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200/60 flex items-center text-xs font-medium text-gold">
                  <MapPin className="w-3.5 h-3.5 mr-1.5" />
                  Makurdi, Benue State
                </div>
              </div>
            );
          })}
        </div>

        {/* Luxury Banner Callout */}
        <div className="mt-16 bg-navy rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-gold/20 to-transparent pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2 space-y-3">
              <span className="text-gold uppercase tracking-widest text-xs font-semibold">
                PREMIUM EXPERIENCE
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold">
                Ready to Create Unforgettable Memories?
              </h3>
              <p className="text-gray-300 text-sm sm:text-base font-light">
                Our dedicated event coordinators and concierge service are ready to bring your vision to life with immaculate attention to detail.
              </p>
            </div>
            <div className="flex lg:justify-end">
              <a
                href="/contact"
                className="inline-flex items-center justify-center bg-gold hover:bg-[#C5A028] text-white font-medium px-8 py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 text-sm sm:text-base"
              >
                Book a Private Consultation
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
