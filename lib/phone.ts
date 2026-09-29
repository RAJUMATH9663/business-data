/** Returns a clean 10-digit Indian number (starting 6-9) or null. Handles "+91", "0" prefixes and lists like "98450 12345 / 0831-222333". */
export function normalizePhone(raw: unknown): string | null {
  if (raw === null || raw === undefined) return null;
  const parts = String(raw).split(/[,;/\n|]+/);
  for (const part of parts) {
    let d = part.replace(/\D/g, "");
    if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
    else if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
    if (/^[6-9]\d{9}$/.test(d)) return d;
  }
  return null;
}
