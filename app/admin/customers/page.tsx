import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate, rupees } from "@/lib/format";
import { RowButton } from "@/components/Crud";

export default async function CustomersAdmin() {
  await requireAdmin();
  const users = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      purchases: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { district: true, category: true },
      },
    },
  });
  return (
    <div className="space-y-4">
      <h1 className="text-2xl">Customers ({users.length})</h1>
      <div className="space-y-2">
        {users.map((u) => {
          const paid = u.purchases.filter((p) => p.paymentStatus === "PAID");
          return (
            <details key={u.id} className="card p-4">
              <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-2">
                <span><span className="font-semibold">{u.name}</span> <span className="text-xs">{u.email}</span></span>
                <span className="flex items-center gap-2 text-xs"><span>{paid.length} paid</span><span className={u.status === "ACTIVE" ? "badge-brand" : "badge"}>{u.status}</span></span>
              </summary>
              <div className="mt-3 space-y-3 text-sm">
                <p className="text-xs">Joined {formatDate(u.createdAt)}{u.phone ? ` · ${u.phone}` : ""}</p>
                <ul className="space-y-1">
                  {u.purchases.map((p) => (
                    <li key={p.id}>#{p.code} · {p.district.name} · {p.category.name} · {p.quantity} · {rupees(p.finalAmountPaise)} · {p.paymentStatus}</li>
                  ))}
                  {u.purchases.length === 0 && <li>No purchases.</li>}
                </ul>
                <RowButton
                  endpoint="/api/admin/customers"
                  method="PATCH"
                  body={{ id: u.id, status: u.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE" }}
                  label={u.status === "ACTIVE" ? "Suspend account" : "Re-activate account"}
                  confirmText={u.status === "ACTIVE" ? "Suspend this customer and sign them out everywhere?" : undefined}
                />
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
