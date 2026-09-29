import crypto from "crypto";
import { prisma } from "./db";
import { ApiError } from "./api";
import { availableWhere } from "./catalog";

export function newPurchaseCode(districtCode: string) {
  return `${districtCode}-${crypto.randomInt(10000, 100000)}`;
}

/**
 * Marks a purchase PAID and allocates exactly `quantity` business records to it.
 * Idempotent and safe if the browser callback and the webhook arrive at the same time
 * (the purchase row is locked for the duration of the transaction).
 */
export async function finalizePaid(purchaseId: number, paymentId: string) {
  return prisma.$transaction(
    async (tx) => {
      await tx.$queryRaw`SELECT id FROM purchases WHERE id = ${purchaseId} FOR UPDATE`;
      const p = await tx.purchase.findUnique({ where: { id: purchaseId } });
      if (!p) throw new ApiError(404, "Purchase not found");
      if (p.paymentStatus === "PAID" || p.paymentStatus === "REFUND_REQUIRED") return p;

      const ids = await tx.business.findMany({
        where: availableWhere(p.districtId, p.categoryId, p.userId),
        select: { id: true },
        orderBy: { id: "asc" },
        take: p.quantity,
      });

      if (ids.length < p.quantity) {
        // Money was taken but stock vanished (admin disabled/deleted records meanwhile). Flag for refund.
        return tx.purchase.update({
          where: { id: p.id },
          data: { paymentStatus: "REFUND_REQUIRED", razorpayPaymentId: paymentId },
        });
      }

      await tx.purchaseContact.createMany({
        data: ids.map((b) => ({ purchaseId: p.id, businessId: b.id })),
      });
      return tx.purchase.update({
        where: { id: p.id },
        data: { paymentStatus: "PAID", razorpayPaymentId: paymentId, paidAt: new Date() },
      });
    },
    { timeout: 30000, maxWait: 10000 },
  );
}
