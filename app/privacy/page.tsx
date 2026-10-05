import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | NivoLeads",
  description: "Privacy Policy and DPDP Act Data Protection standards for NivoLeads business directory platform.",
};

export default function PrivacyPolicy() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 py-6">
      <div className="card p-8 sm:p-12">
        <div className="border-b border-[var(--border-card)] pb-6">
          <span className="badge-brand">Legal Compliance</span>
          <h1 className="mt-2 text-3xl font-extrabold text-[var(--text-main)] sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-2 text-xs text-[var(--text-muted)]">
            Last Updated: {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
          </p>
        </div>

        <div className="mt-8 space-y-6 text-sm text-[var(--text-main)] leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-main)]">1. Commitment to Privacy</h2>
            <p className="text-[var(--text-muted)]">
              <strong>NivoLeads</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) is committed to respecting user privacy and complying with applicable data protection laws, including the <strong>Digital Personal Data Protection (DPDP) Act 2023</strong> and the Information Technology Act 2000 of India. This Privacy Policy details how we collect, use, and protect information when you browse our B2B commercial enterprise directory.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-main)]">2. User Account Data</h2>
            <p className="text-[var(--text-muted)]">
              When you register on NivoLeads, we collect user-provided details including your name, email address, mobile number, and payment transaction references. We use this data exclusively to manage user authentication, deliver purchased directory credits, prevent duplicate records, and fulfill customer support inquiries.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-main)]">3. Public Commercial Directory Listings</h2>
            <p className="text-[var(--text-muted)]">
              The business profiles, enterprise addresses, and trade contact numbers indexed on NivoLeads are limited to commercial entities, proprietors, and corporate service providers. These records are gathered from publicly registered trade directories, government registries, open business filings, and voluntary business submissions for commercial trade discoverability. We do <strong>not</strong> collect or sell sensitive personal data (such as financial information, biometric data, or private personal phone records of individual consumers).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-main)]">4. Payment Security</h2>
            <p className="text-[var(--text-muted)]">
              All payment transactions are encrypted and processed through RBI-authorized, PCI-DSS Level 1 compliant payment gateways (such as Razorpay). NivoLeads never stores, logs, or has access to your full credit/debit card numbers, CVVs, or Net Banking credentials.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-main)]">5. Right to Delist / Opt-Out</h2>
            <p className="text-[var(--text-muted)]">
              If you are a business proprietor or enterprise owner and wish to update, modify, or delist your public commercial listing from our directory, you may submit a delisting request to <a href="mailto:support@nivoleads.com" className="text-blue-500 hover:underline">support@nivoleads.com</a>. Requests are verified and processed within <strong>48 hours</strong> free of charge.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-main)]">6. Grievance Officer</h2>
            <p className="text-[var(--text-muted)]">
              For any privacy, grievance, or compliance concerns under the DPDP Act, you can contact our designated officer:
            </p>
            <div className="p-4 rounded-xl border border-[var(--border-card)] bg-[var(--bg-mist)] text-xs text-[var(--text-muted)] space-y-1">
              <div><strong>Grievance Officer:</strong> NivoLeads Consumer Protection Cell</div>
              <div><strong>Email:</strong> <a href="mailto:grievance@nivoleads.com" className="text-blue-500 hover:underline">grievance@nivoleads.com</a> / <a href="mailto:support@nivoleads.com" className="text-blue-500 hover:underline">support@nivoleads.com</a></div>
              <div><strong>Address:</strong> Sector 16, Navanagar Commercial Hub, Bagalkote, Karnataka – 587103, India</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
