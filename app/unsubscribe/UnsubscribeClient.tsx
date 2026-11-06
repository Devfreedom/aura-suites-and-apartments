"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Mail,
  MailX,
} from "lucide-react";

interface UnsubscribeClientProps {
  token?: string;
  email?: string;
}

export default function UnsubscribeClient({
  token,
  email,
}: UnsubscribeClientProps) {
  const [emailInput, setEmailInput] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  async function handleTokenUnsubscribe() {
    if (!token) return;

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/subscribers/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setStatus("error");
        setMessage(data.error || "We could not unsubscribe this address.");
        return;
      }

      setStatus("success");
      setMessage(
        data.message || "You have been removed from our mailing list."
      );
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  async function handleEmailRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/subscribers/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setStatus("error");
        setMessage(data.error || "We could not process your request.");
        return;
      }

      setStatus("success");
      setMessage(
        data.message ||
          "If that address is on our list, a confirmation email is on its way."
      );
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  const isTokenFlow = Boolean(token);

  return (
    <div className="w-full max-w-lg rounded-3xl border border-gray-100 bg-white p-8 shadow-xl sm:p-10">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-navy text-gold">
          {isTokenFlow ? (
            <MailX className="h-6 w-6" />
          ) : (
            <Mail className="h-6 w-6" />
          )}
        </div>
        <h1 className="font-serif text-2xl font-bold text-navy">
          {isTokenFlow ? "Confirm Unsubscribe" : "Unsubscribe"}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">
          {isTokenFlow ? (
            <>
              You are about to stop receiving marketing emails at{" "}
              <span className="font-medium text-navy">{email}</span>.
            </>
          ) : (
            "Enter the email address you subscribed with and we'll send a secure confirmation link."
          )}
        </p>
      </div>

      {status === "success" ? (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-5 text-center">
          <CheckCircle2 className="mx-auto mb-3 h-8 w-8 text-green-600" />
          <p className="text-sm font-medium text-green-800">{message}</p>
        </div>
      ) : (
        <>
          {isTokenFlow ? (
            <button
              type="button"
              onClick={() => void handleTokenUnsubscribe()}
              disabled={status === "loading"}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-navy px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#152A49] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Unsubscribing…
                </>
              ) : (
                <>
                  <MailX className="h-4 w-4" />
                  Confirm Unsubscribe
                </>
              )}
            </button>
          ) : (
            <form onSubmit={handleEmailRequest} className="space-y-4">
              <div className="relative">
                <label htmlFor="unsubscribe-email" className="sr-only">
                  Email address
                </label>
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="unsubscribe-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={emailInput}
                  onChange={(event) => setEmailInput(event.target.value)}
                  placeholder="you@example.com"
                  disabled={status === "loading"}
                  className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm text-navy outline-none transition-colors placeholder:text-gray-400 focus:border-gold focus:ring-2 focus:ring-gold/20 disabled:opacity-60"
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#C5A028] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  "Send Confirmation Link"
                )}
              </button>
            </form>
          )}

          {status === "error" && message && (
            <p
              role="alert"
              className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700"
            >
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
              <span>{message}</span>
            </p>
          )}
        </>
      )}

      <div className="mt-8 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Aura Suites
        </Link>
      </div>
    </div>
  );
}
