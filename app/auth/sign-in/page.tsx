"use client";

import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  LogIn,
  Mail,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import AuthShell from "@/components/auth/AuthShell";

const inputClass =
  "w-full rounded-xl border border-gray-300 bg-white py-3.5 pl-11 pr-4 text-sm text-navy outline-none transition-colors placeholder:text-gray-400 focus:border-gold focus:ring-2 focus:ring-gold/20 min-h-[44px]";

/** Only allow same-site relative paths to prevent open redirects. */
function sanitizeRedirectTo(value: string | null): string | null {
  if (value && value.startsWith("/") && !value.startsWith("//")) {
    return value;
  }
  return null;
}

/** Friendly copy for error codes returned by the OAuth callback route. */
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "auth-failed": "Google sign-in failed or was cancelled. Please try again.",
};

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const requestedRedirect = sanitizeRedirectTo(
    searchParams.get("redirectTo")
  );
  const authErrorCode = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    authErrorCode
      ? AUTH_ERROR_MESSAGES[authErrorCode] ??
          "Authentication failed. Please try again."
      : null
  );

  // Show the callback's error banner immediately if the page was mounted
  // after a failed OAuth round-trip.
  useEffect(() => {
    if (!authErrorCode) return;
    window.history.replaceState(null, "", "/auth/sign-in");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setError(
          signInError.message === "Invalid login credentials"
            ? "Invalid email or password. Please try again."
            : signInError.message
        );
        setIsLoading(false);
        return;
      }

      const destination = requestedRedirect ?? "/dashboard";
      router.replace(destination);
      router.refresh();
    } catch {
      setError("Unable to sign in right now. Please try again.");
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setError(null);
    setIsLoading(true);

    try {
      const supabase = createClient();
      // Forward the requested destination to the OAuth callback via ?next=
      // (e.g. ?next=%2Fcheckout%3FsuiteId%3D...) so the user continues their
      // flow after Google redirecting them back.
      const googleRedirect = requestedRedirect
        ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(
            requestedRedirect
          )}`
        : `${window.location.origin}/auth/callback`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: googleRedirect,
        },
      });

      if (error) {
        setError(error.message);
        setIsLoading(false);
      }
      // On success the browser redirects to Google, then back to /auth/callback.
    } catch {
      setError("Unable to sign in with Google. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <AuthShell>
      <div className="mb-6 text-center">
        <h1 className="font-serif text-2xl font-bold text-navy">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="font-medium text-gold hover:underline"
          >
            Register
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-navy"
          >
            Email Address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-navy"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className={`${inputClass} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-navy"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-6 py-4 text-base font-semibold text-white shadow-lg transition-colors hover:bg-[#C5A028] disabled:cursor-not-allowed disabled:opacity-60 min-h-[52px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in…
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4" />
              Sign In
            </>
          )}
        </button>
      </form>

      <div className="mt-6">
        <div className="relative flex items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <div className="px-4 text-sm text-gray-500">Or continue with</div>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-4 text-base font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed min-h-[52px]"
        >
          <span
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white"
            aria-hidden="true"
          >
            G
          </span>
          {isLoading ? "Connecting…" : "Sign in with Google"}
        </button>
      </div>
    </AuthShell>
  );
}

export default function PublicSignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInForm />
    </Suspense>
  );
}
