import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import {
  createPaidBookingFromWebhook,
  getBookingByReference,
  markBookingPaid,
} from "@/lib/bookings";
import { sendConfirmationEmail } from "@/lib/email";
import type { Booking } from "@/types/booking";

interface PaystackEvent {
  event: string;
  data: {
    reference: string;
    amount: number;
    paid_at?: string;
    channel?: string;
    customer?: {
      name?: string;
      email?: string;
      phone?: string;
    };
    metadata?: {
      customer_name?: string;
      customer_phone?: string;
      suite_type?: string;
      check_in?: string;
      check_out?: string;
      guest_count?: number;
      nights?: number;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
}

function verifySignature(body: string, signature: string, secret: string): boolean {
  const expected = crypto
    .createHmac("sha512", secret)
    .update(body)
    .digest("hex");

  const expectedBuffer = Buffer.from(expected, "utf8");
  const signatureBuffer = Buffer.from(signature, "utf8");

  if (expectedBuffer.length !== signatureBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, signatureBuffer);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-paystack-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing Paystack signature" },
        { status: 401 }
      );
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        { error: "Paystack secret key not configured" },
        { status: 500 }
      );
    }

    if (!verifySignature(body, signature, secretKey)) {
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 401 }
      );
    }

    let event: PaystackEvent;

    try {
      event = JSON.parse(body) as PaystackEvent;
    } catch {
      return NextResponse.json(
        { error: "Invalid webhook payload" },
        { status: 400 }
      );
    }

    if (event.event !== "charge.success") {
      // Acknowledge other events so Paystack stops retrying them.
      return NextResponse.json({ received: true, ignored: event.event });
    }

    const { reference, amount } = event.data;
    const metadata = event.data.metadata ?? {};

    if (!reference) {
      return NextResponse.json(
        { error: "Missing transaction reference" },
        { status: 400 }
      );
    }

    // Prefer a pending row (created at initialize time). If none exists, create
    // a paid booking from the webhook payload so no successful charge is lost.
    const existing = await getBookingByReference(reference);

    let booking: Booking | null;
    let justPaid: boolean;

    if (existing) {
      const result = await markBookingPaid(reference, {
        paymentMethod: event.data.channel || "Paystack",
        paidAt: event.data.paid_at,
      });
      booking = result.booking;
      justPaid = result.justPaid;

      if (booking) {
        const expectedKobo = Math.round(booking.totalAmount * 100);
        if (expectedKobo !== Number(amount)) {
          console.warn(
            `Paystack amount mismatch for ${reference}: expected ${expectedKobo}, received ${amount}`
          );
        }
      }
    } else {
      const result = await createPaidBookingFromWebhook({
        reference,
        customerName:
          asString(metadata.customer_name) || event.data.customer?.name,
        customerEmail: event.data.customer?.email ?? "",
        customerPhone:
          asString(metadata.customer_phone) || event.data.customer?.phone,
        suiteType: asString(metadata.suite_type),
        checkIn: asString(metadata.check_in),
        checkOut: asString(metadata.check_out),
        guestCount: asNumber(metadata.guest_count, 1),
        nights: asNumber(metadata.nights, 1),
        totalAmount: Number(amount) / 100,
        metadata,
      });
      booking = result.booking;
      justPaid = result.justPaid;
    }

    // Only send the receipt on the transition to paid, so webhook retries and
    // the client-side verify/confirm flow never send duplicate emails.
    if (justPaid && booking?.customerEmail) {
      const emailResult = await sendConfirmationEmail({
        to: booking.customerEmail,
        guestName: booking.customerName || "Guest",
        suiteName: booking.suiteType || "Aura Suite",
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guests: booking.guestCount,
        nights: booking.nights,
        totalAmount: booking.totalAmount,
        reference: booking.reference,
        paymentMethod: booking.paymentMethod || "Paystack",
        paidAt: booking.paidAt || new Date().toISOString(),
      });

      if (!emailResult.success) {
        console.error(
          `Receipt email failed for ${booking.reference}:`,
          emailResult.error
        );
      }
    }

    console.log(`Payment verified for reference: ${reference}`);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Paystack webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function asNumber(value: unknown, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}
