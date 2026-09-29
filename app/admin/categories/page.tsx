import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { JsonForm, type Field } from "@/components/Crud";

const statusOpts = [{ value: "ACTIVE", label: "Enabled" }, { value: "DISABLED", label: "Disabled" }];

export default async function CategoriesAdmin() {
  await requireAdmin();
  const cats = await prisma.category.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }], include: { _count: { select: { businesses: true } } } });
  const fields = (c?: (typeof cats)[number]): Field[] => [
    { name: "name", label: "Name", value: c?.name, required: true },
    { name: "icon", label: "Icon (emoji)", value: c?.icon ?? "📁", required: true },
    { name: "sortOrder", label: "Sort order", type: "number", value: c?.sortOrder ?? 999 },
    { name: "status", label: "Status", type: "select", options: statusOpts, value: c?.status ?? "ACTIVE" },
  ];
  return (
    <div className="space-y-5">
      <h1 className="text-2xl">Categories ({cats.length})</h1>
      <details className="card p-4"><summary className="cursor-pointer font-semibold">+ Add category</summary>
        <div className="mt-4"><JsonForm endpoint="/api/admin/categories" fields={fields()} submit="Add category" reset /></div>
      </details>
      <div className="space-y-2">
        {cats.map((c) => (
          <details key={c.id} className="card p-4">
            <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-2">
              <span className="font-semibold">{c.icon} {c.name}</span>
              <span className="flex items-center gap-2 text-xs"><span>{c._count.businesses.toLocaleString("en-IN")} businesses</span><span className={c.status === "ACTIVE" ? "badge-brand" : "badge"}>{c.status === "ACTIVE" ? "Enabled" : "Disabled"}</span></span>
            </summary>
            <div className="mt-4"><JsonForm endpoint="/api/admin/categories" method="PATCH" extra={{ id: c.id }} fields={fields(c)} submit="Save" /></div>
          </details>
        ))}
      </div>
    </div>
  );
}
