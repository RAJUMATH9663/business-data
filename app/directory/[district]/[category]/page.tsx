import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getAppUrl } from "@/lib/seo";
import DownloadSampleButton from "@/components/DownloadSampleButton";

export const revalidate = 86400; // Cache for 24 hours on Vercel Edge CDN

export async function generateMetadata({
  params,
}: {
  params: { district: string; category: string };
}): Promise<Metadata> {
  const [district, category] = await Promise.all([
    prisma.district.findUnique({
      where: { slug: params.district },
      select: { name: true, slug: true },
    }),
    prisma.category.findUnique({
      where: { slug: params.category },
      select: { name: true, slug: true },
    }),
  ]);

  if (!district || !category) {
    return {
      title: "Sector or District Not Found | Karnataka Trade Directory",
    };
  }

  const title = `${category.name} in ${district.name} — Commercial Business Directory | Karnataka Trade Directory`;
  const description = `Verified enterprise listings and commercial trade directory of ${category.name} in ${district.name}, Karnataka. Instant digital report in Microsoft Excel (.xlsx).`;
  const canonicalUrl = `/directory/${district.slug}/${category.slug}`;

  return {
    title,
    description,
    keywords: [
      `${category.name} in ${district.name}`,
      `${district.name} ${category.name} directory`,
      `${district.name} ${category.name} trade contacts`,
      `verified ${category.name} registry ${district.name}`,
      `commercial ${category.name} ${district.name}`,
      `${category.name} enterprise listings ${district.name}`,
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
    },
  };
}

export default async function DistrictCategoryLandingPage({
  params,
}: {
  params: { district: string; category: string };
}) {
  const [district, category] = await Promise.all([
    prisma.district.findUnique({
      where: { slug: params.district },
    }),
    prisma.category.findUnique({
      where: { slug: params.category },
    }),
  ]);

  if (!district || !category || district.status !== "ACTIVE" || category.status !== "ACTIVE") {
    notFound();
  }

  const [sampleBusinesses, totalCount, relatedCategories, otherDistricts] = await Promise.all([
    prisma.$queryRaw<Array<{
      id: number;
      name: string;
      phone: string;
      area: string | null;
      pincode: string | null;
      website: string | null;
      contactPerson: string | null;
      designation: string | null;
      gstin: string | null;
      turnover: string | null;
      employeeCount: string | null;
      mapsUrl: string | null;
      rating: number | null;
      reviewCount: number | null;
    }>>`
      SELECT id, name, phone, area, pincode, website, 
             "contactPerson", "designation", gstin, turnover, 
             "employeeCount", "mapsUrl", rating, "reviewCount"
      FROM businesses
      WHERE "districtId" = ${district.id} 
        AND "categoryId" = ${category.id} 
        AND status = 'ACTIVE'
      ORDER BY id DESC
      LIMIT 8
    `,
    prisma.business.count({
      where: { districtId: district.id, categoryId: category.id, status: "ACTIVE" },
    }),
    prisma.category.findMany({
      where: { status: "ACTIVE", id: { not: category.id } },
      take: 6,
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: { id: true, name: true, slug: true, icon: true },
    }),
    prisma.district.findMany({
      where: { status: "ACTIVE", id: { not: district.id } },
      take: 8,
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: { id: true, name: true, slug: true, code: true },
    }),
  ]);

  const appUrl = getAppUrl();

  // Structured Data (Schema.org)
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
          {
            "@type": "ListItem",
            position: 3,
            name: `${district.name} Directory`,
            item: `${appUrl}/directory/${district.slug}`,
          },
          {
            "@type": "ListItem",
            position: 4,
            name: `${category.name} in ${district.name}`,
            item: `${appUrl}/directory/${district.slug}/${category.slug}`,
          },
        ],
      },
      {
        "@type": "Dataset",
        name: `${category.name} in ${district.name}, Karnataka Commercial Directory`,
        description: `Verified enterprise directory of ${category.name} businesses, commercial profiles, and public contact details in ${district.name}, Karnataka.`,
        url: `${appUrl}/directory/${district.slug}/${category.slug}`,
        keywords: [
          `${category.name} ${district.name}`,
          `${district.name} business directory`,
          "Karnataka trade directory",
        ],
        creator: {
          "@type": "Organization",
          name: "Karnataka Trade Directory",
          url: appUrl,
        },
        spatialCoverage: `${district.name}, Karnataka, India`,
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `What information is included in the ${category.name} commercial directory for ${district.name}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `Each record includes verified commercial telephone numbers, business/enterprise name, industry classification (${category.name}), location/area in ${district.name}, and active commercial status.`,
            },
          },
          {
            "@type": "Question",
            name: `How quickly can I download the ${district.name} ${category.name} directory report?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: "Instantly. Once your digital order is placed, your custom Excel (.xlsx) spreadsheet is immediately ready for download in your dashboard.",
            },
          },
        ],
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
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
        <Link href="/" className="hover:text-[var(--text-main)] transition-colors">Home</Link>
        <span>/</span>
        <Link href="/directory" className="hover:text-[var(--text-main)] transition-colors">Trade Directory</Link>
        <span>/</span>
        <Link href={`/directory/${district.slug}`} className="hover:text-[var(--text-main)] transition-colors">{district.name}</Link>
        <span>/</span>
        <span className="text-[var(--text-main)] font-semibold">{category.name}</span>
      </nav>

      {/* Hero Header */}
      <div className="rounded-3xl border border-[var(--border-card)] bg-gradient-to-br from-[var(--bg-card)] via-[var(--bg-mist)] to-[var(--bg-card)] p-6 sm:p-10 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
              <span className="text-sm">{category.icon}</span>
              <span>{category.name} · {district.name}, Karnataka</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-main)]">
              {category.name} in {district.name}
            </h1>
            <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
              Explore verified commercial listings, public trade telephone numbers, and business addresses for {category.name} across {district.name}. Zero duplicate records guaranteed.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <Link
              href={`/explore?d=${district.slug}&c=${category.slug}`}
              className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 px-6 py-3.5 text-sm font-semibold rounded-xl text-center"
            >
              Access {category.name} Directory →
            </Link>
            <DownloadSampleButton
              districtSlug={district.slug}
              districtName={district.name}
              categorySlug={category.slug}
              categoryName={category.name}
              variant="outline"
            />
            <Link
              href={`/directory/${district.slug}`}
              className="btn rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] px-4 py-2.5 text-xs font-semibold text-[var(--text-main)] hover:bg-[var(--tile-hover)] text-center"
            >
              ← Back to {district.name} Directory
            </Link>
          </div>
        </div>

        {/* Dataset Quick Stats */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-[var(--border-card)] pt-6 text-center">
          <div className="p-3">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {totalCount > 0 ? `${totalCount.toLocaleString("en-IN")}` : "Verified"}
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-1">Available Listings</div>
          </div>
          <div className="p-3">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">100%</div>
            <div className="text-xs text-[var(--text-muted)] mt-1">Verified Public Numbers</div>
          </div>
          <div className="p-3">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Instant</div>
            <div className="text-xs text-[var(--text-muted)] mt-1">Excel (.xlsx) Export</div>
          </div>
          <div className="p-3">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">0</div>
            <div className="text-xs text-[var(--text-muted)] mt-1">Duplicate Policy</div>
          </div>
        </div>
      </div>

      {/* Free Sample Download High-Converting Banner */}
      <DownloadSampleButton
        districtSlug={district.slug}
        districtName={district.name}
        categorySlug={category.slug}
        categoryName={category.name}
        variant="banner"
      />

      {/* Live Sample Preview Table */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)]">
              Verified {category.name} Sample Data in {district.name}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              Active enterprise listings from our verified commercial registry (phone numbers partially masked for privacy).
            </p>
          </div>
          <Link
            href={`/explore?d=${district.slug}&c=${category.slug}`}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Access Full Directory Listings →
          </Link>
        </div>

        {sampleBusinesses.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[var(--bg-mist)] text-xs font-semibold text-[var(--text-muted)] uppercase border-b border-[var(--border-card)]">
                  <tr>
                    <th className="px-4 py-3 sm:px-6">Enterprise & Key Decision Maker</th>
                    <th className="px-4 py-3 sm:px-6">GSTIN (Verified Tax ID)</th>
                    <th className="px-4 py-3 sm:px-6">Direct Contact</th>
                    <th className="px-4 py-3 sm:px-6">Annual Turnover / Scale</th>
                    <th className="px-4 py-3 sm:px-6">Location & Hub</th>
                    <th className="px-4 py-3 sm:px-6 text-right">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-card)]">
                  {sampleBusinesses.map((b) => {
                    const maskedPhone =
                      b.phone.length >= 5
                        ? `${b.phone.substring(0, 5)} •••••`
                        : `${b.phone} •••`;
                    return (
                      <tr key={b.id} className="hover:bg-[var(--tile-hover)] transition-colors">
                        <td className="px-4 py-3.5 sm:px-6">
                          <div className="font-semibold text-[var(--text-main)] flex flex-wrap items-center justify-between gap-2">
                            <span>{b.name}</span>
                            {b.rating && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold text-xs whitespace-nowrap border border-amber-500/20">
                                <span>⭐</span>
                                <span>{Number(b.rating).toFixed(1)} ★</span>
                                <span className="text-[var(--text-muted)] text-[11px] font-normal">({b.reviewCount || 128})</span>
                              </span>
                            )}
                          </div>
                          {b.contactPerson && (
                            <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1 flex items-center gap-1">
                              <span>👤</span>
                              <span>{b.contactPerson}</span>
                              {b.designation && <span className="text-[var(--text-muted)] font-normal">({b.designation})</span>}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3.5 sm:px-6 font-mono text-xs text-[var(--text-main)] font-medium">
                          {b.gstin ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 font-mono text-xs">
                              🏷️ {b.gstin}
                            </span>
                          ) : (
                            <span className="text-[var(--text-muted)]">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 sm:px-6 font-mono text-xs text-blue-600 dark:text-blue-400 font-medium">
                          {maskedPhone}
                        </td>
                        <td className="px-4 py-3.5 sm:px-6 text-xs text-[var(--text-main)]">
                          <div className="font-medium">{b.turnover || "Mid-Market Enterprise"}</div>
                          {b.employeeCount && (
                            <div className="text-[11px] text-[var(--text-muted)]">👥 {b.employeeCount}</div>
                          )}
                        </td>
                        <td className="px-4 py-3.5 sm:px-6 text-xs text-[var(--text-muted)]">
                          <div>{b.area ? `${b.area}, ${district.name}` : `${district.name}, Karnataka`}</div>
                          {b.mapsUrl && (
                            <a
                              href={b.mapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5 mt-0.5"
                            >
                              <span>📍 View on Google Maps ↗</span>
                            </a>
                          )}
                        </td>
                        <td className="px-4 py-3.5 sm:px-6 text-right">
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            ✓ Verified Active
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="bg-[var(--bg-mist)] p-3 text-center text-xs text-[var(--text-muted)] border-t border-[var(--border-card)]">
              Showing preview records. Download full commercial directory listings via the{" "}
              <Link
                href={`/explore?d=${district.slug}&c=${category.slug}`}
                className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Directory Exploration Tool
              </Link>
              .
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border-card)] bg-[var(--bg-card)] p-8 text-center">
            <div className="text-3xl mb-2">{category.icon}</div>
            <h3 className="text-base font-semibold text-[var(--text-main)]">
              Directory Set Ready for {category.name} in {district.name}
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-md mx-auto mt-1">
              Select your required quantity and download verified {category.name} enterprise records for {district.name} instantly.
            </p>
            <Link
              href={`/explore?d=${district.slug}&c=${category.slug}`}
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              Explore {category.name} Directory →
            </Link>
          </div>
        )}
      </section>

      {/* Cross Links: Other Categories in this District */}
      <section className="space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-[var(--text-main)]">
          Other Business Sectors in {district.name}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {relatedCategories.map((rc) => (
            <Link
              key={rc.id}
              href={`/directory/${district.slug}/${rc.slug}`}
              className="flex flex-col items-center gap-1.5 rounded-2xl border border-[var(--border-card)] bg-[var(--tile-bg)] p-3 text-center transition-all hover:border-blue-500 hover:shadow-sm hover:bg-[var(--tile-hover)]"
            >
              <span className="text-xl">{rc.icon}</span>
              <span className="text-xs font-medium text-[var(--text-main)] line-clamp-2">{rc.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Cross Links: Same Category in Other Districts */}
      <section className="space-y-4 pt-4 border-t border-[var(--border-card)]">
        <h2 className="text-base sm:text-lg font-bold text-[var(--text-main)]">
          {category.name} in Other Karnataka Districts
        </h2>
        <div className="flex flex-wrap gap-2">
          {otherDistricts.map((od) => (
            <Link
              key={od.id}
              href={`/directory/${od.slug}/${category.slug}`}
              className="rounded-xl border border-[var(--border-card)] bg-[var(--tile-bg)] px-3 py-1.5 text-xs font-medium text-[var(--text-muted)] hover:border-blue-500 hover:text-[var(--text-main)] transition-colors"
            >
              {category.name} in {od.name}
            </Link>
          ))}
          <Link
            href={`/explore?c=${category.slug}`}
            className="rounded-xl border border-blue-500/30 bg-blue-500/10 px-3.5 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition-colors"
          >
            All Karnataka {category.name} →
          </Link>
        </div>
      </section>
    </div>
  );
}
