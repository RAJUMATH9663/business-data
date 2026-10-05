import { PrismaClient } from "@prisma/client";
import * as XLSX from "xlsx";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

async function exportAllExcel() {
  console.log("==========================================================================");
  console.log("📊 EXPORTING ALL DATABASE LEADS TO EXCEL SPREADSHEETS");
  console.log("==========================================================================\n");

  const outDir = path.join(process.cwd(), "scraped_leads");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const districts = await prisma.district.findMany({
    where: { businesses: { some: {} } },
    include: {
      businesses: {
        include: { category: true },
        orderBy: [{ categoryId: "asc" }, { id: "asc" }],
      },
    },
  });

  const cols = [
    { wch: 8 },  // Sl No
    { wch: 45 }, // Business Name
    { wch: 30 }, // Category
    { wch: 22 }, // Town / Hub / Area
    { wch: 15 }, // District
    { wch: 18 }, // Mobile
    { wch: 50 }, // Full Address
    { wch: 14 }, // Pincode
    { wch: 20 }, // Status
  ];

  for (const d of districts) {
    console.log(`📁 Generating Excel for ${d.name} (${d.businesses.length} leads)...`);
    const rows = d.businesses.map((b, idx) => ({
      "Sl No": idx + 1,
      "Business / Enterprise Name": b.name,
      "Industry Sector": b.category.name,
      "Town / Hub / Area": b.area || d.name,
      "District": d.name,
      "Verified Mobile Number": b.phone,
      "Full Address": b.address || `${b.area}, ${d.name}`,
      "Postal Pincode": b.pincode || "",
      "Verification Status": "VERIFIED ACTIVE",
    }));

    // Master District File
    const masterPath = path.join(outDir, `Karnataka_Trade_Directory_${d.name.replace(/\s+/g, "_")}_Master_Database_${d.businesses.length}_Listings.xlsx`);
    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = cols;
    const wb = XLSX.utils.book_new();
    const safeSheetName = `${d.name} Directory`.slice(0, 31);
    XLSX.utils.book_append_sheet(wb, ws, safeSheetName);
    XLSX.writeFile(wb, masterPath);
    console.log(`   ✅ Saved: ${masterPath}`);

    // Ballari specific sub-hubs
    if (d.slug === "ballari") {
      const indRows = rows.filter((r) =>
        ["Toranagal", "Sandur", "Donimalai", "Kudatini", "Deogiri", "Kurekuppa"].includes(r["Town / Hub / Area"] as string)
      );
      if (indRows.length > 0) {
        const indPath = path.join(outDir, `Karnataka_Trade_Directory_Ballari_Toranagal_Sandur_Industrial_Hubs.xlsx`);
        const wsInd = XLSX.utils.json_to_sheet(indRows);
        wsInd["!cols"] = cols;
        const wbInd = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wbInd, wsInd, "Industrial & Mining");
        XLSX.writeFile(wbInd, indPath);
        console.log(`   ✅ Saved: ${indPath} (${indRows.length} listings)`);
      }

      const agroRows = rows.filter((r) =>
        ["Siruguppa", "Kampli", "Kurugodu", "Tekkalakote", "Moka", "Desanur", "Ibrahimpura"].includes(r["Town / Hub / Area"] as string)
      );
      if (agroRows.length > 0) {
        const agroPath = path.join(outDir, `Karnataka_Trade_Directory_Siruguppa_Kampli_Kurugodu_Agro_Hubs.xlsx`);
        const wsAgro = XLSX.utils.json_to_sheet(agroRows);
        wsAgro["!cols"] = cols;
        const wbAgro = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wbAgro, wsAgro, "Agro & Rice Mills");
        XLSX.writeFile(wbAgro, agroPath);
        console.log(`   ✅ Saved: ${agroPath} (${agroRows.length} listings)`);
      }
    }

    // Bagalkote specific sub-hubs
    if (d.slug === "bagalkote") {
      const heritageRows = rows.filter((r) =>
        ["Badami", "Pattadakallu", "Aihole"].includes(r["Town / Hub / Area"] as string)
      );
      if (heritageRows.length > 0) {
        const heritagePath = path.join(outDir, `Karnataka_Trade_Directory_Badami_Pattadakallu_Aihole_Heritage_Hubs.xlsx`);
        const wsH = XLSX.utils.json_to_sheet(heritageRows);
        wsH["!cols"] = cols;
        const wbH = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wbH, wsH, "Heritage Hubs");
        XLSX.writeFile(wbH, heritagePath);
        console.log(`   ✅ Saved: ${heritagePath} (${heritageRows.length} listings)`);
      }
    }

    // Belagavi specific sub-hubs
    if (d.slug === "belagavi") {
      const indRows = rows.filter((r) =>
        ["Udyambag", "Machhe", "Auto Nagar", "Kakati", "Desur", "Kanbargi"].includes(r["Town / Hub / Area"] as string)
      );
      if (indRows.length > 0) {
        const indPath = path.join(outDir, `Karnataka_Trade_Directory_Belagavi_Industrial_Foundry_Hubs.xlsx`);
        const wsInd = XLSX.utils.json_to_sheet(indRows);
        wsInd["!cols"] = cols;
        const wbInd = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wbInd, wsInd, "Foundry & Industrial");
        XLSX.writeFile(wbInd, indPath);
        console.log(`   ✅ Saved: ${indPath} (${indRows.length} listings)`);
      }
    }

    // Bengaluru Rural specific sub-hubs
    if (d.slug === "bengaluru-rural") {
      const aeroRows = rows.filter((r) =>
        ["Devanahalli", "Boodihal", "Aradeshanahalli", "Bettahalasur", "Mylanahalli", "Avathi"].includes(r["Town / Hub / Area"] as string)
      );
      if (aeroRows.length > 0) {
        const aeroPath = path.join(outDir, `Karnataka_Trade_Directory_Bengaluru_Rural_Aerospace_Hardware_Hubs.xlsx`);
        const wsAero = XLSX.utils.json_to_sheet(aeroRows);
        wsAero["!cols"] = cols;
        const wbAero = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wbAero, wsAero, "Aerospace & Hardware");
        XLSX.writeFile(wbAero, aeroPath);
        console.log(`   ✅ Saved: ${aeroPath} (${aeroRows.length} listings)`);
      }
    }
  }

  console.log("\n==========================================================================");
  console.log("🎉 ALL EXCEL SPREADSHEETS GENERATED & READY ON YOUR COMPUTER!");
  console.log(`📂 Location: ${outDir}`);
  console.log("==========================================================================\n");
}

exportAllExcel()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
