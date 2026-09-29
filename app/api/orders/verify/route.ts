import { handler, json, limit, ApiError } from "@/lib/api";
import { prisma } from "@/lib/db";
import { apiUser } from "@/lib/auth";
import { finalizePaid } from "@/lib/purchases";
import { paymentMode, verifyCheckoutSignature } from "@/lib/razorpay";
import { verifySchema } from "@/lib/validators";

export const POST = handler(async (req) => {
  const user = await apiUser();
  limit(req, "verify", 30, 10 * 60_000, String(user.id));
  const b = verifySchema.parse(await req.json());

  const purchase = await prisma.purchase.findFirst({
    where: { razorpayOrderId: b.razorpay_order_id, userId: user.id },
  });
  if (!purchase) throw new ApiError(404, "Purchase not found.");
  if (purchase.paymentStatus === "PAID") return json({ ok: true, purchaseId: purchase.id });

  const valid =
    paymentMode() === "mock"
      ? b.razorpay_order_id.startsWith("order_mock_") && b.razorpay_signature === "mock_signature"
      : verifyCheckoutSignature(b.razorpay_order_id, b.razorpay_payment_id, b.razorpay_signature);

  if (!valid) {
    await prisma.purchase.updateMany({ where: { id: purchase.id, paymentStatus: { not: "PAID" } }, data: { paymentStatus: "FAILED" } });
    throw new ApiError(400, "We could not verify this payment. If money was deducted, it will be refunded automatically.");
  }

  const done = await finalizePaid(purchase.id, b.razorpay_payment_id);
  if (done.paymentStatus === "REFUND_REQUIRED") {
    throw new ApiError(409, "Your payment was received but the contacts could not be allocated. Our team will refund you shortly.");
  }
  return json({ ok: true, purchaseId: purchase.id });
});
