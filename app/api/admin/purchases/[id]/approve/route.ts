import { NextRequest, NextResponse } from "next/server";
import { apiAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { finalizePaid } from "@/lib/purchases";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await apiAdmin();
    const purchaseId = parseInt(params.id, 10);
    if (isNaN(purchaseId)) {
      return NextResponse.json({ error: "Invalid purchase ID" }, { status: 400 });
    }

    const purchase = await prisma.purchase.findUnique({
      where: { id: purchaseId },
    });

    if (!purchase) {
      return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
    }

    if (purchase.paymentStatus === "PAID") {
      return NextResponse.json({
        message: "Purchase is already marked as PAID.",
        purchase,
      });
    }

    let bodyUtr = "";
    try {
      const body = await req.json();
      if (body?.utrNumber) {
        bodyUtr = String(body.utrNumber).trim().replace(/\D/g, "");
      }
    } catch {
      // Body may be empty
    }

    const realUtr = bodyUtr || purchase.utrNumber || `admin_override_${Date.now()}`;
    const updated = await finalizePaid(
      purchase.id,
      `upi_${realUtr}`,
      realUtr,
      "PHONEPE_UPI"
    );

    return NextResponse.json({
      success: true,
      message: `Order #${purchase.code} approved with UTR: ${realUtr}. Leads are unlocked!`,
      purchase: updated,
    });
  } catch (error: any) {
    console.error("Admin approval error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to approve purchase" },
      { status: error?.status || 500 }
    );
  }
}
