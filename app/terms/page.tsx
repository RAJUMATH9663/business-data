import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions of service for using NivoLeads business directory platform.",
};

export default function TermsOfService() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 py-4">
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
              By accessing, browsing, or purchasing datasets on <strong>NivoLeads</strong>, you agree to comply with and be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use this website.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-main)]">2. Commercial Use & Compliance</h2>
            <p className="text-[var(--text-muted)]">
              Purchased contact datasets are provided solely for legitimate B2B marketing, sales prospecting, business inquiries, and commercial communications. Users agree to comply with all applicable telecommunication regulations, TRAI guidelines, and anti-spam laws (including DND regulations).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-main)]">3. Instant Digital Delivery & Refund Policy</h2>
            <p className="text-[var(--text-muted)]">
              Due to the digital nature of instant contact allocation and download capability, all completed purchases are non-refundable once unlocked in the user portal, except in proven cases of technical billing errors or duplicate charges.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-main)]">4. Intellectual Property & Anti-Scraping</h2>
            <p className="text-[var(--text-muted)]">
              Automated crawling, scraping, data extraction bots, or attempts to circumvent dataset allocation limits are strictly prohibited and may result in immediate account termination without refund.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-main)]">5. Limitation of Liability</h2>
            <p className="text-[var(--text-muted)]">
              While NivoLeads takes rigorous steps to clean, normalize, and verify data accuracy, directory information may change over time as businesses evolve. NivoLeads provides data on an &ldquo;as-is&rdquo; basis.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-main)]">6. Support & Inquiries</h2>
            <p className="text-[var(--text-muted)]">
              For support or corporate licensing inquiries, please visit our{" "}
              <Link href="/contact" className="text-blue-500 font-semibold hover:underline">
                Contact Page
              </Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
