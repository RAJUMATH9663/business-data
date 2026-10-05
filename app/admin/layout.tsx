import Link from "next/link";
import { requireAdmin } from "@/lib/auth";

const links = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/districts", label: "Districts", icon: "📍" },
  { href: "/admin/categories", label: "Categories", icon: "🗂️" },
  { href: "/admin/businesses", label: "Business Data", icon: "🏢" },
  { href: "/admin/import", label: "Excel Import", icon: "📥", highlight: true },
  { href: "/admin/orders", label: "Orders", icon: "🧾" },
  { href: "/admin/customers", label: "Customers", icon: "👥" },
  { href: "/admin/pricing", label: "Pricing", icon: "🏷️" },
  { href: "/admin/security", label: "Security", icon: "🛡️" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="space-y-6">
      {/* Admin Header & Navigation */}
      <div className="card p-4">
        <div className="flex flex-col gap-3 pb-3 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--border-card)]">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white shadow-sm [forced-color-adjust:none]">
              ⚡
            </span>
            <span className="text-sm font-bold text-[var(--text-main)]">Admin Control Center</span>
            <span className="badge-brand">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/api/admin/export"
              download
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 transition-colors"
            >
              <span>📊</span>
              <span>Download All Listings (Excel)</span>
            </a>
          </div>
        </div>

        <nav aria-label="Admin" className="-mx-4 overflow-x-auto px-4 pt-3">
          <ul className="flex w-max gap-1.5 pb-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all duration-150 whitespace-nowrap ${
                    link.highlight
                      ? "bg-blue-500/15 text-blue-500 hover:bg-blue-500/25 border border-blue-500/30 shadow-sm"
                      : "text-[var(--text-muted)] hover:bg-[var(--tile-hover)] hover:text-[var(--text-main)] border border-transparent"
                  }`}
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Admin Page Content */}
      <div>{children}</div>
    </div>
  );
}
