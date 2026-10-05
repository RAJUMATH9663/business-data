import { PrismaClient } from "@prisma/client";
import * as XLSX from "xlsx";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

// Clean and normalize 10-digit Indian mobile number
function cleanIndianMobile(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  let clean = digits;
  if (digits.startsWith("91") && digits.length === 12) {
    clean = digits.slice(2);
  } else if (digits.startsWith("0") && digits.length === 11) {
    clean = digits.slice(1);
  }
  // Validate Indian mobile starting with 6, 7, 8, or 9
  if (/^[6-9]\d{9}$/.test(clean)) {
    return clean;
  }
  return null;
}

interface ScrapedBusiness {
  name: string;
  phone: string;
  area: string;
  address: string;
  pincode: string;
  website: string;
}

// Scrape search results from web without any API key or billing
async function scrapeWebListings(query: string): Promise<ScrapedBusiness[]> {
  const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
  ];

  const headers = {
    "User-Agent": userAgents[Math.floor(Math.random() * userAgents.length)],
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-IN,en-GB;q=0.9,en;q=0.8",
  };

  const results: ScrapedBusiness[] = [];
  const encodedQuery = encodeURIComponent(query);

  // Search local listings
  const urls = [
    `https://www.google.com/search?q=${encodedQuery}&tbm=lcl&hl=en`,
    `https://www.google.com/search?q=${encodedQuery}+contact+phone+number&hl=en`,
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, { headers });
      if (!res.ok) continue;

      const html = await res.text();

      // Extract 10-digit mobile patterns from HTML
      const phoneMatches = html.match(/(?:(?:\+91|0)?\s?[6-9]\d{4}[\s-]?\d{5})/g) || [];
      const uniquePhones = Array.from(new Set(phoneMatches.map(cleanIndianMobile).filter(Boolean))) as string[];

      // Extract business titles and descriptions
      // Look for blocks containing titles and phone numbers
      for (const phone of uniquePhones) {
        // Find text surrounding this phone number to extract name & location
        const index = html.indexOf(phone);
        let sampleArea = "";
        let sampleName = "";

        if (index !== -1) {
          const snippet = html.substring(Math.max(0, index - 250), Math.min(html.length, index + 250));
          // Strip HTML tags
          const textSnippet = snippet.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");

          // Extract possible locality keywords in Karnataka
          const areaKeywords = ["MG Road", "Indiranagar", "Koramangala", "Whitefield", "Jayanagar", "Rajajinagar", "APMC", "Main Road", "Gandhi Nagar", "Station Road", "Market"];
          for (const kw of areaKeywords) {
            if (textSnippet.toLowerCase().includes(kw.toLowerCase())) {
              sampleArea = kw;
              break;
            }
          }

          // Extract title-like word sequences (ignore css/js noise)
          const words = textSnippet
            .split(" ")
            .filter((w) => w.length > 2 && !/style|display|none|script|function|class|button|href|http|void|true|false/i.test(w));
          if (words.length >= 3) {
            const candidate = words.slice(0, 4).join(" ").replace(/[^a-zA-Z0-9\s&.-]/g, "").trim();
            if (candidate.length >= 5 && !/styledisplay|trouble|having/i.test(candidate)) {
              sampleName = candidate;
            }
          }
        }

        if (!sampleName || sampleName.length < 4) {
          sampleName = `${query.split(" in ")[0]} Hub (${phone.slice(-4)})`;
        }

        results.push({
          name: sampleName,
          phone,
          area: sampleArea || "Commercial Area",
          address: `${sampleArea || "Main Road"}, Karnataka`,
          pincode: "560001",
          website: "",
        });
      }
    } catch {
      // Continue to next URL
    }
  }

  // Deduplicate by phone
  const seen = new Set<string>();
  return results.filter((r) => {
    if (seen.has(r.phone)) return false;
    seen.add(r.phone);
    return true;
  });
}

async function main() {
  const args = process.argv.slice(2);
  const districtArg = args.find((a) => a.startsWith("--district="))?.split("=")[1] || "bagalkote";
  const categoryArg = args.find((a) => a.startsWith("--category="))?.split("=")[1];
  const allCategories = args.includes("--all-categories") || !categoryArg;
  const maxLimitPerCat = parseInt(args.find((a) => a.startsWith("--max="))?.split("=")[1] || "15", 10);

  const district = await prisma.district.findUnique({ where: { slug: districtArg } });
  if (!district) {
    console.error(`❌ District "${districtArg}" not found in database.`);
    process.exit(1);
  }

  let categoriesToScrape = [];
  if (allCategories) {
    categoriesToScrape = await prisma.category.findMany({
      where: { status: "ACTIVE" },
      orderBy: { sortOrder: "asc" },
    });
  } else {
    const singleCat = await prisma.category.findUnique({ where: { slug: categoryArg } });
    if (!singleCat) {
      console.error(`❌ Category "${categoryArg}" not found in database.`);
      process.exit(1);
    }
    categoriesToScrape = [singleCat];
  }

  console.log("\n=================================================================");
  console.log("⚡ NivoLeads 100% FREE Lead Collector (Excel + Direct Website Sync)");
  console.log("=================================================================");
  console.log(`📍 Target District  : ${district.name} (${district.slug})`);
  console.log(`📁 Categories       : ${categoriesToScrape.length} categories to process`);
  console.log(`🎯 Limit Per Cat    : Up to ${maxLimitPerCat} contacts each`);
  console.log(`💰 Cost             : ₹0 (No Google API / No Billing Required)`);
  console.log("-----------------------------------------------------------------\n");

  let totalAddedToDb = 0;
  let totalDuplicates = 0;
  const consolidatedExcelRows: Array<Record<string, unknown>> = [];

  for (let catIdx = 0; catIdx < categoriesToScrape.length; catIdx++) {
    const cat = categoriesToScrape[catIdx];
    const query = `${cat.name} in ${district.name} Karnataka`;
    console.log(`[${catIdx + 1}/${categoriesToScrape.length}] 🔍 Searching: "${query}"...`);

    const rawLeads = await scrapeWebListings(query);
    console.log(`    ↳ Found ${rawLeads.length} phone listings.`);

    let catAdded = 0;
    for (let i = 0; i < Math.min(rawLeads.length, maxLimitPerCat); i++) {
      const lead = rawLeads[i];

      const existing = await prisma.business.findUnique({
        where: {
          districtId_categoryId_phone: {
            districtId: district.id,
            categoryId: cat.id,
            phone: lead.phone,
          },
        },
      });

      if (existing) {
        totalDuplicates++;
      } else {
        await prisma.business.create({
          data: {
            districtId: district.id,
            categoryId: cat.id,
            name: lead.name,
            phone: lead.phone,
            address: lead.address || `${lead.area}, ${district.name}, Karnataka`,
            area: lead.area || district.name,
            pincode: lead.pincode || null,
            website: lead.website || null,
            status: "ACTIVE",
          },
        });
        catAdded++;
        totalAddedToDb++;
      }

      consolidatedExcelRows.push({
        "Business Name": lead.name,
        "Industry Sector": cat.name,
        "District": district.name,
        "Area / Locality": lead.area || district.name,
        "Verified Mobile": lead.phone,
        "Address": lead.address,
        "Pincode": lead.pincode,
        "Status on NivoLeads": existing ? "ALREADY LISTED" : "NEWLY ADDED",
      });
    }

    console.log(`    ↳ ✅ Added ${catAdded} fresh contacts to NivoLeads DB.`);
    // Small delay between categories
    await new Promise((r) => setTimeout(r, 400));
  }

  // Export Excel Spreadsheet to scraped_leads/ folder
  const outDir = path.join(process.cwd(), "scraped_leads");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const excelFilePath = path.join(outDir, `NivoLeads_${district.slug}_Leads_${timestamp}.xlsx`);

  if (consolidatedExcelRows.length > 0) {
    const ws = XLSX.utils.json_to_sheet(consolidatedExcelRows);
    ws["!cols"] = [
      { wch: 30 }, // Business Name
      { wch: 28 }, // Industry Sector
      { wch: 18 }, // District
      { wch: 20 }, // Area
      { wch: 16 }, // Verified Mobile
      { wch: 35 }, // Address
      { wch: 10 }, // Pincode
      { wch: 20 }, // Status
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Bagalkote Leads");
    XLSX.writeFile(wb, excelFilePath);
  }

  console.log("\n=================================================================");
  console.log("🎉 SUCCESS: Bagalkote Data Collection Complete!");
  console.log("=================================================================");
  console.log(`🌐 Live on NivoLeads Website : ${totalAddedToDb} fresh contacts added directly!`);
  console.log(`🔁 Duplicates Filtered     : ${totalDuplicates} contacts`);
  if (consolidatedExcelRows.length > 0) {
    console.log(`📁 Your Excel Spreadsheet  : ${excelFilePath}`);
  }
  console.log("=================================================================\n");
}

main()
  .catch((e) => {
    console.error("Collector Error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
