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
    { wch: 45 }, // Business Name
    { wch: 30 }, // Category
    { wch: 22 }, // Town / Hub / Area
    { wch: 15 }, // District
    { wch: 18 }, // Mobile
    { wch: 50 }, // Full Address
    { wch: 14 }, // Pincode
    { wch: 20 }, // Status
  ];

  let totalBusinesses = 0;

  for (const d of districts) {
    totalBusinesses += d.businesses.length;
    const rows = d.businesses.map((b, idx) => ({
      "Sl No": idx + 1,
      "Business / Enterprise Name": b.name,
      "Industry Sector": b.category.name,
      "Town / Hub / Area": b.area || d.name,
      "District": d.name,
      "Verified Mobile Number": b.phone,
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
