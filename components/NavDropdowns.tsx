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
  { name: "Bengaluru Rural", slug: "bengaluru-rural", tag: "Industrial Belt", icon: "🏭" },
  { name: "Mysuru", slug: "mysuru", tag: "Heritage & Tech Hub", icon: "🏛️" },
  { name: "Hubballi - Dharwad", slug: "dharwad", tag: "Commercial Capital", icon: "🚂" },
  { name: "Belagavi", slug: "belagavi", tag: "Engineering & Foundry", icon: "⚙️" },
  { name: "Mangaluru (D.K.)", slug: "dakshina-kannada", tag: "Port & Coastal Trade", icon: "⚓" },
  { name: "Tumakuru", slug: "tumakuru", tag: "Smart City & Auto", icon: "🏗️" },
  { name: "Udupi", slug: "udupi", tag: "Hospitality & Marine", icon: "🏖️" },
  { name: "Kalaburagi", slug: "kalaburagi", tag: "North Region Center", icon: "🌾" },
  { name: "Ballari", slug: "ballari", tag: "Steel & Mining", icon: "⛏️" },
  { name: "Shivamogga", slug: "shivamogga", tag: "Malnad Enterprise", icon: "🌿" },
  { name: "Chikkamagaluru", slug: "chikkamagaluru", tag: "Coffee & Agro", icon: "☕" },
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

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const close = () => setOpenMenu(null);

  return (
    <div ref={containerRef} className="relative flex items-center gap-1">
      {/* 1. Cities Dropdown Button */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenMenu(openMenu === "cities" ? null : "cities")}
          aria-expanded={openMenu === "cities"}
          className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-all ${
            openMenu === "cities"
              ? "bg-blue-500/15 text-blue-600 dark:text-blue-400"
              : "text-[var(--text-muted)] hover:bg-[var(--tile-hover)] hover:text-[var(--text-main)]"
          }`}
        >
          <span>📍</span>
          <span>Cities</span>
          <svg
            className={`h-3 w-3 transition-transform duration-200 ${
              openMenu === "cities" ? "rotate-180 text-blue-500" : "text-slate-400"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Cities Popover Mega-Card */}
        {openMenu === "cities" && (
          <div className="absolute left-0 top-full mt-2 w-[420px] rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)]/95 p-4 shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2.5 border-b border-[var(--border-card)]/70">
              <div className="flex items-center gap-2">
                <span className="text-sm">📍</span>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)]">
                  Karnataka Business Hubs
                </span>
              </div>
              <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                31 Districts
              </span>
            </div>

            {/* City Grid */}
            <div className="mt-3 grid grid-cols-2 gap-1.5 max-h-[300px] overflow-y-auto pr-1">
              {TOP_CITIES.map((c) => (
                <Link
                  key={c.slug}
                  href={`/directory?district=${c.slug}`}
                  onClick={close}
                  className="group flex items-start gap-2 rounded-xl p-2 transition-all hover:bg-[var(--tile-hover)]"
                >
                  <span className="text-base leading-none group-hover:scale-110 transition-transform">
                    {c.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-[var(--text-main)] group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                      {c.name}
                    </p>
                    <p className="text-[10px] text-[var(--text-muted)] truncate">{c.tag}</p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Footer Action */}
            <div className="mt-3 pt-2.5 border-t border-[var(--border-card)]/70 flex items-center justify-between text-xs">
              <span className="text-[11px] text-[var(--text-muted)]">16,746 verified listings</span>
              <Link
                href="/directory"
                onClick={close}
                className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
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
              ? "bg-purple-500/15 text-purple-600 dark:text-purple-400"
              : "text-[var(--text-muted)] hover:bg-[var(--tile-hover)] hover:text-[var(--text-main)]"
          }`}
        >
          <span>🏢</span>
          <span>Categories</span>
          <svg
            className={`h-3 w-3 transition-transform duration-200 ${
              openMenu === "categories" ? "rotate-180 text-purple-500" : "text-slate-400"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Categories Popover Mega-Card */}
        {openMenu === "categories" && (
          <div className="absolute left-0 top-full mt-2 w-[440px] rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)]/95 p-4 shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2.5 border-b border-[var(--border-card)]/70">
              <div className="flex items-center gap-2">
                <span className="text-sm">🏢</span>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)]">
                  Top B2B Industries
                </span>
              </div>
              <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold text-purple-600 dark:text-purple-400">
                28+ Categories
              </span>
            </div>

            {/* Category Grid */}
            <div className="mt-3 grid grid-cols-2 gap-1.5 max-h-[300px] overflow-y-auto pr-1">
              {TOP_CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/explore?category=${cat.slug}`}
                  onClick={close}
                  className="group flex items-start gap-2 rounded-xl p-2 transition-all hover:bg-[var(--tile-hover)]"
                >
                  <span className="text-base leading-none group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-[var(--text-main)] group-hover:text-purple-600 dark:group-hover:text-purple-400 truncate">
                      {cat.name}
                    </p>
                    <p className="text-[10px] text-[var(--text-muted)] truncate">{cat.countHint}</p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Footer Action */}
            <div className="mt-3 pt-2.5 border-t border-[var(--border-card)]/70 flex items-center justify-between text-xs">
              <span className="text-[11px] text-[var(--text-muted)]">Full Contact Database</span>
              <Link
                href="/explore"
                onClick={close}
                className="font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
              >
                Open Category Explorer →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
