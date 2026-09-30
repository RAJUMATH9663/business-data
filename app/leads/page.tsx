import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Karnataka Business Leads Directory by District & Industry | NivoLeads",
  description:
    "Explore verified B2B leads, company databases, and verified 10-digit phone numbers across all 31 districts and 20+ industries in Karnataka.",
  keywords: [
    "Karnataka business directory",
    "Karnataka B2B leads",
    "Karnataka company database",
    "business leads Karnataka",
    "local business leads Karnataka",
    "Karnataka business phone numbers",
    "district business contacts Karnataka",
  ],
  alternates: {
    canonical: "/leads",
  },
  openGraph: {
    title: "Karnataka Business Leads Directory by District & Industry | NivoLeads",
    description:
      "Explore verified B2B leads, company databases, and verified 10-digit phone numbers across all 31 districts and 20+ industries in Karnataka.",
    url: "/leads",
  },
};

export default async function LeadsDirectoryPage() {
  const [districts, categories, totalBusinesses] = await Promise.all([
    prisma.district.findMany({
      where: { status: "ACTIVE" },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        code: true,
        _count: { select: { businesses: { where: { status: "ACTIVE" } } } },
      },
    }),
    prisma.category.findMany({
      where: { status: "ACTIVE" },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        icon: true,
        _count: { select: { businesses: { where: { status: "ACTIVE" } } } },
      },
    }),
    prisma.business.count({ where: { status: "ACTIVE" } }),
  ]);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://nivoleads.com";

  // Schema.org CollectionPage + Breadcrumb
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: appUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Leads Directory",
            item: `${appUrl}/leads`,
          },
        ],
      },
      {
        "@type": "CollectionPage",
        "@id": `${appUrl}/leads/#page`,
        name: "Karnataka B2B Leads & Business Directory",
        description:
          "Complete directory of verified business phone numbers and commercial contacts across all 31 districts of Karnataka.",
        url: `${appUrl}/leads`,
      },
    ],
  };

  return (
    <div className="space-y-12 py-4 sm:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
        <Link href="/" className="hover:text-[var(--text-main)] transition-colors">Home</Link>
        <span>/</span>
        <span className="text-[var(--text-main)] font-semibold">Leads Directory</span>
      </nav>

      {/* Hero Section */}
      <div className="rounded-3xl border border-[var(--border-card)] bg-gradient-to-br from-[var(--bg-card)] via-[var(--bg-mist)] to-[var(--bg-card)] p-6 sm:p-10 shadow-sm text-center md:text-left">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
              📍 31 Districts · 20+ Sectors · 100% Phone Verified
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-main)]">
              Karnataka B2B Business Leads Directory
            </h1>
            <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
              Explore verified company contacts, 10-digit mobile numbers, and decision-maker databases organized by district and industry sector.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 md:flex-col shrink-0">
            <Link
              href="/explore"
              className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 px-6 py-3 text-sm font-semibold rounded-xl text-center"
            >
              Filter & Export Custom Leads →
            </Link>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-[var(--border-card)] pt-6 text-center">
          <div className="p-3">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{districts.length}</div>
            <div className="text-xs text-[var(--text-muted)] mt-1">Karnataka Districts</div>
          </div>
          <div className="p-3">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{categories.length}</div>
            <div className="text-xs text-[var(--text-muted)] mt-1">Industry Categories</div>
          </div>
          <div className="p-3">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {totalBusinesses > 0 ? `${totalBusinesses}+` : "50,000+"}
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-1">Verified Contacts</div>
          </div>
          <div className="p-3">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">0</div>
            <div className="text-xs text-[var(--text-muted)] mt-1">Duplicate Policy</div>
          </div>
        </div>
      </div>

      {/* Browse by District Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)]">
              Browse Leads by Karnataka District
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
              Select a district to view industry sectors, live sample records, and localized B2B databases.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {districts.map((d) => (
            <Link
              key={d.id}
              href={`/leads/${d.slug}`}
              className="group flex items-center justify-between rounded-2xl border border-[var(--border-card)] bg-[var(--tile-bg)] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500/50 hover:shadow-md hover:bg-[var(--tile-hover)]"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-sm font-bold text-blue-600 dark:text-blue-400">
                  {d.code || "KA"}
                </span>
                <div>
                  <div className="text-sm font-semibold text-[var(--text-main)] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {d.name}
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">
                    {d._count.businesses > 0 ? `${d._count.businesses} verified records` : "District Leads"}
                  </div>
                </div>
              </div>
              <span className="text-[var(--text-muted)] group-hover:text-blue-600 group-hover:translate-x-1 transition-all text-sm">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Browse by Industry Category Section */}
      <section className="space-y-6 pt-6 border-t border-[var(--border-card)]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)]">
            Browse Leads by Industry Category
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
            Target decision-makers and business owners in high-demand commercial sectors.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/explore?c=${c.slug}`}
              className="group flex items-center justify-between rounded-2xl border border-[var(--border-card)] bg-[var(--tile-bg)] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500/50 hover:shadow-md hover:bg-[var(--tile-hover)]"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-lg">
                  {c.icon || "📁"}
                </span>
                <div>
                  <div className="text-sm font-semibold text-[var(--text-main)] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {c.name}
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">
                    {c._count.businesses > 0 ? `${c._count.businesses} verified leads` : "Commercial category"}
                  </div>
                </div>
              </div>
              <span className="text-[var(--text-muted)] group-hover:text-emerald-600 group-hover:translate-x-1 transition-all text-sm">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
