import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import { JsonForm, RowButton, type Field } from "@/components/Crud";

const PAGE = 30;

export default async function BusinessesAdmin({ searchParams }: { searchParams: { d?: string; c?: string; q?: string; p?: string } }) {
  await requireAdmin();
  const d = Number(searchParams.d) || undefined;
  const c = Number(searchParams.c) || undefined;
  const q = (searchParams.q ?? "").trim();
  const page = Math.max(1, Number(searchParams.p) || 1);
  const where: Prisma.BusinessWhereInput = {
    ...(d ? { districtId: d } : {}),
    ...(c ? { categoryId: c } : {}),
    ...(q ? { OR: [{ name: { contains: q } }, { phone: { contains: q.replace(/\D/g, "") || q } }, { area: { contains: q } }] } : {}),
  };
  const [districts, cats, total, rows] = await Promise.all([
    prisma.district.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
    prisma.category.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
    prisma.business.count({ where }),
    prisma.business.findMany({ where, orderBy: { id: "desc" }, skip: (page - 1) * PAGE, take: PAGE, include: { district: true, category: true } }),
  ]);
  const dOpts = districts.map((x) => ({ value: x.id, label: x.name }));
  const cOpts = cats.map((x) => ({ value: x.id, label: x.name }));
  const fields = (b?: (typeof rows)[number]): Field[] => [
    { name: "districtId", label: "District", type: "select", numeric: true, options: dOpts, value: b?.districtId ?? d ?? districts[0]?.id },
    { name: "categoryId", label: "Category", type: "select", numeric: true, options: cOpts, value: b?.categoryId ?? c ?? cats[0]?.id },
    { name: "name", label: "Business name", value: b?.name, required: true },
    { name: "phone", label: "Phone", value: b?.phone, required: true },
    { name: "altPhone", label: "Alternate phone", value: b?.altPhone },
    { name: "email", label: "Email", value: b?.email },
    { name: "website", label: "Website", value: b?.website },
    { name: "area", label: "Area", value: b?.area },
    { name: "pincode", label: "Pincode", value: b?.pincode },
    { name: "address", label: "Address", value: b?.address, wide: true },
    { name: "mapsUrl", label: "Google Maps URL", value: b?.mapsUrl, wide: true },
    { name: "status", label: "Status", type: "select", options: [{ value: "ACTIVE", label: "Enabled" }, { value: "DISABLED", label: "Disabled" }], value: b?.status ?? "ACTIVE" },
  ];
  const pages = Math.max(1, Math.ceil(total / PAGE));
  const qs = (p: number) => {
    const s = new URLSearchParams();
    if (d) s.set("d", String(d));
    if (c) s.set("c", String(c));
    if (q) s.set("q", q);
    s.set("p", String(p));
    return `/admin/businesses?${s}`;
  };
  return (
    <div className="space-y-5">
      <h1 className="text-2xl">Business data ({total.toLocaleString("en-IN")})</h1>
      <form className="card grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4" method="GET">
        <select name="d" defaultValue={d ?? ""} className="input" aria-label="District"><option value="">All districts</option>{districts.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select>
        <select name="c" defaultValue={c ?? ""} className="input" aria-label="Category"><option value="">All categories</option>{cats.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select>
        <input name="q" defaultValue={q} placeholder="Search name / phone / area" className="input" aria-label="Search" />
        <button className="btn btn-primary">Filter</button>
      </form>
      <details className="card p-4"><summary className="cursor-pointer font-semibold">+ Add business</summary>
        <div className="mt-4"><JsonForm endpoint="/api/admin/businesses" fields={fields()} submit="Add business" reset /></div>
      </details>
      <div className="space-y-2">
        {rows.map((b) => (
          <details key={b.id} className="card p-4">
            <summary className="cursor-pointer">
              <span className="font-semibold">{b.name}</span>
              <span className="ml-2 text-xs text-[var(--text-muted)]">{b.phone} · {b.district.name} · {b.category.name}{b.status === "DISABLED" ? " · DISABLED" : ""}</span>
            </summary>
            <div className="mt-4 space-y-3">
              <JsonForm endpoint="/api/admin/businesses" method="PATCH" extra={{ id: b.id }} fields={fields(b)} submit="Save" />
              <RowButton endpoint="/api/admin/businesses" method="DELETE" body={{ id: b.id }} label="Delete" confirmText="Delete this business? (If it was already sold it will be disabled instead.)" />
            </div>
          </details>
        ))}
        {rows.length === 0 && <p className="card p-6 text-center text-sm text-[var(--text-muted)]">No businesses found.</p>}
      </div>
      <div className="flex items-center justify-between gap-2">
        {page > 1 ? <Link className="btn btn-ghost" href={qs(page - 1)}>← Previous</Link> : <span />}
        <span className="text-sm text-[var(--text-muted)]">Page <b>{page}</b> of <b>{pages}</b></span>
        {page < pages ? <Link className="btn btn-ghost" href={qs(page + 1)}>Next →</Link> : <span />}
      </div>
    </div>
  );
}
