import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { JsonForm, type Field } from "@/components/Crud";

const statusOpts = [{ value: "ACTIVE", label: "Enabled" }, { value: "DISABLED", label: "Disabled" }];

export default async function DistrictsAdmin() {
  await requireAdmin();
  const districts = await prisma.district.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }], include: { _count: { select: { businesses: true } } } });
  const fields = (d?: (typeof districts)[number]): Field[] => [
    { name: "name", label: "Name", value: d?.name, required: true },
    { name: "code", label: "Code (2-5 letters)", value: d?.code, required: true },
    { name: "sortOrder", label: "Sort order", type: "number", value: d?.sortOrder ?? 999 },
    { name: "status", label: "Status", type: "select", options: statusOpts, value: d?.status ?? "ACTIVE" },
  ];
  return (
    <div className="space-y-5">
      <h1 className="text-2xl">Districts ({districts.length})</h1>
      <details className="card p-4"><summary className="cursor-pointer font-semibold">+ Add district</summary>
        <div className="mt-4"><JsonForm endpoint="/api/admin/districts" fields={fields()} submit="Add district" reset /></div>
      </details>
      <div className="space-y-2">
        {districts.map((d) => (
          <details key={d.id} className="card p-4">
            <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-2">
              <span className="font-semibold">{d.name} <span className="text-xs">({d.code})</span></span>
              <span className="flex items-center gap-2 text-xs"><span>{d._count.businesses.toLocaleString("en-IN")} businesses</span><span className={d.status === "ACTIVE" ? "badge-brand" : "badge"}>{d.status === "ACTIVE" ? "Enabled" : "Disabled"}</span></span>
            </summary>
            <div className="mt-4"><JsonForm endpoint="/api/admin/districts" method="PATCH" extra={{ id: d.id }} fields={fields(d)} submit="Save" /></div>
          </details>
        ))}
      </div>
    </div>
  );
}
