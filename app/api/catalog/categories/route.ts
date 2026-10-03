import { handler, json, limit, ApiError } from "@/lib/api";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

// Returns category listing and live counts, accounting for contacts already purchased by the logged-in user.
export const GET = handler(async (req) => {
  limit(req, "catalog", 120, 60_000);
  const slug = req.nextUrl.searchParams.get("district") ?? "";

  const [district, session, cats] = await Promise.all([
    prisma.district.findFirst({ where: { slug, status: "ACTIVE" }, select: { id: true, name: true, slug: true } }),
    getSession(),
    prisma.category.findMany({
      where: { status: "ACTIVE" },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: { id: true, name: true, slug: true, icon: true },
    }),
  ]);

  if (!district) throw new ApiError(404, "District not found");

  const [counts, purchasedRows] = await Promise.all([
    prisma.business.groupBy({
      by: ["categoryId"],
      where: { districtId: district.id, status: "ACTIVE" },
      _count: { _all: true },
    }),
    session?.user.id
      ? prisma.purchaseContact.findMany({
          where: {
            purchase: {
              userId: session.user.id,
              districtId: district.id,
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

  // Count already purchased per category
  const purchasedMap = new Map<number, number>();
  for (const r of purchasedRows) {
    const catId = r.purchase.categoryId;
    purchasedMap.set(catId, (purchasedMap.get(catId) ?? 0) + 1);
  }

  return json({
    categories: cats.map((c) => {
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
    }),
  });
});
