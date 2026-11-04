/**
 * Email Utility for Aura Suites & Apartments
 * Uses Resend as primary provider with console fallback for development.
 */

const emailFrom = process.env.EMAIL_FROM || "noreply@aurasuitessapartments.com";

interface SendConfirmationEmailParams {
  to: string;
  guestName: string;
  suiteName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalAmount: number;
  reference: string;
  address: string;
  hostContact: string;
}

/**
 * Send a luxury booking confirmation email
 */
export async function sendConfirmationEmail({
  to,
  guestName,
  suiteName,
  checkIn,
  checkOut,
  guests,
  totalAmount,
  reference,
  address,
  hostContact,
}: SendConfirmationEmailParams): Promise<{ success: boolean; error?: string }> {
  const subject = `Your Reservation is Confirmed - ${suiteName} at Aura Suites & Apartments`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmation - Aura Suites & Apartments</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F9FAFB; color: #1B365D;">
      <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; box-shadow: 0 10px 30px rgba(27, 54, 93, 0.1); overflow: hidden;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1B365D 0%, #2A4A7F 100%); padding: 40px 32px; text-align: center;">
          <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 32px; font-weight: 700; color: #ffffff; letter-spacing: 0.5px;">
            AURA
          </div>
          <div style="font-size: 14px; color: #D4AF37; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px;">
            Suites & Apartments
          </div>
        </div>

        <!-- Content -->
        <div style="padding: 40px 32px;">
          <h1 style="font-family: 'Playfair Display', Georgia, serif; font-size: 28px; color: #1B365D; margin: 0 0 16px 0;">
            Reservation Confirmed ✨
          </h1>
          
          <p style="font-size: 16px; color: #4A5568; line-height: 1.6; margin-bottom: 24px;">
            Dear <strong>${guestName}</strong>, thank you for choosing Aura Suites & Apartments. Your luxury stay has been confirmed.
          </p>

          <!-- Booking Details -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 20px; color: #1B365D; margin: 0 0 16px 0; border-bottom: 2px solid #D4AF37; padding-bottom: 8px;">
              Booking Details
            </h2>
            
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 10px 0; color: #718096; font-weight: 500;">Suite</td>
                <td style="padding: 10px 0; color: #1B365D; font-weight: 600; text-align: right;">${suiteName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 10px 0; color: #718096; font-weight: 500;">Check-in</td>
                <td style="padding: 10px 0; color: #1B365D; font-weight: 600; text-align: right;">${checkIn}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 10px 0; color: #718096; font-weight: 500;">Check-out</td>
                <td style="padding: 10px 0; color: #1B365D; font-weight: 600; text-align: right;">${checkOut}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 10px 0; color: #718096; font-weight: 500;">Guests</td>
                <td style="padding: 10px 0; color: #1B365D; font-weight: 600; text-align: right;">${guests} guest${guests !== 1 ? "s" : ""}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 10px 0; color: #718096; font-weight: 500;">Total Paid</td>
                <td style="padding: 10px 0; color: #1B365D; font-weight: 700; text-align: right;">₦${totalAmount.toLocaleString()}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 10px 0; color: #718096; font-weight: 500;">Reference</td>
                <td style="padding: 10px 0; color: #1B365D; font-weight: 600; text-align: right; font-family: monospace;">${reference}</td>
              </tr>
            </table>
          </div>

          <!-- Location & Contact -->
          <div style="background: #1B365D; color: #ffffff; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 20px; color: #D4AF37; margin: 0 0 12px 0;">
              Location & Contact
            </h2>
            <p style="margin: 0 0 8px 0; font-size: 14px; line-height: 1.6;">
              <strong>📍 Address:</strong> ${address}
            </p>
            <p style="margin: 0 0 8px 0; font-size: 14px; line-height: 1.6;">
              <strong>📞 Host Contact:</strong> ${hostContact}
            </p>
            <p style="margin: 0; font-size: 14px; line-height: 1.6;">
              <strong>✉️ Email:</strong> reservations@aurasuitessapartments.com
            </p>
          </div>

          <!-- CTA -->
          <div style="text-align: center; margin-top: 24px;">
            <a href="https://aurasuitessapartments.com" style="background: #D4AF37; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
              Visit Our Website
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="padding: 24px 32px; background: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
          <p style="font-size: 12px; color: #718096; margin: 0;">
            This is an automated confirmation email. Please do not reply to this message.
          </p>
          <p style="font-size: 12px; color: #718096; margin: 8px 0 0 0;">
            © 2026 Aura Suites & Apartments. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Try Resend (dynamically imported so the module loads without the package installed)
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(resendApiKey);
      const data = await resend.emails.send({
        from: `Aura Suites & Apartments <${emailFrom}>`,
        to: [to],
        subject,
        html,
      });
      if (data.error) {
        throw new Error(data.error.message);
      }
      return { success: true };
    } catch (err) {
      console.error("Resend email error:", err);
      // Fall through to console logging
    }
  }

  // Development fallback: log to console
  console.log("=".repeat(60));
  console.log("EMAIL CONFIRMATION (Development Mode)");
  console.log("=".repeat(60));
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Guest: ${guestName}`);
  console.log(`Suite: ${suiteName}`);
  console.log(`Check-in: ${checkIn}`);
  console.log(`Check-out: ${checkOut}`);
  console.log(`Guests: ${guests}`);
  console.log(`Total: ₦${totalAmount.toLocaleString()}`);
  console.log(`Reference: ${reference}`);
  console.log("=".repeat(60));
  console.log("Note: Configure RESEND_API_KEY in .env.local to send real emails.");
  console.log("=".repeat(60));

  return { success: true };
}
