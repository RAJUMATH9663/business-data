import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate, rupees } from "@/lib/format";
import { StatusBadge } from "@/components/ui";
import AdminApproveButton from "@/components/AdminApproveButton";
import AdminBankCreditManager from "@/components/AdminBankCreditManager";

export default async function OrdersAdmin() {
  await requireAdmin();
  const orders = await prisma.purchase.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { user: { select: { name: true, email: true } }, district: true, category: true },
  });
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Orders (latest 200)</h1>
        <span className="text-xs text-slate-500">Auto-synced with PhonePe & UPI UTR</span>
      </div>

      {/* Bank Credits & UTR Verification Manager */}
      <AdminBankCreditManager />

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead className="border-b border-lilac/60 text-xs uppercase">
            <tr>
              {["Purchase", "Customer", "District / Category", "Qty", "Amount", "Method / UTR", "Status", "Action", "Date"].map(
                (h) => (
                  <th key={h} className="p-3">
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-lilac/40">
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="p-3 font-semibold">#{o.code}</td>
                <td className="p-3">
                  {o.user.name}
                  <br />
                  <span className="text-xs text-slate-500">{o.user.email}</span>
                </td>
                <td className="p-3">
                  {o.district.name}
                  <br />
                  <span className="text-xs text-slate-500">{o.category.name}</span>
                </td>
                <td className="p-3">{o.quantity}</td>
                <td className="p-3">
                  {rupees(o.finalAmountPaise)}
                  <br />
                  <span className="text-xs text-slate-500">{o.discountPercent}% off</span>
                </td>
                <td className="p-3">
                  <span className="inline-block rounded bg-purple-50 px-2 py-0.5 text-xs font-semibold text-purple-700 dark:bg-purple-950/40 dark:text-purple-300">
                    {o.paymentMethod || "UPI"}
                  </span>
                  {o.utrNumber ? (
                    <div className="mt-1 font-mono text-xs text-slate-700 dark:text-slate-300">
                      UTR: {o.utrNumber}
                    </div>
                  ) : (
                    <div className="mt-1 text-xs text-slate-400">No UTR yet</div>
                  )}
                </td>
                <td className="p-3">
                  <StatusBadge status={o.paymentStatus} />
                </td>
                <td className="p-3">
                  {o.paymentStatus === "PENDING" ? (
                    <AdminApproveButton
                      purchaseId={o.id}
                      purchaseCode={o.code}
                      currentUtr={o.utrNumber}
                    />
                  ) : (
                    <span className="text-xs text-emerald-600 font-medium">✓ Unlocked</span>
                  )}
                </td>
                <td className="p-3 whitespace-nowrap text-xs text-slate-500">
                  {formatDate(o.createdAt)}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td className="p-6 text-center" colSpan={9}>
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
