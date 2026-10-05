"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Contact = {
  id: number;
  sequenceNumber?: number;
  name: string;
  phone: string;
  altPhone: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  area: string | null;
  pincode: string | null;
  mapsUrl: string | null;
};

type Page = {
  total: number;
  pages: number;
  startOffset?: number;
  endOffset?: number;
  previousContactsCount?: number;
  items: Contact[];
};

const esc = (s: string) => s.replace(/[&<>'"]/g, (c) => `&#${c.charCodeAt(0)};`);

export default function DataViewer({
  purchaseId,
  licensee,
  code,
  district,
}: {
  purchaseId: number;
  licensee: string;
  code: string;
  district: string;
}) {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [dq, setDq] = useState("");
  const [data, setData] = useState<Page | null>(null);
  const [error, setError] = useState("");
  const [expired, setExpired] = useState(false);
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => {
      setDq(q.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    fetch(`/api/purchases/${purchaseId}/contacts?page=${page}&q=${encodeURIComponent(dq)}`, { cache: "no-store" })
      .then(async (r) => {
        const j = await r.json();
        if (r.status === 401) {
          setExpired(true);
          throw new Error(j.error);
        }
        if (!r.ok) throw new Error(j.error || "Could not load data");
        return j as Page;
      })
      .then((j) => !cancelled && setData(j))
      .catch((e) => !cancelled && setError(e instanceof TypeError ? "Network error. Please check your connection and try again." : e.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [purchaseId, page, dq, attempt]);

  // Deterrence only (cannot stop screenshots): block common copy / save / print shortcuts outside the search box
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && t.tagName === "INPUT") return;
      if ((e.ctrlKey || e.metaKey) && ["c", "x", "a", "s", "p", "u"].includes(e.key.toLowerCase())) e.preventDefault();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const watermark = useMemo(() => {
    const svg =
      `<svg xmlns='http://www.w3.org/2000/svg' width='380' height='210'>` +
      `<g transform='rotate(-24 190 105)' fill='#2563EB' fill-opacity='0.08' font-family='Arial,sans-serif' font-size='14' font-weight='600'>` +
      `<text x='24' y='90'>Licensed to: ${esc(licensee)}</text>` +
      `<text x='24' y='110'>Purchase ID: ${esc(code)}</text>` +
      `<text x='24' y='130'>For authorized use only</text></g></svg>`;
    return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
  }, [licensee, code]);

  const block = (e: React.SyntheticEvent) => e.preventDefault();

  if (expired) {
    return (
      <div className="card p-8 text-center">
        <p className="font-semibold text-[var(--text-main)]">Your session has expired.</p>
        <Link href={`/login?next=/purchases/${purchaseId}`} className="btn btn-primary mt-4">
          Log in again
        </Link>
      </div>
    );
  }

  return (
    <div className="protected no-select relative space-y-4" onContextMenu={block} onCopy={block} onCut={block} onDragStart={block}>
      {/* Sequence Range Banner */}
      {data?.startOffset && data?.endOffset && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4 text-xs shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white [forced-color-adjust:none]">
              ✓
            </span>
            <span className="text-sm font-bold text-[var(--text-main)]">
              Listings #{data.startOffset} to #{data.endOffset}
            </span>
            {data.startOffset > 1 && (
              <span className="badge-brand">
                Fresh Listings #{data.startOffset}+ (New Listings Only)
              </span>
            )}
          </div>
          <span className="font-semibold text-[var(--text-muted)]">
            Guaranteed 100% Unique · No Duplicate Records
          </span>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <input
          className="input pl-10"
          type="search"
          placeholder="Search by business name, area or phone…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search purchased directory listings"
        />
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
          🔍
        </span>
      </div>

      {error && (
        <div role="alert" className="fade-in card border-rose-500/30 bg-rose-500/10 p-4 text-sm font-medium text-rose-500">
          ⚠️ {error}{" "}
          <button className="font-bold text-brand underline ml-2" onClick={() => setAttempt((a) => a + 1)}>
            Retry
          </button>
        </div>
      )}

      {/* Contact Cards Grid */}
      <div className="relative min-h-[240px]">
        {data && data.items.length === 0 && !loading && (
          <p className="card p-8 text-center text-sm text-[var(--text-muted)]">
            No listings match "{dq}".
          </p>
        )}

        <div className={`grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 ${loading ? "opacity-60" : ""}`}>
          {(data?.items ?? []).map((c) => {
            const mapHref =
              c.mapsUrl ||
              `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([c.name, c.address || c.area, district].filter(Boolean).join(", "))}`;

            return (
              <article
                key={c.id}
                className="card flex flex-col justify-between p-5 transition-all duration-200 hover:border-brand/60"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="break-words text-base font-bold text-[var(--text-main)] leading-snug">
                      {c.name}
                    </h3>
                    {c.sequenceNumber !== undefined && (
                      <span className="shrink-0 rounded-md bg-blue-500/15 px-2 py-0.5 text-[11px] font-extrabold text-blue-500 border border-blue-500/30">
                        #{c.sequenceNumber}
                      </span>
                    )}
                  </div>

                  <p className="mt-2 break-words text-xs text-[var(--text-muted)] flex items-start gap-1.5">
                    <span>📍</span>
                    <span>
                      {[c.area, c.address].filter(Boolean).join(" · ") || district}
                      {c.pincode ? ` – ${c.pincode}` : ""}
                    </span>
                  </p>

                  <p className="mt-2 text-sm font-bold text-[var(--text-main)] flex items-center gap-1.5">
                    <span>📞</span>
                    <span>
                      {c.phone}
                      {c.altPhone ? ` · ${c.altPhone}` : ""}
                    </span>
                  </p>

                  {c.email && (
                    <p className="mt-1 break-all text-xs text-[var(--text-muted)] flex items-center gap-1.5">
                      <span>✉️</span>
                      <span>{c.email}</span>
                    </p>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 pt-2 border-t border-[var(--border-card)]">
                  <a className="btn btn-primary !px-2 !text-xs font-bold" href={`tel:+91${c.phone}`}>
                    CALL
                  </a>
                  <a className="btn btn-ghost !px-2 !text-xs font-bold" href={mapHref} target="_blank" rel="noopener noreferrer">
                    MAP
                  </a>
                  {c.website ? (
                    <a className="btn btn-ghost !px-2 !text-xs font-bold" href={c.website} target="_blank" rel="noopener noreferrer">
                      WEBSITE
                    </a>
                  ) : (
                    <span className="btn btn-ghost !px-2 !text-xs opacity-40 cursor-not-allowed">
                      WEBSITE
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {loading && !data && (
          <div className="grid place-items-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--border-card)] border-t-brand" />
          </div>
        )}

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10"
          style={{ backgroundImage: watermark, backgroundRepeat: "repeat" }}
        />
      </div>

      {data && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-card)] pt-4">
          <button
            className="btn btn-ghost"
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Previous
          </button>
          <span className="text-center text-xs font-medium text-[var(--text-muted)] sm:text-sm">
            Page <b>{page}</b> of <b>{data.pages}</b> ·{" "}
            <b>{data.total.toLocaleString("en-IN")}</b> listings in this report
          </span>
          <button
            className="btn btn-ghost"
            disabled={page >= data.pages || loading}
            onClick={() => setPage((p) => p + 1)}
          >
            Next →
          </button>
        </div>
      )}

      <p className="mt-3 text-center text-xs text-[var(--text-muted)]">
        Verified B2B Directory · Watermarked with your licensee identity and order code.
      </p>
    </div>
  );
}
