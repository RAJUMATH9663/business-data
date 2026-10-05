import { NextResponse } from "next/server";
import { getAppUrl } from "@/lib/seo";

export const revalidate = 86400; // 24 hours Edge cache
export const dynamic = "force-dynamic";

const DISTRICT_SLUGS = [
  "bagalkote", "ballari", "belagavi", "bengaluru-rural", "bengaluru-urban",
  "bidar", "chamarajanagar", "chikkaballapur", "chikkamagaluru", "chitradurga",
  "dakshina-kannada", "davanagere", "dharwad", "gadag", "hassan",
  "haveri", "kalaburagi", "kodagu", "kolar", "koppal",
  "mandya", "mysuru", "raichur", "ramanagara", "shivamogga",
  "tumakuru", "udupi", "uttara-kannada", "vijayapura", "yadgir", "vijayanagara"
];

const CATEGORY_SLUGS = [
  "hospitals-clinics", "real-estate", "colleges-universities", "schools",
  "coaching-training-institutes", "gyms-fitness-centers", "salons-beauty-parlours",
  "restaurants-hotels", "retail-supermarkets", "construction-builders",
  "it-software-companies", "photography-videography", "digital-marketing-advertising",
  "legal-ca-services", "finance-insurance-loans", "automobile-dealers",
  "manufacturing-industries", "transport-logistics", "travel-tourism",
  "agriculture-agro-businesses"
];

export async function GET() {
  const baseUrl = getAppUrl();
  const dateStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD standard format

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Core Static Pages
  const staticPages = [
    { loc: "", priority: "1.0", changefreq: "daily" },
    { loc: "/leads", priority: "0.9", changefreq: "daily" },
    { loc: "/explore", priority: "0.9", changefreq: "daily" },
    { loc: "/list-business", priority: "0.9", changefreq: "daily" },
    { loc: "/login", priority: "0.5", changefreq: "monthly" },
    { loc: "/register", priority: "0.6", changefreq: "monthly" },
    { loc: "/contact", priority: "0.5", changefreq: "monthly" },
    { loc: "/privacy", priority: "0.3", changefreq: "yearly" },
    { loc: "/terms", priority: "0.3", changefreq: "yearly" },
  ];

  for (const page of staticPages) {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}${page.loc}</loc>\n`;
    xml += `    <lastmod>${dateStr}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += `  </url>\n`;
  }

  // 31 District Landing Pages (/leads/[district])
  for (const d of DISTRICT_SLUGS) {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/leads/${d}</loc>\n`;
    xml += `    <lastmod>${dateStr}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  }

  // 372 District + Category Programmatic Pages (/leads/[district]/[category])
  for (const d of DISTRICT_SLUGS) {
    for (const c of CATEGORY_SLUGS) {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/leads/${d}/${c}</loc>\n`;
      xml += `    <lastmod>${dateStr}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    }
  }

  xml += `</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
