"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AuthForm({ mode, next }: { mode: "login" | "register"; next?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const isReg = mode === "register";

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const body = Object.fromEntries(fd.entries());
    try {
      const r = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Something went wrong");
      const dest = next && next.startsWith("/") && !next.startsWith("//") ? next : j.role === "ADMIN" ? "/admin" : "/purchases";
      router.push(dest);
      router.refresh();
    } catch (err) {
      setError(err instanceof TypeError ? "Network error. Check your connection and try again." : (err as Error).message);
      setBusy(false);
    }
  }

  const q = next ? `?next=${encodeURIComponent(next)}` : "";

  return (
    <div className="card fade-in mx-auto w-full max-w-md p-8 sm:p-10">
      <div className="text-center">
        <div className="mx-auto flex justify-center">
          <Image
            src="/logo.png"
            alt="NivoLeads"
            width={260}
            height={70}
            className="h-16 sm:h-20 w-auto rounded-xl object-contain shadow-md"
            priority
          />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-[var(--text-main)]">
          {isReg ? "Create your NivoLeads account" : "Welcome back to NivoLeads"}
        </h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          {isReg ? "Register once to browse and unlock verified contacts." : "Sign in to access your purchased datasets."}
        </p>
      </div>

      <form onSubmit={submit} className="mt-6 space-y-4">
        {isReg && (
          <div>
            <label className="label" htmlFor="name">
              Full name
            </label>
            <input
              id="name"
              name="name"
              className="input"
              required
              minLength={2}
              placeholder="e.g. Ramesh Kumar"
              autoComplete="name"
            />
          </div>
        )}

        <div>
          <label className="label" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="input"
            required
            placeholder="you@company.com"
            autoComplete="email"
          />
        </div>

        {isReg && (
          <div>
            <label className="label" htmlFor="phone">
              Mobile number (optional)
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              className="input"
              placeholder="10-digit mobile number"
              autoComplete="tel"
            />
          </div>
        )}

        <div>
          <div className="flex items-center justify-between">
            <label className="label" htmlFor="password">
              Password
            </label>
            {!isReg && (
              <Link href="/forgot-password" className="text-xs text-blue-500 hover:underline font-medium">
                Forgot password?
              </Link>
            )}
          </div>
          <input
            id="password"
            name="password"
            type="password"
            className="input"
            required
            minLength={isReg ? 8 : 1}
            placeholder={isReg ? "At least 8 characters" : "Enter your password"}
            autoComplete={isReg ? "new-password" : "current-password"}
          />
        </div>

        {error && (
          <div role="alert" className="fade-in rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-semibold text-rose-500">
            ⚠️ {error}
          </div>
        )}

        <button className="btn btn-primary w-full !py-3 !text-sm mt-2" disabled={busy}>
          {busy ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Please wait…
            </span>
          ) : isReg ? (
            "Create Account"
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <div className="mt-6 border-t border-[var(--border-card)] pt-4 text-center text-xs text-[var(--text-muted)]">
        {isReg ? (
          <>
            Already registered?{" "}
            <Link href={`/login${q}`} className="font-semibold text-blue-500 hover:underline">
              Sign in here
            </Link>
          </>
        ) : (
          <>
            Need an account?{" "}
            <Link href={`/register${q}`} className="font-semibold text-blue-500 hover:underline">
              Register now
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
