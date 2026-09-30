"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialToken = searchParams.get("token") || "";

  const [token, setToken] = useState(initialToken);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!token.trim()) {
      setError("Password reset token is required. Please use the reset link sent to your email.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setBusy(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reset password.");

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2500);
    } catch (err) {
      setError((err as Error).message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card fade-in mx-auto w-full max-w-md p-8 sm:p-10 shadow-xl border border-[var(--border-card)]">
      <div className="text-center">
        <div className="mx-auto flex justify-center mb-4">
          <Image
            src="/logo.png"
            alt="NivoLeads"
            width={240}
            height={64}
            className="h-14 w-auto rounded-xl object-contain shadow-md"
            priority
          />
        </div>
        <h1 className="text-2xl font-bold text-[var(--text-main)]">Set New Password</h1>
        <p className="mt-1.5 text-xs text-[var(--text-muted)] leading-relaxed">
          Create a new secure password for your NivoLeads account.
        </p>
      </div>

      {success ? (
        <div className="mt-6 space-y-4 text-center">
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            🎉 Password reset successfully! Redirecting you to login…
          </div>
          <Link href="/login" className="btn btn-primary w-full !py-2.5 !text-xs mt-2 block">
            Click here if not redirected →
          </Link>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-6 space-y-4">
          {!initialToken && (
            <div>
              <label className="label" htmlFor="token">
                Reset Token
              </label>
              <input
                id="token"
                name="token"
                type="text"
                className="input font-mono text-xs"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste the token from your reset link"
              />
            </div>
          )}

          <div>
            <label className="label" htmlFor="password">
              New Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="input"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="label" htmlFor="confirmPassword">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className="input"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-type your new password"
              autoComplete="new-password"
            />
          </div>

          {error && (
            <div role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-semibold text-rose-500">
              ⚠️ {error}
            </div>
          )}

          <button className="btn btn-primary w-full !py-3 !text-sm mt-2" disabled={busy}>
            {busy ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Updating password…
              </span>
            ) : (
              "Update Password & Log In"
            )}
          </button>

          <div className="pt-2 text-center text-xs text-[var(--text-muted)]">
            <Link href="/login" className="font-semibold text-blue-500 hover:underline">
              ← Cancel and return to login
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="card mx-auto max-w-md p-8 text-center text-xs text-[var(--text-muted)]">Loading reset form…</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
