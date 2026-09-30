import Image from "next/image";
import Link from "next/link";

const steps = [
  {
    step: "01",
    icon: "📍",
    label: "Pick a District",
    desc: "Choose from any of Karnataka's 31 districts.",
  },
  {
    step: "02",
    icon: "🗂️",
    label: "Select Category",
    desc: "Target specific industries like Hospitals, IT, Real Estate, etc.",
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
    desc: "Seamless, encrypted payment via Razorpay / UPI / Cards.",
  },
  {
    step: "05",
    icon: "⚡",
    label: "Instant Access",
    desc: "Immediately view and search your verified contacts online.",
  },
];

const featuredCategories = [
  { icon: "🏥", name: "Hospitals & Clinics", slug: "hospitals-clinics", tag: "Healthcare", query: "hospital business leads & phone numbers" },
  { icon: "🏠", name: "Real Estate & Builders", slug: "real-estate", tag: "Property", query: "real estate company contacts" },
  { icon: "💻", name: "IT & Software Companies", slug: "it-software-companies", tag: "Tech", query: "software company decision makers" },
  { icon: "🏫", name: "Schools & Educational Inst.", slug: "schools", tag: "Education", query: "school & college phone numbers" },
  { icon: "🛒", name: "Retail & Supermarkets", slug: "retail-supermarkets", tag: "Commercial", query: "local retail business contacts" },
  { icon: "🏭", name: "Manufacturing & Industries", slug: "manufacturing-industries", tag: "Industrial", query: "industrial & manufacturing leads" },
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
    desc: "Every lead includes a validated 10-digit mobile number stripped of duplicates, invalid formats, and dead numbers ready for cold calling and WhatsApp outreach.",
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
    q: "Where can I find business phone numbers and contact details in Karnataka?",
    a: "NivoLeads is Karnataka's dedicated B2B business directory offering direct, verified phone numbers, company names, areas, and addresses across all 31 districts and 20+ industries. You can filter by district (e.g. Vijayapura, Bengaluru, Belagavi, Mysuru) and sector to instantly access verified contacts.",
  },
  {
    q: "How can freelancers and marketing agencies use NivoLeads for client acquisition?",
    a: "Freelancers, web designers, digital marketing agencies, and SEO consultants use NivoLeads to find local business leads who need digital services. Instead of spending days scraping Google Maps, agencies can purchase 100 to 1,000+ verified contacts in specific sectors (like hospitals, real estate, gyms, or schools) to run targeted outreach.",
  },
  {
    q: "Can I find hospital and clinic contact lists with phone numbers in Karnataka?",
    a: "Yes! NivoLeads includes comprehensive healthcare contact databases for hospitals, multi-specialty clinics, diagnostic centers, and nursing homes across Karnataka with direct verified mobile numbers for medical suppliers, pharmaceutical sales, and equipment reps.",
  },
  {
    q: "How does the zero-duplicate guarantee work when buying B2B leads?",
    a: "Our smart contact allocation engine tracks every lead you have ever unlocked under your account. When you place a repeat order in the same district and category, the system automatically starts from the next unowned contact (e.g. Order 1 gives contacts #1–#100; Order 2 gives #101–#200). You never pay for the same phone number twice.",
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
        text: f.a,
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

      {/* Hero Section */}
      <section className="card relative overflow-hidden p-8 text-center sm:p-14 lg:p-20">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="mx-auto flex justify-center">
            <Image
              src="/logo.png"
              alt="NivoLeads"
              width={380}
              height={100}
              className="h-20 sm:h-28 md:h-32 w-auto rounded-2xl object-contain shadow-lg"
              priority
            />
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-500">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            NivoLeads · Verified Business Leads & Company Contact Database · 31 Karnataka Districts
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-[var(--text-main)] sm:text-5xl lg:text-6xl">
            Target Real Businesses & Decision Makers Across{" "}
            <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 bg-clip-text text-transparent">
              Karnataka
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-base text-[var(--text-muted)] sm:text-lg">
            High-accuracy B2B leads, company databases & local business phone numbers.
            Clean mobile numbers, addresses, areas, and websites ready for cold calling, WhatsApp, and sales outreach.
          </p>

          <div className="flex flex-col items-center justify-center gap-3.5 pt-4 sm:flex-row">
            <Link
              href="/explore"
              className="btn btn-primary w-full sm:w-auto !px-8 !py-3.5 !text-base shadow-lg hover:shadow-blue-500/25 transition-all"
            >
              Explore Business Leads →
            </Link>
            <Link
              href="/login"
              className="btn btn-ghost w-full sm:w-auto !px-6 !py-3.5 !text-base"
            >
              Client Login
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-12 grid grid-cols-2 gap-4 border-t border-[var(--border-card)] pt-8 sm:grid-cols-4">
            <div>
              <div className="text-2xl font-extrabold text-[var(--text-main)] sm:text-3xl">31</div>
              <div className="text-xs font-medium text-[var(--text-muted)]">Districts Covered</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-[var(--text-main)] sm:text-3xl">20+</div>
              <div className="text-xs font-medium text-[var(--text-muted)]">Industry Categories</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-blue-500 sm:text-3xl">100%</div>
              <div className="text-xs font-medium text-[var(--text-muted)]">Verified Mobile Numbers</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-emerald-500 sm:text-3xl">Instant</div>
              <div className="text-xs font-medium text-[var(--text-muted)]">Excel & CSV Download</div>
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
          <Link href="/explore" className="text-sm font-semibold text-blue-500 hover:underline">
            All 31 districts →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {topDistricts.map((d) => (
            <Link
              key={d.slug}
              href={`/explore?d=${d.slug}`}
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
            View all 20 categories →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/explore?c=${cat.slug}`}
              className="card group flex items-center justify-between p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500/60"
            >
              <div className="flex items-center gap-3.5">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--bg-mist)] text-2xl transition-transform duration-200 group-hover:scale-110">
                  {cat.icon}
                </span>
                <div>
                  <h3 className="text-base font-bold text-[var(--text-main)] group-hover:text-blue-500 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="inline-block rounded bg-[var(--bg-mist)] px-2 py-0.5 text-[11px] font-medium text-[var(--text-muted)]">
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
