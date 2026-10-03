import type { Metadata } from "next";
import ExploreFlow from "@/components/ExploreFlow";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { d?: string; c?: string };
}): Promise<Metadata> {
  const { d, c } = searchParams;
  let title = "Explore Business Leads, Contacts & Phone Numbers | NivoLeads";
  let description =
    "Browse verified B2B leads, company databases, and verified 10-digit mobile numbers across 31 districts and 12 core sectors in Karnataka.";

  try {
    if (d && c) {
      const [district, category] = await Promise.all([
        prisma.district.findUnique({ where: { slug: d }, select: { name: true } }),
        prisma.category.findUnique({ where: { slug: c }, select: { name: true } }),
      ]);
      if (district && category) {
        title = `${category.name} in ${district.name} — Business Leads & Phone Numbers`;
        description = `Find verified ${category.name} phone numbers, contacts, and company addresses in ${district.name}, Karnataka. Instant digital access and Excel export on NivoLeads.`;
      }
    } else if (d) {
      const district = await prisma.district.findUnique({ where: { slug: d }, select: { name: true } });
      if (district) {
        title = `${district.name} Business Leads & Company Contact Database`;
        description = `Access verified B2B leads and business contact lists in ${district.name}, Karnataka across all major industries. Instant download on NivoLeads.`;
      }
    } else if (c) {
      const category = await prisma.category.findUnique({ where: { slug: c }, select: { name: true } });
      if (category) {
        title = `${category.name} Phone Numbers & Business Leads in Karnataka`;
        description = `Target decision makers in ${category.name} across Karnataka. Verified 10-digit phone numbers and commercial datasets ready for sales outreach on NivoLeads.`;
      }
    }
  } catch {
    // Fallback to default metadata if query fails
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: { d?: string; c?: string; q?: string };
}) {
  const [districts, rules, session] = await Promise.all([
    prisma.district.findMany({
      where: { status: "ACTIVE" },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: { id: true, name: true, slug: true },
    }),
    prisma.pricingRule.findMany({ where: { active: true }, orderBy: { minQty: "asc" } }),
    getSession(),
  ]);

  const targetDistrictSlug = searchParams.d ?? null;
  const selectedDistrict = targetDistrictSlug
    ? districts.find((d) => d.slug === targetDistrictSlug)
    : null;

  let initialCategories: Array<{
    id: number;
    name: string;
    slug: string;
    icon: string;
    count: number;
    purchased?: number;
    available?: number;
  }> | null = null;

  if (selectedDistrict) {
    const [cats, counts, purchasedRows] = await Promise.all([
      prisma.category.findMany({
        where: { status: "ACTIVE" },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        select: { id: true, name: true, slug: true, icon: true },
      }),
      prisma.business.groupBy({
        by: ["categoryId"],
        where: { districtId: selectedDistrict.id, status: "ACTIVE" },
        _count: { _all: true },
      }),
      session?.user.id
        ? prisma.purchaseContact.findMany({
            where: {
              purchase: {
                userId: session.user.id,
                districtId: selectedDistrict.id,
                paymentStatus: "PAID",
              },
            },
            select: {
              purchase: {
                select: { categoryId: true },
              },
            },
          })
        : Promise.resolve([]),
    ]);

    const totalMap = new Map(counts.map((c) => [c.categoryId, c._count._all]));
    const purchasedMap = new Map<number, number>();
    for (const r of purchasedRows) {
      const catId = r.purchase.categoryId;
      purchasedMap.set(catId, (purchasedMap.get(catId) ?? 0) + 1);
    }

    initialCategories = cats.map((c) => {
      const total = totalMap.get(c.id) ?? 0;
      const purchased = purchasedMap.get(c.id) ?? 0;
      const available = Math.max(0, total - purchased);
      return {
        id: c.id,
        name: c.name,
        slug: c.slug,
        icon: c.icon,
        count: total,
        purchased,
        available: session?.user.id ? available : total,
      };
    });
  }

  const q = parseInt(searchParams.q ?? "", 10);

  return (
    <ExploreFlow
      districts={districts}
      tiers={rules.map((r) => ({
        id: r.id,
        minQty: r.minQty,
        maxQty: r.maxQty,
        discountPercent: r.discountPercent,
      }))}
      loggedIn={!!session}
      initialCategories={initialCategories}
      initial={{
        d: searchParams.d ?? null,
        c: searchParams.c ?? null,
        q: Number.isFinite(q) && q > 0 ? q : null,
      }}
    />
  );
}
