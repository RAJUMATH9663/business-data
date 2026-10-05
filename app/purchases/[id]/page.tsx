import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate, rupees } from "@/lib/format";
import PurchaseView from "@/components/PurchaseView";
import { StatusBadge } from "@/components/ui";

export const metadata = { title: "Order Details | Karnataka Trade Directory" };

const STATUS_HELP: Record<string, string> = {
  PENDING: "This payment has not been completed. If money was deducted it will be confirmed automatically within a few minutes.",
  FAILED: "This payment failed and you were not charged. You can start a new purchase any time.",
  CANCELLED: "This payment was cancelled and you were not charged.",
  REFUND_REQUIRED: "Your payment was received but the directory records could not be allocated. Our team will refund you shortly.",
};

export default async function PurchasePage({ params, searchParams }: { params: { id: string }; searchParams: { paid?: string } }) {
  const id = Number(params.id);
  const { user } = await requireUser(`/purchases/${params.id}`);
  // Ownership enforced in the query: another customer's purchase looks exactly like a missing one.
  const p = Number.isInteger(id)
    ? await prisma.purchase.findFirst({ where: { id, userId: user.id }, include: { district: true, category: true } })
    : null;

  if (!p) {
    return (
      <div className="card mx-auto max-w-md p-8 text-center">
        <div className="text-4xl">🔒</div>
        <h1 className="mt-3 text-xl">Purchase not found</h1>
        <p className="mt-2 text-sm">This purchase does not exist or does not belong to your account.</p>
        <Link href="/purchases" className="btn btn-primary mt-5 !text-paper">My Purchases</Link>
      </div>
    );
  }

  const previousCount =
    p && p.paymentStatus === "PAID"
      ? await prisma.purchaseContact.count({
          where: {
            purchase: {
              userId: user.id,
              districtId: p.districtId,
              categoryId: p.categoryId,
              paymentStatus: "PAID",
              createdAt: { lt: p.createdAt },
            },
          },
        })
      : 0;

  const startNumber = previousCount + 1;
  const endNumber = previousCount + (p?.quantity ?? 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl">Purchase #{p.code}</h1>
        <StatusBadge status={p.paymentStatus} />
      </div>

      <div className="card grid grid-cols-2 gap-4 p-4 text-sm sm:grid-cols-4">
        <div><p className="text-xs">District</p><p className="font-semibold">{p.district.name}</p></div>
        <div><p className="text-xs">Category</p><p className="font-semibold">{p.category.name}</p></div>
        <div><p className="text-xs">Listings</p><p className="font-semibold">{p.quantity.toLocaleString("en-IN")}</p></div>
        <div><p className="text-xs">Date</p><p className="font-semibold">{formatDate(p.createdAt)}</p></div>
        <div><p className="text-xs">Base</p><p className="font-semibold">{rupees(p.baseAmountPaise)}</p></div>
        <div><p className="text-xs">Discount</p><p className="font-semibold">{p.discountPercent}%</p></div>
        <div><p className="text-xs">Final</p><p className="font-semibold">{rupees(p.finalAmountPaise)}</p></div>
        <div><p className="text-xs">Payment</p><p className="font-semibold">{p.paymentStatus.replace("_", " ")}</p></div>
      </div>

      {p.paymentStatus === "PAID" ? (
        <PurchaseView
          purchaseId={p.id}
          code={p.code}
          district={p.district.name}
          category={p.category.name}
          icon={p.category.icon}
          quantity={p.quantity}
          licensee={user.name}
          justPaid={searchParams.paid === "1"}
          startNumber={startNumber}
          endNumber={endNumber}
        />
      ) : (
        <div className="card p-6 text-center text-sm">
          <p>{STATUS_HELP[p.paymentStatus]}</p>
          <Link href="/explore" className="btn btn-primary mt-4 !text-paper">Explore Business Directory</Link>
        </div>
      )}
    </div>
  );
}
