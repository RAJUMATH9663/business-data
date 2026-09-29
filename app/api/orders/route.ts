import { handler, json, limit, ApiError, isUniqueError } from "@/lib/api";
import { prisma } from "@/lib/db";
import { apiUser } from "@/lib/auth";
import { availableWhere } from "@/lib/catalog";
import { priceFor } from "@/lib/pricing";
import { newPurchaseCode } from "@/lib/purchases";
import { paymentMode, razorpayClient } from "@/lib/razorpay";
import { orderSchema } from "@/lib/validators";
import crypto from "crypto";

export const POST = handler(async (req) => {
  const user = await apiUser();
  limit(req, "order", 20, 10 * 60_000, String(user.id));
  const b = orderSchema.parse(await req.json());

  const [district, category] = await Promise.all([
    prisma.district.findFirst({ where: { slug: b.district, status: "ACTIVE" } }),
    prisma.category.findFirst({ where: { slug: b.category, status: "ACTIVE" } }),
  ]);
  if (!district || !category) throw new ApiError(404, "This district or category is not available.");

  const available = await prisma.business.count({ where: availableWhere(district.id, category.id, user.id) });
  if (available === 0) throw new ApiError(409, "No contacts are available in this category for you.");
  if (b.quantity > available) throw new ApiError(409, `Only ${available} contacts are available. Please reduce the quantity.`);

  const price = await priceFor(b.quantity); // price is ALWAYS computed here, never taken from the browser

  let purchase = null;
  for (let i = 0; i < 5 && !purchase; i++) {
    try {
      purchase = await prisma.purchase.create({
        data: {
          code: newPurchaseCode(district.code),
          userId: user.id,
          districtId: district.id,
          categoryId: category.id,
          quantity: b.quantity,
          baseAmountPaise: price.basePaise,
          discountPercent: price.discountPercent,
          discountAmountPaise: price.discountPaise,
          finalAmountPaise: price.finalPaise,
        },
      });
    } catch (e) {
      if (!isUniqueError(e)) throw e;
    }
  }
  if (!purchase) throw new ApiError(500, "Could not create the order. Please try again.");

  const mode = paymentMode();
  let orderId: string;
  try {
    if (mode === "mock") {
      orderId = `order_mock_${crypto.randomBytes(8).toString("hex")}`;
    } else {
      const rp = razorpayClient();
      const order = await rp.orders.create({
        amount: price.finalPaise,
        currency: "INR",
        receipt: purchase.code,
        notes: { purchaseId: String(purchase.id), userId: String(user.id) },
      });
      orderId = order.id;
    }
  } catch (e) {
    await prisma.purchase.update({ where: { id: purchase.id }, data: { paymentStatus: "FAILED" } });
    if (e instanceof ApiError) throw e;
    console.error("Razorpay order creation failed", e);
    throw new ApiError(502, "The payment gateway is not reachable right now. Please try again.");
  }

  await prisma.purchase.update({ where: { id: purchase.id }, data: { razorpayOrderId: orderId } });
  const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { name: true, email: true, phone: true } });

  return json({
    mode,
    purchaseId: purchase.id,
    code: purchase.code,
    orderId,
    quantity: purchase.quantity,
    amountPaise: purchase.finalAmountPaise,
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",
    prefill: { name: dbUser?.name ?? "", email: dbUser?.email ?? "", contact: dbUser?.phone ?? "" },
  });
});
