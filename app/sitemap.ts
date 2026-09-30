import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://nivoleads.com";

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/leads`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  try {
    const districts = await prisma.district.findMany({
      where: { status: "ACTIVE" },
      select: { slug: true, updatedAt: true },
    });

    const categories = await prisma.category.findMany({
      where: { status: "ACTIVE" },
      select: { slug: true, updatedAt: true },
    });

    // District programmatic landing pages (/leads/[district])
    const districtLandingRoutes: MetadataRoute.Sitemap = districts.map((d) => ({
      url: `${baseUrl}/leads/${d.slug}`,
      lastModified: d.updatedAt,
      changeFrequency: "weekly",
      priority: 0.85,
    }));

    // District + Category programmatic landing pages (/leads/[district]/[category])
    const districtCategoryRoutes: MetadataRoute.Sitemap = [];
    for (const d of districts) {
      for (const c of categories) {
        districtCategoryRoutes.push({
          url: `${baseUrl}/leads/${d.slug}/${c.slug}`,
          lastModified: d.updatedAt,
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
    }

    // Dynamic explore filter routes
    const districtExploreRoutes: MetadataRoute.Sitemap = districts.map((d) => ({
      url: `${baseUrl}/explore?d=${d.slug}`,
      lastModified: d.updatedAt,
      changeFrequency: "weekly",
      priority: 0.75,
    }));

    const categoryExploreRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
      url: `${baseUrl}/explore?c=${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly",
      priority: 0.75,
    }));

    return [
      ...staticRoutes,
      ...districtLandingRoutes,
      ...districtCategoryRoutes,
      ...districtExploreRoutes,
      ...categoryExploreRoutes,
    ];
  } catch {
    return staticRoutes;
  }
}
