import { handler, json, limit, ApiError } from "@/lib/api";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { getCachedMetadata, getDistrictCategoryCounts } from "@/lib/catalog-cache";

export const dynamic = "force-dynamic";

// Returns category listing and live counts, accounting for contacts already purchased by the logged-in user.
export const GET = handler(async (req) => {
  limit(req, "catalog", 240, 60_000);
  const slug = req.nextUrl.searchParams.get("district") ?? "";

  const [{ districts, categories }, session] = await Promise.all([
    getCachedMetadata(),
    getSession(),
  ]);

  const district = districts.find((d) => d.slug === slug);
  if (!district) throw new ApiError(404, "District not found");

  const [totalMap, purchasedRows] = await Promise.all([
    getDistrictCategoryCounts(district.id),
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

  // Count already purchased per category
  const purchasedMap = new Map<number, number>();
  for (const r of purchasedRows) {
    const catId = r.purchase.categoryId;
    purchasedMap.set(catId, (purchasedMap.get(catId) ?? 0) + 1);
  }

  return json({
    categories: categories.map((c) => {
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
