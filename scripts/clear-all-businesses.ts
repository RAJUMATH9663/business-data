import { prisma } from "../lib/db";
import * as fs from "fs";
import * as path from "path";

async function clearAll() {
  console.log("==========================================================================");
  console.log("🚨 INITIATING 100% CLEAN SLATE DATABASE RESET");
  console.log("==========================================================================\n");

  const currentCount = await prisma.business.count();
  console.log(`📊 Current businesses in database: ${currentCount.toLocaleString("en-IN")}`);

  console.log("🗑️  Truncating business table (resetting IDs to 1)...");
  try {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "business" RESTART IDENTITY CASCADE;`);
  } catch {
    console.log("Fallback to prisma.business.deleteMany()...");
    await prisma.business.deleteMany();
  }

  const remaining = await prisma.business.count();
  console.log(`✅ Business table cleared! Remaining records: ${remaining}`);

  try {
    await prisma.$executeRawUnsafe(`ALTER SEQUENCE businesses_id_seq RESTART WITH 1;`);
    console.log("✅ Sequence businesses_id_seq reset to 1!");
  } catch (e) {
    console.log("Sequence reset note:", e);
  }

  // Clean dummy files in scraped_leads
  const leadsDir = path.join(process.cwd(), "scraped_leads");
  if (fs.existsSync(leadsDir)) {
    console.log("🗑️  Cleaning dummy Excel workbooks from scraped_leads/...");
    const files = fs.readdirSync(leadsDir);
    let removed = 0;
    for (const f of files) {
      if (f.endsWith(".xlsx")) {
        fs.unlinkSync(path.join(leadsDir, f));
        removed++;
      }
    }
    console.log(`✅ Removed ${removed} dummy Excel files from scraped_leads/.`);
  }

  console.log("\n==========================================================================");
  console.log("🎉 DATABASE IS NOW 100% CLEAN SLATE & READY FOR REAL VERIFIED DATA ONLY!");
  console.log("==========================================================================\n");
}

clearAll()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
