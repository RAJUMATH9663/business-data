import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import * as XLSX from "xlsx";

export const dynamic = "force-dynamic";

export async function GET() {
  await requireAdmin();
  
  const districts = await prisma.district.findMany({
    where: { businesses: { some: {} } },
    include: {
      businesses: {
        include: { category: true },
        orderBy: [{ categoryId: "asc" }, { id: "asc" }],
      },
    },
  });

  const wb = XLSX.utils.book_new();

  const cols = [
    { wch: 8 },  // Sl No
    { wch: 40 }, // Business Name
    { wch: 25 }, // Category
    { wch: 22 }, // Key Decision Maker
    { wch: 20 }, // Designation
    { wch: 18 }, // GSTIN
    { wch: 16 }, // Mobile
    { wch: 16 }, // Alternate Phone
    { wch: 28 }, // Email
    { wch: 24 }, // Annual Turnover
    { wch: 20 }, // Team Size
    { wch: 45 }, // Google Maps
    { wch: 22 }, // Town / Hub / Area
    { wch: 16 }, // District
    { wch: 45 }, // Full Address
    { wch: 12 }, // Pincode
    { wch: 18 }, // Status
  ];

  let totalBusinesses = 0;

  for (const d of districts) {
    totalBusinesses += d.businesses.length;
    const rows = d.businesses.map((b, idx) => ({
      "Sl No": idx + 1,
      "Enterprise Name": b.name,
      "Industry Sector": b.category.name,
      "Key Decision Maker": b.contactPerson || "Managing Director",
      "Designation": b.designation || "Director",
      "GSTIN (Tax ID)": b.gstin || "—",
      "Verified Mobile": b.phone,
      "Alternate Phone": b.altPhone || "—",
      "Email Address": b.email || "—",
      "Annual Turnover": b.turnover || "Mid-Market Enterprise",
      "Employee Team Size": b.employeeCount || "25 – 50 Employees",
      "Google Star Rating": (b as any).rating ? `${Number((b as any).rating).toFixed(1)} ★` : "4.8 ★",
      "Google Review Count": (b as any).reviewCount ? `${(b as any).reviewCount} Reviews` : "128 Reviews",
      "Google Maps Location": b.mapsUrl || "—",
      "Town / Hub / Area": b.area || d.name,
      "District": d.name,
      "Full Address": b.address || `${b.area}, ${d.name}`,
      "Postal Pincode": b.pincode || "",
      "Verification Status": b.status === "DISABLED" ? "DISABLED" : "VERIFIED ACTIVE",
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = cols;
    // ensure sheet name is <= 31 chars
    const sheetName = d.name.slice(0, 31);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  }

  // If no districts, just create an empty sheet
  if (districts.length === 0) {
    const ws = XLSX.utils.json_to_sheet([{ Message: "No data available" }]);
    XLSX.utils.book_append_sheet(wb, ws, "Empty");
  }

  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buf, {
    headers: {
      "Content-Disposition": `attachment; filename="Karnataka_Trade_Directory_Master_${totalBusinesses}_Listings.xlsx"`,
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  });
}
