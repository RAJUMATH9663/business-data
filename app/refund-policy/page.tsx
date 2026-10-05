import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy | NivoLeads",
  description: "Official cancellation and refund policy for NivoLeads B2B business directory platform.",
};

export default function RefundPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 py-6">
      <div className="card p-8 sm:p-12">
        <div className="border-b border-[var(--border-card)] pb-6">
          <span className="badge-brand">Customer Protection</span>
          <h1 className="mt-2 text-3xl font-extrabold text-[var(--text-main)] sm:text-4xl">
            Cancellation & Refund Policy
          </h1>
          <p className="mt-2 text-xs text-[var(--text-muted)]">
            Last Updated: {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
          </p>
        </div>

        <div className="mt-8 space-y-6 text-sm text-[var(--text-main)] leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-main)]">1. Digital Services Overview</h2>
            <p className="text-[var(--text-muted)]">
              NivoLeads operates as an online B2B business directory and commercial enterprise intelligence platform. Upon completing a payment via Razorpay, UPI, Credit/Debit Cards, or Net Banking, access to the selected verified business profiles and directory listings is delivered immediately in digital format (via dashboard unlock and downloadable Excel/CSV format).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-main)]">2. Refund Eligibility</h2>
            <p className="text-[var(--text-muted)]">
              We strive to maintain the highest quality standards. Due to the instantaneous nature of digital data delivery, completed orders are generally non-refundable once unlocked. However, you are fully eligible for a refund under the following circumstances:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[var(--text-muted)]">
              <li><strong>Duplicate Transaction:</strong> If your bank account or card was debited multiple times for a single order due to a network or gateway failure.</li>
              <li><strong>Technical Allocation Failure:</strong> If payment was debited from your account but the directory listings failed to unlock in your dashboard due to a technical server error, and our support team is unable to resolve it within 24 hours.</li>
              <li><strong>Unverified Data Exceeding Threshold:</strong> If more than 20% of the directory profiles in a purchased package contain verifiable invalid or defunct contact details, reported within 7 days of purchase.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-main)]">3. Cancellation Terms</h2>
            <p className="text-[var(--text-muted)]">
              Since directory credits and dataset purchases are one-time on-demand orders (not recurring recurring subscriptions), cancellation requests can only be entertained prior to dataset generation or download. Once digital download access has been utilized, cancellation cannot be processed.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-main)]">4. Refund Processing & Timelines</h2>
            <p className="text-[var(--text-muted)]">
              To request a refund, please email our support desk at <a href="mailto:support@nivoleads.com" className="text-blue-500 font-semibold hover:underline">support@nivoleads.com</a> with your Order ID, registered email, and payment receipt.
            </p>
            <p className="text-[var(--text-muted)]">
              Approved refunds will be credited back to the original source payment method (Bank Account, Credit/Debit Card, or UPI handle) within <strong>5 to 7 business days</strong> as per standard Reserve Bank of India (RBI) and banking partner settlement cycles.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-main)]">5. Contact for Billing Grievances</h2>
            <p className="text-[var(--text-muted)]">
              For any payment or billing inquiries, please reach out to our accounts team at <a href="mailto:support@nivoleads.com" className="text-blue-500 font-semibold hover:underline">support@nivoleads.com</a> or visit our <Link href="/contact" className="text-blue-500 font-semibold hover:underline">Contact Us page</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
