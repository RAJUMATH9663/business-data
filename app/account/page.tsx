import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/format";
import LogoutButton from "@/components/LogoutButton";

export const metadata = { title: "Account" };

export default async function AccountPage() {
  const { user, sessionId } = await requireUser("/account");
  const [full, paid, sessions] = await Promise.all([
    prisma.user.findUnique({ where: { id: user.id } }),
    prisma.purchase.count({ where: { userId: user.id, paymentStatus: "PAID" } }),
    prisma.userSession.findMany({
      where: { userId: user.id, status: "ACTIVE", expiresAt: { gt: new Date() } },
      orderBy: { lastActiveAt: "desc" },
    }),
  ]);
  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <h1 className="text-2xl">Account</h1>
      <div className="card space-y-2 p-5 text-sm">
        <p><span className="font-semibold">Name:</span> {full?.name}</p>
        <p className="break-all"><span className="font-semibold">Email:</span> {full?.email}</p>
        {full?.phone && <p><span className="font-semibold">Mobile:</span> {full.phone}</p>}
        <p><span className="font-semibold">Paid purchases:</span> {paid}</p>
        <div className="flex flex-wrap gap-2 pt-2">
          <Link href="/purchases" className="btn btn-primary !text-paper">My Purchases</Link>
          <LogoutButton />
        </div>
      </div>
      <div className="card p-5">
        <h2 className="text-lg">Signed-in devices</h2>
        <p className="mt-1 text-xs">Up to 3 devices can be signed in at once. Sign in on a 4th and the oldest is logged out.</p>
        <ul className="mt-3 divide-y divide-lilac/50 text-sm">
          {sessions.map((s) => (
            <li key={s.id} className="flex items-center justify-between gap-2 py-2">
              <span>{s.deviceLabel}{s.id === sessionId && <span className="badge-brand ml-2">This device</span>}</span>
              <span className="text-xs">{formatDate(s.lastActiveAt)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
