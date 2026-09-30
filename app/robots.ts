import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://nivoleads.com";
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/explore", "/login", "/register", "/privacy", "/terms", "/contact"],
        disallow: ["/admin/", "/api/", "/purchases/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
