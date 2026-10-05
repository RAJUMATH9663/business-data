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
  params: { district: string };
}): Promise<Metadata> {
  const district = await prisma.district.findUnique({
    where: { slug: params.district },
    select: { name: true, slug: true },
  });

  if (!district) {
    return {
      title: "District Not Found | NivoLeads",
    };
  }

  const title = `${district.name} Business Leads & Company Database (2026) | NivoLeads`;
  const description = `Access verified B2B leads, company phone numbers, and decision-maker contacts in ${district.name}, Karnataka. Instant download, 0 duplicate guarantee, Excel/CSV ready.`;
  const canonicalUrl = `/leads/${district.slug}`;

  return {
    title,
    description,
    keywords: [
      `${district.name} business leads`,
      `${district.name} company database`,
      `${district.name} B2B contacts`,
      `${district.name} business directory`,
      `${district.name} business phone numbers`,
      `local business leads ${district.name}`,
      `companies in ${district.name}`,
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

export default async function DistrictLandingPage({
  params,
}: {
  params: { district: string };
}) {
  const district = await prisma.district.findUnique({
    where: { slug: params.district },
    include: {
      _count: {
        select: {
          businesses: { where: { status: "ACTIVE" } },
        },
      },
    },
  });

  if (!district || district.status !== "ACTIVE") {
    notFound();
  }

  const [categories, sampleBusinesses, otherDistricts] = await Promise.all([
    prisma.category.findMany({
      where: { status: "ACTIVE" },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        icon: true,
        _count: {
          select: {
            businesses: {
              where: { districtId: district.id, status: "ACTIVE" },
            },
          },
        },
      },
    }),
    prisma.business.findMany({
      where: { districtId: district.id, status: "ACTIVE" },
      take: 6,
      orderBy: { id: "desc" },
      select: {
        id: true,
        name: true,
        phone: true,
        area: true,
        category: { select: { name: true, slug: true, icon: true } },
      },
    }),
    prisma.district.findMany({
      where: { status: "ACTIVE", id: { not: district.id } },
      take: 8,
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: { id: true, name: true, slug: true, code: true },
    }),
  ]);

  const appUrl = getAppUrl();
  const totalCount = district._count.businesses;

  // Schema.org Structured Data
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
          {
            "@type": "ListItem",
            position: 3,
            name: `${district.name} Leads`,
            item: `${appUrl}/leads/${district.slug}`,
          },
        ],
      },
      {
        "@type": "Dataset",
        name: `${district.name} B2B Business Leads & Company Database`,
        description: `Verified directory of businesses, commercial enterprises, and 10-digit mobile contacts in ${district.name}, Karnataka.`,
        url: `${appUrl}/leads/${district.slug}`,
        keywords: [
          `${district.name} business leads`,
          "Karnataka B2B database",
          "verified phone numbers",
        ],
        creator: {
          "@type": "Organization",
          name: "NivoLeads",
          url: appUrl,
        },
        spatialCoverage: `${district.name}, Karnataka, India`,
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `How many verified business contacts are available in ${district.name}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `NivoLeads provides comprehensive verified business contacts across ${district.name}, covering multiple sectors including healthcare, manufacturing, retail, real estate, and services.`,
            },
          },
          {
            "@type": "Question",
            name: `What format will I receive the ${district.name} leads in?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: "All purchased leads can be downloaded immediately in clean Excel (.xlsx) and CSV formats, complete with business name, category, verified phone numbers, and location details.",
            },
          },
          {
            "@type": "Question",
            name: `Does NivoLeads guarantee zero duplicates for ${district.name} contacts?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Our intelligent contact allocation engine tracks your previous purchases and guarantees you never pay for or receive the same contact number twice.",
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

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
        <Link href="/" className="hover:text-[var(--text-main)] transition-colors">Home</Link>
        <span>/</span>
        <Link href="/leads" className="hover:text-[var(--text-main)] transition-colors">Leads Directory</Link>
        <span>/</span>
        <span className="text-[var(--text-main)] font-semibold">{district.name}</span>
      </nav>

      {/* Hero Header */}
      <div className="rounded-3xl border border-[var(--border-card)] bg-gradient-to-br from-[var(--bg-card)] via-[var(--bg-mist)] to-[var(--bg-card)] p-6 sm:p-10 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
              📍 District Directory · {district.name}, Karnataka
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-main)]">
              {district.name} Business Leads & Company Database
            </h1>
            <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
              Target active business owners, key decision-makers, and commercial enterprises in {district.name}. Verified 10-digit mobile numbers with instant Excel export.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <Link
              href={`/explore?d=${district.slug}`}
              className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 px-6 py-3.5 text-sm font-semibold rounded-xl text-center"
            >
              Explore & Download {district.name} Leads →
            </Link>
            <DownloadSampleButton
              districtSlug={district.slug}
              districtName={district.name}
              variant="outline"
            />
          </div>
        </div>

        {/* District Highlights */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-[var(--border-card)] pt-6 text-center">
          <div className="p-3">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {totalCount > 0 ? `${totalCount}+` : "Verified"}
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-1">Available in {district.name}</div>
          </div>
          <div className="p-3">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {categories.filter((c) => c._count.businesses > 0).length || categories.length}
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-1">Industry Sectors</div>
          </div>
          <div className="p-3">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">100%</div>
            <div className="text-xs text-[var(--text-muted)] mt-1">10-Digit Mobile Numbers</div>
          </div>
          <div className="p-3">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">0</div>
            <div className="text-xs text-[var(--text-muted)] mt-1">Duplicate Guarantee</div>
          </div>
        </div>
      </div>

      {/* Free Sample Download High-Converting Banner */}
      <DownloadSampleButton
        districtSlug={district.slug}
        districtName={district.name}
        variant="banner"
      />

      {/* Live Sample Preview Section (Google SEO Anti-Thin Content Proof) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)]">
              Verified Data Preview in {district.name}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              Real sample listings from our verified {district.name} commercial registry (phone numbers partially masked for privacy).
            </p>
          </div>
          <Link
            href={`/explore?d=${district.slug}`}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Unlock Full Unmasked List →
          </Link>
        </div>

        {sampleBusinesses.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[var(--bg-mist)] text-xs font-semibold text-[var(--text-muted)] uppercase border-b border-[var(--border-card)]">
                  <tr>
                    <th className="px-4 py-3 sm:px-6">Business / Enterprise Name</th>
                    <th className="px-4 py-3 sm:px-6">Industry Category</th>
                    <th className="px-4 py-3 sm:px-6">Verified Contact</th>
                    <th className="px-4 py-3 sm:px-6">Location</th>
                    <th className="px-4 py-3 sm:px-6 text-right">Status</th>
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
                        <td className="px-4 py-3.5 sm:px-6 font-semibold text-[var(--text-main)]">
                          {b.name}
                        </td>
                        <td className="px-4 py-3.5 sm:px-6">
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--bg-mist)] px-2.5 py-1 text-xs font-medium text-[var(--text-muted)]">
                            <span>{b.category.icon}</span>
                            <span>{b.category.name}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3.5 sm:px-6 font-mono text-xs text-blue-600 dark:text-blue-400 font-medium">
                          {maskedPhone}
                        </td>
                        <td className="px-4 py-3.5 sm:px-6 text-[var(--text-muted)]">
                          {b.area || `${district.name}, KA`}
                        </td>
                        <td className="px-4 py-3.5 sm:px-6 text-right">
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            ✓ Verified
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="bg-[var(--bg-mist)] p-3 text-center text-xs text-[var(--text-muted)] border-t border-[var(--border-card)]">
              Showing sample entries from {district.name}. To unlock all complete phone numbers, use the{" "}
              <Link href={`/explore?d=${district.slug}`} className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                Lead Export Tool
              </Link>
              .
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border-card)] bg-[var(--bg-card)] p-8 text-center">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="text-base font-semibold text-[var(--text-main)]">
              Custom Dataset Available for {district.name}
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-md mx-auto mt-1">
              Our lead verification engine continuously compiles active businesses in {district.name}. You can customize your order and export fresh contacts today.
            </p>
            <Link
              href={`/explore?d=${district.slug}`}
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              Order {district.name} Dataset →
            </Link>
          </div>
        )}
      </section>

      {/* Browse Categories in this District */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)]">
            Explore {district.name} Leads by Sector
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
            Browse targeted industry lists with verified decision-maker contacts in {district.name}.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/leads/${district.slug}/${c.slug}`}
              className="group flex items-center justify-between rounded-2xl border border-[var(--border-card)] bg-[var(--tile-bg)] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500/50 hover:shadow-md hover:bg-[var(--tile-hover)]"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-lg">
                  {c.icon || "📁"}
                </span>
                <div>
                  <div className="text-sm font-semibold text-[var(--text-main)] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {c.name}
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">
                    {c._count.businesses > 0
                      ? `${c._count.businesses} verified records`
                      : `Leads in ${district.name}`}
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

      {/* Why Choose NivoLeads */}
      <section className="rounded-3xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 sm:p-8 space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] text-center">
          Why B2B Teams Choose NivoLeads for {district.name} Data
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-mist)] p-5">
            <div className="text-2xl">⚡</div>
            <h3 className="text-base font-semibold text-[var(--text-main)]">Zero Duplicates Guaranteed</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Every lead purchased is recorded to your account. You will never pay for or receive the same {district.name} phone number twice.
            </p>
          </div>
          <div className="space-y-2 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-mist)] p-5">
            <div className="text-2xl">📱</div>
            <h3 className="text-base font-semibold text-[var(--text-main)]">Direct 10-Digit Mobile Numbers</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Skip generic switchboards. Our database prioritizes direct WhatsApp and calling numbers of key business owners and proprietors.
            </p>
          </div>
          <div className="space-y-2 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-mist)] p-5">
            <div className="text-2xl">📥</div>
            <h3 className="text-base font-semibold text-[var(--text-main)]">Instant Excel / CSV Download</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Ready-to-use spreadsheet format compatible with Tele-calling CRM, WhatsApp marketing tools, and Cold Outreach software.
            </p>
          </div>
        </div>
      </section>

      {/* Other Districts Cross Links (Internal SEO Equity) */}
      <section className="space-y-4 pt-4 border-t border-[var(--border-card)]">
        <h2 className="text-base sm:text-lg font-bold text-[var(--text-main)]">
          Explore Other Karnataka Districts
        </h2>
        <div className="flex flex-wrap gap-2">
          {otherDistricts.map((od) => (
            <Link
              key={od.id}
              href={`/leads/${od.slug}`}
              className="rounded-xl border border-[var(--border-card)] bg-[var(--tile-bg)] px-3 py-1.5 text-xs font-medium text-[var(--text-muted)] hover:border-blue-500 hover:text-[var(--text-main)] transition-colors"
            >
              {od.name} Leads
            </Link>
          ))}
          <Link
            href="/leads"
            className="rounded-xl border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition-colors"
          >
            View All 31 Districts →
          </Link>
        </div>
      </section>
    </div>
  );
}
