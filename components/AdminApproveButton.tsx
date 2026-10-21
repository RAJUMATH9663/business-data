"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminApproveButton({
  purchaseId,
  purchaseCode,
  currentUtr,
}: {
  purchaseId: number;
  purchaseCode: string;
  currentUtr?: string | null;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleApprove = async (overrideUtr?: string) => {
    const utrMsg = overrideUtr ? ` with corrected UTR (${overrideUtr})` : "";
    if (
      !confirm(
        `Are you sure you want to approve order #${purchaseCode}${utrMsg} and unlock business leads?`
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/purchases/${purchaseId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: overrideUtr ? JSON.stringify({ utrNumber: overrideUtr }) : undefined,
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to approve purchase");
      } else {
        alert(data.message || "Order approved successfully! Leads unlocked.");
        router.refresh();
      }
    } catch {
      alert("Network error while approving purchase");
    } finally {
      setLoading(false);
    }
  };

  const handleCorrectUtr = () => {
    const real = prompt(
      `Customer entered: ${currentUtr || "None"}\n\nEnter the REAL 12-digit UTR from your PhonePe/Bank:`,
      currentUtr || ""
    );
    if (!real) return;
    const clean = real.trim().replace(/\D/g, "");
    if (clean.length !== 12) {
      alert("Error: UTR must be exactly 12 numeric digits.");
      return;
    }
    void handleApprove(clean);
  };

  const handleReject = async () => {
    if (!confirm(`Are you sure you want to REJECT and CANCEL order #${purchaseCode}?`)) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/purchases/${purchaseId}/reject`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to reject purchase");
      } else {
        alert(data.message || "Order rejected.");
        router.refresh();
      }
    } catch {
      alert("Network error while rejecting purchase");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <button
        onClick={() => void handleApprove()}
        disabled={loading}
        title="Approve order directly"
        className="inline-flex items-center gap-1 rounded bg-emerald-600 px-2 py-1 text-xs font-bold text-white shadow hover:bg-emerald-700 disabled:opacity-50"
      >
        ✓ Approve
      </button>

      <button
        onClick={handleCorrectUtr}
        disabled={loading}
        title="Edit UTR to real number and approve"
        className="inline-flex items-center gap-1 rounded bg-blue-600 px-2 py-1 text-xs font-medium text-white shadow hover:bg-blue-700 disabled:opacity-50"
      >
        ✏️ Fix UTR
      </button>

      <button
        onClick={() => void handleReject()}
        disabled={loading}
        title="Reject fake/unpaid order"
        className="inline-flex items-center gap-1 rounded bg-rose-600 px-2 py-1 text-xs font-medium text-white shadow hover:bg-rose-700 disabled:opacity-50"
      >
        ✕ Reject
      </button>
    </div>
  );
}
