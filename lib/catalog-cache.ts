import { prisma } from "@/lib/db";

// Cache districts and categories metadata for 5 minutes
let cachedDistricts: Array<{ id: number; name: string; slug: string }> | null = null;
let cachedCategories: Array<{ id: number; name: string; slug: string; icon: string }> | null = null;
let lastMetaFetch = 0;

export async function getCachedMetadata() {
  const now = Date.now();
  if (!cachedDistricts || !cachedCategories || now - lastMetaFetch > 5 * 60 * 1000) {
    const [d, c] = await Promise.all([
      prisma.district.findMany({
        where: { status: "ACTIVE" },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        select: { id: true, name: true, slug: true },
      }),
      prisma.category.findMany({
        where: { status: "ACTIVE" },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        select: { id: true, name: true, slug: true, icon: true },
      }),
    ]);
    cachedDistricts = d;
    cachedCategories = c;
    lastMetaFetch = now;
  }
  return { districts: cachedDistricts, categories: cachedCategories };
}

// In-memory cache for district category counts (30 seconds TTL)
const countCache = new Map<number, { timestamp: number; counts: Map<number, number> }>();

export async function getDistrictCategoryCounts(districtId: number): Promise<Map<number, number>> {
  const now = Date.now();
  const cached = countCache.get(districtId);
  if (cached && now - cached.timestamp < 30 * 1000) {
    return cached.counts;
  }

  const rows = await prisma.business.groupBy({
    by: ["categoryId"],
    where: { districtId, status: "ACTIVE" },
    _count: { _all: true },
  });

  const map = new Map(rows.map((r) => [r.categoryId, r._count._all]));
  countCache.set(districtId, { timestamp: now, counts: map });
  return map;
}

export function invalidateDistrictCountCache(districtId?: number) {
  if (districtId) {
    countCache.delete(districtId);
  } else {
    countCache.clear();
  }
}
