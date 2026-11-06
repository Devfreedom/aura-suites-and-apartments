import { NextRequest, NextResponse } from "next/server";
import {
  getBookingsDueForReminder,
  markReminderSent,
} from "@/lib/bookings";
import { sendPaymentReminderEmail } from "@/lib/email";

/**
 * Sends payment reminders for reservations left unpaid past the grace period.
 *
 * Intended to be triggered by Vercel Cron (see `vercel.json`) every 10 minutes.
 * When CRON_SECRET is configured, callers must send
 * `Authorization: Bearer <CRON_SECRET>`.
 */

const DEFAULT_REMINDER_MINUTES = 20;

function reminderDelayMinutes(): number {
  const configured = Number(process.env.PAYMENT_REMINDER_MINUTES);
  return Number.isFinite(configured) && configured >= 15
    ? configured
    : DEFAULT_REMINDER_MINUTES;
}

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret) {
    const authorization = request.headers.get("authorization");
    if (authorization !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const delayMinutes = reminderDelayMinutes();
    const cutoff = new Date(
      Date.now() - delayMinutes * 60 * 1000
    ).toISOString();

    const bookings = await getBookingsDueForReminder(cutoff);

    let sent = 0;
    let failed = 0;

    for (const booking of bookings) {
      if (!booking.customerEmail) {
        failed += 1;
        continue;
      }

      const result = await sendPaymentReminderEmail({
        to: booking.customerEmail,
        guestName: booking.customerName || "Guest",
        suiteName: booking.suiteType || "Aura Suite",
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        totalAmount: booking.totalAmount,
        reference: booking.reference,
        paymentUrl: booking.paymentUrl,
      });

      if (result.success) {
        await markReminderSent(booking.id);
        sent += 1;
      } else {
        failed += 1;
        console.error(
          `Payment reminder failed for ${booking.reference}:`,
          result.error
        );
      }
    }

    return NextResponse.json({
      success: true,
      cutoff,
      delayMinutes,
      candidates: bookings.length,
      sent,
      failed,
    });
  } catch (error) {
    console.error("Payment reminder cron error:", error);
    return NextResponse.json(
      { error: "Payment reminder job failed" },
      { status: 500 }
    );
  }
}
