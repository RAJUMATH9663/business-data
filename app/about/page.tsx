import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | Karnataka Trade Directory",
  description: "Learn about Karnataka Trade Directory — Karnataka's premier verified B2B commercial enterprise directory and market intelligence platform.",
};

export default function AboutUsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 py-6">
      <div className="card p-8 sm:p-12">
        <div className="border-b border-[var(--border-card)] pb-6">
          <span className="badge-brand">Corporate Overview</span>
          <h1 className="mt-2 text-3xl font-extrabold text-[var(--text-main)] sm:text-4xl">
            About Karnataka Trade Directory
          </h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Empowering Karnataka’s small, medium, and large enterprises with verified B2B commercial intelligence.
          </p>
        </div>

        <div className="mt-8 space-y-6 text-sm text-[var(--text-main)] leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[var(--text-main)]">Who We Are</h2>
            <p className="text-[var(--text-muted)]">
              <strong>Karnataka Trade Directory</strong> is an Indian B2B digital enterprise directory and commercial trade intelligence platform headquartered in Karnataka. Our mission is to bridge the information gap across Karnataka’s 31 districts, enabling verified local manufacturers, distributors, traders, and service providers to connect seamlessly.
            </p>
            <p className="text-[var(--text-muted)]">
              From fast-growing metro hubs like Bengaluru, Belagavi, and Mysuru to vital industrial and heritage commerce zones like Bagalkote, Vijayapura, Hubballi-Dharwad, and Kalaburagi, Karnataka Trade Directory organizes publicly available corporate information into an accessible, structured digital registry.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[var(--text-main)]">What We Do</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
              <div className="p-4 rounded-xl border border-[var(--border-card)] bg-[var(--bg-mist)]">
                <div className="text-2xl mb-1">🏢</div>
                <h3 className="font-bold text-[var(--text-main)]">Enterprise Directory Listings</h3>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  Accurate, categorized profiles of active businesses across 20 commercial sectors including Healthcare, Real Estate, Education, Manufacturing, and Agriculture.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[var(--border-card)] bg-[var(--bg-mist)]">
                <div className="text-2xl mb-1">🔍</div>
                <h3 className="font-bold text-[var(--text-main)]">Market Intelligence & Research</h3>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  Enabling B2B procurement managers, suppliers, and entrepreneurs to discover verified partners, vendors, and regional business contacts.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[var(--border-card)] bg-[var(--bg-mist)]">
                <div className="text-2xl mb-1">🛡️</div>
                <h3 className="font-bold text-[var(--text-main)]">Verified Public Data Standards</h3>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  Strict deduplication, active telecom normalization, and algorithmic validation ensuring businesses never waste resources on defunct records.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[var(--border-card)] bg-[var(--bg-mist)]">
                <div className="text-2xl mb-1">🚀</div>
                <h3 className="font-bold text-[var(--text-main)]">Free Business Listings</h3>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  Local business owners and proprietors can list their own enterprises for free, enhancing their visibility across digital search engines.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3 pt-4">
            <h2 className="text-xl font-bold text-[var(--text-main)]">Data Governance & Compliance</h2>
            <p className="text-[var(--text-muted)]">
              Karnataka Trade Directory complies with the <strong>Digital Personal Data Protection (DPDP) Act</strong> and Indian Information Technology laws. We index only legitimate corporate, trade, and commercial enterprise contact details that businesses have voluntarily made public or registered for commercial trade identification.
            </p>
          </section>

          <div className="pt-6 border-t border-[var(--border-card)] flex flex-wrap gap-4 items-center">
            <Link href="/explore" className="btn btn-primary !px-5 !py-2.5 !text-sm">
              Explore Directory
            </Link>
            <Link href="/contact" className="btn btn-ghost !px-5 !py-2.5 !text-sm border border-[var(--border-card)]">
              Contact Our Team
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
