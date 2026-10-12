import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const total = await prisma.business.count();
  const districts = await prisma.district.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      _count: {
        select: { businesses: true }
      }
    },
    orderBy: {
      businesses: {
        _count: 'desc'
      }
    }
  });

  console.log(`================================================================`);
  console.log(`📊 TOTAL VERIFIED BUSINESSES: ${total}`);
  console.log(`📍 TOTAL DISTRICTS: ${districts.length}`);
  console.log(`================================================================`);
  districts.forEach((d, idx) => {
    console.log(`${(idx + 1).toString().padStart(2)}. ${d.name.padEnd(28)} : ${d._count.businesses.toString().padStart(5)} leads`);
  });
}

main().finally(() => prisma.$disconnect());
