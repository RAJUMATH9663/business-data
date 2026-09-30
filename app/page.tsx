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
  { icon: "🏥", name: "Hospitals & Clinics", slug: "hospitals-clinics", tag: "Healthcare" },
  { icon: "🏠", name: "Real Estate & Builders", slug: "real-estate", tag: "Property" },
  { icon: "💻", name: "IT & Software Companies", slug: "it-software-companies", tag: "Tech" },
  { icon: "🏫", name: "Schools & Educational Inst.", slug: "schools", tag: "Education" },
  { icon: "🛒", name: "Retail & Supermarkets", slug: "retail-supermarkets", tag: "Commercial" },
  { icon: "🏭", name: "Manufacturing & Industries", slug: "manufacturing-industries", tag: "Industrial" },
];

const benefits = [
  {
    icon: "✅",
    title: "100% Normalized Numbers",
    desc: "Every contact includes a validated 10-digit mobile number stripped of duplicates, invalid formats, and fake entries.",
  },
  {
    icon: "💰",
    title: "Transparent Per-Contact Pricing",
    desc: "Pay only for what you need with automated volume tier discounts starting from as low as ₹1 per contact.",
  },
  {
    icon: "⚡",
    title: "Instant Secure Access",
    desc: "No waiting for manual file sends. Instantly view, search, and filter your purchased contacts inside your account portal.",
  },
];

export default function Home() {
  return (
    <div className="space-y-16 pb-8">
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
            NivoLeads · Verified B2B & Retail Directory · 31 Districts · 20+ Sectors
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-[var(--text-main)] sm:text-5xl lg:text-6xl">
            Target Real Businesses & Decision Makers Across{" "}
            <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 bg-clip-text text-transparent">
              Karnataka
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-base text-[var(--text-muted)] sm:text-lg">
            High-accuracy B2B & retail contact datasets filtered by district and category.
            Clean mobile numbers, addresses, areas, and websites ready for sales outreach.
          </p>

          <div className="flex flex-col items-center justify-center gap-3.5 pt-4 sm:flex-row">
            <Link
              href="/explore"
              className="btn btn-primary w-full sm:w-auto !px-8 !py-3.5 !text-base"
            >
              Explore Business Data →
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
              <div className="text-xs font-medium text-[var(--text-muted)]">Verified Numbers</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-emerald-500 sm:text-3xl">Instant</div>
              <div className="text-xs font-medium text-[var(--text-muted)]">Delivery & Viewer</div>
            </div>
          </div>
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
            From discovering leads to browsing verified contacts in under 2 minutes.
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
    </div>
  );
}
