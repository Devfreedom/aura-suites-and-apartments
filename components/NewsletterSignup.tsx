"use client";

import { useId, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Mail,
  Send,
} from "lucide-react";

interface NewsletterSignupProps {
  /** `dark` renders on navy backgrounds (footer); `light` on white sections. */
  variant?: "dark" | "light";
  className?: string;
}

export default function NewsletterSignup({
  variant = "dark",
  className = "",
}: NewsletterSignupProps) {
  const inputId = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  const isDark = variant === "dark";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setStatus("error");
        setMessage(data.error || "Unable to subscribe. Please try again.");
        return;
      }

      setStatus("success");
      setMessage(data.message || "You're subscribed. Welcome to the Aura circle.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Network error. Please check your connection and try again.");
    }
  }

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <label htmlFor={inputId} className="sr-only">
            Email address
          </label>
          <Mail
            className={`pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 ${
              isDark ? "text-gold/70" : "text-gray-400"
            }`}
          />
          <input
            id={inputId}
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (status !== "idle") {
                setStatus("idle");
                setMessage("");
              }
            }}
            placeholder="Your email address"
            disabled={status === "loading"}
            className={`w-full rounded-xl border py-3.5 pl-11 pr-4 text-sm outline-none transition-colors disabled:opacity-60 ${
              isDark
                ? "border-white/20 bg-white/10 text-white placeholder:text-white/40 focus:border-gold focus:ring-2 focus:ring-gold/30"
                : "border-gray-300 bg-white text-navy placeholder:text-gray-400 focus:border-gold focus:ring-2 focus:ring-gold/20"
            } min-h-[44px]`}
          />
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-5 py-3.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#C5A028] disabled:cursor-not-allowed disabled:opacity-60 min-h-[52px]"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Subscribing…
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Subscribe
            </>
          )}
        </button>
      </form>

      {message && (
        <p
          role="status"
          className={`mt-3 flex items-start gap-2 text-xs ${
            status === "success"
              ? isDark
                ? "text-gold"
                : "text-green-700"
              : isDark
                ? "text-red-300"
                : "text-red-600"
          }`}
        >
          {status === "success" ? (
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
          )}
          <span>{message}</span>
        </p>
      )}

      <p
        className={`mt-3 text-[11px] leading-relaxed ${
          isDark ? "text-gray-400" : "text-gray-500"
        }`}
      >
        Curated offers and seasonal news. No spam.{" "}
        <Link
          href="/unsubscribe"
          className={`underline underline-offset-2 transition-colors ${
            isDark ? "hover:text-gold" : "hover:text-gold"
          }`}
        >
          Unsubscribe anytime
        </Link>
        .
      </p>
    </div>
  );
}
