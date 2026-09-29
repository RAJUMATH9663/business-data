// Run with:  npm run test:unit   (no database needed)
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { computePrice, type RuleLike } from "../lib/pricing-core";
import { normalizePhone } from "../lib/phone";

const rules: RuleLike[] = [
  { minQty: 1, maxQty: 99, pricePerContactPaise: 100, discountPercent: 0, active: true },
  { minQty: 100, maxQty: 249, pricePerContactPaise: 100, discountPercent: 5, active: true },
  { minQty: 250, maxQty: 499, pricePerContactPaise: 100, discountPercent: 10, active: true },
  { minQty: 500, maxQty: null, pricePerContactPaise: 100, discountPercent: 15, active: true },
];

// Pricing examples from the specification
const cases: [number, number, number][] = [
  [1, 100, 0], [99, 9900, 0], [100, 9500, 5], [250, 22500, 10], [499, 44910, 10], [500, 42500, 15], [1000, 85000, 15],
];
for (const [qty, finalPaise, pct] of cases) {
  const p = computePrice(rules, qty);
  assert.ok(p, `no price for ${qty}`);
  assert.equal(p.finalPaise, finalPaise, `final for ${qty}`);
  assert.equal(p.discountPercent, pct, `discount for ${qty}`);
}
assert.equal(computePrice(rules.map((r) => ({ ...r, active: false })), 10), null);
assert.equal(computePrice(rules, 0), null);

// Phone normalisation
assert.equal(normalizePhone("+91 98450 12345"), "9845012345");
assert.equal(normalizePhone("09845012345"), "9845012345");
assert.equal(normalizePhone("98450-12345 / 0831-222333"), "9845012345");
assert.equal(normalizePhone("12345"), null);
assert.equal(normalizePhone("5845012345"), null);
assert.equal(normalizePhone(9845012345), "9845012345");

// Razorpay signature scheme used in lib/razorpay.ts
const secret = "test_secret";
const sig = crypto.createHmac("sha256", secret).update("order_1|pay_1").digest("hex");
assert.equal(sig.length, 64);

console.log("All unit tests passed ✓");
