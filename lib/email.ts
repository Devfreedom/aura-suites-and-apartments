/**
 * Email notifications for Aura Suites & Apartments.
 *
 * All messages are sent through Resend when RESEND_API_KEY is configured.
 * Without a key, messages are logged to the server console so local
 * development still works end-to-end.
 */

import { Resend } from "resend";

const emailFrom = process.env.EMAIL_FROM || "noreply@aurasuitessapartments.com";
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
  "http://localhost:3000";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

interface EmailResult {
  success: boolean;
  error?: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatNaira(amount: number): string {
  return `₦${Number(amount || 0).toLocaleString("en-NG")}`;
}

/**
 * Wrap email content in the shared Aura branded shell.
 */
function emailShell({
  preheader,
  heading,
  body,
}: {
  preheader: string;
  heading: string;
  body: string;
}): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${escapeHtml(heading)} - Aura Suites & Apartments</title>
    </head>
    <body style="margin:0;padding:0;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background-color:#F3F4F6;color:#1B365D;">
      <span style="display:none!important;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;">${escapeHtml(preheader)}</span>
      <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:16px;box-shadow:0 10px 30px rgba(27,54,93,0.12);overflow:hidden;">
        <div style="background:linear-gradient(135deg,#1B365D 0%,#2A4A7F 100%);padding:40px 32px;text-align:center;">
          <div style="font-family:'Playfair Display',Georgia,serif;font-size:32px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">AURA</div>
          <div style="font-size:14px;color:#D4AF37;text-transform:uppercase;letter-spacing:2px;margin-top:4px;">Suites &amp; Apartments</div>
        </div>
        <div style="padding:40px 32px;">
          <h1 style="font-family:'Playfair Display',Georgia,serif;font-size:28px;color:#1B365D;margin:0 0 18px 0;line-height:1.25;">${escapeHtml(heading)}</h1>
          ${body}
        </div>
        <div style="padding:24px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;">
          <p style="font-size:12px;color:#718096;margin:0;">This is an automated message from Aura Suites &amp; Apartments. Please do not reply directly to this email.</p>
          <p style="font-size:12px;color:#718096;margin:8px 0 0 0;">© ${new Date().getFullYear()} Aura Suites &amp; Apartments. All rights reserved.</p>
          <p style="font-size:12px;color:#718096;margin:8px 0 0 0;">No. 5 Kashim Ibrahim Road, Jos, Plateau State, Nigeria</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function detailRow(label: string, value: string, last = false): string {
  return `
    <tr style="border-bottom:${last ? "none" : "1px solid #e2e8f0"};">
      <td style="padding:12px 0;color:#718096;font-weight:500;font-size:14px;">${escapeHtml(label)}</td>
      <td style="padding:12px 0;color:#1B365D;font-weight:600;text-align:right;font-size:14px;">${escapeHtml(value)}</td>
    </tr>
  `;
}

/**
 * Low-level sender. All feature-specific helpers call this.
 */
export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: SendEmailParams): Promise<EmailResult> {
  if (!resend) {
    console.log("=".repeat(60));
    console.log("EMAIL (Development Mode — RESEND_API_KEY not set)");
    console.log("=".repeat(60));
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`From: ${emailFrom}`);
    console.log("=".repeat(60));
    return { success: true };
  }

  try {
    const { error } = await resend.emails.send({
      from: `Aura Suites & Apartments <${emailFrom}>`,
      to: [to],
      subject,
      html,
      ...(replyTo ? { replyTo } : {}),
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown email error";
    console.error(`Email send failed (${to}):`, message);
    return { success: false, error: message };
  }
}

interface SendConfirmationEmailParams {
  to: string;
  guestName: string;
  suiteName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights?: number;
  totalAmount: number;
  reference: string;
  address?: string;
  hostContact?: string;
  paymentMethod?: string;
  paidAt?: string;
}

/**
 * Transaction receipt / booking confirmation sent after a successful charge.
 */
export async function sendConfirmationEmail({
  to,
  guestName,
  suiteName,
  checkIn,
  checkOut,
  guests,
  nights,
  totalAmount,
  reference,
  address = "No. 5 Kashim Ibrahim Road, Jos, Plateau State",
  hostContact = "+234 (0) 800 AURA STAY",
  paymentMethod = "Paystack",
  paidAt = new Date().toISOString(),
}: SendConfirmationEmailParams): Promise<EmailResult> {
  const paidDate = new Date(paidAt).toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const body = `
    <p style="font-size:16px;color:#4A5568;line-height:1.6;margin:0 0 24px 0;">
      Dear <strong>${escapeHtml(guestName)}</strong>, thank you for choosing Aura Suites &amp; Apartments.
      Your payment has been received and your reservation is confirmed.
    </p>

    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:24px;margin-bottom:24px;">
      <h2 style="font-family:'Playfair Display',Georgia,serif;font-size:20px;color:#1B365D;margin:0 0 16px 0;border-bottom:2px solid #D4AF37;padding-bottom:8px;">
        Transaction Receipt
      </h2>
      <table style="width:100%;border-collapse:collapse;">
        ${detailRow("Receipt / Reference", reference)}
        ${detailRow("Suite", suiteName)}
        ${detailRow("Check-in", checkIn)}
        ${detailRow("Check-out", checkOut)}
        ${detailRow("Guests", `${guests} guest${guests === 1 ? "" : "s"}`)}
        ${nights ? detailRow("Nights", String(nights)) : ""}
        ${detailRow("Payment Method", paymentMethod)}
        ${detailRow("Paid On", paidDate)}
        ${detailRow("Total Paid", formatNaira(totalAmount), true)}
      </table>
    </div>

    <div style="background:#1B365D;color:#ffffff;border-radius:12px;padding:24px;margin-bottom:24px;">
      <h2 style="font-family:'Playfair Display',Georgia,serif;font-size:20px;color:#D4AF37;margin:0 0 12px 0;">Location &amp; Contact</h2>
      <p style="margin:0 0 8px 0;font-size:14px;line-height:1.6;"><strong>📍 Address:</strong> ${escapeHtml(address)}</p>
      <p style="margin:0 0 8px 0;font-size:14px;line-height:1.6;"><strong>📞 Host Contact:</strong> ${escapeHtml(hostContact)}</p>
      <p style="margin:0;font-size:14px;line-height:1.6;"><strong>✉️ Email:</strong> reservations@aurasuitessapartments.com</p>
    </div>

    <div style="text-align:center;margin-top:24px;">
      <a href="${siteUrl}" style="background:#D4AF37;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;">Visit Our Website</a>
    </div>
  `;

  return sendEmail({
    to,
    subject: `Payment Receipt & Booking Confirmation — ${suiteName}`,
    html: emailShell({
      preheader: `Your payment of ${formatNaira(totalAmount)} was received. Reference ${reference}.`,
      heading: "Payment Confirmed — Your Receipt",
      body,
    }),
    replyTo: "reservations@aurasuitessapartments.com",
  });
}

interface SendPaymentReminderEmailParams {
  to: string;
  guestName: string;
  suiteName: string;
  checkIn: string;
  checkOut: string;
  totalAmount: number;
  reference: string;
  paymentUrl?: string | null;
}

/**
 * Reminder for a reservation that is still unpaid after the grace period.
 */
export async function sendPaymentReminderEmail({
  to,
  guestName,
  suiteName,
  checkIn,
  checkOut,
  totalAmount,
  reference,
  paymentUrl,
}: SendPaymentReminderEmailParams): Promise<EmailResult> {
  const resumeUrl = paymentUrl || `${siteUrl}/contact`;
  const body = `
    <p style="font-size:16px;color:#4A5568;line-height:1.6;margin:0 0 24px 0;">
      Dear <strong>${escapeHtml(guestName)}</strong>, your reservation for
      <strong>${escapeHtml(suiteName)}</strong> is being held, but we have not yet
      received payment.
    </p>

    <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:20px;margin-bottom:24px;">
      <p style="margin:0;font-size:14px;color:#92400e;line-height:1.6;">
        <strong>Please complete payment within the next 24 hours</strong> to keep
        your dates reserved. After this window we may release the suite to other guests.
      </p>
    </div>

    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:24px;margin-bottom:24px;">
      <table style="width:100%;border-collapse:collapse;">
        ${detailRow("Reference", reference)}
        ${detailRow("Suite", suiteName)}
        ${detailRow("Check-in", checkIn)}
        ${detailRow("Check-out", checkOut)}
        ${detailRow("Outstanding Amount", formatNaira(totalAmount), true)}
      </table>
    </div>

    <div style="text-align:center;margin-top:24px;">
      <a href="${resumeUrl}" style="background:#D4AF37;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;">Complete Payment</a>
    </div>

    <p style="font-size:13px;color:#718096;line-height:1.6;margin:24px 0 0 0;text-align:center;">
      Already paid? Please disregard this message — your receipt will arrive shortly.
    </p>
  `;

  return sendEmail({
    to,
    subject: `Payment Reminder — ${suiteName} reservation ${reference}`,
    html: emailShell({
      preheader: `Your reservation is still awaiting payment. Reference ${reference}.`,
      heading: "Your Reservation Is Awaiting Payment",
      body,
    }),
    replyTo: "reservations@aurasuitessapartments.com",
  });
}

/**
 * Sends the tokenized unsubscribe link requested from the unsubscribe page.
 */
export async function sendUnsubscribeEmail({
  to,
  unsubscribeUrl,
}: {
  to: string;
  unsubscribeUrl: string;
}): Promise<EmailResult> {
  const body = `
    <p style="font-size:16px;color:#4A5568;line-height:1.6;margin:0 0 24px 0;">
      We received a request to unsubscribe <strong>${escapeHtml(to)}</strong> from
      Aura Suites &amp; Apartments marketing emails.
    </p>
    <div style="text-align:center;margin:28px 0;">
      <a href="${unsubscribeUrl}" style="background:#1B365D;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;">Confirm Unsubscribe</a>
    </div>
    <p style="font-size:13px;color:#718096;line-height:1.6;">
      If you did not request this, you can safely ignore this email and you will
      remain subscribed. This link expires in 7 days.
    </p>
  `;

  return sendEmail({
    to,
    subject: "Confirm your unsubscribe request — Aura Suites & Apartments",
    html: emailShell({
      preheader: "Confirm that you no longer wish to receive marketing emails.",
      heading: "Unsubscribe Request",
      body,
    }),
  });
}
