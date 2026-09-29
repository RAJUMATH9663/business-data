"use client";
import { useState } from "react";
import DataViewer from "./DataViewer";

export default function PurchaseView({
  purchaseId,
  code,
  district,
  category,
  icon,
  quantity,
  licensee,
  justPaid,
  startNumber,
  endNumber,
}: {
  purchaseId: number;
  code: string;
  district: string;
  category: string;
  icon: string;
  quantity: number;
  licensee: string;
  justPaid: boolean;
  startNumber?: number;
  endNumber?: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="card fade-in p-6 text-center sm:p-8">
        {justPaid && (
          <div className="mx-auto mb-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-4 py-1 text-xs font-bold text-emerald-500 border border-emerald-500/30">
            <span>🎉</span>
            <span>Payment Successful & Data Unlocked</span>
          </div>
        )}
        <h2 className="text-3xl font-bold text-[var(--text-main)]">{district}</h2>
        <p className="mt-1 text-base font-semibold text-[var(--text-muted)]">
          {icon} {category}
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {startNumber && endNumber ? (
            <span className="badge-brand">
              Contacts #{startNumber} to #{endNumber} ({quantity.toLocaleString("en-IN")} Unique Contacts)
            </span>
          ) : (
            <span className="badge">
              {quantity.toLocaleString("en-IN")} Contacts Purchased
            </span>
          )}

          {startNumber && startNumber > 1 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-500 border border-emerald-500/30">
              ✓ Guaranteed New Numbers Only
            </span>
          )}
        </div>

        {!open && (
          <button
            className="btn btn-primary mt-6 !px-10 !py-3.5 !text-base shadow-lg shadow-blue-500/25"
            onClick={() => setOpen(true)}
          >
            Access & View Contacts Online →
          </button>
        )}
      </div>

      {open && (
        <DataViewer
          purchaseId={purchaseId}
          licensee={licensee}
          code={code}
          district={district}
        />
      )}
    </div>
  );
}
