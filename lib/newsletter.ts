/**
 * Newsletter subscription helpers.
 *
 * Subscribers live in `public.subscribers`. Unsubscribe links are signed with
 * HMAC-SHA256 so a valid link cannot be forged for another email address, and
 * links expire automatically.
 */

import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

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

  const supabase = createAdminClient();

  const { error } = await supabase.from(TABLE).upsert(
    {
      email: normalized,
      subscribed: true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "email" }
  );

  if (error) {
    console.error("Newsletter subscribe failed:", error.message);
    return {
      ok: false,
      error: "We could not save your subscription. Please try again.",
    };
  }

  return { ok: true, email: normalized };
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
    console.error("Newsletter unsubscribe failed:", error.message);
    return false;
  }

  return true;
}
