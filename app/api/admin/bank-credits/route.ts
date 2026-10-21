import { NextRequest, NextResponse } from "next/server";
import { apiAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { finalizePaid } from "@/lib/purchases";

// Standard parser for pasted bank SMS
function parseSms(raw: string): { utr: string | null; amountPaise: number | null } {
  if (!raw) return { utr: null, amountPaise: null };

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

// GET: List recent bank credit notifications
export async function GET() {
  try {
    await apiAdmin();
    const credits = await (prisma as any).bankCreditNotification.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json({ credits });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to fetch bank credits" }, { status: 500 });
  }
}

// POST: Add new bank credit / paste SMS from admin dashboard
export async function POST(req: NextRequest) {
  try {
    await apiAdmin();
    const body = await req.json();

    const rawText = body.rawSms || body.sms || "";
    let cleanUtr = body.utr ? String(body.utr).trim().replace(/\D/g, "") : "";
    let amountPaise = body.amount ? Math.round(Number(body.amount) * 100) : 0;

    if (rawText && (!cleanUtr || !amountPaise)) {
      const parsed = parseSms(rawText);
      if (!cleanUtr && parsed.utr) cleanUtr = parsed.utr;
      if (!amountPaise && parsed.amountPaise) amountPaise = parsed.amountPaise;
    }

    if (!cleanUtr || cleanUtr.length !== 12 || !/^\d{12}$/.test(cleanUtr)) {
      return NextResponse.json(
        { error: "Invalid UTR number. Must be exactly 12 digits." },
        { status: 400 }
      );
    }

    // 1. Store or update bank credit notification
    const notification = await (prisma as any).bankCreditNotification.upsert({
      where: { utrNumber: cleanUtr },
      update: {
        amountPaise: amountPaise || 0,
        rawMessage: rawText || `Admin manually logged UTR ${cleanUtr}`,
      },
      create: {
        utrNumber: cleanUtr,
        amountPaise: amountPaise || 0,
        sender: "ADMIN_ENTRY",
        rawMessage: rawText || `Admin manually logged UTR ${cleanUtr}`,
      },
    });

    // 2. Check if an order is already waiting with this UTR
    const pendingPurchase = await prisma.purchase.findFirst({
      where: {
        utrNumber: cleanUtr,
        paymentStatus: "PENDING",
      },
    });

    if (pendingPurchase) {
      // Auto-unlock immediately!
      await finalizePaid(pendingPurchase.id, `upi_${cleanUtr}`, cleanUtr, "PHONEPE_UPI");

      await (prisma as any).bankCreditNotification.update({
        where: { id: notification.id },
        data: { isConsumed: true, purchaseId: pendingPurchase.id },
      });

      return NextResponse.json({
        success: true,
        matched: true,
        message: `Matched & Unlocked Order #${pendingPurchase.code} with UTR ${cleanUtr}!`,
        purchaseId: pendingPurchase.id,
        purchaseCode: pendingPurchase.code,
      });
    }

    return NextResponse.json({
      success: true,
      matched: false,
      message: `Bank credit for UTR ${cleanUtr} recorded! When the customer enters this UTR, it will match and unlock instantly.`,
      notificationId: notification.id,
      utr: cleanUtr,
    });
  } catch (error: any) {
    console.error("Failed to add bank credit:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to record bank credit" },
      { status: error?.status || 500 }
    );
  }
}
