import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy and Data Protection standards for NivoLeads.",
};

export default function PrivacyPolicy() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 py-4">
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
            <h2 className="text-lg font-bold text-[var(--text-main)]">1. Information We Collect</h2>
            <p className="text-[var(--text-muted)]">
              When you use <strong>NivoLeads</strong>, we collect personal information you provide when registering an account, such as your full name, email address, phone number, and transaction logs associated with purchased contact datasets.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-main)]">2. Directory & Public Business Data</h2>
            <p className="text-[var(--text-muted)]">
              The business directories and commercial listings available on NivoLeads are aggregated from publicly available commercial registries, verified business listings, trade directories, and public records for commercial discovery and sales outreach.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-main)]">3. How We Use Your Data</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-[var(--text-muted)]">
              <li>To provide, maintain, and deliver your purchased datasets.</li>
              <li>To prevent duplicate contact allocation on subsequent purchases.</li>
              <li>To process secure payments through licensed payment gateways (e.g. Razorpay).</li>
              <li>To protect against fraud, unauthorized scraping, and malicious bot activity.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-main)]">4. Data Security & Storage</h2>
            <p className="text-[var(--text-muted)]">
              We implement industry-standard cryptographic practices (including Bcrypt password hashing, encrypted SSL/TLS data transmission, and role-based access control) to safeguard your account and transaction data.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-main)]">5. Cookies & Tracking</h2>
            <p className="text-[var(--text-muted)]">
              We use strictly necessary session cookies to maintain your login status and secure device sessions. We do not sell your personal browsing history to third-party ad networks.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--text-main)]">6. Contact & Grievance Officer</h2>
            <p className="text-[var(--text-muted)]">
              If you have any questions, privacy concerns, or data removal requests, please reach out to our privacy desk at:{" "}
              <Link href="/contact" className="text-blue-500 font-semibold hover:underline">
                Contact Support
              </Link>{" "}
              or email us directly at <span className="font-mono text-blue-500">support@nivoleads.com</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
