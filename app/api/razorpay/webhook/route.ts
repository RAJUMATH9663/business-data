import { prisma } from "@/lib/db";
import { finalizePaid } from "@/lib/purchases";
import { verifyWebhookSignature } from "@/lib/razorpay";

// Safety net: if the customer closes the browser after paying, Razorpay still tells us.
// Configure in Razorpay Dashboard -> Webhooks: URL = <APP_URL>/api/razorpay/webhook, events = payment.captured, order.paid
export async function POST(req: Request) {
  const raw = await req.text();
  const sig = req.headers.get("x-razorpay-signature") ?? "";
  if (!verifyWebhookSignature(raw, sig)) return new Response("invalid signature", { status: 400 });
  try {
    const event = JSON.parse(raw) as {
      event?: string;
      payload?: { payment?: { entity?: { id?: string; order_id?: string; amount?: number; status?: string } } };
    };
    if (event.event === "payment.captured" || event.event === "order.paid") {
      const pay = event.payload?.payment?.entity;
      if (pay?.order_id && pay.id) {
        const p = await prisma.purchase.findUnique({ where: { razorpayOrderId: pay.order_id } });
        if (p && pay.amount === p.finalAmountPaise) await finalizePaid(p.id, pay.id);
      }
    }
    return new Response("ok");
  } catch (e) {
    console.error("webhook error", e);
    return new Response("error", { status: 500 }); // Razorpay will retry
  }
}
