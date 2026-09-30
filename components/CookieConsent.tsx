"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CookieConsent() {
  const [accepted, setAccepted] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("nl_cookie_consent");
      if (!stored) {
        setAccepted(false);
      }
    } catch {
      // localStorage may fail in certain restricted iframe/privacy modes
    }
  }, []);

  function handleAccept() {
    try {
      localStorage.setItem("nl_cookie_consent", "true");
    } catch {
      // ignore
    }
    setAccepted(true);
  }

  if (accepted) return null;

  return (
    <aside aria-label="Cookie Consent" className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-2xl animate-fade-in">
      <div className="card flex flex-col items-start justify-between gap-4 p-4 shadow-2xl border border-[var(--border-card)] sm:flex-row sm:items-center bg-[var(--header-bg)] backdrop-blur-md">
        <div className="text-xs text-[var(--text-muted)] leading-relaxed">
          🍪 We use essential cookies to maintain your secure session and deliver purchased data. Read our{" "}
          <Link href="/privacy" className="font-semibold text-blue-500 hover:underline">
            Privacy Policy
          </Link>.
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={handleAccept}
            className="btn btn-primary !min-h-[34px] !px-4 !py-1 !text-xs whitespace-nowrap"
          >
            Accept & Continue
          </button>
        </div>
      </div>
    </aside>
  );
}
