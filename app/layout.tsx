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
    default: "NivoLeads | Business Leads, B2B Contacts & Phone Numbers in India",
    template: "%s · NivoLeads",
  },
  description:
    "Buy verified business leads, B2B company contacts, and 100% verified mobile phone numbers across 31 districts and 20+ industries in Karnataka, India. Instant Excel downloads for freelancers, agencies & sales teams.",
  keywords: [
    // Primary SEO Keywords
    "business leads",
    "business leads India",
    "B2B leads India",
    "B2B business leads",
    "business contact database",
    "business contacts India",
    "business directory India",
    "local business directory",
    "business database India",
    "verified business leads",
    "business lead generation",
    "local business leads",
    "company contact database",
    "business contact list",
    "business prospect database",
    "business phone numbers",
    "company phone numbers",
    "business contact numbers",
    "business contact details",

    // Karnataka-focused keywords
    "Karnataka business leads",
    "Karnataka business database",
    "Karnataka business directory",
    "Karnataka B2B leads",
    "Karnataka company database",
    "Karnataka business contacts",
    "business leads Karnataka",
    "local business leads Karnataka",
    "Karnataka industry directory",
    "Karnataka companies list",

    // District/location keywords
    "Vijayapura business leads",
    "Bengaluru business leads",
    "Belagavi business leads",
    "Mysuru business leads",
    "Hubli business leads",
    "Dharwad business leads",
    "Mangaluru business leads",
    "Tumakuru business leads",
    "Shivamogga business leads",
    "Davanagere business leads",
    "Kalaburagi business leads",
    "Ballari business leads",
    "Udupi business leads",
    "Hassan business leads",
    "Raichur business leads",

    // Industry keywords
    "hospital business leads",
    "hospital phone numbers in Karnataka",
    "clinic contact numbers Karnataka",
    "real estate leads",
    "construction company leads",
    "school business leads",
    "college leads",
    "coaching institute leads",
    "gym business leads",
    "salon business leads",
    "restaurant business leads",
    "hotel business leads",
    "retail business leads",
    "IT company leads",
    "digital marketing leads",
    "CA firm leads",
    "legal service leads",
    "automobile dealer leads",
    "manufacturing leads",
    "logistics leads",
    "travel business leads",
    "agriculture business leads",

    // Freelancer/Agency keywords
    "business leads for freelancers",
    "leads for freelancers",
    "leads for digital marketers",
    "leads for marketing agencies",
    "sales leads India",
    "leads for web designers",
    "leads for SEO freelancers",
    "client leads for freelancers",

    // Brand keywords
    "NivoLeads",
    "Nivo Leads",
    "Nivoleads India",
    "Nivoleads business leads",
    "Nivoleads business database",
    "Nivoleads Karnataka",
    "Nivoleads B2B leads",
  ],
  authors: [{ name: "NivoLeads Team" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: appUrl,
    siteName: "NivoLeads",
    title: "NivoLeads | Business Leads, B2B Contacts & Phone Numbers in India",
    description:
      "Access verified business phone numbers, decision makers, and company contact directories across all 31 Karnataka districts and 20+ industries.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "NivoLeads — Verified Business Leads & Contacts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NivoLeads | Business Leads, B2B Contacts & Phone Numbers in India",
    description:
      "Access verified business phone numbers, decision makers, and company contact directories across all 31 Karnataka districts and 20+ industries.",
    images: ["/logo.png"],
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
