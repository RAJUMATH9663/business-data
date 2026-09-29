import type { PaymentStatus } from "@prisma/client";

export function StatusBadge({ status }: { status: PaymentStatus | string }) {
  const paid = status === "PAID";
  return <span className={paid ? "badge-brand" : "badge"}>{status.replace("_", " ")}</span>;
}

export function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card p-4">
      <p className="text-xs font-semibold uppercase tracking-wide">{label}</p>
      <p className="mt-1 text-2xl font-bold text-brand">{typeof value === "number" ? value.toLocaleString("en-IN") : value}</p>
    </div>
  );
}
