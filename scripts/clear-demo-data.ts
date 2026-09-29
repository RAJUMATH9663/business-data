import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Deleting demo data...");

  // 1. Delete contact views and purchases if any
  const deletedViews = await prisma.contactView.deleteMany({});
  console.log(`Deleted ${deletedViews.count} contact views.`);

  const deletedPurchaseContacts = await prisma.purchaseContact.deleteMany({});
  console.log(`Deleted ${deletedPurchaseContacts.count} purchase contacts.`);

  const deletedPurchases = await prisma.purchase.deleteMany({});
  console.log(`Deleted ${deletedPurchases.count} purchases.`);

  // 2. Delete all dummy businesses
  const deletedBusinesses = await prisma.business.deleteMany({});
  console.log(`Deleted ${deletedBusinesses.count} businesses.`);

  // 3. Delete demo/customer test users
  const deletedUsers = await prisma.user.deleteMany({
    where: { role: "CUSTOMER" },
  });
  console.log(`Deleted ${deletedUsers.count} test customer(s).`);

  console.log("\nCleanup finished successfully! Only districts, categories, pricing rules, and admin remain.");
}

main()
  .catch((e) => {
    console.error("Error clearing demo data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
