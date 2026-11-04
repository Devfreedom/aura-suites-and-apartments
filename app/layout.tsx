import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import FloatingConcierge from "@/components/FloatingConcierge";
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
  title: "Aura Event Center | Luxury Venue & Conference Hall",
  description: "Experience world-class elegance for weddings, corporate conferences, and high-end social events.",
  icons: {
    icon: "/aura_horizontal_logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans antialiased bg-white text-navy-900 selection:bg-gold-500 selection:text-white">
        {children}
        <FloatingConcierge />
      </body>
    </html>
  );
}