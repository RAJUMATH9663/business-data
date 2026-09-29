import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate, rupees } from "@/lib/format";
import { StatusBadge } from "@/components/ui";

export default async function OrdersAdmin() {
  await requireAdmin();
  const orders = await prisma.purchase.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { user: { select: { name: true, email: true } }, district: true, category: true },
  });
  return (
    <div className="space-y-4">
      <h1 className="text-2xl">Orders (latest 200)</h1>
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-lilac/60 text-xs uppercase"><tr>{["Purchase", "Customer", "District / Category", "Qty", "Amount", "Status", "Date"].map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-lilac/40">
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="p-3 font-semibold">#{o.code}</td>
                <td className="p-3">{o.user.name}<br /><span className="text-xs">{o.user.email}</span></td>
                <td className="p-3">{o.district.name}<br /><span className="text-xs">{o.category.name}</span></td>
                <td className="p-3">{o.quantity}</td>
                <td className="p-3">{rupees(o.finalAmountPaise)}<br /><span className="text-xs">{o.discountPercent}% off</span></td>
                <td className="p-3"><StatusBadge status={o.paymentStatus} /></td>
                <td className="p-3 whitespace-nowrap">{formatDate(o.createdAt)}</td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td className="p-6 text-center" colSpan={7}>No orders yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
