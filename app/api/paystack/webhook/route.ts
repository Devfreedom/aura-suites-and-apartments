import { NextRequest, NextResponse } from "next/server";

// Mock database - in production, this would be a real database
const RESERVATIONS: Map<string, any> = new Map();

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
    const crypto = require("crypto");
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

    const event = JSON.parse(body);

    // Handle charge.success event
    if (event.event === "charge.success") {
      const reference = event.data.reference;

      // Update reservation payment status
      if (RESERVATIONS.has(reference)) {
        const reservation = RESERVATIONS.get(reference);
        reservation.paymentStatus = "Paid";
        reservation.paymentReference = reference;
        reservation.paidAt = new Date().toISOString();
        RESERVATIONS.set(reference, reservation);
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
          totalAmount: event.data.amount / 100,
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
