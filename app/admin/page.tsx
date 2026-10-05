import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { rupees } from "@/lib/format";
import { Stat } from "@/components/ui";

export const metadata = { title: "Admin" };

export default async function AdminHome() {
  await requireAdmin();
  const [districts, categories, businesses, customers, orders, paid, revenue] = await Promise.all([
    prisma.district.count(),
    prisma.category.count(),
    prisma.business.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.purchase.count(),
    prisma.purchase.count({ where: { paymentStatus: "PAID" } }),
    prisma.purchase.aggregate({ where: { paymentStatus: "PAID" }, _sum: { finalAmountPaise: true } }),
  ]);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl">Admin dashboard</h1>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Total Districts" value={districts} />
        <Stat label="Categories" value={categories} />
        <Stat label="Total Businesses" value={businesses} />
        <Stat label="Customers" value={customers} />
        <Stat label="Orders" value={orders} />
        <Stat label="Paid Orders" value={paid} />
        <Stat label="Revenue" value={rupees(revenue._sum.finalAmountPaise ?? 0)} />
      </div>

      <div className="card p-5 border border-emerald-500/30 bg-emerald-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
            <span>📥</span> Direct Master Excel Export
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            Download the complete verified directory database ({businesses.toLocaleString("en-IN")} businesses across {districts} districts) as a multi-sheet Excel (.xlsx) file.
          </p>
        </div>
        <a
          href="/api/admin/export"
          download
          target="_blank"
          className="btn bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-4 py-2 rounded-xl whitespace-nowrap shadow-sm text-center"
        >
          Download Excel Spreadsheet (.xlsx)
        </a>
      </div>
    </div>
  );
}
