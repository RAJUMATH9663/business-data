// Pure pricing logic (no database) so it can be unit-tested.
export type RuleLike = {
  minQty: number;
  maxQty: number | null;
  pricePerContactPaise: number;
  discountPercent: number;
  active: boolean;
};

export type PriceResult = {
  ratePaise: number;
  basePaise: number;
  discountPercent: number;
  discountPaise: number;
  finalPaise: number;
};

export function computePrice(rules: RuleLike[], qty: number): PriceResult | null {
  const rule = rules
    .filter((r) => r.active && r.minQty <= qty && (r.maxQty === null || r.maxQty >= qty))
    .sort((a, b) => b.minQty - a.minQty)[0];
  if (!rule) return null;
  const basePaise = qty * rule.pricePerContactPaise;
  const discountPaise = Math.round((basePaise * rule.discountPercent) / 100);
  return {
    ratePaise: rule.pricePerContactPaise,
    basePaise,
    discountPercent: rule.discountPercent,
    discountPaise,
    finalPaise: basePaise - discountPaise,
  };
}
