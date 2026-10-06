import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const result: any = await prisma.$queryRawUnsafe(
    `SELECT pg_size_pretty(pg_total_relation_size('"businesses"')) as total_size,
            pg_size_pretty(pg_relation_size('"businesses"')) as table_only_size,
            pg_size_pretty(pg_indexes_size('"businesses"')) as index_size,
            count(*) as row_count
     FROM "businesses";`
  );
  console.log("Database Storage Analysis:");
  console.log(result[0]);
}

main().finally(() => prisma.$disconnect());
