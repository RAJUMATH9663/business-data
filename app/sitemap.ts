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

    const districtRoutes: MetadataRoute.Sitemap = districts.map((d) => ({
      url: `${baseUrl}/explore?d=${d.slug}`,
      lastModified: d.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
      url: `${baseUrl}/explore?c=${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    // High-priority combination pages for top districts
    const priorityDistrictSlugs = [
      "bengaluru-urban",
      "vijayapura",
      "belagavi",
      "mysuru",
      "dharwad",
      "dakshina-kannada",
    ];

    const comboRoutes: MetadataRoute.Sitemap = [];
    for (const d of districts.filter((item) => priorityDistrictSlugs.includes(item.slug))) {
      for (const c of categories) {
        comboRoutes.push({
          url: `${baseUrl}/explore?d=${d.slug}&c=${c.slug}`,
          lastModified: d.updatedAt,
          changeFrequency: "weekly",
          priority: 0.85,
        });
      }
    }

    return [...staticRoutes, ...districtRoutes, ...categoryRoutes, ...comboRoutes];
  } catch {
    return staticRoutes;
  }
}
