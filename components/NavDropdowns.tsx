"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface CityItem {
  name: string;
  slug: string;
  tag: string;
  icon: string;
}

interface CategoryItem {
  name: string;
  slug: string;
  icon: string;
  countHint: string;
}

const TOP_CITIES: CityItem[] = [
  { name: "Bengaluru Urban", slug: "bengaluru-urban", tag: "Tech & Corporate Hub", icon: "🏙️" },
  { name: "Bengaluru Rural", slug: "bengaluru-rural", tag: "Industrial Corridor", icon: "🏭" },
  { name: "Mysuru", slug: "mysuru", tag: "Heritage & IT Hub", icon: "🏛️" },
  { name: "Hubballi - Dharwad", slug: "dharwad", tag: "Commercial Center", icon: "🚂" },
  { name: "Belagavi", slug: "belagavi", tag: "Foundry & Auto Hub", icon: "⚙️" },
  { name: "Mangaluru (D.K.)", slug: "dakshina-kannada", tag: "Port & Export Trade", icon: "⚓" },
  { name: "Tumakuru", slug: "tumakuru", tag: "Smart City & Auto", icon: "🏗️" },
  { name: "Udupi", slug: "udupi", tag: "Hospitality & Marine", icon: "🏖️" },
  { name: "Kalaburagi", slug: "kalaburagi", tag: "North Region Hub", icon: "🌾" },
  { name: "Ballari", slug: "ballari", tag: "Steel & Mining Center", icon: "⛏️" },
  { name: "Shivamogga", slug: "shivamogga", tag: "Malnad Enterprise", icon: "🌿" },
  { name: "Chikkamagaluru", slug: "chikkamagaluru", tag: "Coffee & Agro Trade", icon: "☕" },
];

const TOP_CATEGORIES: CategoryItem[] = [
  { name: "IT & Software", slug: "it-software-companies", icon: "💻", countHint: "3,200+ leads" },
  { name: "Manufacturing", slug: "manufacturing-industries", icon: "🏭", countHint: "2,850+ leads" },
  { name: "Hospitals & Clinics", slug: "hospitals-clinics", icon: "🏥", countHint: "1,920+ leads" },
  { name: "Automobile Dealers", slug: "automobile-dealers", icon: "🚗", countHint: "1,450+ leads" },
  { name: "Construction & Builders", slug: "construction-builders", icon: "🏗️", countHint: "1,380+ leads" },
  { name: "Real Estate", slug: "real-estate", icon: "🏠", countHint: "1,150+ leads" },
  { name: "Retail & Supermarkets", slug: "retail-supermarkets", icon: "🛒", countHint: "1,600+ leads" },
  { name: "Agro Businesses", slug: "agriculture-agro-businesses", icon: "🌾", countHint: "980+ leads" },
  { name: "Transport & Logistics", slug: "transport-logistics", icon: "🚛", countHint: "820+ leads" },
  { name: "Finance & Loans", slug: "finance-insurance-loans", icon: "🏦", countHint: "740+ leads" },
  { name: "Solar & Energy", slug: "solar-renewable-energy", icon: "☀️", countHint: "420+ leads" },
  { name: "Coffee & Plantations", slug: "coffee-tea-plantations", icon: "☕", countHint: "360+ leads" },
];

export default function NavDropdowns() {
  const [openMenu, setOpenMenu] = useState<"cities" | "categories" | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when pressing Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const close = () => setOpenMenu(null);

  return (
    <>
      {/* Click-away backdrop overlay when menu is open: prevents bleed-through and handles outside clicks */}
      {openMenu !== null && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity"
          onClick={close}
          aria-hidden="true"
        />
      )}

      <div ref={containerRef} className="relative z-50 flex items-center gap-1">
        {/* 1. Cities Dropdown Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenMenu(openMenu === "cities" ? null : "cities")}
            aria-expanded={openMenu === "cities"}
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-all ${
              openMenu === "cities"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-[var(--text-muted)] hover:bg-[var(--tile-hover)] hover:text-[var(--text-main)]"
            }`}
          >
            <span>📍</span>
            <span>Cities</span>
            <svg
              className={`h-3 w-3 transition-transform duration-200 ${
                openMenu === "cities" ? "rotate-180 text-white" : "text-slate-400"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Cities Popover (100% OPAQUE SOLID THEMED CARD, ZERO BLEED-THROUGH) */}
          {openMenu === "cities" && (
            <div
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border-card)",
                color: "var(--text-main)",
              }}
              className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-[360px] sm:w-[420px] rounded-2xl border p-4 shadow-2xl ring-1 ring-black/20 z-50 animate-in fade-in zoom-in-95 duration-150"
            >
              <div
                style={{ borderColor: "var(--border-card)" }}
                className="flex items-center justify-between pb-2.5 border-b"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">📍</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)]">
                    Karnataka Business Hubs
                  </span>
                </div>
                <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] font-bold text-blue-500 dark:text-blue-400 border border-blue-500/20">
                  31 Districts
                </span>
              </div>

              {/* City Grid with hidden scrollbar */}
              <div className="mt-3 grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {TOP_CITIES.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/directory?district=${c.slug}`}
                    onClick={close}
                    style={{
                      backgroundColor: "var(--tile-bg)",
                      borderColor: "var(--border-card)",
                    }}
                    className="group flex items-start gap-2 rounded-xl border p-2 transition-all hover:border-blue-500/50 hover:bg-blue-500/10 active:scale-[0.98]"
                  >
                    <span className="text-base leading-none group-hover:scale-110 transition-transform">
                      {c.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[var(--text-main)] group-hover:text-blue-500 transition-colors truncate">
                        {c.name}
                      </p>
                      <p className="text-[10px] text-[var(--text-muted)] truncate">{c.tag}</p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Footer Action */}
              <div
                style={{ borderColor: "var(--border-card)" }}
                className="mt-3 pt-2.5 border-t flex items-center justify-between text-xs"
              >
                <span className="text-[11px] text-[var(--text-muted)]">16,746 verified listings</span>
                <Link
                  href="/directory"
                  onClick={close}
                  className="font-bold text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  View All 31 Districts →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* 2. Categories Dropdown Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenMenu(openMenu === "categories" ? null : "categories")}
            aria-expanded={openMenu === "categories"}
            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-all ${
              openMenu === "categories"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-[var(--text-muted)] hover:bg-[var(--tile-hover)] hover:text-[var(--text-main)]"
            }`}
          >
            <span>🏢</span>
            <span>Categories</span>
            <svg
              className={`h-3 w-3 transition-transform duration-200 ${
                openMenu === "categories" ? "rotate-180 text-white" : "text-slate-400"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Categories Popover (100% OPAQUE SOLID THEMED CARD, ZERO BLEED-THROUGH) */}
          {openMenu === "categories" && (
            <div
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border-card)",
                color: "var(--text-main)",
              }}
              className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-[360px] sm:w-[440px] rounded-2xl border p-4 shadow-2xl ring-1 ring-black/20 z-50 animate-in fade-in zoom-in-95 duration-150"
            >
              <div
                style={{ borderColor: "var(--border-card)" }}
                className="flex items-center justify-between pb-2.5 border-b"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">🏢</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)]">
                    Top B2B Industries
                  </span>
                </div>
                <span className="rounded-full bg-purple-500/15 px-2 py-0.5 text-[10px] font-bold text-purple-500 dark:text-purple-400 border border-purple-500/20">
                  28+ Sectors
                </span>
              </div>

              {/* Category Grid with hidden scrollbar */}
              <div className="mt-3 grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {TOP_CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/explore?category=${cat.slug}`}
                    onClick={close}
                    style={{
                      backgroundColor: "var(--tile-bg)",
                      borderColor: "var(--border-card)",
                    }}
                    className="group flex items-start gap-2 rounded-xl border p-2 transition-all hover:border-purple-500/50 hover:bg-purple-500/10 active:scale-[0.98]"
                  >
                    <span className="text-base leading-none group-hover:scale-110 transition-transform">
                      {cat.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[var(--text-main)] group-hover:text-purple-500 transition-colors truncate">
                        {cat.name}
                      </p>
                      <p className="text-[10px] text-[var(--text-muted)] truncate">{cat.countHint}</p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Footer Action */}
              <div
                style={{ borderColor: "var(--border-card)" }}
                className="mt-3 pt-2.5 border-t flex items-center justify-between text-xs"
              >
                <span className="text-[11px] text-[var(--text-muted)]">Full Verified Database</span>
                <Link
                  href="/explore"
                  onClick={close}
                  className="font-bold text-purple-500 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300"
                >
                  Open Category Explorer →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
