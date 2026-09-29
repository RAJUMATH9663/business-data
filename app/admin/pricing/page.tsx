import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { JsonForm, RowButton, type Field } from "@/components/Crud";

export default async function PricingAdmin() {
  await requireAdmin();
  const rules = await prisma.pricingRule.findMany({ orderBy: { minQty: "asc" } });
  const fields = (r?: (typeof rules)[number]): Field[] => [
    { name: "label", label: "Label", value: r?.label, required: true, placeholder: "e.g. 250–499" },
    { name: "minQty", label: "Minimum quantity", type: "number", value: r?.minQty, required: true },
    { name: "maxQty", label: "Maximum quantity (blank = no limit)", type: "number", value: r?.maxQty ?? null, nullable: true },
    { name: "pricePerContact", label: "Price per contact (₹)", type: "number", step: "0.01", value: r ? r.pricePerContactPaise / 100 : 1, required: true },
    { name: "discountPercent", label: "Discount %", type: "number", value: r?.discountPercent ?? 0, required: true },
    { name: "active", label: "Active", type: "checkbox", value: r ? r.active : true },
  ];
  return (
    <div className="space-y-5">
      <h1 className="text-2xl">Pricing rules</h1>
      <p className="text-sm">The customer&apos;s price is always calculated on the server from these rules: the matching active rule with the highest minimum quantity wins. Avoid overlapping ranges.</p>
      <details className="card p-4"><summary className="cursor-pointer font-semibold">+ Add rule</summary>
        <div className="mt-4"><JsonForm endpoint="/api/admin/pricing" fields={fields()} submit="Add rule" reset /></div>
      </details>
      <div className="space-y-2">
        {rules.map((r) => (
          <details key={r.id} className="card p-4">
            <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-2">
              <span className="font-semibold">{r.minQty}{r.maxQty ? `–${r.maxQty}` : "+"} contacts · ₹{r.pricePerContactPaise / 100}/contact · {r.discountPercent}% off</span>
              <span className={r.active ? "badge-brand" : "badge"}>{r.active ? "Active" : "Inactive"}</span>
            </summary>
            <div className="mt-4 space-y-3">
              <JsonForm endpoint="/api/admin/pricing" method="PATCH" extra={{ id: r.id }} fields={fields(r)} submit="Save" />
              <RowButton endpoint="/api/admin/pricing" method="DELETE" body={{ id: r.id }} label="Delete rule" confirmText="Delete this pricing rule?" />
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
