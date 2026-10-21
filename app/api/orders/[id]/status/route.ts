import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { apiUser } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await apiUser();
    const purchaseId = parseInt(params.id, 10);
    if (isNaN(purchaseId)) {
      return NextResponse.json({ error: "Invalid purchase ID" }, { status: 400 });
    }

    const purchase = await prisma.purchase.findUnique({
      where: { id: purchaseId },
      select: {
        id: true,
        code: true,
        userId: true,
        paymentStatus: true,
        paymentMethod: true,
        utrNumber: true,
        finalAmountPaise: true,
        paidAt: true,
      },
    });

    if (!purchase || purchase.userId !== user.id) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: purchase.id,
      code: purchase.code,
      paymentStatus: purchase.paymentStatus,
      paid: purchase.paymentStatus === "PAID",
      paidAt: purchase.paidAt,
      amountRupees: (purchase.finalAmountPaise / 100).toFixed(2),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Error fetching order status" },
      { status: error?.status || 500 }
    );
  }
}
