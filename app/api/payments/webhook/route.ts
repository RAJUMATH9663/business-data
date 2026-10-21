import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { finalizePaid } from "@/lib/purchases";

// Standard Indian bank SMS regex patterns for UTR and Amount
function parseBankSms(raw: string): { utr: string | null; amountPaise: number | null } {
  if (!raw) return { utr: null, amountPaise: null };

  // 1. Extract 12-digit UTR / UPI Reference Number
  // Examples: "UPI Ref 429512345678", "Ref No 429512345678", "UTR 429512345678", "RRN: 429512345678"
  let utr: string | null = null;
  const utrPatterns = [
    /(?:ref(?:\s*no\.?)?|utr(?:\s*no\.?)?|upi\s*ref(?:\s*no\.?)?|rrn(?:\s*no\.?)?)[:\s-]*([0-9]{12})\b/i,
    /\b([0-9]{12})\b/,
  ];

  for (const pat of utrPatterns) {
    const match = raw.match(pat);
    if (match && match[1]) {
      utr = match[1];
      break;
    }
  }

  // 2. Extract Amount
  // Examples: "Rs 499.00", "Rs.499", "INR 499", "₹ 499", "credited by 499.00"
  let amountPaise: number | null = null;
  const amtPatterns = [
    /(?:rs\.?|inr|₹)\s*([0-9]+(?:,[0-9]+)*(?:\.[0-9]{1,2})?)/i,
    /(?:credited\s*(?:for|with|by)?)\s*(?:rs\.?|inr|₹)?\s*([0-9]+(?:,[0-9]+)*(?:\.[0-9]{1,2})?)/i,
  ];

  for (const pat of amtPatterns) {
    const match = raw.match(pat);
    if (match && match[1]) {
      const cleanAmt = match[1].replace(/,/g, "");
      const parsed = parseFloat(cleanAmt);
      if (!isNaN(parsed) && parsed > 0) {
        amountPaise = Math.round(parsed * 100);
        break;
      }
    }
  }

  return { utr, amountPaise };
}

export async function POST(req: NextRequest) {
  try {
    const secretFromEnv = process.env.UPI_WEBHOOK_SECRET || "sec_upi_9663_b8a92f7c4e1d683a";

    // 1. Authenticate webhook request (Header, Query, or Body)
    const headerSecret = req.headers.get("x-webhook-secret") || req.headers.get("authorization");
    const { searchParams } = new URL(req.url);
    const querySecret = searchParams.get("secret");

    let bodyText = "";
    let bodyJson: Record<string, any> = {};

    try {
      bodyText = await req.text();
      bodyJson = JSON.parse(bodyText);
    } catch {
      // Body may be raw text
    }

    const payloadSecret = bodyJson.secret || bodyJson.token || headerSecret || querySecret;
    if (payloadSecret && payloadSecret !== secretFromEnv && !payloadSecret.includes(secretFromEnv)) {
      return NextResponse.json({ error: "Unauthorized webhook" }, { status: 401 });
    }

    // 2. Extract SMS or transaction details
    const rawMessage =
      bodyJson.message ||
      bodyJson.text ||
      bodyJson.content ||
      bodyJson.body ||
      bodyJson.sms ||
      bodyText ||
      "";

    const explicitUtr = bodyJson.utr || bodyJson.utrNumber || bodyJson.refNo;
    const explicitAmount = bodyJson.amount ? Math.round(Number(bodyJson.amount) * 100) : null;
    const sender = bodyJson.sender || bodyJson.from || "BANK_SMS";

    const parsed = parseBankSms(rawMessage);
    const utr = explicitUtr ? String(explicitUtr).trim() : parsed.utr;
    const amountPaise = explicitAmount || parsed.amountPaise;

    if (!utr || !/^\d{12}$/.test(utr)) {
      return NextResponse.json({
        warning: "No valid 12-digit UTR found in message",
        parsedUtr: utr,
        receivedText: rawMessage.slice(0, 100),
      }, { status: 400 });
    }

    // 3. Save or update the incoming bank notification
    const notification = await (prisma as any).bankCreditNotification.upsert({
      where: { utrNumber: utr },
      update: {
        rawMessage: rawMessage.slice(0, 500),
        amountPaise: amountPaise || 0,
        sender: String(sender).slice(0, 100),
      },
      create: {
        utrNumber: utr,
        amountPaise: amountPaise || 0,
        sender: String(sender).slice(0, 100),
        rawMessage: rawMessage.slice(0, 500),
      },
    });

    // 4. Check if an order is already waiting for this UTR
    const pendingPurchase = await prisma.purchase.findFirst({
      where: {
        OR: [
          { utrNumber: utr, paymentStatus: "PENDING" },
          {
            paymentStatus: "PENDING",
            finalAmountPaise: amountPaise || undefined,
            createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) }, // created within last hour
          },
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    if (pendingPurchase) {
      // Validate amount if present
      if (amountPaise && pendingPurchase.finalAmountPaise !== amountPaise) {
        return NextResponse.json({
          warning: "Amount mismatch for purchase",
          expectedPaise: pendingPurchase.finalAmountPaise,
          receivedPaise: amountPaise,
        });
      }

      // Automatically unlock!
      await finalizePaid(pendingPurchase.id, `upi_${utr}`, utr, "PHONEPE_UPI");

      // Mark notification as consumed
      await (prisma as any).bankCreditNotification.update({
        where: { id: notification.id },
        data: { isConsumed: true, purchaseId: pendingPurchase.id },
      });

      return NextResponse.json({
        success: true,
        matched: true,
        purchaseId: pendingPurchase.id,
        purchaseCode: pendingPurchase.code,
        utr,
      });
    }

    return NextResponse.json({
      success: true,
      matched: false,
      storedNotificationId: notification.id,
      utr,
      amountPaise,
      note: "Notification stored. Customer submission will match instantly.",
    });
  } catch (error: any) {
    console.error("UPI Webhook error:", error);
    return NextResponse.json({ error: error.message || "Webhook processing error" }, { status: 500 });
  }
}

// Allow GET to verify webhook endpoint is active
export async function GET() {
  return NextResponse.json({
    status: "active",
    service: "PhonePe Direct UPI Bank Webhook Listener",
    timestamp: new Date().toISOString(),
  });
}
