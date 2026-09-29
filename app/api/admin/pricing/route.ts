import { handler, json } from "@/lib/api";
import { prisma } from "@/lib/db";
import { apiAdmin } from "@/lib/auth";
import { pricingCreate, pricingUpdate } from "@/lib/validators";
import { z } from "zod";

export const POST = handler(async (req) => {
  await apiAdmin();
  const b = pricingCreate.parse(await req.json());
  return json(
    await prisma.pricingRule.create({
      data: {
        label: b.label,
        minQty: b.minQty,
        maxQty: b.maxQty ?? null,
        pricePerContactPaise: Math.round(b.pricePerContact * 100),
        discountPercent: b.discountPercent,
        active: b.active ?? true,
      },
    }),
  );
});

export const PATCH = handler(async (req) => {
  await apiAdmin();
  const b = pricingUpdate.parse(await req.json());
  return json(
    await prisma.pricingRule.update({
      where: { id: b.id },
      data: {
        label: b.label,
        minQty: b.minQty,
        maxQty: b.maxQty ?? null,
        pricePerContactPaise: Math.round(b.pricePerContact * 100),
        discountPercent: b.discountPercent,
        active: b.active ?? false,
      },
    }),
  );
});

export const DELETE = handler(async (req) => {
  await apiAdmin();
  const { id } = z.object({ id: z.coerce.number().int() }).parse(await req.json());
  await prisma.pricingRule.delete({ where: { id } });
  return json({ ok: true });
});
