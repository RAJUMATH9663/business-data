import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact & Customer Support",
  description: "Get in touch with NivoLeads for sales support, custom dataset requests, or help with your purchases.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-10 py-4">
      <div className="card p-8 sm:p-12">
        <div className="border-b border-[var(--border-card)] pb-6 text-center sm:text-left">
          <span className="badge-brand">We&apos;re Here to Help</span>
          <h1 className="mt-2 text-3xl font-extrabold text-[var(--text-main)] sm:text-4xl">
            Contact & Customer Support
          </h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Have questions about business datasets, bulk volume pricing, or need technical help? Reach out to our dedicated team.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="card p-5 bg-[var(--bg-mist)] border border-[var(--border-card)]">
            <div className="text-2xl mb-2">📧</div>
            <h2 className="text-base font-bold text-[var(--text-main)]">Email Support</h2>
            <p className="mt-1 text-xs text-[var(--text-muted)]">Responses typically within 2–4 business hours.</p>
            <a href="mailto:support@nivoleads.com" className="mt-3 inline-block text-sm font-semibold text-blue-500 hover:underline">
              support@nivoleads.com
            </a>
          </div>

          <div className="card p-5 bg-[var(--bg-mist)] border border-[var(--border-card)]">
            <div className="text-2xl mb-2">💬</div>
            <h2 className="text-base font-bold text-[var(--text-main)]">WhatsApp / Direct Sales</h2>
            <p className="mt-1 text-xs text-[var(--text-muted)]">Instant chat for bulk enterprise orders.</p>
            <div className="mt-3 text-sm font-semibold text-emerald-500 font-mono">
              +91 98765 43210
            </div>
          </div>

          <div className="card p-5 bg-[var(--bg-mist)] border border-[var(--border-card)]">
            <div className="text-2xl mb-2">⏰</div>
            <h2 className="text-base font-bold text-[var(--text-main)]">Operating Hours</h2>
            <p className="mt-1 text-xs text-[var(--text-muted)]">Monday – Saturday</p>
            <div className="mt-3 text-xs font-semibold text-[var(--text-main)]">
              9:00 AM – 7:00 PM IST
            </div>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="mt-12 pt-8 border-t border-[var(--border-card)] space-y-6">
          <h2 className="text-xl font-bold text-[var(--text-main)]">Frequently Asked Questions</h2>

          <div className="space-y-4">
            <div className="rounded-xl border border-[var(--border-card)] p-4">
              <h3 className="text-sm font-bold text-[var(--text-main)]">How quickly do I get access to my data after payment?</h3>
              <p className="mt-1 text-xs text-[var(--text-muted)] leading-relaxed">
                Access is 100% instant! As soon as your Razorpay or UPI payment completes, your unlocked leads immediately appear in your &ldquo;My Purchases&rdquo; dashboard with full Excel/CSV download options.
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border-card)] p-4">
              <h3 className="text-sm font-bold text-[var(--text-main)]">Will I get duplicate numbers if I purchase again?</h3>
              <p className="mt-1 text-xs text-[var(--text-muted)] leading-relaxed">
                No. Our intelligent deduplication engine ensures you never receive a business phone number you previously bought under the same account.
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border-card)] p-4">
              <h3 className="text-sm font-bold text-[var(--text-main)]">Can I download the contacts in Excel or CSV format?</h3>
              <p className="mt-1 text-xs text-[var(--text-muted)] leading-relaxed">
                Yes, every purchase includes a one-click .XLSX Excel export containing business names, verified mobile numbers, addresses, areas, and Google Maps links.
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <Link href="/explore" className="btn btn-primary !px-6 !py-3 !text-sm">
              Explore Available Leads Now →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
