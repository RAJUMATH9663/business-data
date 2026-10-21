import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { apiUser } from "@/lib/auth";
import { finalizePaid } from "@/lib/purchases";

export async function POST(req: NextRequest) {
  try {
    const user = await apiUser();
    const body = await req.json();

    const { purchaseId, utr } = body;
    if (!purchaseId || !utr) {
      return NextResponse.json({ error: "Missing purchaseId or UTR number" }, { status: 400 });
    }

    const cleanUtr = String(utr).trim().replace(/\D/g, "");
    if (cleanUtr.length !== 12 || !/^\d{12}$/.test(cleanUtr)) {
      return NextResponse.json(
        { error: "Invalid UTR format. UPI Reference / UTR numbers must be exactly 12 numeric digits." },
        { status: 400 }
      );
    }

    const purchase = await prisma.purchase.findUnique({
      where: { id: Number(purchaseId) },
    });

    if (!purchase || purchase.userId !== user.id) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (purchase.paymentStatus === "PAID") {
      return NextResponse.json({
        status: "PAID",
        message: "This order is already paid and unlocked.",
        purchaseId: purchase.id,
      });
    }

    // Check Wall 1: Anti-Reuse Constraint
    const existingUsed = await prisma.purchase.findFirst({
      where: {
        utrNumber: cleanUtr,
        paymentStatus: "PAID",
        id: { not: purchase.id },
      },
    });

    if (existingUsed) {
      return NextResponse.json(
        { error: "This UTR number has already been redeemed for another order. Please check your transaction receipt." },
        { status: 409 }
      );
    }

    // Check Wall 2: Check Bank Notifications table for incoming credit
    const creditNotification = await (prisma as any).bankCreditNotification.findFirst({
      where: { utrNumber: cleanUtr },
      orderBy: { createdAt: "desc" },
    });

    if (creditNotification) {
      // Check if already consumed by a DIFFERENT order
      if (
        creditNotification.isConsumed &&
        creditNotification.purchaseId &&
        creditNotification.purchaseId !== purchase.id
      ) {
        return NextResponse.json(
          { error: "This UTR number has already been used for another order. Please check your transaction receipt." },
          { status: 409 }
        );
      }

      // Check Wall 3: Amount Validation (if notification has amount)
      if (
        creditNotification.amountPaise > 0 &&
        creditNotification.amountPaise !== purchase.finalAmountPaise
      ) {
        return NextResponse.json(
          {
            error: `Amount mismatch: Order requires ₹${(purchase.finalAmountPaise / 100).toFixed(
              2
            )}, but bank received ₹${(creditNotification.amountPaise / 100).toFixed(2)}.`,
          },
          { status: 400 }
        );
      }

      // Valid genuine payment confirmed by bank!
      await finalizePaid(purchase.id, `upi_${cleanUtr}`, cleanUtr, "PHONEPE_UPI");

      // Mark notification as consumed
      await (prisma as any).bankCreditNotification.update({
        where: { id: creditNotification.id },
        data: { isConsumed: true, purchaseId: purchase.id },
      });

      return NextResponse.json({
        status: "PAID",
        message: "Payment verified successfully by bank! Your leads are now unlocked.",
        purchaseId: purchase.id,
      });
    }

    // Wall 4: Credit NOT in bank table (Wrong UTR, fake UTR, or payment not received)
    // DO NOT save fake/wrong UTR to purchase.utrNumber! 
    // This keeps the database clean and prevents fake UTRs from appearing in the Admin portal.
    return NextResponse.json(
      {
        error: `Entered wrong UTR number! No bank payment found matching UTR ${cleanUtr}. Please check your PhonePe app transaction receipt and enter the correct 12-digit UTR.`,
        notFound: true,
      },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("UTR submission error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to submit UTR" },
      { status: error?.status || 500 }
    );
  }
}
