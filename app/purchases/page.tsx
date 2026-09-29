import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate, rupees } from "@/lib/format";
import { StatusBadge } from "@/components/ui";

export const metadata = { title: "My Purchases" };

export default async function PurchasesPage() {
  const { user } = await requireUser("/purchases");
  const purchases = await prisma.purchase.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { district: true, category: true },
  });
  return (
    <div className="space-y-4">
      <h1 className="text-2xl">My Purchases</h1>
      {purchases.length === 0 ? (
        <div className="card p-8 text-center">
          <p>You have not purchased any data yet.</p>
          <Link href="/explore" className="btn btn-primary mt-4 !text-paper">Explore Business Data</Link>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {purchases.map((p) => (
            <article key={p.id} className="card p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-semibold">Purchase #{p.code}</p>
                  <h2 className="break-words text-lg">{p.district.name}</h2>
                  <p className="text-sm">{p.category.icon} {p.category.name}</p>
                </div>
                <StatusBadge status={p.paymentStatus} />
              </div>
              <dl className="mt-3 grid grid-cols-3 gap-2 text-sm">
                <div><dt className="text-xs">Contacts</dt><dd className="font-semibold">{p.quantity.toLocaleString("en-IN")}</dd></div>
                <div><dt className="text-xs">Paid</dt><dd className="font-semibold">{rupees(p.finalAmountPaise)}</dd></div>
                <div><dt className="text-xs">Date</dt><dd className="font-semibold">{formatDate(p.createdAt).slice(0, 10)}</dd></div>
              </dl>
              <Link href={`/purchases/${p.id}`} className="btn btn-primary mt-4 w-full !text-paper">
                {p.paymentStatus === "PAID" ? "View data" : "View details"}
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
