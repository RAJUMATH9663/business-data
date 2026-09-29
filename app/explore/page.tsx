import ExploreFlow from "@/components/ExploreFlow";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const metadata = { title: "Explore Business Data" };

export default async function ExplorePage({ searchParams }: { searchParams: { d?: string; c?: string; q?: string } }) {
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
      tiers={rules.map((r) => ({ id: r.id, minQty: r.minQty, maxQty: r.maxQty, discountPercent: r.discountPercent }))}
      loggedIn={!!session}
      initial={{ d: searchParams.d ?? null, c: searchParams.c ?? null, q: Number.isFinite(q) && q > 0 ? q : null }}
    />
  );
}
