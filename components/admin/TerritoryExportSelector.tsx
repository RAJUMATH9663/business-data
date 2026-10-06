"use client";

import { useState } from "react";

interface DistrictOption {
  id: number | string;
  name: string;
  slug: string;
  _count: { businesses: number };
}

interface TerritoryExportSelectorProps {
  districts: DistrictOption[];
  totalBusinesses: number;
}

export default function TerritoryExportSelector({
  districts,
  totalBusinesses,
}: TerritoryExportSelectorProps) {
  const [selectedSlug, setSelectedSlug] = useState<string>(
    districts.find((d) => d.slug === "bengaluru-urban")?.slug || districts[0]?.slug || ""
  );
  const [downloading, setDownloading] = useState(false);
  const [downloadingSlug, setDownloadingSlug] = useState<string | null>(null);
  const [downloadedSlug, setDownloadedSlug] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const selectedDistrict = districts.find((d) => d.slug === selectedSlug) || districts[0];

  const handleDownload = async (slugToDownload: string) => {
    try {
      setDownloading(true);
      setDownloadingSlug(slugToDownload);
      setErrorMsg(null);

      const target = districts.find((d) => d.slug === slugToDownload) || selectedDistrict;
      const downloadUrl = `/api/admin/export?district=${slugToDownload}`;

      const res = await fetch(downloadUrl);
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Admin session expired. Please log in again as an administrator.");
        }
        throw new Error(`Export failed (Status: ${res.status}). Please try again.`);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `B2B_Trade_Directory_${(target?.name || slugToDownload).replace(/\s+/g, "_")}_Master_Database_${target?._count.businesses || 5740}_Listings.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setDownloadedSlug(slugToDownload);
      setTimeout(() => setDownloadedSlug(null), 4000);
    } catch (err: any) {
      console.error("Export error:", err);
      setErrorMsg(err.message || "Could not complete Excel export.");
    } finally {
      setDownloading(false);
      setDownloadingSlug(null);
    }
  };

  const priorityHubs = [
    { name: "Bengaluru Urban", slug: "bengaluru-urban", icon: "🏙️" },
    { name: "Hyderabad", slug: "hyderabad", icon: "💎" },
    { name: "Chennai", slug: "chennai", icon: "🏭" },
    { name: "Pune", slug: "pune", icon: "🚗" },
    { name: "Coimbatore", slug: "coimbatore", icon: "🧵" },
    { name: "Belagavi", slug: "belagavi", icon: "⚙️" },
    { name: "Mysuru", slug: "mysuru", icon: "🌾" },
    { name: "Koppal", slug: "koppal", icon: "🏗️" },
  ];

  return (
    <div className="card p-6 border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent space-y-6 rounded-2xl shadow-sm">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📥</span>
            <h2 className="text-lg font-bold text-[var(--text-main)]">
              Direct Master Excel (.xlsx) Export
            </h2>
            <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {totalBusinesses.toLocaleString("en-IN")} Total Records
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] max-w-2xl">
            Export complete verified business listings with all 18 enterprise columns (GSTIN, Decision Makers,
            Direct Mobiles, Turnover Brackets, Google Star Ratings &amp; Reviews, GPS Maps Links, and Postal Codes).
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Memory-Safe Streaming &lt; 2s
          </span>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
          <span>⚠️</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Selector & Download Button */}
      <div className="bg-[var(--card-bg)] border border-[var(--border)] p-4 sm:p-5 rounded-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Select Territory / District ({districts.length} Commercial Hubs Available)
            </label>
            <select
              value={selectedSlug}
              onChange={(e) => setSelectedSlug(e.target.value)}
              disabled={downloading}
              className="w-full bg-[var(--bg-main)] border border-[var(--border)] text-[var(--text-main)] text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            >
              {districts.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.name} — {d._count.businesses.toLocaleString("en-IN")} Verified Listings (All 28 Sectors)
                </option>
              ))}
            </select>
          </div>

          <div>
            <button
              onClick={() => handleDownload(selectedSlug)}
              disabled={downloading}
              className="w-full btn bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-all duration-150 active:scale-95 disabled:opacity-50 shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
            >
              {downloading && downloadingSlug === selectedSlug ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Streaming Excel...</span>
                </>
              ) : downloadedSlug === selectedSlug ? (
                <>
                  <span>✓</span>
                  <span>Downloaded!</span>
                </>
              ) : (
                <>
                  <span>📥</span>
                  <span>Download Territory (.xlsx)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Hub Badges */}
        <div className="pt-2 border-t border-[var(--border)] space-y-2">
          <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
            Quick 1-Click Hub Downloads:
          </p>
          <div className="flex flex-wrap gap-2">
            {priorityHubs.map((hub) => {
              const matched = districts.find((d) => d.slug === hub.slug);
              if (!matched) return null;
              const isThisDownloading = downloading && downloadingSlug === hub.slug;
              const isThisDownloaded = downloadedSlug === hub.slug;

              return (
                <button
                  key={hub.slug}
                  onClick={() => handleDownload(hub.slug)}
                  disabled={downloading}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 active:scale-95 ${
                    isThisDownloaded
                      ? "bg-emerald-500 text-white border-emerald-600"
                      : "bg-[var(--bg-main)] hover:bg-emerald-500/10 text-[var(--text-main)] border-[var(--border)] hover:border-emerald-500/40"
                  }`}
                >
                  {isThisDownloading ? (
                    <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                  ) : (
                    <span>{hub.icon}</span>
                  )}
                  <span>{hub.name}</span>
                  <span className="text-[10px] text-[var(--text-muted)] font-normal">
                    ({matched._count.businesses.toLocaleString("en-IN")})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 18 Columns Included Spec */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider flex items-center gap-1.5">
          <span>📋</span> All 18 Enterprise Columns Included In Each Excel Sheet:
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-[11px]">
          <div className="p-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border)] text-[var(--text-muted)]">
            <span className="font-bold text-[var(--text-main)]">1.</span> Sl No &amp; Enterprise
          </div>
          <div className="p-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border)] text-[var(--text-muted)]">
            <span className="font-bold text-[var(--text-main)]">2.</span> Industry Sector
          </div>
          <div className="p-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border)] text-[var(--text-muted)]">
            <span className="font-bold text-[var(--text-main)]">3.</span> Key Decision Maker
          </div>
          <div className="p-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border)] text-[var(--text-muted)]">
            <span className="font-bold text-[var(--text-main)]">4.</span> Executive Designation
          </div>
          <div className="p-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border)] text-[var(--text-muted)]">
            <span className="font-bold text-[var(--text-main)]">5.</span> GSTIN (Tax ID)
          </div>
          <div className="p-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border)] text-[var(--text-muted)]">
            <span className="font-bold text-[var(--text-main)]">6.</span> Verified Mobile
          </div>
          <div className="p-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border)] text-[var(--text-muted)]">
            <span className="font-bold text-[var(--text-main)]">7.</span> Alternate Phone
          </div>
          <div className="p-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border)] text-[var(--text-muted)]">
            <span className="font-bold text-[var(--text-main)]">8.</span> Email Address
          </div>
          <div className="p-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border)] text-[var(--text-muted)]">
            <span className="font-bold text-[var(--text-main)]">9.</span> Annual Turnover
          </div>
          <div className="p-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border)] text-[var(--text-muted)]">
            <span className="font-bold text-[var(--text-main)]">10.</span> Employee Team Size
          </div>
          <div className="p-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border)] text-[var(--text-muted)]">
            <span className="font-bold text-[var(--text-main)]">11.</span> Google Star Rating ⭐
          </div>
          <div className="p-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border)] text-[var(--text-muted)]">
            <span className="font-bold text-[var(--text-main)]">12.</span> Google Review Count
          </div>
          <div className="p-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border)] text-[var(--text-muted)]">
            <span className="font-bold text-[var(--text-main)]">13.</span> Google Maps GPS
          </div>
          <div className="p-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border)] text-[var(--text-muted)]">
            <span className="font-bold text-[var(--text-main)]">14.</span> Town / Area / Hub
          </div>
          <div className="p-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border)] text-[var(--text-muted)]">
            <span className="font-bold text-[var(--text-main)]">15.</span> District / Territory
          </div>
          <div className="p-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border)] text-[var(--text-muted)]">
            <span className="font-bold text-[var(--text-main)]">16.</span> Full Postal Address
          </div>
          <div className="p-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border)] text-[var(--text-muted)]">
            <span className="font-bold text-[var(--text-main)]">17.</span> Postal Pincode
          </div>
          <div className="p-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border)] text-[var(--text-muted)]">
            <span className="font-bold text-[var(--text-main)]">18.</span> Active Verification
          </div>
        </div>
      </div>
    </div>
  );
}
