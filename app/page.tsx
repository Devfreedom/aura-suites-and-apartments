import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import Amenities from "@/components/Amenities";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col selection:bg-gold selection:text-white">
      <Navbar />
      <Hero />
      <AboutSection />
      <Amenities />
      <Footer />
    </main>
  );
}
