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
    "Browse verified B2B leads, company databases, and verified 10-digit mobile numbers across 31 districts and 20+ sectors in Karnataka.";

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
      initial={{
        d: searchParams.d ?? null,
        c: searchParams.c ?? null,
        q: Number.isFinite(q) && q > 0 ? q : null,
      }}
    />
  );
}
