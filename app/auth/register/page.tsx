"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2, LogIn, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import AuthShell from "@/components/auth/AuthShell";

const inputClass =
  "w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm text-navy outline-none transition-colors placeholder:text-gray-400 focus:border-gold focus:ring-2 focus:ring-gold/20";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsEmailConfirm, setNeedsEmailConfirm] = useState(false);

  function validate(): string | null {
    if (fullName.trim().length < 2) {
      return "Please enter your full name.";
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }
    return null;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: fullName.trim() },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setIsLoading(false);
        return;
      }

      if (!data.session) {
        // Email confirmation is required before the session exists
        setNeedsEmailConfirm(true);
        setIsLoading(false);
        return;
      }

      // Auto-confirm enabled in Supabase — go straight to the dashboard
      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("Unable to create your account right now. Please try again.");
      setIsLoading(false);
    }
  }

  async function handleGoogleSignUp() {
    setError(null);
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (oauthError) {
        setError(oauthError.message);
        setIsLoading(false);
      }
      // On success the browser redirects to Google, then back to /auth/callback.
    } catch {
      setError("Unable to sign up with Google. Please try again.");
      setIsLoading(false);
    }
  }

  if (needsEmailConfirm) {
    return (
      <AuthShell>
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-navy">
            Check your inbox
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            We sent a confirmation link to <span className="font-medium text-navy">{email.trim()}</span>.
            Click the link to activate your account, then sign in.
          </p>
          <Link
            href="/auth/sign-in"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-navy px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-navy/90"
          >
            <LogIn className="h-4 w-4" />
            Go to Sign In
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <div className="mb-6 text-center">
        <h1 className="font-serif text-2xl font-bold text-navy">
          Create an Account
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/auth/sign-in"
            className="font-medium text-gold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Full name */}
        <div>
          <label htmlFor="full_name" className="mb-2 block text-sm font-medium text-navy">
            Full Name
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              id="full_name"
              type="text"
              autoComplete="name"
              required
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Amina Ibrahim"
              className={inputClass}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-navy">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className={`${inputClass} pl-11`}
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-navy">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
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
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Confirm password */}
        <div>
          <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-navy">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="••••••••"
            className={`${inputClass} pl-11`}
          />
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
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-[#C5A028] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating account…
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <div className="mt-6">
        <div className="relative flex items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <div className="px-4 text-sm text-gray-500">Or</div>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <button
          onClick={handleGoogleSignUp}
          disabled={isLoading}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white"
            aria-hidden="true"
          >
            G
          </span>
          {isLoading ? "Connecting…" : "Sign up with Google"}
        </button>
      </div>
    </AuthShell>
  );
}
