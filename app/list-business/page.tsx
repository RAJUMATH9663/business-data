import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import ListBusinessForm from "./ListBusinessForm";

export const revalidate = 3600; // 1 hour cache on Edge CDN

export const metadata: Metadata = {
  title: "List Your Business Free — Connect with B2B Buyers in Karnataka | NivoLeads",
  description:
    "List your business listing on NivoLeads for 100% free. Reach thousands of verified B2B buyers, tele-calling teams, and commercial partners across all 31 districts of Karnataka.",
  keywords: [
    "list business free Karnataka",
    "free business listing Karnataka",
    "add business directory Karnataka",
    "register company Karnataka",
    "B2B business promotion Karnataka",
  ],
  alternates: {
    canonical: "/list-business",
  },
  openGraph: {
    title: "List Your Business Free — Connect with B2B Buyers in Karnataka | NivoLeads",
    description:
      "List your business listing on NivoLeads for 100% free. Reach thousands of verified B2B buyers, tele-calling teams, and commercial partners across all 31 districts of Karnataka.",
    url: "/list-business",
  },
};

export default async function ListBusinessPage() {
  const [districts, categories] = await Promise.all([
    prisma.district.findMany({
      where: { status: "ACTIVE" },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: { id: true, name: true, slug: true, code: true },
    }),
    prisma.category.findMany({
      where: { status: "ACTIVE" },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: { id: true, name: true, slug: true, icon: true },
    }),
  ]);

  return (
    <div className="mx-auto max-w-4xl space-y-10 py-6 sm:py-10">
      {/* Navigation Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
        <Link href="/" className="hover:text-[var(--text-main)] transition-colors">Home</Link>
        <span>/</span>
        <span className="text-[var(--text-main)] font-semibold">List Business Free</span>
      </nav>

      {/* Hero Header */}
      <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-[var(--bg-card)] to-[var(--bg-mist)] p-6 sm:p-10 shadow-sm text-center md:text-left">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              🚀 100% Free · Get Discovered across 31 Districts
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-main)]">
              List Your Business Free on NivoLeads
            </h1>
            <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
              Get direct inquiries, leads, and orders from active B2B buyers and commercial clients across Karnataka. Takes under 1 minute.
            </p>
          </div>
          <div className="flex flex-col gap-2 shrink-0 text-center">
            <div className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-4 shadow-xs">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">₹0 Fee</div>
              <div className="text-xs text-[var(--text-muted)] mt-0.5">Free Business Promotion</div>
            </div>
          </div>
        </div>

        {/* Benefits Badges */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[var(--border-card)] pt-6 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
              ✓
            </span>
            <div>
              <div className="text-xs font-bold text-[var(--text-main)]">Verified Listing</div>
              <div className="text-[11px] text-[var(--text-muted)]">Indexed in Karnataka Directory</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold">
              📱
            </span>
            <div>
              <div className="text-xs font-bold text-[var(--text-main)]">Direct WhatsApp Calls</div>
              <div className="text-[11px] text-[var(--text-muted)]">Connect directly with buyers</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold">
              ⚡
            </span>
            <div>
              <div className="text-xs font-bold text-[var(--text-main)]">Instant Approval</div>
              <div className="text-[11px] text-[var(--text-muted)]">Live immediately after submission</div>
            </div>
          </div>
        </div>
      </div>

      {/* Free Registration Form */}
      <ListBusinessForm districts={districts} categories={categories} />
    </div>
  );
}
