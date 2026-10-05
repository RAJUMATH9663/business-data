import Image from "next/image";
import Link from "next/link";

const steps = [
  {
    step: "01",
    icon: "📍",
    label: "Pick a District",
    desc: "Choose from any of Karnataka's 31 districts or international regions.",
  },
  {
    step: "02",
    icon: "🗂️",
    label: "Select Category",
    desc: "Target specific industries like Hospitals, IT, Real Estate, Manufacturing, etc.",
  },
  {
    step: "03",
    icon: "🔢",
    label: "Set Quantity",
    desc: "Choose exactly how many contacts you need with bulk volume discounts.",
  },
  {
    step: "04",
    icon: "💳",
    label: "Secure Checkout",
    desc: "Seamless, encrypted payment via Razorpay / UPI / Cards / Net Banking.",
  },
  {
    step: "05",
    icon: "⚡",
    label: "Instant Excel Export",
    desc: "Download verified spreadsheet (.xlsx / .csv) and search contacts online immediately.",
  },
];

const businessIdeas = [
  { icon: "🏥", name: "Healthcare", slug: "healthcare", tag: "Hot Sector" },
  { icon: "🎓", name: "Education & Training", slug: "education-training", tag: "Education" },
  { icon: "🏠", name: "Real Estate & Construction", slug: "real-estate-construction", tag: "High Ticket" },
  { icon: "💪", name: "Health, Fitness & Beauty", slug: "health-fitness-beauty", tag: "Wellness" },
  { icon: "🍽️", name: "Food, Restaurants & Hotels", slug: "food-restaurants-hotels", tag: "Hospitality" },
  { icon: "🛒", name: "Shopping & Retail", slug: "shopping-retail", tag: "Retail" },
  { icon: "💻", name: "IT & Digital Services", slug: "it-digital-services", tag: "Tech" },
  { icon: "⚖️", name: "Professional Services", slug: "professional-services", tag: "B2B" },
  { icon: "🚗", name: "Automobile & Transport", slug: "automobile-transport", tag: "Auto" },
  { icon: "🏭", name: "Industries & Manufacturing", slug: "industries-manufacturing", tag: "B2B Supply" },
  { icon: "✈️", name: "Travel & Tourism", slug: "travel-tourism", tag: "Travel" },
  { icon: "🌾", name: "Agriculture & Agro Businesses", slug: "agriculture-agro-businesses", tag: "Agri" },
];

const topDistricts = [
  { name: "Bengaluru Urban", slug: "bengaluru-urban", tag: "Silicon Valley" },
  { name: "Vijayapura", slug: "vijayapura", tag: "Commercial Hub" },
  { name: "Belagavi", slug: "belagavi", tag: "Industrial Zone" },
  { name: "Mysuru", slug: "mysuru", tag: "Heritage & Tech" },
  { name: "Dharwad", slug: "dharwad", tag: "Education & IT" },
  { name: "Mangaluru", slug: "dakshina-kannada", tag: "Coastal Port" },
  { name: "Tumakuru", slug: "tumakuru", tag: "Smart City" },
  { name: "Shivamogga", slug: "shivamogga", tag: "Central Trade" },
  { name: "Kalaburagi", slug: "kalaburagi", tag: "North Hub" },
  { name: "Ballari", slug: "ballari", tag: "Mining & Steel" },
  { name: "Udupi", slug: "udupi", tag: "Banking & Retail" },
  { name: "Davanagere", slug: "davanagere", tag: "Textiles & Agri" },
];

const benefits = [
  {
    icon: "✅",
    title: "100% Normalized Mobile Numbers",
    desc: "Every enterprise listing includes a validated 10-digit business phone number, formatted and checked against active telecom standards for verified commercial trade inquiries and business networking.",
  },
  {
    icon: "💰",
    title: "Transparent Per-Contact Pricing",
    desc: "Pay only for what you need with automated volume tier discounts starting from as low as ₹1 per contact. No expensive recurring monthly retainers.",
  },
  {
    icon: "⚡",
    title: "Instant Digital Delivery & Excel Export",
    desc: "No waiting for manual file sends. Instantly view, search, and download your purchased B2B contact lists directly into Excel (.xlsx) or CSV.",
  },
];

const faqs = [
  {
    q: "Where can I find business phone numbers and contact details?",
    a: "NivoLeads is a dedicated commercial B2B directory providing verified business phone numbers, company names, areas, and addresses. Users can filter by country, region, city, and industry sector to instantly view and export authentic decision-maker contact lists.",
  },
  {
    q: "Does NivoLeads offer US business contacts and international company leads?",
    a: "Yes. NivoLeads is built on a scalable Country → State → City → Industry directory structure. While our deepest verified coverage currently starts across Karnataka's 31 districts in India, our database architecture natively scales to US business phone numbers, American company databases, and international B2B sales prospect lists.",
  },
  {
    q: "How can businesses and marketing agencies use NivoLeads?",
    a: "Freelancers, web consultants, B2B vendors, and agencies use NivoLeads to discover commercial partners and corporate clients who need enterprise services. Instead of spending weeks manually searching directories, businesses can access verified profiles in specific high-value sectors (like hospitals, real estate, manufacturing, or retail) for commercial trade collaboration.",
  },
  {
    q: "Can I find hospital and clinic contact lists with direct phone numbers?",
    a: "Yes! NivoLeads includes comprehensive healthcare contact databases for hospitals, multi-specialty clinics, diagnostic centers, and medical facilities with verified mobile numbers for medical suppliers, pharmaceutical sales, and equipment reps.",
  },
  {
    q: "How does the zero-duplicate guarantee work when buying B2B leads?",
    a: "Our smart contact allocation engine tracks every lead you have ever unlocked under your account. When you place a repeat order in the same location and category, the system automatically starts from the next unowned contact (e.g. Order 1 gives contacts #1–#100; Order 2 gives #101–#200). You never pay for the same phone number twice.",
  },
  {
    q: "Can I download business leads directly to Microsoft Excel or CSV format?",
    a: "Yes. Every completed order comes with instant one-click 'Download Excel' (.xlsx) export capability from your account portal, making it easy to import contacts into your CRM, dialer, or outreach software.",
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
              alt="NivoLeads"
              width={340}
              height={90}
              className="h-16 sm:h-24 md:h-28 w-auto rounded-2xl object-contain shadow-md transition-transform hover:scale-105"
              priority
            />
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              NivoLeads · Global B2B Directory & Verified Company Contact Database
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-main)] sm:text-5xl lg:text-6xl leading-[1.15]">
            Target Real Businesses & Decision Makers{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent">
              Locally & Globally
            </span>
          </h1>

          {/* Subtitle / Value Proposition */}
          <p className="mx-auto max-w-2xl text-sm sm:text-base md:text-lg text-[var(--text-muted)] leading-relaxed">
            Verified B2B company directory, corporate profiles & commercial business listings. Filter by region and industry sector to discover authentic commercial partners and business contacts for trade collaboration.
          </p>

          {/* Direct CTA Action Box */}
          <div className="mx-auto max-w-xl rounded-2xl border border-blue-500/30 bg-[var(--bg-card)] p-4 sm:p-5 shadow-md">
            <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
              Want verified contacts for your business outreach?
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/explore"
                className="btn btn-primary w-full sm:flex-1 !py-3.5 !text-sm sm:!text-base font-bold shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02]"
              >
                Get Started — Get Business Contacts →
              </Link>
              <Link
                href="/leads"
                className="btn btn-ghost w-full sm:w-auto !py-3.5 !text-sm font-semibold border border-[var(--border-card)]"
              >
                Browse Directory 📍
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
              Explore Popular Business Ideas & Sectors:
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
              <div className="text-2xl font-extrabold text-[var(--text-main)] sm:text-3xl">12</div>
              <div className="text-xs font-medium text-[var(--text-muted)] mt-0.5">Industry Categories</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 sm:text-3xl">100%</div>
              <div className="text-xs font-medium text-[var(--text-muted)] mt-0.5">Verified Mobile Numbers</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 sm:text-3xl">Instant</div>
              <div className="text-xs font-medium text-[var(--text-muted)] mt-0.5">Excel & CSV Download</div>
            </div>
          </div>
        </div>
      </section>

      {/* Freelancers & Sales Agencies Callout */}
      <section className="card p-6 sm:p-10 border border-blue-500/30 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-transparent">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="badge-brand">Built for Growth Teams</span>
            <h2 className="text-2xl font-bold text-[var(--text-main)]">
              Leads for Freelancers, Digital Marketers & Sales Agencies
            </h2>
            <p className="text-sm text-[var(--text-muted)] max-w-2xl leading-relaxed">
              Stop wasting hours manually searching Google Maps. Access verified business prospect databases with direct owner phone numbers to pitch web design, SEO, social media marketing, and B2B services.
            </p>
          </div>
          <Link
            href="/explore"
            className="btn btn-primary whitespace-nowrap !px-6 !py-3 !text-sm shrink-0"
          >
            Find Client Leads Now →
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
            From discovering leads to browsing and downloading verified contacts in under 2 minutes.
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
              Explore Business Leads by Karnataka District
            </h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Target verified commercial listings in your local city or region.
            </p>
          </div>
          <Link href="/leads" className="text-sm font-semibold text-blue-500 hover:underline">
            All 31 districts →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {topDistricts.map((d) => (
            <Link
              key={d.slug}
              href={`/leads/${d.slug}`}
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
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-[var(--text-main)]">Popular Industry Databases</h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">Direct phone numbers and addresses for targeted campaigns.</p>
          </div>
          <Link href="/explore" className="text-sm font-semibold text-blue-500 hover:underline">
            View all 12 categories →
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
            Frequently Asked Questions About NivoLeads
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            Everything you need to know about our verified business contact database and lead delivery.
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
            Search Business Leads in Your District →
          </Link>
        </div>
      </section>
    </div>
  );
}
