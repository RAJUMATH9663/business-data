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
  let title = "Explore Karnataka Trade Directory | B2B Business Listings & Market Reports";
  let description =
    "Browse verified Karnataka enterprise directory profiles, commercial listings, and industry trade intelligence across 31 districts and 20+ sectors.";

  try {
    if (d && c) {
      const [district, category] = await Promise.all([
        prisma.district.findUnique({ where: { slug: d }, select: { name: true } }),
        prisma.category.findUnique({ where: { slug: c }, select: { name: true } }),
      ]);
      if (district && category) {
        title = `${category.name} in ${district.name} — B2B Trade Directory & Business Listings`;
        description = `Browse verified ${category.name} enterprises, business addresses, and commercial directory profiles in ${district.name}, Karnataka. Instant digital access and verified trade reports.`;
      }
    } else if (d) {
      const district = await prisma.district.findUnique({ where: { slug: d }, select: { name: true } });
      if (district) {
        title = `${district.name} B2B Trade Directory & Commercial Business Index`;
        description = `Access verified enterprise listings and commercial business profiles in ${district.name}, Karnataka across all major industries. Instant directory access.`;
      }
    } else if (c) {
      const category = await prisma.category.findUnique({ where: { slug: c }, select: { name: true } });
      if (category) {
        title = `${category.name} B2B Directory & Commercial Index in Karnataka`;
        description = `Discover verified ${category.name} enterprises and verified supplier listings across Karnataka. Search and download structured B2B trade reports.`;
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
