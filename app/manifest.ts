import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NivoLeads — Global Business Leads & Contact Database",
    short_name: "NivoLeads",
    description: "Verified business phone numbers, company databases, and B2B leads directory.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#2563eb",
    icons: [
      {
        src: "/favicon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
