import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import FloatingConcierge from "@/components/FloatingConcierge";
import CookieBanner from "@/components/CookieBanner";
import { Toaster } from "sonner";
import "./globals.css";

// Configure Google Fonts for luxury styling
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aura Suites & Apartments | Luxury Shortlets in Jos",
  description: "Experience unrivaled comfort and elegance at Aura Suites & Apartments, Jos's premier luxury shortlet and executive suite destination.",
  icons: {
    icon: "/aura_horizontal_logo.jpg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1B365D",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen overflow-x-hidden bg-white font-sans text-navy-900 antialiased selection:bg-gold-500 selection:text-white">
        <Navbar />
        {children}
        <FloatingConcierge />
        <CookieBanner />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}