import { PrismaClient, type Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DISTRICTS: [string, string][] = [
  ["Bagalkote", "BGK"], ["Ballari", "BLL"], ["Belagavi", "BEL"], ["Bengaluru Rural", "BGR"], ["Bengaluru Urban", "BGU"],
  ["Bidar", "BDR"], ["Chamarajanagar", "CHN"], ["Chikkaballapur", "CKB"], ["Chikkamagaluru", "CKM"], ["Chitradurga", "CTD"],
  ["Dakshina Kannada", "DKA"], ["Davanagere", "DVG"], ["Dharwad", "DHW"], ["Gadag", "GDG"], ["Hassan", "HSN"],
  ["Haveri", "HVR"], ["Kalaburagi", "KLB"], ["Kodagu", "KDG"], ["Kolar", "KLR"], ["Koppal", "KPL"],
  ["Mandya", "MND"], ["Mysuru", "MYS"], ["Raichur", "RCR"], ["Ramanagara", "RMN"], ["Shivamogga", "SHM"],
  ["Tumakuru", "TMK"], ["Udupi", "UDP"], ["Uttara Kannada", "UKA"], ["Vijayapura", "VJH"], ["Yadgir", "YDG"],
  ["Vijayanagara", "VJN"],
];

const CATEGORIES: [string, string, string][] = [
  ["🏥", "Healthcare", "healthcare"],
  ["🎓", "Education & Training", "education-training"],
  ["🏠", "Real Estate & Construction", "real-estate-construction"],
  ["💪", "Health, Fitness & Beauty", "health-fitness-beauty"],
  ["🍽️", "Food, Restaurants & Hotels", "food-restaurants-hotels"],
  ["🛒", "Shopping & Retail", "shopping-retail"],
  ["💻", "IT & Digital Services", "it-digital-services"],
  ["⚖️", "Professional Services", "professional-services"],
  ["🚗", "Automobile & Transport", "automobile-transport"],
  ["🏭", "Industries & Manufacturing", "industries-manufacturing"],
  ["✈️", "Travel & Tourism", "travel-tourism"],
  ["🌾", "Agriculture & Agro Businesses", "agriculture-agro-businesses"],
];

const AREAS = ["Station Road", "Gandhi Chowk", "Market Area", "College Road", "Ring Road", "Old Town", "Industrial Area"];

async function sample(districtSlugName: string, categorySlug: string, count: number) {
  const d = await prisma.district.findFirstOrThrow({ where: { name: districtSlugName } });
  const c = await prisma.category.findFirstOrThrow({ where: { slug: categorySlug } });
  const rows: Prisma.BusinessCreateManyInput[] = [];
  for (let i = 1; i <= count; i++) {
    const n = String(i).padStart(4, "0");
    rows.push({
      districtId: d.id,
      categoryId: c.id,
      // Clearly fictional demo data - NOT real businesses
      name: `[DEMO] ${c.name.split(" ")[0]} Sample ${n}`,
      phone: `90${String(d.id).padStart(2, "0")}${String(c.id).padStart(2, "0")}${n}`,
      email: `demo${n}@example.com`,
      website: `https://example.com/demo-${n}`,
      address: `Demo address ${i}, ${d.name}`,
      area: AREAS[i % AREAS.length],
      pincode: d.name === "Vijayapura" ? "586101" : null,
    });
  }
  for (let i = 0; i < rows.length; i += 500) {
    await prisma.business.createMany({ data: rows.slice(i, i + 500), skipDuplicates: true });
  }
  console.log(`  ${d.name} / ${c.name}: ${count} demo records`);
}

async function main() {
  console.log("Seeding districts…");
  for (const [i, [name, code]] of DISTRICTS.entries()) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await prisma.district.upsert({ where: { name }, update: { code, slug }, create: { name, slug, code, sortOrder: i + 1 } });
  }
  console.log("Seeding categories…");
  const validSlugs = CATEGORIES.map(([, , slug]) => slug);
  await prisma.category.deleteMany({
    where: {
      slug: { notIn: validSlugs },
      businesses: { none: {} },
      purchases: { none: {} },
    },
  });
  for (const [i, [icon, name, slug]] of CATEGORIES.entries()) {
    await prisma.category.upsert({
      where: { slug },
      update: { name, icon, sortOrder: i + 1, status: "ACTIVE" },
      create: { name, slug, icon, sortOrder: i + 1, status: "ACTIVE" },
    });
  }

  if ((await prisma.pricingRule.count()) === 0) {
    console.log("Seeding pricing rules…");
    await prisma.pricingRule.createMany({
      data: [
        { label: "1–99", minQty: 1, maxQty: 99, pricePerContactPaise: 100, discountPercent: 0 },
        { label: "100–249", minQty: 100, maxQty: 249, pricePerContactPaise: 100, discountPercent: 5 },
        { label: "250–499", minQty: 250, maxQty: 499, pricePerContactPaise: 100, discountPercent: 10 },
        { label: "500+", minQty: 500, maxQty: null, pricePerContactPaise: 100, discountPercent: 15 },
      ],
    });
  }

  // Demo business and user seeding removed to keep database clean for real data.

  const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const adminPassword = (process.env.ADMIN_PASSWORD || "").trim();

  if (adminEmail && adminPassword) {
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: {},
      create: { name: "Administrator", email: adminEmail, role: "ADMIN", passwordHash: await bcrypt.hash(adminPassword, 12) },
    });
    console.log(`\nAdmin account configured for: ${adminEmail}`);
  } else {
    console.log("\nADMIN_EMAIL or ADMIN_PASSWORD not set in environment. Skipping admin creation.");
  }
  console.log("\nSeed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
