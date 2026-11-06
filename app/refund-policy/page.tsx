import type { Metadata } from "next";
import LegalPageLayout from "@/components/LegalPageLayout";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | Aura Suites & Apartments",
  description:
    "Cancellation terms, refund eligibility, and processing timelines for reservations at Aura Suites & Apartments in Jos, Plateau State.",
};

export default function RefundPolicyPage() {
  return (
    <LegalPageLayout
      eyebrow="Legal & Compliance"
      title="Refund & Cancellation Policy"
      subtitle="Clear, fair terms for changing or cancelling your reservation at Aura Suites & Apartments."
      updatedAt="1 November 2026"
    >
      <p>
        This policy explains how reservations, cancellations, date changes, and
        refunds are handled at <strong>Aura Suites &amp; Apartments</strong>
        (&quot;Aura&quot;, &quot;we&quot;, &quot;us&quot;), located at No. 5
        Kashim Ibrahim Road, Jos, Plateau State, Nigeria. By confirming a
        reservation you agree to the terms below.
      </p>

      <h2>1. Reservations &amp; Payment</h2>
      <p>
        All reservations are confirmed only after full payment has been received
        and verified. Payments are processed securely through{" "}
        <strong>Paystack</strong> in Nigerian Naira (NGN). A reservation is not
        guaranteed until you receive a payment receipt and booking confirmation
        by email.
      </p>
      <ul>
        <li>
          Rates quoted are per night and include the amenities described on the
          suite listing.
        </li>
        <li>
          A refundable incidentals or damages deposit may be requested at
          check-in for certain suites. This is separate from your reservation
          payment and is returned after inspection.
        </li>
        <li>
          Payment processing fees charged by Paystack are non-refundable, except
          where the cancellation is caused by Aura.
        </li>
      </ul>

      <h2>2. Cancellation by the Guest</h2>
      <p>
        Cancellation requests must be submitted in writing to{" "}
        <a href="mailto:reservations@aurasuitessapartments.com">
          reservations@aurasuitessapartments.com
        </a>{" "}
        or by calling +234 (0) 800 AURA STAY. The cancellation date is the date
        we receive your written request. Refunds are calculated on the total
        amount paid, as follows:
      </p>
      <ul>
        <li>
          <strong>7 or more days before check-in:</strong> full refund of the
          reservation amount, less any non-refundable payment processing fees.
        </li>
        <li>
          <strong>3 to 6 days before check-in:</strong> 50% refund of the
          reservation amount.
        </li>
        <li>
          <strong>Less than 72 hours before check-in:</strong> no refund.
        </li>
        <li>
          <strong>No-show or early departure:</strong> no refund for unused
          nights.
        </li>
      </ul>

      <h2>3. Date Changes</h2>
      <p>
        We understand plans change. Subject to availability, you may move your
        reservation to a later date at no additional charge if the request is
        made at least <strong>72 hours before check-in</strong>. Rate differences
        for the new dates may apply. Each reservation may be rescheduled once;
        subsequent changes are treated as a cancellation and new booking.
      </p>

      <h2>4. Cancellation by Aura</h2>
      <p>
        In the rare event that we cannot honour a confirmed reservation — for
        example due to maintenance, safety issues, or circumstances beyond our
        control — we will:
      </p>
      <ul>
        <li>offer a comparable suite at the same rate, or</li>
        <li>
          provide a full refund of the amount paid, including any processing
          fees.
        </li>
      </ul>
      <p>
        Where possible, we will also assist with alternative accommodation. Our
        liability in these circumstances is limited to the amount you paid for
        the affected nights.
      </p>

      <h2>5. Refund Processing</h2>
      <p>
        Approved refunds are returned to the original payment method used at
        checkout. Please allow <strong>5 to 10 business days</strong> for the
        refund to reflect, depending on your bank or card issuer. We will send
        you a confirmation email once the refund has been initiated.
      </p>

      <h2>6. Exceptions</h2>
      <p>
        Refunds are not available for:
      </p>
      <ul>
        <li>Guests removed for breaching our house rules or causing damage.</li>
        <li>
          Complaints raised after departure where we were not given a reasonable
          opportunity to resolve the issue during your stay.
        </li>
        <li>
          Third-party bookings, packages, or add-ons purchased outside Aura.
        </li>
      </ul>

      <h2>7. Force Majeure</h2>
      <p>
        Neither party is liable for failure to perform caused by events beyond
        reasonable control, including natural disasters, civil unrest,
        government restrictions, or extended utility failures. In such cases we
        will work with you in good faith to reschedule or refund where
        practicable.
      </p>

      <h2>8. How to Request a Refund</h2>
      <p>To request a cancellation or refund, contact us with:</p>
      <ul>
        <li>Your booking reference (shown on your receipt),</li>
        <li>The email address used for the reservation,</li>
        <li>The suite name and dates booked, and</li>
        <li>The reason for the request.</li>
      </ul>
      <p>
        Email{" "}
        <a href="mailto:reservations@aurasuitessapartments.com">
          reservations@aurasuitessapartments.com
        </a>{" "}
        or call +234 (0) 800 AURA STAY, daily between 8:00 AM and 10:00 PM.
      </p>

      <h2>9. Related Policies</h2>
      <p>
        Please also read our{" "}
        <a href="/privacy-policy">Privacy Policy</a> to understand how we handle
        your personal data. These terms are governed by the laws of the Federal
        Republic of Nigeria.
      </p>
    </LegalPageLayout>
  );
}
