import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us & Support | Karnataka Trade Directory",
  description: "Official contact information, registered office address, and customer support for Karnataka Trade Directory B2B platform.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-10 py-6">
      <div className="card p-8 sm:p-12">
        <div className="border-b border-[var(--border-card)] pb-6 text-center sm:text-left">
          <span className="badge-brand">Customer Support & Office</span>
          <h1 className="mt-2 text-3xl font-extrabold text-[var(--text-main)] sm:text-4xl">
            Contact Us
          </h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Have questions regarding our enterprise directory listings, digital billing, or need customized market research reports? Contact our support team.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="card p-5 bg-[var(--bg-mist)] border border-[var(--border-card)]">
            <div className="text-2xl mb-2">📧</div>
            <h2 className="text-base font-bold text-[var(--text-main)]">Email Support</h2>
            <p className="mt-1 text-xs text-[var(--text-muted)]">Fast responses within 2–4 business hours.</p>
            <a href="mailto:support@karnatakatradedirectory.com" className="mt-3 inline-block text-sm font-semibold text-blue-500 hover:underline">
              support@karnatakatradedirectory.com
            </a>
          </div>

          <div className="card p-5 bg-[var(--bg-mist)] border border-[var(--border-card)]">
            <div className="text-2xl mb-2">📞</div>
            <h2 className="text-base font-bold text-[var(--text-main)]">Helpline & Sales</h2>
            <p className="mt-1 text-xs text-[var(--text-muted)]">Commercial inquiries & enterprise support.</p>
            <div className="mt-3 text-sm font-semibold text-emerald-500 font-mono">
              +91 91485 24089
            </div>
          </div>

          <div className="card p-5 bg-[var(--bg-mist)] border border-[var(--border-card)]">
            <div className="text-2xl mb-2">⏰</div>
            <h2 className="text-base font-bold text-[var(--text-main)]">Business Hours</h2>
            <p className="mt-1 text-xs text-[var(--text-muted)]">Monday – Saturday</p>
            <div className="mt-3 text-xs font-semibold text-[var(--text-main)]">
              9:00 AM – 6:30 PM IST
            </div>
          </div>
        </div>

        {/* Official Registered Business Address (Razorpay Mandatory Requirement) */}
        <div className="mt-8 p-6 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-mist)] space-y-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">🏢</div>
            <div>
              <h3 className="text-base font-bold text-[var(--text-main)]">Registered Operational Office</h3>
              <p className="mt-1 text-sm text-[var(--text-muted)] leading-relaxed">
                <strong>Karnataka Trade Directory Services</strong><br />
                Sector 16, Navanagar Commercial Hub,<br />
                Bagalkote, Karnataka – 587103, India.<br />
                <strong>State:</strong> Karnataka | <strong>Country:</strong> India
              </p>
            </div>
          </div>
        </div>

        {/* Grievance & Nodal Officer Details (RBI / IT Rules Compliance) */}
        <div className="mt-6 p-6 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-mist)] space-y-2 text-xs text-[var(--text-muted)]">
          <h3 className="text-sm font-bold text-[var(--text-main)]">Grievance & Redressal Officer</h3>
          <p>
            In accordance with the Information Technology Act 2000 and consumer protection guidelines, the details of the designated Grievance Officer are provided below:
          </p>
          <div className="pt-2 font-mono text-[var(--text-main)] space-y-1">
            <div><strong>Designation:</strong> Head of Consumer Grievances & Compliance</div>
            <div><strong>Email:</strong> <a href="mailto:grievance@karnatakatradedirectory.com" className="text-blue-500 hover:underline">grievance@karnatakatradedirectory.com</a> / <a href="mailto:support@karnatakatradedirectory.com" className="text-blue-500 hover:underline">support@karnatakatradedirectory.com</a></div>
            <div><strong>Address:</strong> Karnataka Trade Directory Services, Sector 16, Navanagar, Bagalkote, Karnataka 587103</div>
            <div><strong>Response Time:</strong> Within 48 business hours</div>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="mt-8 pt-8 border-t border-[var(--border-card)] space-y-6">
          <h2 className="text-xl font-bold text-[var(--text-main)]">Frequently Asked Questions</h2>

          <div className="space-y-4">
            <div className="rounded-xl border border-[var(--border-card)] p-4">
              <h3 className="text-sm font-bold text-[var(--text-main)]">How quickly do I get access to directory records after payment?</h3>
              <p className="mt-1 text-xs text-[var(--text-muted)] leading-relaxed">
                Access is 100% instant. As soon as your Razorpay, UPI, or card payment completes, your unlocked business profiles immediately appear in your &ldquo;My Purchases&rdquo; dashboard with one-click Excel (.XLSX) and CSV export options.
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border-card)] p-4">
              <h3 className="text-sm font-bold text-[var(--text-main)]">Are these directory listings verified?</h3>
              <p className="mt-1 text-xs text-[var(--text-muted)] leading-relaxed">
                Yes. Every listing is validated for active status, formatted to standardized 10-digit Indian mobile contact specifications, and cross-referenced with regional commercial trade registrations.
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border-card)] p-4">
              <h3 className="text-sm font-bold text-[var(--text-main)]">Can I list my own business on Karnataka Trade Directory?</h3>
              <p className="mt-1 text-xs text-[var(--text-muted)] leading-relaxed">
                Yes! Any legitimate business proprietor in Karnataka can submit their enterprise details for free through our <Link href="/list-business" className="text-blue-500 font-semibold hover:underline">List Your Business Free</Link> page.
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <Link href="/explore" className="btn btn-primary !px-6 !py-3 !text-sm">
              Explore Business Directory
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
