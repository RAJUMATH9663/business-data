import Image from "next/image";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import LogoutButton from "./LogoutButton";
import ThemeToggle from "./ThemeToggle";

export default async function Navbar() {
  const s = await getSession();
  const links = [
    { href: "/leads", label: "Directory", icon: "📍" },
    { href: "/explore", label: "Explore Data", icon: "🔎" },
    { href: "/purchases", label: "My Purchases", icon: "🧾" },
    s ? { href: "/account", label: "Account", icon: "👤" } : { href: "/login", label: "Login", icon: "👤" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--header-border)] bg-[var(--header-bg)] backdrop-blur-md transition-all shadow-sm">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className="group flex items-center gap-2.5">
            <Image
              src="/logo.png"
              alt="NivoLeads"
              width={240}
              height={64}
              className="h-12 sm:h-14 w-auto rounded-xl object-contain transition-transform duration-200 group-hover:scale-105"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1.5 md:flex" aria-label="Main">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-xl px-3.5 py-2 text-sm font-semibold text-[var(--text-muted)] transition-colors hover:bg-[var(--tile-hover)] hover:text-[var(--text-main)]"
              >
                {l.label}
              </Link>
            ))}

            {s?.user.role === "ADMIN" && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-500/10 px-3.5 py-2 text-sm font-semibold text-indigo-400 hover:bg-indigo-500/20 transition-colors"
              >
                <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                Admin Panel
              </Link>
            )}

            <div className="ml-2 flex items-center gap-2 border-l border-[var(--border-card)] pl-3">
              <ThemeToggle />

              {s ? (
                <LogoutButton className="btn btn-ghost !min-h-[38px] !px-3.5 !py-1.5 !text-xs font-semibold text-[var(--text-muted)] hover:text-rose-500" />
              ) : (
                <Link href="/register" className="btn btn-primary !min-h-[38px] !px-4 !py-1.5 !text-sm">
                  Register Free
                </Link>
              )}
            </div>
          </nav>

          {/* Mobile Right CTA */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            {s?.user.role === "ADMIN" && (
              <Link href="/admin" className="rounded-lg bg-indigo-500/10 px-2.5 py-1 text-xs font-semibold text-indigo-400">
                Admin
              </Link>
            )}
            <Link href="/explore" className="btn btn-primary !min-h-[36px] !px-3.5 !py-1.5 !text-xs">
              Explore
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        aria-label="Mobile"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-[var(--border-card)] bg-[var(--header-bg)] pb-[env(safe-area-inset-bottom)] backdrop-blur-lg md:hidden shadow-lg"
      >
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="flex min-h-[58px] flex-col items-center justify-center gap-1 text-[11px] font-semibold text-[var(--text-muted)] transition-colors active:text-brand"
          >
            <span className="text-xl leading-none">{l.icon}</span>
            <span>{l.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
