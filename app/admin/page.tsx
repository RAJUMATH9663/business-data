import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { rupees } from "@/lib/format";
import { Stat } from "@/components/ui";
import TerritoryExportSelector from "@/components/admin/TerritoryExportSelector";

export const metadata = { title: "Admin" };

export default async function AdminHome() {
  await requireAdmin();
  const [districts, categories, businesses, customers, orders, paid, revenue, districtList] = await Promise.all([
    prisma.district.count(),
    prisma.category.count(),
    prisma.business.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.purchase.count(),
    prisma.purchase.count({ where: { paymentStatus: "PAID" } }),
    prisma.purchase.aggregate({ where: { paymentStatus: "PAID" }, _sum: { finalAmountPaise: true } }),
    prisma.district.findMany({
      where: { businesses: { some: {} } },
      select: {
        id: true,
        name: true,
        slug: true,
        _count: { select: { businesses: true } },
      },
      orderBy: { name: "asc" },
    }),
  ]);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin dashboard</h1>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Total Districts" value={districts} />
        <Stat label="Categories" value={categories} />
        <Stat label="Total Businesses" value={businesses} />
        <Stat label="Customers" value={customers} />
        <Stat label="Orders" value={orders} />
        <Stat label="Paid Orders" value={paid} />
        <Stat label="Revenue" value={rupees(revenue._sum.finalAmountPaise ?? 0)} />
      </div>

      {/* Enterprise Interactive Excel Export */}
      <TerritoryExportSelector districts={districtList} totalBusinesses={businesses} />
    </div>
  );
}

