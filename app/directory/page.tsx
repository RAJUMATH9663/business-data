import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getAppUrl } from "@/lib/seo";
import DownloadSampleButton from "@/components/DownloadSampleButton";

export const revalidate = 86400; // Cache for 24 hours on Vercel Edge CDN

export const metadata: Metadata = {
  title: "Karnataka B2B Commerce Directory & Merchant Index | Karnataka Trade Directory",
  description:
    "Explore verified public enterprise registry, verified trade profiles, and commercial business listings across all 31 districts and 20 core industries in Karnataka.",
  keywords: [
    "Karnataka business directory",
    "Karnataka trade directory",
    "Karnataka commerce index",
    "Karnataka merchant registry",
    "local business listings Karnataka",
    "commercial enterprises Karnataka",
    "district business directory Karnataka",
  ],
  alternates: {
    canonical: "/directory",
  },
  openGraph: {
    title: "Karnataka B2B Commerce Directory & Merchant Index | Karnataka Trade Directory",
    description:
      "Explore verified public enterprise registry, verified trade profiles, and commercial business listings across all 31 districts and 20 core industries in Karnataka.",
    url: "/directory",
  },
};

export default async function DirectoryPage() {
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

  const appUrl = getAppUrl();

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
            name: "Trade Directory",
            item: `${appUrl}/directory`,
          },
        ],
      },
      {
        "@type": "CollectionPage",
        "@id": `${appUrl}/directory/#page`,
        name: "Karnataka B2B Commerce Directory & Merchant Index",
        description:
          "Complete directory of verified enterprise listings and commercial business profiles across all 31 districts of Karnataka.",
        url: `${appUrl}/directory`,
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
        <span className="text-[var(--text-main)] font-semibold">Trade Directory</span>
      </nav>

      {/* Hero Section */}
      <div className="rounded-3xl border border-[var(--border-card)] bg-gradient-to-br from-[var(--bg-card)] via-[var(--bg-mist)] to-[var(--bg-card)] p-6 sm:p-10 shadow-sm text-center md:text-left">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
              📍 31 Districts · 20 Commercial Sectors · Verified Public Registry
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-main)]">
              Karnataka B2B Trade Directory & Merchant Registry
            </h1>
            <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
              Explore verified commercial listings, public trade phone numbers, and enterprise profiles organized by district and industry sector for commercial trade discovery.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 md:flex-col shrink-0">
            <Link
              href="/explore"
              className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 px-6 py-3 text-sm font-semibold rounded-xl text-center"
            >
              Search & Filter Directory →
            </Link>
            <DownloadSampleButton variant="outline" />
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
            <div className="text-xs text-[var(--text-muted)] mt-1">Commercial Sectors</div>
          </div>
          <div className="p-3">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {totalBusinesses > 0 ? `${totalBusinesses.toLocaleString("en-IN")}` : "8,000+"}
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-1">Verified Listings</div>
          </div>
          <div className="p-3">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">100%</div>
            <div className="text-xs text-[var(--text-muted)] mt-1">Normalized Records</div>
          </div>
        </div>
      </div>

      {/* Free Sample Download Banner */}
      <DownloadSampleButton variant="banner" />

      {/* Browse by District Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)]">
              Browse Directory by Karnataka District
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
              href={`/directory/${d.slug}`}
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
                    {d._count.businesses > 0 ? `${d._count.businesses.toLocaleString("en-IN")} verified listings` : "Commercial Listings"}
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
            Browse Directory by Industry Sector
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
            Discover verified commercial enterprises and registered vendors in key trade sectors.
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
                    {c._count.businesses > 0 ? `${c._count.businesses.toLocaleString("en-IN")} active listings` : "Commercial sector"}
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
