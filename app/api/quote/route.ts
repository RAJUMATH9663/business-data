import { handler, json, limit, ApiError } from "@/lib/api";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { priceFor } from "@/lib/pricing";
import { quoteQuery } from "@/lib/validators";
import { getCachedMetadata, getDistrictCategoryCounts } from "@/lib/catalog-cache";

export const GET = handler(async (req) => {
  limit(req, "quote", 480, 60_000);
  const sp = req.nextUrl.searchParams;
  const q = quoteQuery.parse({
    district: sp.get("district") ?? "",
    category: sp.get("category") ?? "",
    qty: sp.get("qty") ?? undefined,
  });

  const [{ districts, categories }, session, price] = await Promise.all([
    getCachedMetadata(),
    getSession(),
    q.qty !== undefined ? priceFor(q.qty) : Promise.resolve(null),
  ]);

  const district = districts.find((d) => d.slug === q.district);
  const category = categories.find((c) => c.slug === q.category);

  if (!district || !category) throw new ApiError(404, "District or category not found");

  const [totalMap, alreadyPurchased] = await Promise.all([
    getDistrictCategoryCounts(district.id),
    session?.user.id
      ? prisma.purchaseContact.count({
          where: {
            purchase: {
              userId: session.user.id,
              districtId: district.id,
              categoryId: category.id,
              paymentStatus: "PAID",
            },
          },
        })
      : Promise.resolve(0),
  ]);

  const totalInCategory = totalMap.get(category.id) ?? 0;
  const available = Math.max(0, totalInCategory - alreadyPurchased);
  const nextStartNumber = alreadyPurchased + 1;

  if (q.qty === undefined || !price) {
    return json({ available, totalInCategory, alreadyPurchased, nextStartNumber });
  }

  return json({
    available,
    totalInCategory,
    alreadyPurchased,
    nextStartNumber,
    quantity: q.qty,
    exceeds: q.qty > available,
    ...price,
  });
});
