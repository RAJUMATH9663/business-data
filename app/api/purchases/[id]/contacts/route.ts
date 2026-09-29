import { handler, json, limit, ApiError } from "@/lib/api";
import { prisma } from "@/lib/db";
import { apiUser } from "@/lib/auth";
import type { Prisma } from "@prisma/client";

const PAGE_SIZE = 20;

// The ONLY way purchased contacts reach the browser.
// Enforces: signed-in user + purchase owned by that user + PAID + record is in purchase_contacts.
export const GET = handler(async (req, ctx) => {
  const user = await apiUser();
  limit(req, "contacts", 90, 60_000, String(user.id));
  const id = Number(ctx.params.id);
  if (!Number.isInteger(id)) throw new ApiError(404, "Purchase not found.");

  const purchase = await prisma.purchase.findFirst({
    where: { id, userId: user.id, paymentStatus: "PAID" },
    select: {
      id: true,
      districtId: true,
      categoryId: true,
      quantity: true,
      createdAt: true,
    },
  });
  if (!purchase) throw new ApiError(404, "Purchase not found.");

  // Count contacts from earlier PAID purchases in the same district + category
  const previousContactsCount = await prisma.purchaseContact.count({
    where: {
      purchase: {
        userId: user.id,
        districtId: purchase.districtId,
        categoryId: purchase.categoryId,
        paymentStatus: "PAID",
        createdAt: { lt: purchase.createdAt },
      },
    },
  });

  const startOffset = previousContactsCount + 1;
  const endOffset = previousContactsCount + purchase.quantity;

  const sp = req.nextUrl.searchParams;
  const page = Math.max(1, Math.min(100000, parseInt(sp.get("page") ?? "1", 10) || 1));
  const q = (sp.get("q") ?? "").trim().slice(0, 60);

  const digits = q.replace(/\D/g, "");
  const or: Prisma.BusinessWhereInput[] = [{ name: { contains: q } }, { area: { contains: q } }];
  if (digits) or.push({ phone: { contains: digits } });
  const where: Prisma.PurchaseContactWhereInput = {
    purchaseId: purchase.id,
    ...(q ? { business: { OR: or } } : {}),
  };

  const [total, rows] = await Promise.all([
    prisma.purchaseContact.count({ where }),
    prisma.purchaseContact.findMany({
      where,
      include: { business: true },
      orderBy: { id: "asc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  if (rows.length) {
    await prisma.contactView.createMany({
      data: rows.map((r) => ({ userId: user.id, purchaseId: purchase.id, businessId: r.businessId })),
    });
  }

  return json({
    total,
    page,
    pages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    startOffset,
    endOffset,
    previousContactsCount,
    items: rows.map((r, index) => ({
      sequenceNumber: startOffset + (page - 1) * PAGE_SIZE + index,
      id: r.business.id,
      name: r.business.name,
      phone: r.business.phone,
      altPhone: r.business.altPhone,
      email: r.business.email,
      website: r.business.website,
      address: r.business.address,
      area: r.business.area,
      pincode: r.business.pincode,
      mapsUrl: r.business.mapsUrl,
    })),
  });
});
