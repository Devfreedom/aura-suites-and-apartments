import { NextRequest, NextResponse } from "next/server";
import { createPendingBooking } from "@/lib/bookings";

interface InitializeBody {
  email?: string;
  amount?: number | string;
  reference?: string;
  callback_url?: string;
  metadata?: Record<string, unknown>;
}

function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
    "http://localhost:3000"
  );
}

export async function POST(request: NextRequest) {
  try {
    const body: InitializeBody = await request.json();
    const { email, amount, reference, callback_url, metadata } = body;

    if (!email || !reference) {
      return NextResponse.json(
        { error: "Missing required fields: email, reference" },
        { status: 400 }
      );
    }

    const amountInKobo = Number(amount);

    if (!Number.isFinite(amountInKobo) || amountInKobo <= 0) {
      return NextResponse.json(
        { error: "Amount must be a positive value in kobo" },
        { status: 400 }
      );
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        { error: "Paystack secret key not configured" },
        { status: 500 }
      );
    }

    const safeMetadata = metadata && typeof metadata === "object" ? metadata : {};

    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount: Math.round(amountInKobo),
          reference,
          callback_url:
            callback_url || `${getSiteUrl()}/booking/verify`,
          metadata: {
            ...safeMetadata,
            payment_date: new Date().toISOString(),
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.status) {
      return NextResponse.json(
        { error: data.message || "Failed to initialize transaction" },
        { status: response.status || 500 }
      );
    }

    const authorizationUrl: string = data.data.authorization_url;

    // Persist the reservation as pending so the webhook can find it, and so the
    // reminder cron can follow up if the guest abandons checkout.
    await createPendingBooking({
      reference,
      customerName: asString(safeMetadata.customer_name),
      customerEmail: email,
      customerPhone: asString(safeMetadata.customer_phone),
      suiteType: asString(safeMetadata.suite_type),
      checkIn: asString(safeMetadata.check_in),
      checkOut: asString(safeMetadata.check_out),
      guestCount: asNumber(safeMetadata.guest_count, 1),
      nights: asNumber(safeMetadata.nights, 1),
      totalAmount: Math.round(amountInKobo) / 100,
      paymentUrl: authorizationUrl,
      metadata: safeMetadata,
    });

    return NextResponse.json({
      status: true,
      authorization_url: authorizationUrl,
      access_code: data.data.access_code,
      reference: data.data.reference,
    });
  } catch (error) {
    console.error("Paystack initialization error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
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
