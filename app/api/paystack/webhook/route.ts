import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Mock database - in production, this would be a real database
interface Reservation {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  suiteType: string;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  nights: number;
  totalAmount: number;
  paymentStatus: string;
  paymentReference: string | null;
  status: string;
  createdAt: string;
  paidAt: string | null;
}

const RESERVATIONS: Map<string, Reservation> = new Map();

interface PaystackEvent {
  event: string;
  data: {
    reference: string;
    amount: number;
    customer?: {
      name?: string;
      email?: string;
      phone?: string;
    };
    metadata?: {
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

    // Verify webhook signature
    const hash = crypto
      .createHmac("sha512", secretKey)
      .update(body)
      .digest("hex");

    if (hash !== signature) {
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 401 }
      );
    }

    const event: PaystackEvent = JSON.parse(body);

    // Handle charge.success event
    if (event.event === "charge.success") {
      const reference = event.data.reference;
      const amountInNaira = event.data.amount / 100;

      // Update reservation payment status
      if (RESERVATIONS.has(reference)) {
        const reservation = RESERVATIONS.get(reference);
        if (reservation) {
          reservation.paymentStatus = "Paid";
          reservation.paymentReference = reference;
          reservation.paidAt = new Date().toISOString();
          RESERVATIONS.set(reference, reservation);
        }
      } else {
        // Create new reservation from webhook data
        RESERVATIONS.set(reference, {
          id: reference,
          customerName: event.data.customer?.name || "Unknown",
          customerEmail: event.data.customer?.email || "",
          customerPhone: event.data.customer?.phone || "",
          suiteType: event.data.metadata?.suite_type || "Unknown",
          checkIn: event.data.metadata?.check_in || "",
          checkOut: event.data.metadata?.check_out || "",
          guestCount: event.data.metadata?.guest_count || 1,
          nights: event.data.metadata?.nights || 1,
          totalAmount: amountInNaira,
          paymentStatus: "Paid",
          paymentReference: reference,
          status: "Confirmed",
          createdAt: new Date().toISOString(),
          paidAt: new Date().toISOString(),
        });
      }

      console.log(`Payment verified for reference: ${reference}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Paystack webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
