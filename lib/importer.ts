import * as XLSX from "xlsx";
import { normalizePhone } from "./phone";

export type ParsedBusiness = {
  name: string;
  phone: string;
  altPhone: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  area: string | null;
  pincode: string | null;
  mapsUrl: string | null;
};

const ALIASES: Record<string, string[]> = {
  name: ["businessname", "name", "business", "companyname", "company", "hospitalname", "schoolname", "collegename", "firmname"],
  phone: ["phone", "phonenumber", "mobile", "mobilenumber", "contact", "contactnumber", "phone1", "mobile1", "primaryphone"],
  altPhone: ["alternatephone", "alternativephone", "altphone", "phone2", "mobile2", "alternatemobile", "alternatenumber", "secondaryphone"],
  email: ["email", "emailid", "emailaddress", "mail"],
  website: ["website", "web", "websiteurl", "url", "site"],
  address: ["address", "fulladdress", "streetaddress"],
  area: ["area", "locality", "location", "town", "city"],
  pincode: ["pincode", "pin", "postalcode", "zip", "zipcode"],
  mapsUrl: ["googlemapsurl", "mapurl", "mapsurl", "googlemaps", "maplink", "googlemaplink", "gmapurl", "googlemapslink"],
};

export class ImportError extends Error {}

const norm = (h: string) => h.toLowerCase().replace(/[^a-z0-9]/g, "");
const clean = (v: unknown, max: number): string | null => {
  const s = v === null || v === undefined ? "" : String(v).replace(/\s+/g, " ").trim();
  return s ? s.slice(0, max) : null;
};

export type AnalysisResult = {
  total: number;
  valid: number;
  invalid: number;
  duplicatesInFile: number;
  toInsert: ParsedBusiness[];
  toUpdate: ParsedBusiness[];
  invalidSamples: { row: number; reason: string }[];
  duplicateSamples: { row: number; name: string; phone: string }[];
  warnings: string[];
};

export function readRows(buf: Buffer): Record<string, unknown>[] {
  let wb: XLSX.WorkBook;
  try {
    wb = XLSX.read(buf, { type: "buffer" });
  } catch {
    throw new ImportError("This file could not be read. Please upload a valid .xlsx, .xls or .csv file.");
  }
  const ws = wb.Sheets[wb.SheetNames[0]];
  if (!ws) throw new ImportError("The workbook has no sheets.");
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: "", raw: false });
  if (rows.length === 0) throw new ImportError("The first sheet is empty.");
  if (rows.length > 50000) throw new ImportError("Too many rows (limit 50,000 per file). Please split the file.");
  return rows;
}

export function mapColumns(rows: Record<string, unknown>[]) {
  const headers = Object.keys(rows[0]);
  const map: Partial<Record<keyof ParsedBusiness, string>> = {};
  for (const [field, aliases] of Object.entries(ALIASES)) {
    const h = headers.find((x) => aliases.includes(norm(x)));
    if (h) map[field as keyof ParsedBusiness] = h;
  }
  const missing = (["name", "phone"] as const).filter((f) => !map[f]);
  if (missing.length) {
    throw new ImportError(
      `Missing required column(s): ${missing.map((m) => (m === "name" ? "Business Name" : "Phone")).join(", ")}. ` +
        `Columns found: ${headers.join(", ")}`,
    );
  }
  return map;
}

/** existingPhones = phones already in the DB for the selected district + category. */
export function analyze(rows: Record<string, unknown>[], existingPhones: (phones: string[]) => Promise<Set<string>>) {
  return async (): Promise<AnalysisResult> => {
    const map = mapColumns(rows);
    const get = (r: Record<string, unknown>, f: keyof ParsedBusiness) => (map[f] ? r[map[f] as string] : "");

    const res: AnalysisResult = {
      total: rows.length,
      valid: 0,
      invalid: 0,
      duplicatesInFile: 0,
      toInsert: [],
      toUpdate: [],
      invalidSamples: [],
      duplicateSamples: [],
      warnings: [],
    };
    const seen = new Set<string>();
    const parsed: ParsedBusiness[] = [];
    let badEmails = 0;
    let badUrls = 0;

    rows.forEach((r, i) => {
      const rowNo = i + 2; // header is row 1
      const name = clean(get(r, "name"), 200);
      const phone = normalizePhone(get(r, "phone"));
      const bad = (reason: string) => {
        res.invalid++;
        if (res.invalidSamples.length < 30) res.invalidSamples.push({ row: rowNo, reason });
      };
      if (!name && !clean(get(r, "phone"), 60)) return bad("Empty row");
      if (!name) return bad("Missing business name");
      if (!phone) return bad("Missing or invalid phone number");
      if (seen.has(phone)) {
        res.duplicatesInFile++;
        if (res.duplicateSamples.length < 30) res.duplicateSamples.push({ row: rowNo, name, phone });
        return;
      }
      seen.add(phone);

      let email = clean(get(r, "email"), 190);
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        email = null;
        badEmails++;
      }
      let website = clean(get(r, "website"), 300);
      if (website && !/^https?:\/\//i.test(website)) website = "https://" + website;
      if (website && !/^https?:\/\/[^\s.]+\.[^\s]+$/i.test(website)) {
        website = null;
        badUrls++;
      }
      let mapsUrl = clean(get(r, "mapsUrl"), 1000);
      if (mapsUrl && !/^https?:\/\//i.test(mapsUrl)) {
        mapsUrl = null;
        badUrls++;
      }
      let altPhone = normalizePhone(get(r, "altPhone"));
      if (altPhone === phone) altPhone = null;
      const pin = clean(get(r, "pincode"), 10)?.replace(/\D/g, "") || null;

      parsed.push({
        name,
        phone,
        altPhone,
        email,
        website,
        address: clean(get(r, "address"), 500),
        area: clean(get(r, "area"), 120),
        pincode: pin,
        mapsUrl,
      });
    });

    res.valid = parsed.length;
    if (badEmails) res.warnings.push(`${badEmails} invalid email value(s) were ignored (the business rows were still imported).`);
    if (badUrls) res.warnings.push(`${badUrls} invalid website/map link(s) were ignored (the business rows were still imported).`);

    const existing = new Set<string>();
    for (let i = 0; i < parsed.length; i += 1000) {
      const chunk = parsed.slice(i, i + 1000).map((p) => p.phone);
      (await existingPhones(chunk)).forEach((p) => existing.add(p));
    }
    for (const p of parsed) (existing.has(p.phone) ? res.toUpdate : res.toInsert).push(p);
    return res;
  };
}
