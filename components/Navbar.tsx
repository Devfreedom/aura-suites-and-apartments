"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import {
  Menu,
  X,
  Calendar,
  LogIn,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/config";

interface Profile {
  full_name: string | null;
  email: string | null;
  role: string | null;
  avatar_url: string | null;
}

/** Avatar: shows the profile photo when available, otherwise initials. */
function UserAvatar({
  avatarUrl,
  fullName,
  size = "md",
}: {
  avatarUrl: string | null;
  fullName: string;
  size?: "md" | "lg";
}) {
  const [imgError, setImgError] = useState(false);

  const initials =
    fullName
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("") || "U";

  const dimension = size === "lg" ? "w-12 h-12" : "w-8 h-8";
  const textClass =
    size === "lg" ? "text-sm" : "text-[11px]";

  return (
    <span
      className={`relative inline-flex ${dimension} shrink-0 items-center justify-center overflow-hidden rounded-full border border-amber-500/30 bg-navy`}
    >
      {avatarUrl && !imgError ? (
        <Image
          src={avatarUrl}
          alt={fullName || "User avatar"}
          fill
          sizes="48px"
          className="object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span
          className={`font-bold text-gold tracking-wide ${textClass}`}
          aria-hidden="true"
        >
          {initials}
        </span>
      )}
    </span>
  );
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<{ email?: string; id?: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Memoized so the client is created once per component instance (the
  // underlying createBrowserClient is itself cached by @supabase/ssr).
  const supabase = useMemo(
    () => createBrowserClient(supabaseUrl, supabaseAnonKey),
    []
  );

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async (userId: string) => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, email, role, avatar_url")
        .eq("id", userId)
        .maybeSingle<Profile>();
      if (isMounted) setProfile(profile ?? null);
    };

    // a) Validate the session with the auth server. Unlike
    // supabase.auth.getSession(), getUser() re-verifies the token against
    // Supabase, so the Navbar can never drift out of sync with the server.
    const initSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!isMounted) return;

      setUser(user ?? null);
      if (user) void fetchProfile(user.id);
      else setProfile(null);

      setIsLoading(false);
    };

    void initSession();

    // b) Keep local state in sync and refresh server components whenever the
    // session changes (sign-in/sign-out/token refresh), so protected server
    // routes and the Navbar always agree.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;

      setUser(session?.user ?? null);
      if (session?.user) void fetchProfile(session.user.id);
      else setProfile(null);
      setIsLoading(false);

      // Re-render server components with the newly refreshed session cookies.
      router.refresh();
    });

    return () => {
      isMounted = false;
      void subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, router]);

  // Close the dropdown on navigation
  useEffect(() => {
    setIsDropdownOpen(false);
  }, [pathname]);

  // Close the dropdown when clicking outside
  useEffect(() => {
    if (!isDropdownOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsDropdownOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isDropdownOpen]);

  async function handleSignOut() {
    setIsDropdownOpen(false);
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    router.refresh();
    router.push("/");
  }

  const isAuthenticated = !!user;
  const isAdmin = profile?.role === "admin";
  const dashboardHref = isAdmin ? "/admin" : "/dashboard";
  const displayName =
    profile?.full_name || user?.email?.split("@")[0] || "Guest";
  const displayEmail = profile?.email || user?.email || "";

  const dropdownMenu = (
    <div
      className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl"
      role="menu"
      aria-label="User account menu"
    >
      {/* Header: name + email */}
      <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50/50 px-4 py-3.5">
        <UserAvatar
          avatarUrl={profile?.avatar_url ?? null}
          fullName={displayName}
          size="lg"
        />
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-sm font-semibold text-navy">
              {displayName}
            </p>
            {isAdmin && (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-gold/40 bg-gold/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-navy">
                <ShieldCheck className="h-2.5 w-2.5 text-gold" />
                Admin
              </span>
            )}
          </div>
          <p className="truncate text-xs text-gray-500">{displayEmail}</p>
        </div>
      </div>

      {/* Nav links */}
      <div className="py-1.5">
        <Link
          href="/dashboard"
          onClick={() => setIsDropdownOpen(false)}
          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-navy transition-colors hover:bg-gold/10 hover:text-navy"
          role="menuitem"
        >
          <LayoutDashboard className="h-4 w-4 text-gold" />
          Dashboard
        </Link>
        <Link
          href="/dashboard#bookings"
          onClick={() => setIsDropdownOpen(false)}
          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-navy transition-colors hover:bg-gold/10 hover:text-navy"
          role="menuitem"
        >
          <Calendar className="h-4 w-4 text-gold" />
          My Bookings
        </Link>
        {isAdmin && (
          <Link
            href="/admin"
            onClick={() => setIsDropdownOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-navy transition-colors hover:bg-gold/10 hover:text-navy"
            role="menuitem"
          >
            <ShieldCheck className="h-4 w-4 text-gold" />
            Admin Panel
          </Link>
        )}
      </div>

      {/* Divider + Log Out */}
      <div className="border-t border-gray-100 py-1.5">
        <button
          onClick={() => void handleSignOut()}
          className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          role="menuitem"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </button>
      </div>
    </div>
  );

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

          {/* CTA / Account */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/contact"
              className="flex items-center gap-2 bg-gold text-white px-5 py-2.5 rounded-md font-medium text-sm shadow-md hover:bg-amber-600 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              Reserve a Suite
            </Link>

            {isAuthenticated ? (
              <div
                ref={dropdownRef}
                className="relative"
              >
                <button
                  onClick={() => setIsDropdownOpen((open) => !open)}
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="menu"
                  aria-label="Open account menu"
                  className="flex items-center gap-2 rounded-full border border-gray-200 bg-white py-1 pl-1 pr-2.5 shadow-sm transition-colors hover:border-amber-500/40"
                >
                  <UserAvatar
                    avatarUrl={profile?.avatar_url ?? null}
                    fullName={displayName}
                  />
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-navy transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isDropdownOpen && dropdownMenu}
              </div>
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
          <div className="md:hidden flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={() => setIsDropdownOpen((open) => !open)}
                aria-expanded={isDropdownOpen}
                aria-haspopup="menu"
                aria-label="Open account menu"
              >
                <UserAvatar
                  avatarUrl={profile?.avatar_url ?? null}
                  fullName={displayName}
                />
              </button>
            )}
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

      {/* Mobile account dropdown (uncontrolled by hamburger so it can show alone) */}
      {isAuthenticated && isDropdownOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => setIsDropdownOpen(false)}
          aria-hidden="true"
        />
      )}
      {isAuthenticated && isDropdownOpen && (
        <div className="md:hidden absolute right-4 left-4 top-full z-50 origin-top">
          {dropdownMenu}
        </div>
      )}

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
                  {isAdmin ? "Admin Panel" : "Dashboard"}
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    void handleSignOut();
                  }}
                  disabled={isLoading}
                  className="mt-3 flex items-center justify-center gap-2 w-full bg-white border border-navy/20 text-navy py-3 rounded-md font-medium text-sm shadow hover:bg-navy hover:text-white transition-colors disabled:opacity-60"
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
              className="mt-3 flex items-center justify-center gap-2 w-full bg-white border border-navy/20 text-navy py-3 rounded-md font-medium text-sm shadow hover:bg-navy hover:text-white transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Reserve a Suite
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
