"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

interface NavLink {
  href: string;
  label: string;
  icon?: string;
}

interface MobileNavDrawerProps {
  links: NavLink[];
  user: { role?: string; email?: string } | null;
}

export default function MobileNavDrawer({ links, user }: MobileNavDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<"cities" | "categories" | null>(null);

  // Close when window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const close = () => setIsOpen(false);

  return (
    <div className="md:hidden">
      {/* Hamburger / Close Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
        className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--tile-hover)] border border-[var(--border-card)]/60 text-[var(--text-main)] transition-all hover:bg-[var(--border-card)]/30 active:scale-95"
      >
        {isOpen ? (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        )}
      </button>

      {/* Backdrop overlay */}
      {isOpen && (
        <div
          onClick={close}
          className="fixed inset-0 top-[76px] z-40 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      {/* Dropdown Floating Card */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Mobile Navigation"
          className="fixed inset-x-3 top-[74px] z-50 max-h-[calc(100vh-90px)] overflow-y-auto rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-4 shadow-2xl backdrop-blur-2xl transition-all animate-in slide-in-from-top-2 duration-200"
        >
          <div className="flex flex-col gap-1.5">
            {/* Primary Nav Links */}
            <div className="space-y-1 pb-3 border-b border-[var(--border-card)]/60">
              <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Menu
              </span>
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={close}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[var(--text-main)] hover:bg-[var(--tile-hover)] transition-colors active:bg-[var(--tile-hover)]"
                >
                  {link.icon && <span className="text-base leading-none">{link.icon}</span>}
                  <span>{link.label}</span>
                </Link>
              ))}

              {/* Expandable: Cities */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setExpandedSection(expandedSection === "cities" ? null : "cities")}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold text-[var(--text-main)] hover:bg-[var(--tile-hover)]"
                >
                  <span className="flex items-center gap-2.5">
                    <span>📍</span>
                    <span>Browse by City</span>
                  </span>
                  <span className="text-xs font-bold text-blue-500">
                    {expandedSection === "cities" ? "▲" : "▼ 31 Cities"}
                  </span>
                </button>
                {expandedSection === "cities" && (
                  <div className="mt-1 grid grid-cols-2 gap-1.5 p-2 bg-[var(--tile-hover)]/40 rounded-xl">
                    {[
                      { name: "Bengaluru Urban", slug: "bengaluru-urban" },
                      { name: "Bengaluru Rural", slug: "bengaluru-rural" },
                      { name: "Mysuru", slug: "mysuru" },
                      { name: "Hubballi-Dharwad", slug: "dharwad" },
                      { name: "Belagavi", slug: "belagavi" },
                      { name: "Mangaluru (D.K.)", slug: "dakshina-kannada" },
                      { name: "Tumakuru", slug: "tumakuru" },
                      { name: "Udupi", slug: "udupi" },
                    ].map((c) => (
                      <Link
                        key={c.slug}
                        href={`/directory?district=${c.slug}`}
                        onClick={close}
                        className="rounded-lg bg-[var(--bg-card)] px-2.5 py-1.5 text-xs font-medium text-[var(--text-main)] hover:text-blue-500 truncate"
                      >
                        {c.name}
                      </Link>
                    ))}
                    <Link
                      href="/directory"
                      onClick={close}
                      className="col-span-2 text-center text-[11px] font-bold text-blue-500 py-1"
                    >
                      View All 31 Districts →
                    </Link>
                  </div>
                )}
              </div>

              {/* Expandable: Categories */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setExpandedSection(expandedSection === "categories" ? null : "categories")}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold text-[var(--text-main)] hover:bg-[var(--tile-hover)]"
                >
                  <span className="flex items-center gap-2.5">
                    <span>🏢</span>
                    <span>Browse by Industry</span>
                  </span>
                  <span className="text-xs font-bold text-purple-500">
                    {expandedSection === "categories" ? "▲" : "▼ 28+ Sectors"}
                  </span>
                </button>
                {expandedSection === "categories" && (
                  <div className="mt-1 grid grid-cols-2 gap-1.5 p-2 bg-[var(--tile-hover)]/40 rounded-xl">
                    {[
                      { name: "IT & Software", slug: "it-software-companies", icon: "💻" },
                      { name: "Manufacturing", slug: "manufacturing-industries", icon: "🏭" },
                      { name: "Hospitals", slug: "hospitals-clinics", icon: "🏥" },
                      { name: "Automobile", slug: "automobile-dealers", icon: "🚗" },
                      { name: "Real Estate", slug: "real-estate", icon: "🏠" },
                      { name: "Retail & Trade", slug: "retail-supermarkets", icon: "🛒" },
                    ].map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/explore?category=${cat.slug}`}
                        onClick={close}
                        className="flex items-center gap-1.5 rounded-lg bg-[var(--bg-card)] px-2 py-1.5 text-xs font-medium text-[var(--text-main)] hover:text-purple-500 truncate"
                      >
                        <span>{cat.icon}</span>
                        <span className="truncate">{cat.name}</span>
                      </Link>
                    ))}
                    <Link
                      href="/explore"
                      onClick={close}
                      className="col-span-2 text-center text-[11px] font-bold text-purple-500 py-1"
                    >
                      Explore All Categories →
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/list-business"
                onClick={close}
                className="flex items-center gap-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-2.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors"
              >
                <span className="text-base leading-none">✨</span>
                <span>+ Add Business</span>
                <span className="ml-auto text-[10px] font-bold uppercase tracking-wide bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                  Free
                </span>
              </Link>

              {user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  onClick={close}
                  className="flex items-center gap-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 px-3 py-2.5 text-sm font-semibold text-indigo-400 hover:bg-indigo-500/20 transition-colors"
                >
                  <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                  <span>Admin Dashboard</span>
                </Link>
              )}
            </div>

            {/* Quick Actions / Auth */}
            <div className="pt-2">
              {user ? (
                <div className="flex items-center justify-between gap-3 pt-1">
                  <div className="truncate text-xs text-[var(--text-muted)]">
                    Signed in as <span className="font-semibold text-[var(--text-main)]">{user.email || "User"}</span>
                  </div>
                  <LogoutButton className="btn btn-ghost !min-h-[36px] !px-3.5 !py-1 text-xs font-semibold text-rose-500 hover:bg-rose-500/10" />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    href="/login"
                    onClick={close}
                    className="btn btn-ghost !min-h-[40px] text-xs font-semibold text-center rounded-xl border border-[var(--border-card)]"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    onClick={close}
                    className="btn btn-primary !min-h-[40px] text-xs font-semibold text-center rounded-xl shadow-sm"
                  >
                    Register Free
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
