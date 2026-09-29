import { handler, json, limit, ApiError } from "@/lib/api";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { availableWhere } from "@/lib/catalog";
import { priceFor } from "@/lib/pricing";
import { quoteQuery } from "@/lib/validators";

export const GET = handler(async (req) => {
  limit(req, "quote", 240, 60_000);
  const sp = req.nextUrl.searchParams;
  const q = quoteQuery.parse({
    district: sp.get("district") ?? "",
    category: sp.get("category") ?? "",
    qty: sp.get("qty") ?? undefined,
  });
  const [district, category] = await Promise.all([
    prisma.district.findFirst({ where: { slug: q.district, status: "ACTIVE" } }),
    prisma.category.findFirst({ where: { slug: q.category, status: "ACTIVE" } }),
  ]);
  if (!district || !category) throw new ApiError(404, "District or category not found");
  const session = await getSession();
  const [available, totalInCategory, alreadyPurchased] = await Promise.all([
    prisma.business.count({
      where: availableWhere(district.id, category.id, session?.user.id),
    }),
    prisma.business.count({
      where: { districtId: district.id, categoryId: category.id, status: "ACTIVE" },
    }),
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

  const nextStartNumber = alreadyPurchased + 1;

  if (q.qty === undefined) {
    return json({ available, totalInCategory, alreadyPurchased, nextStartNumber });
  }

  const price = await priceFor(q.qty);
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
