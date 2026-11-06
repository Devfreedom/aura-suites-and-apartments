import { NextRequest, NextResponse } from "next/server";
import {
  getUnsubscribeUrl,
  isValidEmail,
  normalizeEmail,
  unsubscribeEmail,
  verifyUnsubscribeToken,
} from "@/lib/newsletter";
import { sendUnsubscribeEmail } from "@/lib/email";

/**
 * Two unsubscribe flows:
 *
 * 1. `{ token }`  — the signed link from an email is confirmed and the address
 *    is removed immediately.
 * 2. `{ email }`  — a confirmation email containing a signed link is sent.
 *    The response is always the same so the endpoint cannot be used to probe
 *    whether an address is subscribed.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const token = typeof body?.token === "string" ? body.token : "";
    const email = typeof body?.email === "string" ? body.email : "";

    if (token) {
      const payload = verifyUnsubscribeToken(token);

      if (!payload) {
        return NextResponse.json(
          {
            error:
              "This unsubscribe link is invalid or has expired. Please request a new one.",
          },
          { status: 400 }
        );
      }

      const ok = await unsubscribeEmail(payload.email);

      if (!ok) {
        return NextResponse.json(
          { error: "We could not process your request. Please try again." },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        email: payload.email,
        message: "You have been unsubscribed.",
      });
    }

    if (!email) {
      return NextResponse.json(
        { error: "An email address or unsubscribe token is required." },
        { status: 400 }
      );
    }

    const normalized = normalizeEmail(email);

    // Only send a confirmation email when the address looks valid. Either way,
    // respond identically to avoid subscriber enumeration.
    if (isValidEmail(normalized)) {
      const result = await sendUnsubscribeEmail({
        to: normalized,
        unsubscribeUrl: getUnsubscribeUrl(normalized),
      });

      if (!result.success) {
        console.error(
          `Unsubscribe email failed for ${normalized}:`,
          result.error
        );
      }
    }

    return NextResponse.json({
      success: true,
      message:
        "If that address is on our list, a confirmation email is on its way.",
    });
  } catch (error) {
    console.error("Unsubscribe API error:", error);
    return NextResponse.json(
      { error: "Unable to process your request right now." },
      { status: 500 }
    );
  }
}
