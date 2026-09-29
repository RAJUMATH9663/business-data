"use client";
import { useState } from "react";

type Opt = { id: number; name: string };
type Summary = {
  total: number;
  valid: number;
  duplicates: number;
  invalid: number;
  newRecords: number;
  existingToUpdate: number;
  invalidSamples: { row: number; reason: string }[];
  duplicateSamples: { row: number; name: string; phone: string }[];
  warnings: string[];
};
type Result = {
  action: "validate" | "import";
  summary: Summary;
  imported?: number;
  updated?: number;
  finalCount?: number;
  target?: string;
};

const n = (v: number) => v.toLocaleString("en-IN");

export default function ImportClient({ districts, categories }: { districts: Opt[]; categories: Opt[] }) {
  const [districtId, setDistrictId] = useState(String(districts[0]?.id ?? ""));
  const [categoryId, setCategoryId] = useState(String(categories[0]?.id ?? ""));
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState<"validate" | "import" | null>(null);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  async function run(action: "validate" | "import") {
    if (!file) return setError("Please select an Excel or CSV file first.");
    setBusy(action);
    setError("");
    if (action === "validate") setResult(null);
    const fd = new FormData();
    fd.set("action", action);
    fd.set("districtId", districtId);
    fd.set("categoryId", categoryId);
    fd.set("file", file);
    try {
      const r = await fetch("/api/admin/import", { method: "POST", body: fd });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Import failed");
      setResult(j);
    } catch (e) {
      setError(e instanceof TypeError ? "Network error. Please try again." : (e as Error).message);
    } finally {
      setBusy(null);
    }
  }

  const s = result?.summary;

  return (
    <div className="space-y-6">
      {/* Upload & Configuration Card */}
      <div className="card space-y-6 p-6 sm:p-8">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Upload Business Dataset</h2>
          <p className="mt-1 text-sm text-slate-500">
            Select the target district and category, then upload your .xlsx or .csv spreadsheet.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="label" htmlFor="imp-d">
              Target District
            </label>
            <select
              id="imp-d"
              className="input cursor-pointer font-medium"
              value={districtId}
              onChange={(e) => {
                setDistrictId(e.target.value);
                setResult(null);
              }}
            >
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label" htmlFor="imp-c">
              Target Category
            </label>
            <select
              id="imp-c"
              className="input cursor-pointer font-medium"
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                setResult(null);
              }}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* File Drop / Selection Area */}
        <div className="relative rounded-2xl border-2 border-dashed border-[var(--border-card)] bg-[var(--bg-mist)] p-6 text-center transition-colors hover:border-brand/60">
          <input
            id="imp-f"
            type="file"
            accept=".xlsx,.xls,.csv"
            className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
            onChange={(e) => {
              setFile(e.target.files?.[0] ?? null);
              setResult(null);
            }}
          />
          <div className="flex flex-col items-center justify-center gap-2">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] text-2xl shadow-sm">
              📄
            </span>
            <div className="text-sm font-semibold text-[var(--text-main)]">
              {file ? (
                <span className="text-brand font-bold">{file.name}</span>
              ) : (
                "Click or drop an Excel (.xlsx, .xls) or CSV file here"
              )}
            </div>
            <div className="text-xs text-[var(--text-muted)]">
              {file
                ? `${(file.size / 1024).toFixed(1)} KB selected · Ready for validation`
                : "Supports up to 50,000 rows (max 8 MB)"}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            className="btn btn-ghost !min-h-[44px] !px-5"
            disabled={!!busy || !file}
            onClick={() => run("validate")}
          >
            {busy === "validate" ? "Validating Spreadsheet…" : "1. Validate Spreadsheet"}
          </button>

          <button
            className="btn btn-primary !min-h-[44px] !px-6"
            disabled={!!busy || !file || !s || result?.action === "import"}
            onClick={() => run("import")}
          >
            {busy === "import" ? "Importing to Database…" : "2. Confirm & Import Data"}
          </button>

          {s && result?.action === "validate" && (
            <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              Validation successful. Ready to import.
            </span>
          )}
        </div>

        {/* Supported Columns Guide */}
        <div className="rounded-xl border border-[var(--border-card)] bg-[var(--bg-mist)] p-4 text-xs text-[var(--text-muted)] leading-relaxed">
          <span className="font-semibold text-[var(--text-main)]">Supported Columns: </span>
          <span className="font-semibold text-blue-500">Business Name</span>,{" "}
          <span className="font-semibold text-blue-500">Phone</span> (Required) · Alternate Phone, Email,
          Website, Address, Area, Pincode, Google Maps URL (Optional).
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div role="alert" className="fade-in card border-rose-500/30 bg-rose-500/10 p-4 text-sm font-semibold text-rose-500">
          ⚠️ {error}
        </div>
      )}

      {/* Results / Summary Display */}
      {s && (
        <div className="card fade-in space-y-6 p-6 sm:p-8">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-bold text-[var(--text-main)]">
              {result?.action === "import" ? "🎉 Import Completed Successfully" : "📊 Spreadsheet Analysis Summary"}
            </h3>
            <span className="badge-brand">
              {result?.action === "import" ? "Imported to Database" : "Pre-import Validation"}
            </span>
          </div>

          {/* Metric Stat Cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="card p-4">
              <dt className="text-xs font-medium text-[var(--text-muted)]">Total Rows</dt>
              <dd className="mt-1 text-2xl font-extrabold text-[var(--text-main)]">{n(s.total)}</dd>
            </div>
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
              <dt className="text-xs font-medium text-emerald-500">Valid Records</dt>
              <dd className="mt-1 text-2xl font-extrabold text-emerald-500">{n(s.valid)}</dd>
            </div>
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
              <dt className="text-xs font-medium text-amber-500">Duplicates in File</dt>
              <dd className="mt-1 text-2xl font-extrabold text-amber-500">{n(s.duplicates)}</dd>
            </div>
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4">
              <dt className="text-xs font-medium text-rose-500">Invalid Rows</dt>
              <dd className="mt-1 text-2xl font-extrabold text-rose-500">{n(s.invalid)}</dd>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--border-card)] bg-[var(--bg-mist)] p-4 text-sm text-[var(--text-muted)] leading-relaxed">
            From the <b className="text-[var(--text-main)]">{n(s.valid)}</b> valid rows:{" "}
            <span className="font-semibold text-blue-500">{n(s.newRecords)}</span> are brand-new businesses to insert, and{" "}
            <span className="font-semibold text-[var(--text-main)]">{n(s.existingToUpdate)}</span> already exist and will have their details updated.
          </div>

          {/* Import Complete Banner */}
          {result?.action === "import" && (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/15 p-4 text-sm font-semibold text-emerald-400">
              ✅ Successfully committed to database: <b>{n(result.imported ?? 0)}</b> inserted · <b>{n(result.updated ?? 0)}</b> updated.{" "}
              {result.target} now has <b>{n(result.finalCount ?? 0)}</b> active business records available in the directory!
            </div>
          )}

          {/* Warnings */}
          {s.warnings.length > 0 && (
            <div className="space-y-1">
              {s.warnings.map((w, idx) => (
                <div key={idx} className="rounded-lg bg-amber-500/15 border border-amber-500/30 px-3 py-2 text-xs font-medium text-amber-400">
                  ℹ️ {w}
                </div>
              ))}
            </div>
          )}

          {/* Samples Details */}
          {s.invalidSamples.length > 0 && (
            <details className="rounded-xl border border-[var(--border-card)] bg-[var(--bg-mist)] p-4">
              <summary className="cursor-pointer text-xs font-bold text-[var(--text-main)]">
                View Invalid Rows ({s.invalidSamples.length} samples)
              </summary>
              <ul className="mt-3 max-h-48 space-y-1.5 overflow-auto text-xs text-rose-500">
                {s.invalidSamples.map((i) => (
                  <li key={i.row} className="flex gap-2">
                    <span className="font-bold">Row {i.row}:</span>
                    <span>{i.reason}</span>
                  </li>
                ))}
              </ul>
            </details>
          )}

          {s.duplicateSamples.length > 0 && (
            <details className="rounded-xl border border-[var(--border-card)] bg-[var(--bg-mist)] p-4">
              <summary className="cursor-pointer text-xs font-bold text-[var(--text-main)]">
                View Duplicate Rows ({s.duplicateSamples.length} samples)
              </summary>
              <ul className="mt-3 max-h-48 space-y-1.5 overflow-auto text-xs text-amber-400">
                {s.duplicateSamples.map((d) => (
                  <li key={d.row} className="flex gap-2">
                    <span className="font-bold">Row {d.row}:</span>
                    <span>
                      {d.name} ({d.phone})
                    </span>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}
    </div>
  );
}
