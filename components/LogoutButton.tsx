"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton({ className = "btn btn-ghost" }: { className?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <button
      className={className}
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          await fetch("/api/auth/logout", { method: "POST" });
        } finally {
          router.push("/");
          router.refresh();
        }
      }}
    >
      {busy ? "Signing out…" : "Log out"}
    </button>
  );
}
