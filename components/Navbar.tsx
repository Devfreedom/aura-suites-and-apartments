"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, X, Calendar, LogIn, LogOut, LayoutDashboard } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    const initSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        // Check the profile role for admin routing
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();
        setIsAdmin(profile?.role === "admin");
      } else {
        setIsAdmin(false);
      }
      setIsLoading(false);
    };

    void initSession();

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) setIsAdmin(false);
      setIsLoading(false);
    });

    return () => {
      void subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    router.refresh();
    router.push("/");
  }

  const isAuthenticated = !!user;
  const dashboardHref = isAdmin ? "/admin" : "/dashboard";

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/aura_horizontal_logo.jpg"
              alt="Aura Suites & Apartments"
              width={180}
              height={48}
              className="h-10 w-auto object-contain group-hover:scale-105 transition-transform"
              priority
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-gray-700">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <Link href="/about" className="hover:text-gold transition-colors">About</Link>
            <Link href="/pricing" className="hover:text-gold transition-colors">Pricing & Packages</Link>
            <Link href="/contact" className="hover:text-gold transition-colors">Contact</Link>
            <Link href="/explore" className="hover:text-gold transition-colors">Explore Jos</Link>
            <Link href="/dining" className="hover:text-gold transition-colors">In-Suite Dining</Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/contact"
              className="flex items-center gap-2 bg-gold text-white px-5 py-2.5 rounded-md font-medium text-sm shadow-md hover:bg-amber-600 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              Reserve a Suite
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  href={dashboardHref}
                  className="flex items-center gap-2 border border-navy/20 bg-white px-5 py-2.5 rounded-md font-medium text-sm text-navy shadow-sm hover:bg-navy hover:text-white transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  disabled={isLoading}
                  className="flex items-center gap-2 border border-navy/20 bg-white px-5 py-2.5 rounded-md font-medium text-sm text-navy shadow-sm hover:bg-navy hover:text-white transition-colors disabled:opacity-60"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </>
            ) : (
              <Link
                href="/auth/sign-in"
                className="flex items-center gap-2 border border-navy/20 bg-white px-5 py-2.5 rounded-md font-medium text-sm text-navy shadow-sm hover:bg-navy hover:text-white transition-colors"
              >
                <LogIn className="w-4 h-4" />
                {isLoading ? "Loading…" : "Sign in"}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-navy focus:outline-none p-2"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-6 space-y-3 shadow-lg">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="block py-2 text-navy font-medium border-b border-gray-50 hover:text-gold"
          >
            Home
          </Link>
          <Link
            href="/about"
            onClick={() => setIsOpen(false)}
            className="block py-2 text-navy font-medium border-b border-gray-50 hover:text-gold"
          >
            About
          </Link>
          <Link
            href="/pricing"
            onClick={() => setIsOpen(false)}
            className="block py-2 text-navy font-medium border-b border-gray-50 hover:text-gold"
          >
            Pricing & Packages
          </Link>
          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className="block py-2 text-navy font-medium border-b border-gray-50 hover:text-gold"
          >
            Contact
          </Link>
          <Link
            href="/explore"
            onClick={() => setIsOpen(false)}
            className="block py-2 text-navy font-medium border-b border-gray-50 hover:text-gold"
          >
            Explore Jos
          </Link>
          <Link
            href="/dining"
            onClick={() => setIsOpen(false)}
            className="block py-2 text-navy font-medium border-b border-gray-50 hover:text-gold"
          >
            In-Suite Dining
          </Link>
          <div className="pt-2">
            {isAuthenticated ? (
              <>
                <Link
                  href={dashboardHref}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-gold text-white py-3 rounded-md font-medium text-sm shadow hover:bg-amber-600 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    void handleSignOut();
                  }}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 w-full bg-white border border-navy/20 text-navy py-3 rounded-md font-medium text-sm shadow hover:bg-navy hover:text-white transition-colors disabled:opacity-60"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </>
            ) : (
              <Link
                href="/auth/sign-in"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full bg-gold text-white py-3 rounded-md font-medium text-sm shadow hover:bg-amber-600 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Sign in
              </Link>
            )}
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full bg-gold text-white py-3 rounded-md font-medium text-sm shadow hover:bg-amber-600 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              Reserve a Suite
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
