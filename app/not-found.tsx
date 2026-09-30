import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="card fade-in mx-auto my-12 max-w-lg p-8 sm:p-12 text-center shadow-xl border border-[var(--border-card)]">
      <div className="mx-auto flex justify-center mb-6">
        <Image
          src="/logo.png"
          alt="NivoLeads"
          width={180}
          height={48}
          className="h-12 w-auto object-contain"
        />
      </div>
      
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-3xl text-blue-500 mb-4">
        🧭
      </div>

      <h1 className="text-3xl font-black tracking-tight text-[var(--text-main)] sm:text-4xl">
        404 — Page Not Found
      </h1>
      
      <p className="mt-3 text-sm text-[var(--text-muted)] leading-relaxed">
        The page or dataset link you are looking for might have been moved, renamed, or is temporarily unavailable.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link href="/explore" className="btn btn-primary w-full sm:w-auto !px-6 !py-3 !text-sm">
          🔍 Explore Business Leads
        </Link>
        <Link href="/" className="btn btn-ghost w-full sm:w-auto !px-6 !py-3 !text-sm">
          🏠 Return to Homepage
        </Link>
      </div>

      <div className="mt-8 pt-6 border-t border-[var(--border-card)] text-xs text-[var(--text-muted)]">
        Need assistance? <Link href="/contact" className="text-blue-500 hover:underline font-semibold">Contact Support</Link>
      </div>
    </div>
  );
}
