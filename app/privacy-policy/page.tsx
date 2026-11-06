import type { Metadata } from "next";
import LegalPageLayout from "@/components/LegalPageLayout";

export const metadata: Metadata = {
  title: "Privacy Policy | Aura Suites & Apartments",
  description:
    "How Aura Suites & Apartments collects, uses, stores, and protects your personal data, including cookies, retention periods, and your privacy rights.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      eyebrow="Legal & Compliance"
      title="Privacy Policy"
      subtitle="How we collect, use, and protect your personal information when you visit or book with Aura Suites & Apartments."
      updatedAt="1 November 2026"
    >
      <p>
        Aura Suites &amp; Apartments (&quot;Aura&quot;, &quot;we&quot;,
        &quot;us&quot;) respects your privacy. This policy explains what
        information we collect, why we collect it, how long we keep it, and the
        choices available to you. It applies to our website, booking flow, and
        email communications.
      </p>

      <h2>1. Information We Collect</h2>
      <h3>Information you provide</h3>
      <ul>
        <li>
          <strong>Reservation details:</strong> name, email address, phone
          number, suite selected, check-in and check-out dates, and guest count.
        </li>
        <li>
          <strong>Payment information:</strong> payment is processed by Paystack.
          We receive confirmation, reference, amount, and status, but never your
          full card number or card security code.
        </li>
        <li>
          <strong>Newsletter:</strong> the email address you submit to join our
          mailing list.
        </li>
        <li>
          <strong>Communications:</strong> messages you send us by email, phone,
          or our contact form.
        </li>
      </ul>

      <h3>Information collected automatically</h3>
      <ul>
        <li>
          Technical data such as browser type, device type, approximate location
          derived from IP address, and pages visited.
        </li>
        <li>
          Cookie and local-storage data, as described in the Cookies section
          below.
        </li>
      </ul>

      <h2 id="cookies">2. Cookies &amp; Similar Technologies</h2>
      <p>
        Cookies are small text files stored on your device. We also use browser{" "}
        <strong>localStorage</strong> to remember your cookie choice under the key{" "}
        <code>aura-cookie-consent</code>.
      </p>
      <ul>
        <li>
          <strong>Essential cookies:</strong> required for the site to function
          securely, including session management and payment flow. These cannot
          be switched off.
        </li>
        <li>
          <strong>Preference storage:</strong> remembers your cookie consent
          choice so we do not ask on every visit.
        </li>
        <li>
          <strong>Analytics cookies (where enabled):</strong> help us understand
          which suites and pages are most useful. These are loaded only when you
          accept all cookies.
        </li>
        <li>
          <strong>Marketing cookies (where enabled):</strong> used to measure
          campaigns and show relevant offers. Also loaded only with your consent.
        </li>
      </ul>
      <p>
        You can accept all cookies or essential cookies only using our cookie
        banner. You may also clear cookies and localStorage at any time through
        your browser settings; clearing storage will cause the banner to appear
        again.
      </p>

      <h2>3. How We Use Your Information</h2>
      <ul>
        <li>To process reservations, payments, and send booking receipts.</li>
        <li>To send payment reminders for unpaid reservations.</li>
        <li>To provide customer support and respond to enquiries.</li>
        <li>
          To send newsletter updates and offers, only where you have subscribed.
        </li>
        <li>To improve our website, services, and guest experience.</li>
        <li>To meet legal, tax, and accounting obligations.</li>
        <li>To prevent fraud and protect the security of our systems.</li>
      </ul>

      <h2>4. Legal Basis for Processing</h2>
      <p>
        We process personal data on the basis of contract performance (your
        reservation), consent (newsletter and non-essential cookies), legitimate
        interests (security, service improvement), and legal obligations. You may
        withdraw consent at any time without affecting processing that already
        took place.
      </p>

      <h2>5. Sharing Your Information</h2>
      <p>
        We do not sell your personal data. We share it only with service
        providers who help us operate, and only as necessary:
      </p>
      <ul>
        <li>
          <strong>Supabase</strong> — secure database hosting and storage.
        </li>
        <li>
          <strong>Paystack</strong> — payment processing and fraud checks.
        </li>
        <li>
          <strong>Resend</strong> — delivery of transactional and marketing
          emails.
        </li>
        <li>
          <strong>Hosting and infrastructure providers</strong> — to serve the
          website securely.
        </li>
        <li>
          <strong>Law enforcement or regulators</strong> — where required by law
          or to protect our legal rights.
        </li>
      </ul>

      <h2>6. Data Retention</h2>
      <ul>
        <li>
          <strong>Reservation and payment records:</strong> retained for up to 7
          years to meet accounting, tax, and dispute-resolution requirements.
        </li>
        <li>
          <strong>Newsletter subscriptions:</strong> retained until you
          unsubscribe, plus a short period to record your opt-out. Unsubscribed
          addresses are marked inactive and not used for marketing.
        </li>
        <li>
          <strong>Contact enquiries:</strong> retained for up to 24 months after
          the matter is resolved.
        </li>
        <li>
          <strong>Cookie consent:</strong> stored in your browser until cleared.
        </li>
      </ul>

      <h2>7. Your Privacy Rights</h2>
      <p>Subject to applicable law, you have the right to:</p>
      <ul>
        <li>
          <strong>Access</strong> the personal data we hold about you.
        </li>
        <li>
          <strong>Correct</strong> inaccurate or incomplete information.
        </li>
        <li>
          <strong>Request deletion</strong> of your personal data, where we are
          not required to retain it.
        </li>
        <li>
          <strong>Object to or restrict</strong> certain processing.
        </li>
        <li>
          <strong>Withdraw consent</strong> for marketing or non-essential
          cookies at any time.
        </li>
        <li>
          <strong>Request a portable copy</strong> of the data you provided.
        </li>
      </ul>
      <p>
        To exercise any of these rights, email{" "}
        <a href="mailto:reservations@aurasuitessapartments.com">
          reservations@aurasuitessapartments.com
        </a>
        . We may need to verify your identity before responding, and we aim to
        reply within 30 days.
      </p>

      <h2>8. Marketing &amp; Unsubscribe</h2>
      <p>
        You can unsubscribe from marketing emails at any time using the link in
        any newsletter or by visiting our{" "}
        <a href="/unsubscribe">unsubscribe page</a>. Unsubscribe links are
        signed and expire for security. Transactional emails such as receipts and
        payment reminders are not marketing and may still be sent for active
        reservations.
      </p>

      <h2>9. Data Security</h2>
      <p>
        We use industry-standard measures including encrypted connections (HTTPS),
        access controls, and row-level security in our database. Payment card
        details are handled by Paystack and never stored on our servers. No
        method of transmission or storage is completely secure, but we work to
        protect your data and review our practices regularly.
      </p>

      <h2>10. International Transfers</h2>
      <p>
        Some of our service providers may process data outside Nigeria. Where
        this happens, we rely on appropriate safeguards and contractual
        protections to keep your information secure.
      </p>

      <h2>11. Children&apos;s Privacy</h2>
      <p>
        Our services are intended for adults. We do not knowingly collect personal
        data from children under 18 without the consent of a parent or guardian.
        If you believe a child has provided us with personal data, please contact
        us so we can remove it.
      </p>

      <h2>12. Changes to This Policy</h2>
      <p>
        We may update this policy from time to time. Material changes will be
        posted on this page with a revised &quot;last updated&quot; date. Please
        review it periodically.
      </p>

      <h2>13. Contact Us</h2>
      <p>
        For privacy questions or requests, contact us at{" "}
        <a href="mailto:reservations@aurasuitessapartments.com">
          reservations@aurasuitessapartments.com
        </a>{" "}
        or +234 (0) 800 AURA STAY, or write to us at No. 5 Kashim Ibrahim Road,
        Jos, Plateau State, Nigeria.
      </p>
    </LegalPageLayout>
  );
}
