"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to process request");

      setSuccess(true);
      if (data.resetUrl) {
        setDevResetUrl(data.resetUrl);
      }
    } catch (err) {
      setError((err as Error).message || "Something went wrong. Please try again.");
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
        <h1 className="text-2xl font-bold text-[var(--text-main)]">Reset Your Password</h1>
        <p className="mt-1.5 text-xs text-[var(--text-muted)] leading-relaxed">
          Enter your registered email address and we will generate a secure link to reset your account password.
        </p>
      </div>

      {success ? (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400 leading-relaxed">
            ✅ If an account exists for <span className="font-bold underline">{email}</span>, password reset instructions have been generated.
          </div>

          {devResetUrl && (
            <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 text-xs space-y-2">
              <div className="font-bold text-blue-500">🧪 Local Development Reset Shortcut:</div>
              <p className="text-[var(--text-muted)]">Click the button below to directly set your new password:</p>
              <Link
                href={devResetUrl}
                className="btn btn-primary w-full !py-2.5 !text-xs block text-center mt-2"
              >
                Proceed to Reset Password →
              </Link>
            </div>
          )}

          <div className="pt-2 text-center">
            <Link href="/login" className="btn btn-ghost w-full !text-xs">
              ← Return to Login
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="label" htmlFor="email">
              Registered Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="input"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              autoComplete="email"
              autoFocus
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
                Generating reset link…
              </span>
            ) : (
              "Send Password Reset Link"
            )}
          </button>

          <div className="pt-2 text-center text-xs text-[var(--text-muted)]">
            Remembered your password?{" "}
            <Link href="/login" className="font-semibold text-blue-500 hover:underline">
              Back to login
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
