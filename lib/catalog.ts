import type { Prisma } from "@prisma/client";

/** Contacts a user can still buy: active businesses they don't already own via a PAID purchase. */
export function availableWhere(districtId: number, categoryId: number, userId?: number): Prisma.BusinessWhereInput {
  return {
    districtId,
    categoryId,
    status: "ACTIVE",
    ...(userId ? { purchaseContacts: { none: { purchase: { userId, paymentStatus: "PAID" } } } } : {}),
  };
}
