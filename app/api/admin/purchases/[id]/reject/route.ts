import { NextRequest, NextResponse } from "next/server";
import { apiAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

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
      return NextResponse.json(
        { error: "Cannot reject an already completed and paid order." },
        { status: 400 }
      );
    }

    const updated = await prisma.purchase.update({
      where: { id: purchase.id },
      data: {
        paymentStatus: "FAILED",
      },
    });

    return NextResponse.json({
      success: true,
      message: `Order #${purchase.code} marked as REJECTED / FAILED.`,
      purchase: updated,
    });
  } catch (error: any) {
    console.error("Admin reject error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to reject purchase" },
      { status: error?.status || 500 }
    );
  }
}
