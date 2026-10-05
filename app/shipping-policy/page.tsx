import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy | NivoLeads",
  description: "Shipping and digital delivery terms for NivoLeads commercial business directory platform.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 py-6">
      <div className="card p-8 sm:p-12">
        <div className="border-b border-[var(--border-card)] pb-6">
          <span className="badge-brand">Digital Fulfillment</span>
          <h1 className="mt-2 text-3xl font-extrabold text-[var(--text-main)] sm:text-4xl">
            Shipping & Delivery Policy
          </h1>
          <p className="mt-2 text-xs text-[var(--text-muted)]">
            Last Updated: {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
          </p>
        </div>

        <div className="mt-8 space-y-6 text-sm text-[var(--text-main)] leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-main)]">1. Nature of Products & Services</h2>
            <p className="text-[var(--text-muted)]">
              NivoLeads is an online B2B business directory and commercial data analytics portal. We provide digital goods, namely verified business enterprise directory profiles, commercial listings, and downloadable business research spreadsheets (.xlsx and .csv formats).
            </p>
            <p className="text-[var(--text-muted)]">
              We do <strong>not</strong> ship any physical merchandise or tangible paper goods to postal addresses. All deliveries occur electronically over the Internet.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-main)]">2. Delivery Method & Fulfillment Timeline</h2>
            <p className="text-[var(--text-muted)]">
              All digital orders placed on NivoLeads are delivered via <strong>Instant Electronic Fulfillment</strong>:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[var(--text-muted)]">
              <li><strong>Instant Dashboard Access:</strong> Immediately upon successful transaction confirmation from our payment gateway (Razorpay), your purchased business directory profiles are automatically credited to your user account and unlocked under the &ldquo;My Purchases&rdquo; tab.</li>
              <li><strong>Download Availability:</strong> You can download the complete formatted spreadsheet (.XLSX / .CSV) instantly from your browser at any time without delay.</li>
              <li><strong>Email Confirmation:</strong> A purchase invoice and transaction receipt containing download links is dispatched to your registered email address within <strong>5 to 10 minutes</strong> of payment completion.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-main)]">3. Shipping Fees & Charges</h2>
            <p className="text-[var(--text-muted)]">
              Since all directory information is delivered electronically, there are <strong>zero shipping fees, handling charges, or postal duties</strong> applied to any order.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-main)]">4. Delivery Issues or Technical Delays</h2>
            <p className="text-[var(--text-muted)]">
              If you experience any delay in accessing your purchased directory listings after payment debit, or if you do not receive the confirmation email within 15 minutes, please:
            </p>
            <ol className="list-decimal pl-5 space-y-1 text-[var(--text-muted)]">
              <li>Check your email Spam or Promotions folder.</li>
              <li>Refresh your <Link href="/purchases" className="text-blue-500 font-semibold hover:underline">My Purchases</Link> dashboard page.</li>
              <li>Contact our support team at <a href="mailto:support@nivoleads.com" className="text-blue-500 font-semibold hover:underline">support@nivoleads.com</a> with your Payment Reference ID / Order ID for immediate manual resolution.</li>
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
