import { PrismaClient } from "@prisma/client";
import * as XLSX from "xlsx";
import * as fs from "fs";
import * as path from "path";

// Auto-load .env
if (!process.env.GOOGLE_MAPS_API_KEY && fs.existsSync(".env")) {
  const envContent = fs.readFileSync(".env", "utf8");
  for (const line of envContent.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let val = match[2] || "";
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const prisma = new PrismaClient();

// Helper to clean Indian mobile numbers (10 digits)
function normalizePhone(raw: string | undefined | null): string | null {
  if (!raw) return null;
  // Remove spaces, dashes, brackets, country codes
  let clean = raw.replace(/\D/g, "");
  if (clean.startsWith("91") && clean.length === 12) {
    clean = clean.slice(2);
  } else if (clean.startsWith("0") && clean.length === 11) {
    clean = clean.slice(1);
  }
  // Validate 10-digit Indian mobile or landline/telecom number
  if (/^[6-9]\d{9}$/.test(clean)) {
    return clean;
  }
  if (clean.length === 10) {
    return clean;
  }
  return null;
}

interface PlaceItem {
  name: string;
  phone?: string;
  address?: string;
  area?: string;
  pincode?: string;
  website?: string;
  mapsUrl?: string;
}

// 1. Try New Places API v1 ( searchText )
async function fetchViaPlacesV1(query: string, apiKey: string): Promise<PlaceItem[]> {
  const url = "https://places.googleapis.com/v1/places:searchText";
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.internationalPhoneNumber,places.websiteUri,places.googleMapsUri,places.addressComponents",
    },
    body: JSON.stringify({ textQuery: query }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || `HTTP ${res.status}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const list = data.places || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return list.map((p: any) => {
    let area = "";
    let pincode = "";
    if (p.addressComponents) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const comp of p.addressComponents) {
        if (comp.types?.includes("sublocality") || comp.types?.includes("sublocality_level_1") || comp.types?.includes("locality")) {
          if (!area) area = comp.longText || comp.shortText || "";
        }
        if (comp.types?.includes("postal_code")) {
          pincode = comp.longText || comp.shortText || "";
        }
      }
    }

    return {
      name: p.displayName?.text || "Unknown Business",
      phone: p.nationalPhoneNumber || p.internationalPhoneNumber,
      address: p.formattedAddress,
      area,
      pincode,
      website: p.websiteUri,
      mapsUrl: p.googleMapsUri,
    };
  });
}

// 2. Fallback: Legacy Places Text Search API
async function fetchViaLegacyPlaces(query: string, apiKey: string): Promise<PlaceItem[]> {
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    throw new Error(`${data.status}: ${data.error_message || "API error"}`);
  }

  const results = data.results || [];
  const items: PlaceItem[] = [];

  for (const p of results.slice(0, 15)) {
    // Fetch place details for phone number
    const detailUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${p.place_id}&fields=name,formatted_phone_number,international_phone_number,formatted_address,website,url,address_components&key=${apiKey}`;
    const dRes = await fetch(detailUrl);
    const dData = await dRes.json();
    if (dData.status === "OK" && dData.result) {
      const d = dData.result;
      let area = "";
      let pincode = "";
      if (d.address_components) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const comp of d.address_components) {
          if (comp.types?.includes("sublocality") || comp.types?.includes("sublocality_level_1") || comp.types?.includes("locality")) {
            if (!area) area = comp.long_name;
          }
          if (comp.types?.includes("postal_code")) {
            pincode = comp.long_name;
          }
        }
      }

      items.push({
        name: d.name || p.name,
        phone: d.formatted_phone_number || d.international_phone_number,
        address: d.formatted_address || p.formatted_address,
        area,
        pincode,
        website: d.website,
        mapsUrl: d.url,
      });
    }
  }

  return items;
}

async function main() {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey || apiKey === "AIzaSy...") {
    console.error("\n❌ Error: GOOGLE_MAPS_API_KEY is missing in your .env file.");
    process.exit(1);
  }

  const args = process.argv.slice(2);
  const districtArg = args.find((a) => a.startsWith("--district="))?.split("=")[1] || "bengaluru-urban";
  const categoryArg = args.find((a) => a.startsWith("--category="))?.split("=")[1] || "healthcare";
  const maxLimit = parseInt(args.find((a) => a.startsWith("--max="))?.split("=")[1] || "20", 10);
  const exportExcel = args.includes("--export");

  console.log("\n=======================================================");
  console.log("🚀 NivoLeads Google Places Auto-Scraper & DB Importer");
  console.log("=======================================================");
  console.log(`📍 Target District  : ${districtArg}`);
  console.log(`📁 Target Category  : ${categoryArg}`);
  console.log(`🎯 Max Limit        : ${maxLimit}`);
  console.log("-------------------------------------------------------\n");

  const district = await prisma.district.findUnique({ where: { slug: districtArg } });
  if (!district) {
    console.error(`❌ District "${districtArg}" not found in database.`);
    process.exit(1);
  }

  const category = await prisma.category.findUnique({ where: { slug: categoryArg } });
  if (!category) {
    console.error(`❌ Category "${categoryArg}" not found in database.`);
    process.exit(1);
  }

  const query = `${category.name} in ${district.name}, Karnataka`;
  console.log(`🔍 Querying Google Maps: "${query}"...`);

  let places: PlaceItem[] = [];
  try {
    places = await fetchViaPlacesV1(query, apiKey);
    console.log(`✓ Fetched via Places API (New): ${places.length} listings found.`);
  } catch (err) {
    console.log(`ℹ️ Places v1 returned: ${err instanceof Error ? err.message : String(err)}. Falling back to Legacy Places API...`);
    try {
      places = await fetchViaLegacyPlaces(query, apiKey);
      console.log(`✓ Fetched via Legacy Places API: ${places.length} listings found.`);
    } catch (fallbackErr) {
      console.error(`❌ Both Google Places API attempts failed:`, fallbackErr);
      process.exit(1);
    }
  }

  if (places.length === 0) {
    console.log("⚠️ No places found for this search query.");
    process.exit(0);
  }

  let savedCount = 0;
  let skippedDuplicates = 0;
  let skippedNoPhone = 0;
  const scrapedRows: Array<Record<string, unknown>> = [];

  const toProcess = places.slice(0, maxLimit);

  for (let i = 0; i < toProcess.length; i++) {
    const item = toProcess[i];
    const phone = normalizePhone(item.phone);

    if (!phone) {
      console.log(`[${i + 1}/${toProcess.length}] "${item.name}" ⏩ No 10-digit mobile (${item.phone || "None"}). Skipped.`);
      skippedNoPhone++;
      continue;
    }

    // Check duplicate
    const existing = await prisma.business.findUnique({
      where: {
        districtId_categoryId_phone: {
          districtId: district.id,
          categoryId: category.id,
          phone,
        },
      },
    });

    if (existing) {
      console.log(`[${i + 1}/${toProcess.length}] "${item.name}" 🔁 Already in DB (${phone}). Skipped.`);
      skippedDuplicates++;
      continue;
    }

    // Insert into database
    await prisma.business.create({
      data: {
        districtId: district.id,
        categoryId: category.id,
        name: item.name,
        phone,
        address: item.address || null,
        area: item.area || district.name,
        pincode: item.pincode || null,
        website: item.website || null,
        mapsUrl: item.mapsUrl || null,
        status: "ACTIVE",
      },
    });

    console.log(`[${i + 1}/${toProcess.length}] "${item.name}" ✅ SAVED (+91 ${phone})`);
    savedCount++;

    scrapedRows.push({
      "Business Name": item.name,
      "Category": category.name,
      "District": district.name,
      "Area": item.area || district.name,
      "Phone": phone,
      "Address": item.address || "",
      "Pincode": item.pincode || "",
      "Website": item.website || "",
      "Google Maps URL": item.mapsUrl || "",
    });
  }

  console.log("\n=======================================================");
  console.log("📊 Scraping & Import Summary");
  console.log("=======================================================");
  console.log(`✅ Newly Added to Database : ${savedCount} contacts`);
  console.log(`🔁 Duplicates Skipped       : ${skippedDuplicates} contacts`);
  console.log(`⏩ No 10-Digit Phone       : ${skippedNoPhone} contacts`);
  console.log("=======================================================\n");

  if (exportExcel && scrapedRows.length > 0) {
    const ws = XLSX.utils.json_to_sheet(scrapedRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Scraped Leads");

    const outDir = path.join(process.cwd(), "scraped_data");
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    const filename = path.join(outDir, `Google_${district.slug}_${category.slug}_${Date.now()}.xlsx`);
    XLSX.writeFile(wb, filename);
    console.log(`📁 Excel spreadsheet exported to:\n${filename}\n`);
  }
}

main()
  .catch((e) => {
    console.error("Fatal Error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
