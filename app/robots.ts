import { MetadataRoute } from "next";
import { getAppUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getAppUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/directory",
          "/directory/",
          "/explore",
          "/login",
          "/register",
          "/privacy",
          "/terms",
          "/contact",
          "/llms.txt",
        ],
        disallow: [
          "/admin/",
          "/api/",
          "/purchases/",
          "/account/",
          "/reset-password/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/purchases/",
          "/account/",
          "/reset-password/",
        ],
      },
      {
        userAgent: ["GPTBot", "PerplexityBot", "ClaudeBot", "Google-Extended", "Applebot-Extended"],
        allow: ["/", "/explore", "/llms.txt", "/privacy", "/terms", "/contact", "/directory"],
        disallow: ["/admin/", "/api/", "/purchases/", "/account/", "/reset-password/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
