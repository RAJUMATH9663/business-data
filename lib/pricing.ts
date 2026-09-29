import { prisma } from "./db";
import { ApiError } from "./api";
import { computePrice } from "./pricing-core";

/** Backend-authoritative price. The browser never sends a price. */
export async function priceFor(qty: number) {
  const rules = await prisma.pricingRule.findMany({ where: { active: true, minQty: { lte: qty } } });
  const price = computePrice(rules, qty);
  if (!price) throw new ApiError(400, "Pricing is not available for this quantity.");
  return price;
}
