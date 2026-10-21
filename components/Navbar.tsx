import Image from "next/image";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import LogoutButton from "./LogoutButton";
import ThemeToggle from "./ThemeToggle";
import MobileNavDrawer from "./MobileNavDrawer";
import NavDropdowns from "./NavDropdowns";

export default async function Navbar() {
  const s = await getSession();
  const links = s
    ? [
        { href: "/directory", label: "Directory", icon: "📖" },
        { href: "/explore", label: "Explore", icon: "🔍" },
        { href: "/purchases", label: "Orders", icon: "📦" },
        { href: "/account", label: "Account", icon: "👤" },
      ]
    : [
        { href: "/directory", label: "Directory", icon: "📖" },
        { href: "/explore", label: "Explore", icon: "🔍" },
        { href: "/login", label: "Login", icon: "🔑" },
      ];

  return (
    <>
      {/* Floating Island Header */}
      <header className="sticky top-3 z-50 w-full px-3 sm:px-6">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2.5 rounded-2xl border border-[var(--border-card)]/80 bg-[var(--header-bg)]/90 px-3.5 sm:px-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.35)] backdrop-blur-xl transition-all">
          {/* Brand Logo */}
          <Link href="/" className="group flex items-center gap-2 shrink-0">
            <Image
              src="/logo.png"
              alt="NivoLeads B2B"
              width={160}
              height={40}
              className="h-8 w-auto rounded-lg object-contain transition-transform duration-200 group-hover:scale-105"
              priority
            />
            <span className="hidden lg:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              16,746 Leads
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            <Link
              href="/directory"
              className="rounded-xl px-2.5 py-1.5 text-xs font-semibold text-[var(--text-muted)] transition-all hover:bg-[var(--tile-hover)] hover:text-[var(--text-main)]"
            >
              Directory
            </Link>

            {/* Interactive City & Category Mega-Popovers */}
            <NavDropdowns />

            <Link
              href="/explore"
              className="rounded-xl px-2.5 py-1.5 text-xs font-semibold text-[var(--text-muted)] transition-all hover:bg-[var(--tile-hover)] hover:text-[var(--text-main)]"
            >
              Explore
            </Link>

            {s && (
              <>
                <Link
                  href="/purchases"
                  className="rounded-xl px-2.5 py-1.5 text-xs font-semibold text-[var(--text-muted)] transition-all hover:bg-[var(--tile-hover)] hover:text-[var(--text-main)]"
                >
                  Orders
                </Link>
                <Link
                  href="/account"
                  className="rounded-xl px-2.5 py-1.5 text-xs font-semibold text-[var(--text-muted)] transition-all hover:bg-[var(--tile-hover)] hover:text-[var(--text-main)]"
                >
                  Account
                </Link>
              </>
            )}

            <Link
              href="/list-business"
              className="ml-1 inline-flex items-center gap-1 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 transition-all hover:bg-emerald-500/20 hover:scale-[1.02]"
            >
              <span>+ Add Business</span>
            </Link>

            {s?.user.role === "ADMIN" && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-400 transition-all hover:bg-indigo-500/20"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                Admin
              </Link>
            )}

            <div className="ml-2 flex items-center gap-1.5 border-l border-[var(--border-card)]/70 pl-2.5">
              <ThemeToggle />

              {s ? (
                <LogoutButton className="btn btn-ghost !min-h-[34px] !px-3 !py-1 !text-xs font-semibold text-[var(--text-muted)] hover:text-rose-500" />
              ) : (
                <Link
                  href="/register"
                  className="btn btn-primary !min-h-[36px] !px-3.5 !py-1.5 !text-xs !font-semibold rounded-xl shadow-sm hover:shadow transition-all"
                >
                  Register Free
                </Link>
              )}
            </div>
          </nav>

          {/* Mobile Actions: Add Business + Theme + Hamburger Drawer */}
          <div className="flex items-center gap-1.5 md:hidden">
            <Link
              href="/list-business"
              className="inline-flex items-center rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 transition-all active:scale-95"
            >
              + Add
            </Link>
            <ThemeToggle />
            <MobileNavDrawer
              links={links}
              user={s ? { role: s.user.role, email: s.user.email } : null}
            />
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Logged in only) */}
      {s && (
        <nav
          aria-label="Mobile"
          className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-[var(--border-card)] bg-[var(--header-bg)] pb-[env(safe-area-inset-bottom)] backdrop-blur-lg md:hidden shadow-lg"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex min-h-[56px] flex-col items-center justify-center gap-1 text-[11px] font-semibold text-[var(--text-muted)] transition-colors active:text-brand"
            >
              <span className="text-lg leading-none">{l.icon}</span>
              <span>{l.label}</span>
            </Link>
          ))}
        </nav>
      )}
    </>
  );
}
