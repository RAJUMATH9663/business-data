"use client";

import { useState, useEffect } from "react";

interface Credit {
  id: number;
  utrNumber: string;
  amountPaise: number;
  sender: string | null;
  rawMessage: string;
  isConsumed: boolean;
  purchaseId: number | null;
  createdAt: string;
}

export default function AdminBankCreditManager() {
  const [credits, setCredits] = useState<Credit[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [utrInput, setUtrInput] = useState("");
  const [amountInput, setAmountInput] = useState("");
  const [smsInput, setSmsInput] = useState("");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const loadCredits = async () => {
    try {
      const res = await fetch("/api/admin/bank-credits");
      if (res.ok) {
        const data = await res.json();
        setCredits(data.credits || []);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadCredits();
    }
  }, [isOpen]);

  const handleAddCredit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/bank-credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          utr: utrInput,
          amount: amountInput,
          rawSms: smsInput,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ text: data.error || "Failed to record credit", type: "error" });
      } else {
        setMessage({
          text: data.message || "Bank credit recorded successfully!",
          type: "success",
        });
        setUtrInput("");
        setAmountInput("");
        setSmsInput("");
        loadCredits();
      }
    } catch {
      setMessage({ text: "Network error recording credit", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-4 dark:border-purple-900/60 dark:bg-purple-950/20">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              PhonePe & Bank UTR Verification Engine
            </h2>
          </div>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Automated SMS Webhook listener is active at{" "}
            <code className="rounded bg-purple-100 px-1 py-0.5 font-mono text-[11px] text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">
              /api/payments/webhook
            </code>
          </p>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-purple-700 transition"
        >
          {isOpen ? "Close Bank Ledger ▲" : "Manage Bank Credits & Paste SMS ▼"}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 border-t border-purple-200/80 pt-4 dark:border-purple-900/40 space-y-4">
          {/* Add / Paste SMS Form */}
          <form onSubmit={handleAddCredit} className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              ⚡ Quick Log Bank Credit / Paste PhonePe SMS
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">
              If customer pays and you see the SMS on your phone, paste it here to let customer auto-unlock immediately.
            </p>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  12-Digit Real UTR
                </label>
                <input
                  type="text"
                  maxLength={12}
                  value={utrInput}
                  onChange={(e) => setUtrInput(e.target.value.replace(/\D/g, ""))}
                  placeholder="e.g. 110441981474"
                  className="mt-1 w-full rounded-md border border-slate-300 px-2.5 py-1.5 font-mono text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  Amount in ₹ (Optional)
                </label>
                <input
                  type="number"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  placeholder="e.g. 499"
                  className="mt-1 w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  Or Paste Full Bank SMS
                </label>
                <input
                  type="text"
                  value={smsInput}
                  onChange={(e) => setSmsInput(e.target.value)}
                  placeholder="Credited Rs 499 via UPI Ref 110441981474..."
                  className="mt-1 w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            {message && (
              <div
                className={`mt-2 rounded p-2 text-xs font-semibold ${
                  message.type === "success"
                    ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                    : "bg-red-50 text-red-800 dark:bg-red-950/50 dark:text-red-300"
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                disabled={loading || (!utrInput && !smsInput)}
                className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white shadow hover:bg-emerald-700 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Record Credit & Match Order ✓"}
              </button>
            </div>
          </form>

          {/* List of Bank Credits */}
          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-[10px] uppercase dark:border-slate-800 dark:bg-slate-800/50">
                <tr>
                  <th className="p-2.5">UTR / Ref No</th>
                  <th className="p-2.5">Amount</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5">Linked Order</th>
                  <th className="p-2.5">Date Logged</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {credits.map((c) => (
                  <tr key={c.id}>
                    <td className="p-2.5 font-mono font-bold text-slate-900 dark:text-white">
                      {c.utrNumber}
                    </td>
                    <td className="p-2.5 font-semibold text-emerald-600">
                      ₹{(c.amountPaise / 100).toFixed(2)}
                    </td>
                    <td className="p-2.5">
                      {c.isConsumed ? (
                        <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          ✓ Matched & Unlocked
                        </span>
                      ) : (
                        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          Waiting for Customer
                        </span>
                      )}
                    </td>
                    <td className="p-2.5 font-mono text-slate-600 dark:text-slate-400">
                      {c.purchaseId ? `#${c.purchaseId}` : "—"}
                    </td>
                    <td className="p-2.5 text-slate-400">
                      {new Date(c.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
                {credits.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-slate-400">
                      No bank credits recorded yet. When customer pays via PhonePe, credits will show here automatically via SMS Webhook or manual log.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
