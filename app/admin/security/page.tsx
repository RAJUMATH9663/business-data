import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { RowButton } from "@/components/Crud";

const DAILY_VIEW_ALERT = 600; // contacts viewed by one customer in 24h

export default async function SecurityAdmin() {
  await requireAdmin();
  const since = new Date(Date.now() - 24 * 3600 * 1000);
  const [sessions, views, heavy] = await Promise.all([
    prisma.userSession.findMany({
      where: { status: "ACTIVE", expiresAt: { gt: new Date() } },
      orderBy: { lastActiveAt: "desc" },
      take: 100,
      include: { user: { select: { name: true, email: true } } },
    }),
    prisma.contactView.findMany({
      orderBy: { viewedAt: "desc" },
      take: 100,
      include: { user: { select: { name: true } }, purchase: { select: { code: true } }, business: { select: { name: true } } },
    }),
    prisma.contactView.groupBy({ by: ["userId"], where: { viewedAt: { gte: since } }, _count: { _all: true }, having: { userId: { _count: { gt: DAILY_VIEW_ALERT } } } }),
  ]);
  const heavyUsers = heavy.length
    ? await prisma.user.findMany({ where: { id: { in: heavy.map((h) => h.userId) } }, select: { id: true, name: true, email: true } })
    : [];
  return (
    <div className="space-y-6">
      <h1 className="text-2xl">Security</h1>

      <section className="space-y-2">
        <h2 className="text-lg">Suspicious activity (last 24h)</h2>
        {heavy.length === 0 ? (
          <p className="card p-4 text-sm">No customer has viewed more than {DAILY_VIEW_ALERT} contacts in 24 hours.</p>
        ) : (
          <ul className="card divide-y divide-lilac/40 text-sm">
            {heavy.map((h) => {
              const u = heavyUsers.find((x) => x.id === h.userId);
              return <li key={h.userId} className="p-3"><b>{u?.name}</b> ({u?.email}) viewed {h._count._all} contacts in 24h.</li>;
            })}
          </ul>
        )}
      </section>

      <section className="space-y-2">
        <h2 className="text-lg">Active sessions ({sessions.length})</h2>
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-lilac/60 text-xs uppercase"><tr>{["User", "Device", "IP", "Last active", "Expires", ""].map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-lilac/40">
              {sessions.map((s) => (
                <tr key={s.id}>
                  <td className="p-3">{s.user.name}<br /><span className="text-xs">{s.user.email}</span></td>
                  <td className="p-3">{s.deviceLabel}</td>
                  <td className="p-3">{s.ip}</td>
                  <td className="p-3 whitespace-nowrap">{formatDate(s.lastActiveAt)}</td>
                  <td className="p-3 whitespace-nowrap">{formatDate(s.expiresAt)}</td>
                  <td className="p-3"><RowButton endpoint="/api/admin/sessions" method="PATCH" body={{ id: s.id }} label="Revoke" confirmText="Sign this device out?" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg">Access log (latest 100)</h2>
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-lilac/60 text-xs uppercase"><tr>{["Customer", "Purchase", "Business", "Viewed"].map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-lilac/40">
              {views.map((v) => (
                <tr key={v.id}><td className="p-3">{v.user.name}</td><td className="p-3">#{v.purchase.code}</td><td className="p-3">{v.business.name}</td><td className="p-3 whitespace-nowrap">{formatDate(v.viewedAt)}</td></tr>
              ))}
              {views.length === 0 && <tr><td className="p-6 text-center" colSpan={4}>No views logged yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
