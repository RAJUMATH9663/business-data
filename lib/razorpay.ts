import crypto from "crypto";
import Razorpay from "razorpay";
import fs from "fs";
import path from "path";
import { ApiError } from "./api";

function getRazorpayConfig() {
  let key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  let key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    try {
      const envPath = path.resolve(process.cwd(), ".env");
      if (fs.existsSync(envPath)) {
        const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
        for (const line of lines) {
          const match = line.match(/^\s*([\w_]+)\s*=\s*"?([^"]*)"?\s*$/);
          if (match) {
            const [, key, val] = match;
            if (key === "NEXT_PUBLIC_RAZORPAY_KEY_ID") key_id = val;
            if (key === "RAZORPAY_KEY_SECRET") key_secret = val;
          }
        }
      }
    } catch {
      // ignore
    }
  }

  return { key_id, key_secret };
}

export function paymentMode(): "razorpay" | "mock" {
  // Mock mode can never be active in production.
  if (process.env.PAYMENT_MODE === "mock" && process.env.NODE_ENV !== "production") return "mock";
  return "razorpay";
}

export function razorpayClient() {
  const { key_id, key_secret } = getRazorpayConfig();
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
  const { key_secret } = getRazorpayConfig();
  const secret = process.env.RAZORPAY_KEY_SECRET || key_secret;
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
