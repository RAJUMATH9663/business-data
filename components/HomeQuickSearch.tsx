"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface DistrictItem {
  name: string;
  slug: string;
  count: number;
}

interface CategoryItem {
  name: string;
  slug: string;
  icon: string;
  tag?: string;
}

interface HomeQuickSearchProps {
  districts: DistrictItem[];
  categories: CategoryItem[];
  totalLeads: number;
}

export default function HomeQuickSearch({ districts, categories, totalLeads }: HomeQuickSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<"all" | "districts" | "categories">("all");
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredDistricts = useMemo(() => {
    if (!query.trim()) return districts.slice(0, 8);
    const q = query.toLowerCase().trim();
    return districts.filter((d) => d.name.toLowerCase().includes(q)).slice(0, 6);
  }, [districts, query]);

  const filteredCategories = useMemo(() => {
    if (!query.trim()) return categories.slice(0, 8);
    const q = query.toLowerCase().trim();
    return categories.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 6);
  }, [categories, query]);

  const handleSelect = (url: string) => {
    setIsOpen(false);
    router.push(url);
  };

  return (
    <div ref={containerRef} className="relative mx-auto w-full max-w-2xl">
      {/* Search Input Box */}
      <div className="relative flex items-center rounded-2xl border-2 border-blue-500/40 bg-[var(--bg-card)] p-2 shadow-xl shadow-blue-500/10 transition-all focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-500/20">
        <span className="pl-3 pr-2 text-xl text-blue-500">🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search district (e.g. Mysuru, Ballari) or sector (e.g. Healthcare, IT)..."
          className="w-full bg-transparent px-2 py-2.5 text-sm sm:text-base font-medium text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="p-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-main)]"
          >
            ✕
          </button>
        )}
        <Link
          href={`/explore${query ? `?q=${encodeURIComponent(query)}` : ""}`}
          className="ml-2 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md transition-all hover:bg-blue-700 active:scale-95 shrink-0"
        >
          <span>Search</span>
          <span className="hidden sm:inline">Leads</span>
          <span>→</span>
        </Link>
      </div>

      {/* Autocomplete / Instant Filter Results Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-3 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Quick Filter Switcher */}
          <div className="flex items-center justify-between border-b border-[var(--border-card)] pb-2 px-1 text-xs">
            <span className="font-semibold text-[var(--text-muted)]">
              {query ? `Results for "${query}"` : "Suggested Quick Jumps"}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSelectedType("all")}
                className={`rounded-lg px-2 py-0.5 font-medium transition-colors ${
                  selectedType === "all" ? "bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold" : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setSelectedType("districts")}
                className={`rounded-lg px-2 py-0.5 font-medium transition-colors ${
                  selectedType === "districts" ? "bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold" : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
                }`}
              >
                Districts
              </button>
              <button
                type="button"
                onClick={() => setSelectedType("categories")}
                className={`rounded-lg px-2 py-0.5 font-medium transition-colors ${
                  selectedType === "categories" ? "bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold" : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
                }`}
              >
                Sectors
              </button>
            </div>
          </div>

          <div className="mt-2 space-y-3">
            {/* Districts Section */}
            {(selectedType === "all" || selectedType === "districts") && filteredDistricts.length > 0 && (
              <div>
                <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  📍 Karnataka Districts
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-1">
                  {filteredDistricts.map((d) => (
                    <button
                      key={d.slug}
                      type="button"
                      onClick={() => handleSelect(`/explore?d=${d.slug}`)}
                      className="flex items-center justify-between rounded-xl px-3 py-2 text-left text-xs sm:text-sm font-medium text-[var(--text-main)] hover:bg-blue-500/10 hover:text-blue-600 transition-colors"
                    >
                      <span className="truncate">{d.name}</span>
                      <span className="ml-2 inline-flex items-center rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                        {d.count > 0 ? `${d.count} leads` : "Available"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Categories Section */}
            {(selectedType === "all" || selectedType === "categories") && filteredCategories.length > 0 && (
              <div>
                <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  🗂️ Industry Sectors
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-1">
                  {filteredCategories.map((c) => (
                    <button
                      key={c.slug}
                      type="button"
                      onClick={() => handleSelect(`/explore?c=${c.slug}`)}
                      className="flex items-center justify-between rounded-xl px-3 py-2 text-left text-xs sm:text-sm font-medium text-[var(--text-main)] hover:bg-emerald-500/10 hover:text-emerald-600 transition-colors"
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        <span>{c.icon}</span>
                        <span>{c.name}</span>
                      </span>
                      {c.tag && (
                        <span className="ml-2 text-[10px] text-[var(--text-muted)] font-normal">
                          {c.tag}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Direct Instant Action */}
            <div className="border-t border-[var(--border-card)] pt-2 flex items-center justify-between text-xs text-[var(--text-muted)] px-2">
              <span>Over {totalLeads.toLocaleString("en-IN")} verified listings ready</span>
              <Link
                href="/explore"
                className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Browse All Directory →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
