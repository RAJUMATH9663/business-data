import crypto from "crypto";
import Razorpay from "razorpay";
import { ApiError } from "./api";

export function paymentMode(): "razorpay" | "mock" {
  // Mock mode can never be active in production.
  if (process.env.PAYMENT_MODE === "mock" && process.env.NODE_ENV !== "production") return "mock";
  return "razorpay";
}

export function razorpayClient() {
  const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret || key_id.startsWith("YOUR_") || key_secret.startsWith("YOUR_")) {
    throw new ApiError(503, "Online payment is not configured yet. Please contact support.");
  }
  return new Razorpay({ key_id, key_secret });
}

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
}

export function verifyCheckoutSignature(orderId: string, paymentId: string, signature: string) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;
  const expected = crypto.createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex");
  return safeEqual(expected, signature);
}

export function verifyWebhookSignature(rawBody: string, signature: string) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return safeEqual(expected, signature);
}
