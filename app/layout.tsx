import type { Metadata, Viewport } from "next";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CookieConsent from "@/components/CookieConsent";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://nivoleads.com";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "NivoLeads | Global Business Leads, B2B Contacts & Company Phone Numbers",
    template: "%s · NivoLeads",
  },
  description:
    "Access verified business phone numbers, B2B company leads, and decision-maker databases across the US, India, and global markets. Filter by country, city, and industry for instant Excel downloads.",
  keywords: [
    // 🌎 Global Primary Keywords
    "business phone numbers",
    "business contact numbers",
    "business contact database",
    "business contact list",
    "company phone numbers",
    "company contact database",
    "company contact list",
    "business leads",
    "B2B leads",
    "B2B contact database",
    "business leads database",
    "business directory",
    "local business contacts",
    "business prospects",
    "business leads by industry",
    "business leads by location",
    "business database",
    "company database",
    "local business leads",
    "verified business contacts",

    // 🇺🇸 US-Focused Keywords
    "US business phone numbers",
    "USA business phone numbers",
    "US business contacts",
    "USA business contacts",
    "US business contact database",
    "USA business contact database",
    "US B2B leads",
    "USA B2B leads",
    "US company phone numbers",
    "USA company contact list",
    "US business leads",
    "USA business leads",
    "American business directory",
    "US local business leads",
    "US company database",

    // 🏥 Industry + Country Keywords
    "US hospital phone numbers",
    "US hospital contact list",
    "USA hospital contacts",
    "US clinic phone numbers",
    "US real estate company contacts",
    "US construction company contacts",
    "US restaurant contacts",
    "US hotel contact numbers",
    "US IT company contacts",
    "US software company contacts",
    "US marketing agency contacts",
    "US manufacturing company contacts",
    "US automobile dealer contacts",
    "US logistics company contacts",
    "US travel company contacts",

    // 📍 Global Cities & Regions
    "New York business contacts",
    "New York hospital contacts",
    "New York real estate leads",
    "Los Angeles business contacts",
    "Chicago business leads",
    "Houston business contacts",
    "Karnataka business leads",
    "Karnataka business database",
    "Karnataka business directory",
    "Karnataka B2B leads",
    "Bengaluru business leads",
    "Vijayapura business leads",
    "Mumbai business leads",
    "Delhi business contacts",

    // 👨‍💻 Freelancer & Agency Intent Keywords
    "business contacts for freelancers",
    "business leads for freelancers",
    "US leads for freelancers",
    "USA client leads",
    "US business leads for freelancers",
    "business contacts for digital marketers",
    "leads for web designers",
    "leads for SEO agencies",
    "leads for marketing agencies",
    "local business leads for agencies",
    "potential clients for freelancers",
    "B2B leads for agencies",
    "company contacts for sales prospecting",

    // 🚀 Brand Keywords
    "NivoLeads",
    "Nivo Leads",
    "Nivoleads India",
    "Nivoleads USA",
    "Nivoleads business leads",
    "Nivoleads business database",
    "Nivoleads global",
    "Nivoleads B2B leads",
  ],
  authors: [{ name: "NivoLeads Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: appUrl,
    siteName: "NivoLeads",
    title: "NivoLeads | Global Business Leads, B2B Contacts & Company Phone Numbers",
    description:
      "Access verified business phone numbers, decision makers, and company contact directories across the US, India, and international markets.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "NivoLeads — Global Business Leads & Contact Database",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NivoLeads | Global Business Leads, B2B Contacts & Company Phone Numbers",
    description:
      "Access verified business phone numbers, decision makers, and company contact directories across the US, India, and international markets.",
    images: ["/logo.png"],
  },
  alternates: {
    canonical: appUrl,
  },
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Karnataka, India",
    "target-country": "IN, US",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
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
                  name: "NivoLeads",
                  url: appUrl,
                  logo: `${appUrl}/logo.png`,
                  description:
                    "Verified business leads, B2B company contacts, and phone directories across 31 Karnataka districts and 20+ industries.",
                  contactPoint: {
                    "@type": "ContactPoint",
                    contactType: "Customer Support",
                    email: "support@nivoleads.com",
                  },
                },
                {
                  "@type": "WebSite",
                  "@id": `${appUrl}/#website`,
                  url: appUrl,
                  name: "NivoLeads",
                  description: "Business Leads, B2B Contacts & Phone Numbers in India",
                  publisher: {
                    "@id": `${appUrl}/#organization`,
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
                alt="NivoLeads"
                width={40}
                height={40}
                className="h-10 w-10 rounded-xl object-contain shadow-sm"
              />
              <div>
                <div className="text-base font-bold text-[var(--text-main)]">Nivo<span className="text-blue-500">Leads</span></div>
                <div className="text-[var(--text-muted)]">Verified B2B & Commercial Directory</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
              <Link href="/leads" className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                Leads Directory
              </Link>
              <span>·</span>
              <Link href="/explore" className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                Explore Data
              </Link>
              <span>·</span>
              <Link href="/contact" className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                Support & Contact
              </Link>
              <span>·</span>
              <Link href="/privacy" className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                Privacy Policy
              </Link>
              <span>·</span>
              <Link href="/terms" className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                Terms of Service
              </Link>
            </div>

            <div className="text-center sm:text-right text-[var(--text-muted)]">
              © {new Date().getFullYear()} NivoLeads. All rights reserved.
            </div>
          </div>
        </footer>

        <CookieConsent />
      </body>
    </html>
  );
}
