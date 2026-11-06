/**
 * Newsletter subscription helpers.
 *
 * Subscribers live in `public.subscribers`. Unsubscribe links are signed with
 * HMAC-SHA256 so a valid link cannot be forged for another email address, and
 * links expire automatically.
 */

import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendWelcomeEmail } from "@/lib/email";

const TABLE = "subscribers";
const TOKEN_TTL_DAYS = 7;

function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
    "http://localhost:3000"
  );
}

function tokenSecret(): string {
  return (
    process.env.NEWSLETTER_SECRET ||
    process.env.PAYSTACK_SECRET_KEY ||
    "aura-newsletter-development-secret"
  );
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function base64UrlEncode(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function base64UrlDecode(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(payload: string): string {
  return crypto
    .createHmac("sha256", tokenSecret())
    .update(payload)
    .digest("base64url");
}

/**
 * Create a signed, expiring unsubscribe token.
 * Format: base64url(email|expiresAt).signature
 */
export function createUnsubscribeToken(
  email: string,
  ttlDays = TOKEN_TTL_DAYS
): string {
  const expiresAt = Date.now() + ttlDays * 24 * 60 * 60 * 1000;
  const payload = base64UrlEncode(
    `${normalizeEmail(email)}|${expiresAt}`
  );
  return `${payload}.${sign(payload)}`;
}

export function verifyUnsubscribeToken(
  token: string
): { email: string } | null {
  const [payload, signature] = token.split(".");

  if (!payload || !signature) {
    return null;
  }

  const expected = sign(payload);
  const expectedBuffer = Buffer.from(expected, "utf8");
  const signatureBuffer = Buffer.from(signature, "utf8");

  if (
    expectedBuffer.length !== signatureBuffer.length ||
    !crypto.timingSafeEqual(expectedBuffer, signatureBuffer)
  ) {
    return null;
  }

  const decoded = base64UrlDecode(payload);
  const separator = decoded.lastIndexOf("|");

  if (separator === -1) {
    return null;
  }

  const email = normalizeEmail(decoded.slice(0, separator));
  const expiresAt = Number(decoded.slice(separator + 1));

  if (!isValidEmail(email) || !Number.isFinite(expiresAt)) {
    return null;
  }

  if (Date.now() > expiresAt) {
    return null;
  }

  return { email };
}

export function getUnsubscribeUrl(email: string): string {
  return `${siteUrl()}/unsubscribe?token=${encodeURIComponent(
    createUnsubscribeToken(email)
  )}`;
}

export type SubscribeResult =
  | { ok: true; email: string }
  | { ok: false; error: string };

/**
 * Subscribe an email address, re-activating it if it previously unsubscribed.
 */
export async function subscribeEmail(email: string): Promise<SubscribeResult> {
  const normalized = normalizeEmail(email);

  if (!isValidEmail(normalized)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  try {
    const supabase = createAdminClient();

    // `upsert` keeps repeat signups idempotent: an existing subscriber row is
    // updated (re-activated) instead of raising a duplicate-key error.
    const { error } = await supabase.from(TABLE).upsert(
      {
        email: normalized,
        subscribed: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "email" }
    );

    if (error) {
      console.error("Newsletter subscribe failed:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });

      // Surface configuration problems distinctly so they are easy to diagnose,
      // while keeping the public message friendly.
      if (error.code === "42501" || error.code === "42P01") {
        return {
          ok: false,
          error:
            "Subscriptions are temporarily unavailable. Please try again later.",
        };
      }

      return {
        ok: false,
        error: "We could not save your subscription. Please try again.",
      };
    }

    // Send the welcome email in its own try/catch so a delivery failure never
    // turns a successful subscription into an error response.
    try {
      const emailResult = await sendWelcomeEmail({ to: normalized });
      if (!emailResult.success) {
        console.error(
          `Welcome email failed for ${normalized}:`,
          emailResult.error
        );
      }
    } catch (error) {
      console.error(`Welcome email crashed for ${normalized}:`, error);
    }

    return { ok: true, email: normalized };
  } catch (error) {
    // Catches thrown errors such as missing Supabase env vars or network
    // failures, so the API route always returns clean JSON instead of crashing.
    console.error("Newsletter subscribe crashed:", error);
    return {
      ok: false,
      error: "We could not save your subscription. Please try again.",
    };
  }
}

/**
 * Mark an email as unsubscribed. Returns ok even if the email was not on the
 * list, to avoid leaking subscriber information.
 */
export async function unsubscribeEmail(email: string): Promise<boolean> {
  const normalized = normalizeEmail(email);

  if (!isValidEmail(normalized)) {
    return false;
  }

  try {
    const supabase = createAdminClient();

    const { error } = await supabase.from(TABLE).upsert(
      {
        email: normalized,
        subscribed: false,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "email" }
    );

    if (error) {
      console.error("Newsletter unsubscribe failed:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error("Newsletter unsubscribe crashed:", error);
    return false;
  }
}
