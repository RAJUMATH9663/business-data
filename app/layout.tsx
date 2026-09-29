import type { Metadata, Viewport } from "next";
import Image from "next/image";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: { default: "LeadSetu | B2B & Verified Business Directory", template: "%s · LeadSetu" },
  description: "Instant access to verified business contacts and decision makers across all 31 districts and 20+ industries on LeadSetu.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563EB",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="color-scheme" content="light dark" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem("kbd_theme");var p=window.matchMedia("(prefers-color-scheme: dark)").matches;var t=s||(p?"dark":"light");document.documentElement.setAttribute("data-theme",t);document.documentElement.style.colorScheme=t;}catch(e){}})();`,
          }}
        />
      </head>
      <body className="relative bg-[var(--bg-page)] text-[var(--text-main)] selection:bg-brand/20 selection:text-brand">
        {/* Subtle decorative background ambient glow */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-blue-600/10 via-indigo-600/10 to-transparent blur-3xl" />
          <div className="absolute top-1/2 -right-40 h-[400px] w-[500px] rounded-full bg-gradient-to-bl from-amber-500/5 to-transparent blur-3xl" />
        </div>

        <Navbar />
        
        <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6 sm:px-6 md:pb-16 md:pt-8">
          {children}
        </main>

        <footer className="border-t border-[var(--border-card)] bg-[var(--header-bg)] backdrop-blur-sm py-8 text-xs text-[var(--text-muted)]">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
            <div className="flex items-center gap-2.5">
              <Image
                src="/leadsetu-icon.png"
                alt="LeadSetu"
                width={28}
                height={28}
                className="h-7 w-7 rounded-lg object-contain shadow-sm"
              />
              <span className="font-bold text-[var(--text-main)]">Lead<span className="text-blue-500">Setu</span></span>
              <span className="text-[var(--text-muted)]">· Verified B2B Directory</span>
            </div>
            <div className="text-center sm:text-right text-[var(--text-muted)]">
              © {new Date().getFullYear()} LeadSetu. All rights reserved. Licensed verified contacts.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
