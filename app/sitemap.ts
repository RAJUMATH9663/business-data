import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { getAppUrl } from "@/lib/seo";

export const revalidate = 86400; // Cache on Vercel Edge CDN for 24h

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getAppUrl();
  const now = new Date();

  // Static high-priority core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/leads`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  try {
    const [districts, categories] = await Promise.all([
      prisma.district.findMany({
        where: { status: "ACTIVE" },
        select: { slug: true, updatedAt: true },
        orderBy: { name: "asc" },
      }),
      prisma.category.findMany({
        where: { status: "ACTIVE" },
        select: { slug: true, updatedAt: true },
        orderBy: { name: "asc" },
      }),
    ]);

    // 1. District landing pages (/leads/[district])
    const districtLandingRoutes: MetadataRoute.Sitemap = districts.map((d) => ({
      url: `${baseUrl}/leads/${d.slug}`,
      lastModified: d.updatedAt || now,
      changeFrequency: "weekly",
      priority: 0.85,
    }));

    // 2. Programmatic District + Category landing pages (/leads/[district]/[category])
    const districtCategoryRoutes: MetadataRoute.Sitemap = [];
    for (const d of districts) {
      for (const c of categories) {
        districtCategoryRoutes.push({
          url: `${baseUrl}/leads/${d.slug}/${c.slug}`,
          lastModified: d.updatedAt || now,
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
    }

    return [
      ...staticRoutes,
      ...districtLandingRoutes,
      ...districtCategoryRoutes,
    ];
  } catch {
    return staticRoutes;
  }
}
