import Image from "next/image";
import Link from "next/link";

const steps = [
  {
    step: "01",
    icon: "📍",
    label: "Pick a District",
    desc: "Choose from any of Karnataka's 31 administrative districts and commerce hubs.",
  },
  {
    step: "02",
    icon: "🗂️",
    label: "Select Industry",
    desc: "Filter by key sectors including Manufacturing, Healthcare, Agriculture, Retail & IT.",
  },
  {
    step: "03",
    icon: "🔢",
    label: "Choose Coverage",
    desc: "Select the volume of enterprise profiles you wish to include in your market report.",
  },
  {
    step: "04",
    icon: "💳",
    label: "Secure Checkout",
    desc: "Encrypted payment via Razorpay / UPI / Credit & Debit Cards / Net Banking.",
  },
  {
    step: "05",
    icon: "⚡",
    label: "Instant Directory Export",
    desc: "Instantly download your verified trade directory report in Microsoft Excel (.xlsx).",
  },
];

const businessIdeas = [
  { icon: "🏥", name: "Healthcare", slug: "healthcare", tag: "Hot Sector" },
  { icon: "🎓", name: "Education & Training", slug: "education-training", tag: "Education" },
  { icon: "🏠", name: "Real Estate & Construction", slug: "real-estate-construction", tag: "Infrastructure" },
  { icon: "💪", name: "Health, Fitness & Beauty", slug: "health-fitness-beauty", tag: "Wellness" },
  { icon: "🍽️", name: "Food, Restaurants & Hotels", slug: "food-restaurants-hotels", tag: "Hospitality" },
  { icon: "🛒", name: "Shopping & Retail", slug: "shopping-retail", tag: "Commerce" },
  { icon: "💻", name: "IT & Digital Services", slug: "it-digital-services", tag: "Tech" },
  { icon: "⚖️", name: "Professional Services", slug: "professional-services", tag: "Corporate" },
  { icon: "🚗", name: "Automobile & Transport", slug: "automobile-transport", tag: "Logistics" },
  { icon: "🏭", name: "Industries & Manufacturing", slug: "industries-manufacturing", tag: "Manufacturing" },
  { icon: "✈️", name: "Travel & Tourism", slug: "travel-tourism", tag: "Tourism" },
  { icon: "🌾", name: "Agriculture & Agro Businesses", slug: "agriculture-agro-businesses", tag: "Agro Trade" },
];

const topDistricts = [
  { name: "Bengaluru Urban", slug: "bengaluru-urban", tag: "Tech & Corporate Hub" },
  { name: "Vijayapura", slug: "vijayapura", tag: "Commercial Hub" },
  { name: "Belagavi", slug: "belagavi", tag: "Industrial Zone" },
  { name: "Mysuru", slug: "mysuru", tag: "Heritage & Tech" },
  { name: "Dharwad", slug: "dharwad", tag: "Education & Commerce" },
  { name: "Mangaluru", slug: "dakshina-kannada", tag: "Coastal Port Trade" },
  { name: "Tumakuru", slug: "tumakuru", tag: "Industrial Node" },
  { name: "Shivamogga", slug: "shivamogga", tag: "Central Trade" },
  { name: "Kalaburagi", slug: "kalaburagi", tag: "North Region Hub" },
  { name: "Ballari", slug: "ballari", tag: "Mining & Steel Hub" },
  { name: "Udupi", slug: "udupi", tag: "Coastal Commerce" },
  { name: "Davanagere", slug: "davanagere", tag: "Agri & Textiles" },
];

const benefits = [
  {
    icon: "✅",
    title: "100% Normalized Business Registry",
    desc: "Every enterprise listing includes verified public trade telephone numbers, registered business addresses, area details, and active commercial status.",
  },
  {
    icon: "💰",
    title: "Transparent Per-Listing Pricing",
    desc: "Flexible directory licensing starting from just ₹1 per listing with automatic tier discounts. No recurring monthly commitments.",
  },
  {
    icon: "⚡",
    title: "Instant Digital Excel Fulfillment",
    desc: "Instant one-click digital fulfillment. Download your selected commercial directory datasets in Microsoft Excel (.xlsx) and CSV format immediately.",
  },
];

const faqs = [
  {
    q: "What is Karnataka Trade Directory?",
    a: "Karnataka Trade Directory is an organized digital B2B commerce index cataloging registered commercial enterprises, manufacturers, distributors, and service providers across Karnataka's 31 administrative districts.",
  },
  {
    q: "How do procurement teams and businesses use this directory?",
    a: "Corporate buyers, supply chain managers, vendors, and regional traders use the directory to identify active local suppliers, verify regional vendor addresses, and initiate legitimate business-to-business trade inquiries.",
  },
  {
    q: "How can local businesses list their company on the platform?",
    a: "Registered business owners in Karnataka can list their enterprise for free by visiting our 'List Business Free' portal. After editorial verification, verified listings are included in our public B2B index.",
  },
  {
    q: "Can I download directory datasets in Microsoft Excel or CSV format?",
    a: "Yes. All completed directory orders include instant digital download access in Microsoft Excel (.xlsx) format from your client dashboard for offline business analysis and vendor management.",
  },
  {
    q: "How are the merchant directory records verified?",
    a: "Listings are compiled from publicly registered business records, trade filings, and direct merchant submissions, undergoing automated deduplication and telecom standard checks.",
  },
  {
    q: "How does the zero-duplicate guarantee work for repeat downloads?",
    a: "Our system tracks previously unlocked enterprise records in your client account. When downloading additional listings in the same district and category, the platform automatically allocates new, non-overlapping listings.",
  },
];

export default function Home() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
      },
    })),
  };

  return (
    <div className="space-y-16 pb-8">
      {/* Schema.org FAQPage Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero Section — Distinct, High-Converting & Intuitive */}
      <section className="relative overflow-hidden rounded-3xl border border-[var(--border-card)] bg-gradient-to-b from-[var(--bg-card)] via-[var(--bg-mist)] to-[var(--bg-card)] p-6 sm:p-12 lg:p-16 shadow-lg text-center">
        {/* Ambient Top Glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-72 w-96 -translate-x-1/2 rounded-full bg-blue-500/15 blur-3xl" />

        <div className="mx-auto max-w-4xl space-y-6">
          {/* Brand Logo & Authority Badge */}
          <div className="mx-auto flex flex-col items-center justify-center gap-3">
            <Image
              src="/logo.png"
              alt="Karnataka Trade Directory"
              width={340}
              height={90}
              className="h-16 sm:h-24 md:h-28 w-auto rounded-2xl object-contain shadow-md transition-transform hover:scale-105"
              priority
            />
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              Karnataka Trade Directory · B2B Commerce Index & Merchant Registry
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-main)] sm:text-5xl lg:text-6xl leading-[1.15]">
            Discover Verified Commercial Enterprises & Business Partners{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent">
              Across Karnataka
            </span>
          </h1>

          {/* Subtitle / Value Proposition */}
          <p className="mx-auto max-w-2xl text-sm sm:text-base md:text-lg text-[var(--text-muted)] leading-relaxed">
            Karnataka’s premier B2B trade directory and merchant registry. Filter by district and industry sector to explore verified local suppliers, manufacturers, distributors, and registered commercial enterprises.
          </p>

          {/* Direct CTA Action Box */}
          <div className="mx-auto max-w-xl rounded-2xl border border-blue-500/30 bg-[var(--bg-card)] p-4 sm:p-5 shadow-md">
            <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
              Looking to connect with verified enterprises and vendors?
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/explore"
                className="btn btn-primary w-full sm:flex-1 !py-3.5 !text-sm sm:!text-base font-bold shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02]"
              >
                Explore Trade Directory →
              </Link>
              <Link
                href="/directory"
                className="btn btn-ghost w-full sm:w-auto !py-3.5 !text-sm font-semibold border border-[var(--border-card)]"
              >
                Browse All Districts 📍
              </Link>
            </div>
            <div className="mt-3 flex items-center justify-center gap-4 text-xs text-[var(--text-muted)]">
              <span>Already have an account?</span>
              <Link href="/login" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                Client Portal / Sign In →
              </Link>
            </div>
          </div>

          {/* Quick Business Ideas & Popular Sectors Pills */}
          <div className="pt-2">
            <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2.5">
              Explore Industry Sectors & Commercial Hubs:
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {businessIdeas.map((item) => (
                <Link
                  key={item.slug}
                  href={`/explore?c=${item.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] px-3 py-1.5 text-xs font-medium text-[var(--text-main)] transition-all hover:-translate-y-0.5 hover:border-blue-500 hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 shadow-sm"
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-[var(--border-card)] pt-6 sm:grid-cols-4">
            <div>
              <div className="text-2xl font-extrabold text-[var(--text-main)] sm:text-3xl">31</div>
              <div className="text-xs font-medium text-[var(--text-muted)] mt-0.5">Karnataka Districts</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-[var(--text-main)] sm:text-3xl">20</div>
              <div className="text-xs font-medium text-[var(--text-muted)] mt-0.5">Industry Sectors</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 sm:text-3xl">100%</div>
              <div className="text-xs font-medium text-[var(--text-muted)] mt-0.5">Verified Public Listings</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 sm:text-3xl">Instant</div>
              <div className="text-xs font-medium text-[var(--text-muted)] mt-0.5">Excel (.xlsx) Export</div>
            </div>
          </div>
        </div>
      </section>

      {/* B2B Sourcing Callout */}
      <section className="card p-6 sm:p-10 border border-blue-500/30 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-transparent">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="badge-brand">Commercial Trade Index</span>
            <h2 className="text-2xl font-bold text-[var(--text-main)]">
              Connecting Manufacturers, Distributors & Commercial Buyers
            </h2>
            <p className="text-sm text-[var(--text-muted)] max-w-2xl leading-relaxed">
              Streamline B2B procurement, regional vendor discovery, and market research. Access verified commercial enterprise profiles with public business telephone numbers and registered addresses across 31 districts.
            </p>
          </div>
          <Link
            href="/explore"
            className="btn btn-primary whitespace-nowrap !px-6 !py-3 !text-sm shrink-0"
          >
            Explore Directory Now →
          </Link>
        </div>
      </section>

      {/* How it Works */}
      <section aria-labelledby="how-it-works-title" className="space-y-6">
        <div className="text-center">
          <span className="badge-brand">Simple Process</span>
          <h2 id="how-it-works-title" className="mt-2 text-2xl sm:text-3xl font-bold text-[var(--text-main)]">
            How It Works in 5 Easy Steps
          </h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            From discovering verified business listings to exporting structured B2B trade reports in under 2 minutes.
          </p>
        </div>

        <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((s) => (
            <li
              key={s.step}
              className="card relative flex flex-col justify-between p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:border-blue-500/60"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--bg-mist)] text-2xl">
                    {s.icon}
                  </span>
                  <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-xs font-bold text-blue-500">
                    {s.step}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-bold text-[var(--text-main)]">{s.label}</h3>
                <p className="mt-1.5 text-xs text-[var(--text-muted)] leading-relaxed">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Top Districts Grid */}
      <section className="space-y-6">
        <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <span className="badge-brand">Location Directory</span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-[var(--text-main)]">
              Explore Directory Listings by Karnataka District
            </h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Discover verified commercial listings in your local city or region.
            </p>
          </div>
          <Link href="/directory" className="text-sm font-semibold text-blue-500 hover:underline">
            All 31 districts →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {topDistricts.map((d) => (
            <Link
              key={d.slug}
              href={`/directory/${d.slug}`}
              className="card p-3 text-center transition-all duration-200 hover:-translate-y-1 hover:border-blue-500/60 group"
            >
              <div className="text-sm font-bold text-[var(--text-main)] group-hover:text-blue-500 transition-colors">
                {d.name}
              </div>
              <div className="text-[10px] text-[var(--text-muted)] mt-0.5">
                {d.tag}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Categories Grid */}
      <section className="space-y-6">
        <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <span className="badge-brand">Sectors & Categories</span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-[var(--text-main)]">Industry Commercial Registries</h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">Commercial profiles and registered addresses for B2B collaboration.</p>
          </div>
          <Link href="/explore" className="text-sm font-semibold text-blue-500 hover:underline">
            View all 20 sectors →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {businessIdeas.map((cat) => (
            <Link
              key={cat.slug}
              href={`/explore?c=${cat.slug}`}
              className="card group flex items-center justify-between p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500/60"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--bg-mist)] text-2xl transition-transform duration-200 group-hover:scale-110">
                  {cat.icon}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-main)] group-hover:text-blue-500 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="inline-block rounded bg-[var(--bg-mist)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-muted)]">
                    {cat.tag}
                  </span>
                </div>
              </div>
              <span className="text-[var(--text-muted)] group-hover:text-blue-500 transition-colors">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Value & Guarantees */}
      <section className="card p-8 sm:p-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {benefits.map((b) => (
            <div key={b.title} className="space-y-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-xl text-blue-500">
                {b.icon}
              </span>
              <h3 className="text-lg font-bold text-[var(--text-main)]">{b.title}</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* High-Intent SEO FAQs */}
      <section aria-labelledby="faq-section-title" className="card p-8 sm:p-12 space-y-6">
        <div className="text-center sm:text-left">
          <span className="badge-brand">Got Questions?</span>
          <h2 id="faq-section-title" className="mt-2 text-2xl sm:text-3xl font-bold text-[var(--text-main)]">
            Frequently Asked Questions About Karnataka Trade Directory
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            Everything you need to know about our commercial enterprise registry and digital directory fulfillment.
          </p>
        </div>

        <div className="divide-y divide-[var(--border-card)] space-y-2">
          {faqs.map((faq, idx) => (
            <div key={idx} className="pt-4 first:pt-0">
              <h3 className="text-base font-bold text-[var(--text-main)] mb-1.5 flex items-center gap-2">
                <span className="text-blue-500">Q.</span> {faq.q}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center pt-6 border-t border-[var(--border-card)]">
          <Link href="/explore" className="btn btn-primary !px-8 !py-3 !text-sm">
            Explore Karnataka Trade Directory →
          </Link>
        </div>
      </section>
    </div>
  );
}
