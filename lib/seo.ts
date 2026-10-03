/**
 * SEO & Canonical URL Helper for NivoLeads
 * Ensures consistent domain resolution across local, preview, and production environments.
 */

export function getAppUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (envUrl && envUrl.trim() !== "") {
    return envUrl.trim().replace(/\/$/, "");
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`.replace(/\/$/, "");
  }

  return "https://nivoleads.vercel.app";
}

export function absoluteUrl(path: string = ""): string {
  const base = getAppUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
}
