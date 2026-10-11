import { prisma } from "./db";
import { ApiError } from "./api";
import { computePrice } from "./pricing-core";
import type { PricingRule } from "@prisma/client";

let cachedRules: PricingRule[] | null = null;
let lastRulesFetch = 0;

async function getCachedPricingRules(): Promise<PricingRule[]> {
  const now = Date.now();
  if (!cachedRules || now - lastRulesFetch > 5 * 60 * 1000) {
    cachedRules = await prisma.pricingRule.findMany({
      where: { active: true },
      orderBy: { minQty: "asc" },
    });
    lastRulesFetch = now;
  }
  return cachedRules;
}

export function invalidatePricingRulesCache() {
  cachedRules = null;
}

/** Backend-authoritative price. The browser never sends a price. */
export async function priceFor(qty: number) {
  const rules = await getCachedPricingRules();
  const price = computePrice(rules, qty);
  if (!price) throw new ApiError(400, "Pricing is not available for this quantity.");
  return price;
}
