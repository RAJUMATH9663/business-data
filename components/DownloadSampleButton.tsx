"use client";

import { useState } from "react";

interface DownloadSampleButtonProps {
  districtSlug?: string;
  districtName?: string;
  categorySlug?: string;
  categoryName?: string;
  className?: string;
  variant?: "primary" | "secondary" | "outline" | "compact" | "banner";
}

export default function DownloadSampleButton({
  districtSlug,
  districtName,
  categorySlug,
  categoryName,
  className = "",
  variant = "primary",
}: DownloadSampleButtonProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = async (format: "xlsx" | "csv" = "xlsx") => {
    try {
      setDownloading(true);
      setDownloaded(false);

      const params = new URLSearchParams();
      if (districtSlug) params.set("district", districtSlug);
      if (categorySlug) params.set("category", categorySlug);
      params.set("format", format);

      const downloadUrl = `/api/sample?${params.toString()}`;
      const response = await fetch(downloadUrl);

      if (!response.ok) {
        throw new Error("Failed to download sample file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      
      const safeDist = (districtName || districtSlug || "Karnataka").replace(/[^a-zA-Z0-9]/g, "-");
      const safeCat = (categoryName || categorySlug || "Leads").replace(/[^a-zA-Z0-9]/g, "-");
      a.download = `NivoLeads-5-Sample-Leads-${safeDist}-${safeCat}.${format}`;
      
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 4000);
    } catch (err) {
      console.error("Download sample error:", err);
      alert("Could not download sample file. Please check your connection.");
    } finally {
      setDownloading(false);
    }
  };

  if (variant === "banner") {
    return (
      <div className={`rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent p-4 sm:p-5 shadow-sm ${className}`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xl font-bold">
              📥
            </div>
            <div>
              <h4 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
                <span>Test Before Buying: Download 5 Free Sample Leads</span>
                <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                  Free
                </span>
              </h4>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Download a 5-contact sample spreadsheet (.xlsx) for {districtName || "this district"} {categoryName ? `(${categoryName})` : ""} to verify phone quality instantly.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleDownload("xlsx")}
              disabled={downloading}
              className="btn bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all duration-150 active:scale-95 disabled:opacity-50"
            >
              {downloading ? (
                <>
                  <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Preparing 5 Leads...</span>
                </>
              ) : downloaded ? (
                <>
                  <span>✓</span>
                  <span>5 Leads Downloaded!</span>
                </>
              ) : (
                <>
                  <span>📥</span>
                  <span>Download 5 Free Sample Leads (.xlsx)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <button
        onClick={() => handleDownload("xlsx")}
        disabled={downloading}
        className={`inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline disabled:opacity-50 ${className}`}
      >
        <span>📥</span>
        <span>
          {downloading ? "Preparing sample..." : downloaded ? "✓ Downloaded!" : "Download 5 Free Sample Leads"}
        </span>
      </button>
    );
  }

  if (variant === "outline") {
    return (
      <button
        onClick={() => handleDownload("xlsx")}
        disabled={downloading}
        className={`btn border border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all duration-150 active:scale-95 disabled:opacity-50 ${className}`}
      >
        {downloading ? (
          <span className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
            <span>Preparing...</span>
          </span>
        ) : downloaded ? (
          <span className="flex items-center gap-1.5">
            <span>✓</span>
            <span>5 Sample Leads Downloaded</span>
          </span>
        ) : (
          <span className="flex items-center gap-1.5">
            <span>📥</span>
            <span>Download 5 Free Sample Leads (.xlsx)</span>
          </span>
        )}
      </button>
    );
  }

  // Primary variant
  return (
    <button
      onClick={() => handleDownload("xlsx")}
      disabled={downloading}
      className={`btn bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25 px-5 py-3 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-150 active:scale-95 disabled:opacity-50 ${className}`}
    >
      {downloading ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          <span>Generating 5 Sample Leads...</span>
        </span>
      ) : downloaded ? (
        <span className="flex items-center gap-2">
          <span>✓</span>
          <span>Downloaded 5 Sample Leads!</span>
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <span>📥</span>
          <span>Download 5 Free Sample Leads (.xlsx)</span>
        </span>
      )}
    </button>
  );
}
