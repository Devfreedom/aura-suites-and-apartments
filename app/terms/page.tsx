import type { Metadata } from "next";
import LegalPageLayout from "@/components/LegalPageLayout";

export const metadata: Metadata = {
  title: "Terms of Service | Aura Suites & Apartments",
  description:
    "Terms and conditions governing the use of the Aura Suites & Apartments website and the booking of luxury suites in Jos, Plateau State, Nigeria.",
};

export default function TermsOfServicePage() {
  return (
    <LegalPageLayout
      eyebrow="Legal & Compliance"
      title="Terms of Service"
      subtitle="Please read these terms carefully before using our website or making a reservation with Aura Suites & Apartments."
      updatedAt="9 November 2026"
    >
      <p>
        Welcome to Aura Suites &amp; Apartments (&quot;Aura&quot;, &quot;we&quot;,
        &quot;us&quot;, &quot;our&quot;). These Terms of Service (&quot;Terms&quot;)
        govern your use of our website and your booking and stay at our luxury
        shortlet suites at No. 5 Kashim Ibrahim Road, Jos, Plateau State, Nigeria.
        By accessing our website, making a reservation, or staying with us, you
        agree to be bound by these Terms.
      </p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By using our website or completing a booking, you confirm that you are at
        least 18 years old, have the legal capacity to enter into a binding
        agreement, and accept these Terms, our{" "}
        <a href="/privacy-policy">Privacy Policy</a>, and our Cancellation &
        Refund Policy. If you do not agree, please do not use our website or make
        a booking.
      </p>

      <h2>2. Use of the Website</h2>
      <p>
        You may use our website only for lawful purposes and in accordance with
        these Terms. You must not:
      </p>
      <ul>
        <li>
          Use the site to transmit any unlawful, harmful, or objectionable
          content;
        </li>
        <li>
          Interfere with or disrupt the security or performance of the website;
        </li>
        <li>
          Attempt to gain unauthorised access to any part of our systems or data;
        </li>
        <li>
          Scrape, copy, or reproduce content from the site without our written
          consent.
        </li>
      </ul>

      <h2>3. Bookings &amp; Reservations</h2>
      <p>
        All reservations are subject to availability. A booking is confirmed only
        once we have received full payment or a valid payment authorisation
        through our payment provider, Paystack. We will send a booking
        confirmation to the email address you provide. Please check your details
        carefully; errors in names, dates, or guest count may not be correctable
        after confirmation.
      </p>

      <h2>4. Payment &amp; Pricing</h2>
      <p>
        All prices are quoted in Nigerian Naira (₦) and are inclusive of
        applicable taxes unless stated otherwise. Prices may change at any time,
        but the price confirmed at the time of your booking will be honoured.
        Payment is processed securely by Paystack; we do not store your full card
        details on our servers.
      </p>

      <h2>5. Cancellation &amp; Refund Policy</h2>
      <p>
        Cancellations must be requested in writing by email to{" "}
        <a href="mailto:reservations@aurasuitessapartments.com">
          reservations@aurasuitessapartments.com
        </a>
        . Refunds, where applicable, are processed according to the cancellation
        terms shown at the time of booking and are issued to the original method
        of payment. Non-refundable rates and promotional packages may not be
        cancelled or amended. Please review our full Cancellation &amp; Refund
        Policy before booking.
      </p>

      <h2>6. Check-In &amp; Check-Out</h2>
      <ul>
        <li>
          <strong>Standard check-in:</strong> 3:00 PM. Early check-in is
          subject to availability and may incur an additional charge.
        </li>
        <li>
          <strong>Standard check-out:</strong> 11:00 AM. Late check-out is
          subject to availability and may incur an additional charge.
        </li>
        <li>
          A valid government-issued photo ID is required at check-in for all
          guests.
        </li>
      </ul>

      <h2>7. Guest Conduct</h2>
      <p>
        Guests are expected to treat the property, staff, and other guests with
        respect. Smoking is prohibited inside all suites and common areas.
        Pets are not permitted unless expressly authorised in writing. The
        maximum occupancy stated for each suite must not be exceeded. We
        reserve the right to refuse entry or ask any guest to leave without a
        refund for breach of these Terms or illegal or disruptive behaviour.
      </p>

      <h2>8. Liability</h2>
      <p>
        We take reasonable care to maintain a safe, secure, and comfortable
        environment, but we are not liable for loss, injury, or damage to
        personal property except where caused by our gross negligence or wilful
        misconduct. We are not liable for indirect or consequential losses,
        including disrupted travel plans. Our total liability arising from a
        booking is limited to the amount you paid for that booking.
      </p>

      <h2>9. Intellectual Property</h2>
      <p>
        All content on this website — including text, images, logos, designs,
        and the &quot;Aura Suites &amp; Apartments&quot; name — is owned by us or
        our licensors and is protected by copyright and trademark law. You may
        not reproduce or use any content without our prior written consent.
      </p>

      <h2>10. Governing Law</h2>
      <p>
        These Terms are governed by and construed in accordance with the laws of
        the Federal Republic of Nigeria. Any dispute arising from these Terms or
        your stay will be subject to the exclusive jurisdiction of the courts of
        Plateau State, Nigeria.
      </p>

      <h2>11. Changes to These Terms</h2>
      <p>
        We may update these Terms from time to time. Material changes will be
        posted on this page with a revised &quot;last updated&quot; date. Your
        continued use of the website or a new booking after changes are posted
        constitutes acceptance of the revised Terms.
      </p>

      <h2>12. Contact Us</h2>
      <p>
        If you have any questions about these Terms, please contact us at{" "}
        <a href="mailto:reservations@aurasuitessapartments.com">
          reservations@aurasuitessapartments.com
        </a>
        , or write to us at No. 5 Kashim Ibrahim Road, Jos, Plateau State,
        Nigeria.
      </p>
    </LegalPageLayout>
  );
}
