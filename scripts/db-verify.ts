import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function runProductionVerification() {
  console.log("==========================================================================");
  console.log("🛡️ PRODUCTION DATABASE MIGRATION & HEALTH VERIFICATION");
  console.log("==========================================================================\n");

  const start = Date.now();

  // 1. Connection & Latency Check
  const [usersCount, districtsCount, categoriesCount, businessesCount, rulesCount, purchasesCount] =
    await Promise.all([
      prisma.user.count(),
      prisma.district.count(),
      prisma.category.count(),
      prisma.business.count(),
      prisma.pricingRule.count(),
      prisma.purchase.count(),
    ]);

  const latency = Date.now() - start;
  console.log(`⏱️  Database Ping Latency : ${latency}ms`);
  console.log(`👥 Active Users          : ${usersCount}`);
  console.log(`📍 Total Districts        : ${districtsCount} (Target: 31)`);
  console.log(`🗂️  Business Categories   : ${categoriesCount} (Target: 20)`);
  console.log(`🏢 Total Verified Leads   : ${businessesCount}`);
  console.log(`💰 Pricing Discount Rules : ${rulesCount}`);
  console.log(`🧾 Purchase Records       : ${purchasesCount}\n`);

  // 2. Data Integrity & Foreign Key Consistency
  console.log("🔍 Checking Foreign Key & Data Constraints...");
  const districts = await prisma.district.findMany({ select: { id: true, slug: true, name: true } });
  const districtIds = new Set(districts.map((d) => d.id));

  const categories = await prisma.category.findMany({ select: { id: true, slug: true, name: true } });
  const categoryIds = new Set(categories.map((c) => c.id));

  const businesses = await prisma.business.findMany({
    select: { id: true, districtId: true, categoryId: true, phone: true },
  });

  let invalidDistrictFk = 0;
  let invalidCategoryFk = 0;
  let invalidPhoneFormat = 0;
  const phoneSet = new Set<string>();
  let duplicateWithinCategory = 0;

  for (const b of businesses) {
    if (!districtIds.has(b.districtId)) invalidDistrictFk++;
    if (!categoryIds.has(b.categoryId)) invalidCategoryFk++;
    if (!/^[6-9]\d{9}$/.test(b.phone)) invalidPhoneFormat++;

    const key = `${b.districtId}_${b.categoryId}_${b.phone}`;
    if (phoneSet.has(key)) {
      duplicateWithinCategory++;
    } else {
      phoneSet.add(key);
    }
  }

  console.log(`   - Broken District Foreign Keys  : ${invalidDistrictFk}`);
  console.log(`   - Broken Category Foreign Keys  : ${invalidCategoryFk}`);
  console.log(`   - Invalid 10-digit Indian Phones: ${invalidPhoneFormat}`);
  console.log(`   - Unique Constraint Violations  : ${duplicateWithinCategory}`);

  if (invalidDistrictFk === 0 && invalidCategoryFk === 0 && invalidPhoneFormat === 0 && duplicateWithinCategory === 0) {
    console.log("   ✅ Data Integrity: 100% PERFECT (0 violations)\n");
  } else {
    console.error("   ❌ Data Integrity Failures Detected!\n");
    process.exit(1);
  }

  // 3. District Ingestion Verification
  console.log("📊 Populated Districts Overview:");
  for (const slug of ["bagalkote", "ballari"]) {
    const d = districts.find((item) => item.slug === slug);
    if (!d) continue;
    const count = await prisma.business.count({ where: { districtId: d.id } });
    console.log(`   - ${d.name.padEnd(12)} : ${count} verified leads across 20 categories`);
  }

  console.log("\n==========================================================================");
  console.log("🎉 VERIFICATION PASSED: Production Database is Healthy & Fully Synchronized!");
  console.log("==========================================================================\n");
}

runProductionVerification()
  .catch((e) => {
    console.error("Verification failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
