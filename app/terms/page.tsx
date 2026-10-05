import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | NivoLeads B2B Directory",
  description: "Terms and conditions of service for using NivoLeads commercial business directory platform.",
};

export default function TermsOfService() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 py-6">
      <div className="card p-8 sm:p-12">
        <div className="border-b border-[var(--border-card)] pb-6">
          <span className="badge-brand">User Agreement</span>
          <h1 className="mt-2 text-3xl font-extrabold text-[var(--text-main)] sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-2 text-xs text-[var(--text-muted)]">
            Effective Date: {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
          </p>
        </div>

        <div className="mt-8 space-y-6 text-sm text-[var(--text-main)] leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-main)]">1. Acceptance of Terms</h2>
            <p className="text-[var(--text-muted)]">
              By accessing, browsing, or utilizing the business directory services on <strong>NivoLeads</strong> (&ldquo;the Platform&rdquo;), you agree to comply with and be bound by these Terms of Service, along with our Privacy Policy, Cancellation & Refund Policy, and Shipping & Delivery Policy. If you do not agree with any part of these terms, you must discontinue using this website.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-main)]">2. Nature of Service</h2>
            <p className="text-[var(--text-muted)]">
              NivoLeads operates as an online business information portal and commercial enterprise directory. We compile, categorize, and index publicly available business trade information, company profiles, and registered enterprise contact points across Karnataka’s 31 administrative districts.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-main)]">3. Commercial Use & Legal Compliance</h2>
            <p className="text-[var(--text-muted)]">
              Directory information accessed or exported from NivoLeads is intended strictly for legitimate B2B trade inquiries, commercial procurement, market research, vendor discovery, and business-to-business communications. Users explicitly agree to comply with all applicable laws, including the Information Technology Act 2000, DPDP Act 2023, and TRAI telecom commercial communications regulations. Unsolicited consumer spam or abusive mass-marketing is strictly forbidden.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-main)]">4. Digital Fulfillment & Payments</h2>
            <p className="text-[var(--text-muted)]">
              Access credits and directory unlocks are fulfilled electronically immediately upon transaction confirmation via Razorpay or authorized payment aggregators. For full details on delivery timelines, please review our{" "}
              <Link href="/shipping-policy" className="text-blue-500 font-semibold hover:underline">
                Shipping & Delivery Policy
              </Link>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-main)]">5. Cancellation & Refunds</h2>
            <p className="text-[var(--text-muted)]">
              Billing disputes, duplicate payments, and refund conditions are governed strictly under our{" "}
              <Link href="/refund-policy" className="text-blue-500 font-semibold hover:underline">
                Cancellation & Refund Policy
              </Link>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-main)]">6. Intellectual Property & Fair Usage</h2>
            <p className="text-[var(--text-muted)]">
              All proprietary algorithms, database schemas, taxonomies, and software interfaces are protected by intellectual property rights. Automated scraping, malicious bot attacks, or unauthorized resale of the platform’s aggregated directory records is strictly prohibited and subject to immediate suspension.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-main)]">7. Limitation of Liability</h2>
            <p className="text-[var(--text-muted)]">
              While NivoLeads employs rigorous data hygiene, normalization, and verification pipelines, business trade data evolves continuously. Information is provided on an &ldquo;as-is&rdquo; commercial intelligence basis without warranties of uninterrupted availability.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-main)]">8. Grievance & Inquiries</h2>
            <p className="text-[var(--text-muted)]">
              For any legal, commercial, or billing queries, please contact our administrative desk via our{" "}
              <Link href="/contact" className="text-blue-500 font-semibold hover:underline">
                Contact Page
              </Link>{" "}
              or email <a href="mailto:support@nivoleads.com" className="text-blue-500 font-semibold hover:underline">support@nivoleads.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
