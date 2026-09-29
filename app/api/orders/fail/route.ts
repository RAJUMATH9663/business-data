import { handler, json } from "@/lib/api";
import { prisma } from "@/lib/db";
import { apiUser } from "@/lib/auth";
import { failSchema } from "@/lib/validators";

// Records that the customer cancelled / the payment failed. Can never touch a PAID purchase.
export const POST = handler(async (req) => {
  const user = await apiUser();
  const b = failSchema.parse(await req.json());
  await prisma.purchase.updateMany({
    where: { razorpayOrderId: b.razorpay_order_id, userId: user.id, paymentStatus: { in: ["PENDING", "FAILED"] } },
    data: { paymentStatus: b.reason === "cancelled" ? "CANCELLED" : "FAILED" },
  });
  return json({ ok: true });
});
