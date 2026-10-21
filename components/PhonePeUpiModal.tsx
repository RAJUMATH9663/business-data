"use client";

import { useEffect, useState, useRef } from "react";

type Order = {
  mode: "mock" | "razorpay" | "phonepe_upi";
  purchaseId: number;
  code: string;
  orderId: string;
  quantity: number;
  amountPaise: number;
  amountRupees?: string;
  upiId?: string;
  payeeName?: string;
  upiUri?: string;
  keyId?: string;
};

interface PhonePeUpiModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  districtName?: string;
  categoryName?: string;
  onSuccess: (purchaseId: number) => void;
}

export default function PhonePeUpiModal({
  isOpen,
  onClose,
  order,
  districtName = "Karnataka",
  categoryName = "B2B Directory",
  onSuccess,
}: PhonePeUpiModalProps) {
  const [utr, setUtr] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [statusText, setStatusText] = useState("");
  const [copied, setCopied] = useState(false);
  const [isPolling, setIsPolling] = useState(false);

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const upiId = order?.upiId || "9663319527@ibl";
  const payeeName = order?.payeeName || "NivoLeads B2B";
  const amountRupees =
    order?.amountRupees || (order ? (order.amountPaise / 100).toFixed(2) : "0.00");
  const purchaseCode = order?.code || "";

  const upiUri =
    order?.upiUri ||
    `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
      payeeName
    )}&am=${amountRupees}&tr=${purchaseCode}&tn=${encodeURIComponent(
      `Leads Access ${purchaseCode}`
    )}&cu=INR`;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&data=${encodeURIComponent(
    upiUri
  )}`;

  // Start background status polling when modal is open
  useEffect(() => {
    if (!isOpen || !order) return;

    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/orders/${order.purchaseId}/status`);
        if (res.ok) {
          const data = await res.json();
          if (data.paid) {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            setStatusText("✅ Payment Verified by Bank! Unlocking leads...");
            setTimeout(() => {
              onSuccess(order.purchaseId);
            }, 1200);
          }
        }
      } catch {
        // ignore polling errors
      }
    };

    setIsPolling(true);
    pollIntervalRef.current = setInterval(checkStatus, 2500);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      setIsPolling(false);
    };
  }, [isOpen, order, onSuccess]);

  if (!isOpen || !order) return null;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitUtr = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUtr = utr.trim().replace(/\D/g, "");

    if (cleanUtr.length !== 12) {
      setError("Please enter a valid 12-digit UPI Reference / UTR Number from your PhonePe receipt.");
      return;
    }

    setSubmitting(true);
    setError("");
    setStatusText("🔍 Verifying UTR with bank records...");

    try {
      const res = await fetch("/api/orders/submit-utr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purchaseId: order.purchaseId,
          utr: cleanUtr,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Verification failed. Please check the UTR number.");
        setStatusText("");
        setSubmitting(false);
        return;
      }

      if (data.status === "PAID") {
        setStatusText("🎉 Payment Verified! Directing to your unlocked contacts...");
        setTimeout(() => {
          onSuccess(order.purchaseId);
        }, 1000);
      } else {
        // Bank credit notification pending in webhook
        setStatusText("⏳ UTR recorded! Waiting for bank SMS confirmation (usually 5–15 seconds)...");
        setSubmitting(false);
      }
    } catch {
      setError("Network error while submitting UTR. Please try again.");
      setStatusText("");
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-950/50 dark:text-purple-300">
            <span className="h-2 w-2 rounded-full bg-purple-600 animate-pulse"></span>
            PhonePe & Any UPI App
          </div>
          <h2 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
            Instant UPI Payment
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Order #{order.code} · {order.quantity} Leads ({districtName} · {categoryName})
          </p>
        </div>

        {/* Amount Card */}
        <div className="mt-4 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 p-4 text-center text-white shadow-md">
          <div className="text-xs font-medium uppercase tracking-wider text-purple-200">
            Total Amount to Pay
          </div>
          <div className="mt-1 text-3xl font-extrabold tracking-tight">
            ₹{amountRupees}
          </div>
          <div className="mt-1 text-[11px] text-purple-100/90">
            Zero Payment Gateway Fees · 100% Direct Bank Transfer
          </div>
        </div>

        {/* Step 1: Scan & Pay */}
        <div className="mt-5 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-800 dark:bg-slate-800/40">
            <div className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-2">
              Step 1: Scan with PhonePe / GPay / Paytm
            </div>

            {/* QR Code */}
            <div className="mx-auto my-2 flex h-52 w-52 items-center justify-center rounded-xl bg-white p-2 shadow-inner border border-slate-200 dark:border-slate-700">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrImageUrl}
                alt="PhonePe UPI QR Code"
                className="h-full w-full object-contain"
              />
            </div>

            {/* UPI ID Copy button */}
            <div className="mt-2 flex items-center justify-center gap-2 text-xs">
              <span className="text-slate-500">UPI ID:</span>
              <code className="rounded bg-slate-200 px-2 py-0.5 font-mono font-bold text-slate-800 dark:bg-slate-700 dark:text-slate-200">
                {upiId}
              </code>
              <button
                type="button"
                onClick={handleCopyUpi}
                className="rounded bg-purple-100 px-2 py-0.5 font-medium text-purple-700 hover:bg-purple-200 dark:bg-purple-900/60 dark:text-purple-300"
              >
                {copied ? "Copied! ✓" : "Copy"}
              </button>
            </div>

            {/* Mobile Pay App Launcher */}
            <div className="mt-3 block md:hidden">
              <a
                href={upiUri}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 py-2.5 text-xs font-semibold text-white shadow hover:bg-purple-700"
              >
                ⚡ Open in PhonePe / UPI App
              </a>
            </div>
          </div>

          {/* Step 2: UTR Submission Form */}
          <form onSubmit={handleSubmitUtr} className="space-y-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <label
                htmlFor="utrInput"
                className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-200"
              >
                Step 2: Enter 12-Digit UTR / UPI Reference No.
              </label>
              <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                Found on your PhonePe/GPay payment receipt after sending ₹{amountRupees}.
              </p>

              <div className="mt-2">
                <input
                  id="utrInput"
                  type="text"
                  maxLength={12}
                  value={utr}
                  onChange={(e) => {
                    setUtr(e.target.value.replace(/\D/g, ""));
                    setError("");
                  }}
                  placeholder="e.g. 429512345678"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-center font-mono text-lg font-bold tracking-widest text-slate-900 shadow-sm focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  required
                />
              </div>

              {/* Error Alert */}
              {error && (
                <div className="mt-2 rounded-xl bg-red-50 p-3.5 text-xs text-red-700 border-2 border-red-300 dark:bg-red-950/60 dark:text-red-200 dark:border-red-800 shadow-sm animate-shake">
                  <div className="flex items-start gap-2">
                    <span className="text-base leading-none">❌</span>
                    <div className="flex-1">
                      <p className="font-bold text-red-800 dark:text-red-100">{error}</p>
                      <p className="mt-1 text-[11px] text-red-600 dark:text-red-300">
                        • Open <strong>PhonePe</strong> &gt; <strong>History</strong> &gt; Select this payment.<br />
                        • Look for <strong>UTR: 12 numeric digits</strong> (e.g. 110441981474).
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Status Notice */}
              {statusText && (
                <div className="mt-2 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800 border-2 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-800 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{statusText}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setStatusText("");
                        setError("");
                        setUtr("");
                      }}
                      className="ml-2 text-[11px] font-bold underline text-emerald-900 hover:text-emerald-950 dark:text-emerald-100"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || utr.length !== 12}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-3 text-sm font-bold text-white shadow hover:bg-emerald-700 disabled:opacity-50 transition"
              >
                {submitting ? "Verifying with Bank..." : "Verify & Unlock Contacts ✓"}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Note */}
        <div className="mt-4 text-center text-[11px] text-slate-400">
          🔒 Automated bank matching protects your purchase. Contacts unlock instantly upon verification.
        </div>
      </div>
    </div>
  );
}
