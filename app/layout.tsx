import type { Metadata, Viewport } from "next";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CookieConsent from "@/components/CookieConsent";
import { getAppUrl } from "@/lib/seo";

const appUrl = getAppUrl();

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Karnataka Trade Directory | Verified B2B Enterprise Index & Commercial Listings",
    template: "%s · Karnataka Trade Directory",
  },
  description:
    "Explore verified commercial business listings, enterprise directory profiles, and local trade registries across all 31 districts of Karnataka. Instant Excel export for B2B procurement and market research.",
  keywords: [
    "Karnataka trade directory",
    "Karnataka business directory",
    "B2B commerce directory Karnataka",
    "Karnataka merchant index",
    "commercial enterprise listings Karnataka",
    "local business directory Karnataka",
    "verified business profiles Karnataka",
    "Karnataka industry registry",
    "B2B marketplace Karnataka",
    "Karnataka wholesale and retail directory",
    "business listings by district",
    "commercial trade index Karnataka",
    // 📍 Karnataka Districts & Regions
    "Bengaluru business directory",
    "Belagavi trade directory",
    "Mysuru commercial directory",
    "Ballari trade directory",
    "Bagalkote enterprise directory",
    "Hubballi Dharwad business directory",
    "Vijayapura commercial directory",
    "Mangaluru trade directory",

    // 🚀 Brand Keywords
    "Karnataka Trade Directory",
    "Karnataka B2B Directory",
    "Karnataka Commerce Index",
    "Karnataka Merchant Registry",
    "Karnataka Business Portal",
  ],
  authors: [{ name: "Karnataka Trade Directory Team" }],
  creator: "Karnataka Trade Directory",
  publisher: "Karnataka Trade Directory",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: appUrl,
    siteName: "Karnataka Trade Directory",
    title: "Karnataka Trade Directory | Verified B2B Enterprise Index & Commercial Listings",
    description:
      "Explore verified commercial enterprise directory profiles, registered businesses, and local trade listings across all 31 districts of Karnataka.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Karnataka Trade Directory — B2B Enterprise Index & Commercial Listings",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Karnataka Trade Directory | Verified B2B Enterprise Index & Commercial Listings",
    description:
      "Explore verified commercial enterprise directory profiles, registered businesses, and local trade listings across all 31 districts of Karnataka.",
    images: ["/logo.png"],
  },
  alternates: {
    canonical: appUrl,
  },
  verification: {
    google: [
      "07b99ac8ae838322",
      "X3ZYshAQpt9UDruysLXUYc3bIVUchhoj7cOBCE1gz0E",
      process.env.GOOGLE_SITE_VERIFICATION,
    ].filter(Boolean) as string[],
  },
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Karnataka, India",
    "target-country": "IN",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": `${appUrl}/#organization`,
                  name: "Karnataka Trade Directory",
                  url: appUrl,
                  logo: `${appUrl}/logo.png`,
                  description:
                    "Verified commercial enterprise directory profiles, trade listings, and business registry across 31 Karnataka districts and 20 core industry sectors.",
                  contactPoint: {
                    "@type": "ContactPoint",
                    contactType: "Customer Support",
                    email: "support@karnatakatradedirectory.com",
                  },
                },
                {
                  "@type": "WebSite",
                  "@id": `${appUrl}/#website`,
                  url: appUrl,
                  name: "Karnataka Trade Directory",
                  description: "Verified B2B Business Directory & Commercial Enterprise Registry in Karnataka",
                  publisher: {
                    "@id": `${appUrl}/#organization`,
                  },
                  potentialAction: {
                    "@type": "SearchAction",
                    target: {
                      "@type": "EntryPoint",
                      urlTemplate: `${appUrl}/explore?d={search_term_string}`,
                    },
                    "query-input": "required name=search_term_string",
                  },
                },
              ],
            }),
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

        <footer className="border-t border-[var(--border-card)] bg-[var(--header-bg)] backdrop-blur-sm py-10 text-xs text-[var(--text-muted)]">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Karnataka Trade Directory"
                width={40}
                height={40}
                className="h-10 w-10 rounded-xl object-contain shadow-sm"
              />
              <div>
                <div className="text-base font-bold text-[var(--text-main)]">Karnataka <span className="text-blue-500">Trade Directory</span></div>
                <div className="text-[var(--text-muted)]">Verified B2B Commercial Enterprise Registry</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
              <Link href="/about" className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                About Us
              </Link>
              <span>·</span>
              <Link href="/directory" className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                Directory
              </Link>
              <span>·</span>
              <Link href="/explore" className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                Explore Directory
              </Link>
              <span>·</span>
              <Link href="/terms" className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                Terms of Service
              </Link>
              <span>·</span>
              <Link href="/privacy" className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                Privacy Policy
              </Link>
              <span>·</span>
              <Link href="/refund-policy" className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                Refund Policy
              </Link>
              <span>·</span>
              <Link href="/shipping-policy" className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                Shipping & Delivery
              </Link>
              <span>·</span>
              <Link href="/contact" className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                Contact Us
              </Link>
            </div>

            <div className="text-center sm:text-right text-[var(--text-muted)]">
              © {new Date().getFullYear()} Karnataka Trade Directory. All rights reserved.
            </div>
          </div>
        </footer>

        <CookieConsent />
      </body>
    </html>
  );
}
