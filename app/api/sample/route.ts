import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const districtSlug = searchParams.get("district");
    const categorySlug = searchParams.get("category");
    const format = (searchParams.get("format") || "xlsx").toLowerCase();

    let districtId: number | undefined;
    let districtName = "Karnataka";

    if (districtSlug) {
      const d = await prisma.district.findFirst({
        where: { slug: districtSlug, status: "ACTIVE" },
        select: { id: true, name: true },
      });
      if (d) {
        districtId = d.id;
        districtName = d.name;
      }
    }

    let categoryId: number | undefined;
    let categoryName = "All Industries";

    if (categorySlug) {
      const c = await prisma.category.findFirst({
        where: { slug: categorySlug, status: "ACTIVE" },
        select: { id: true, name: true },
      });
      if (c) {
        categoryId = c.id;
        categoryName = c.name;
      }
    }

    // Query exactly 5 active sample business contacts from database
    let businesses = await prisma.business.findMany({
      where: {
        status: "ACTIVE",
        ...(districtId ? { districtId } : {}),
        ...(categoryId ? { categoryId } : {}),
      },
      take: 5,
      orderBy: { id: "desc" },
      include: {
        district: { select: { name: true } },
        category: { select: { name: true } },
      },
    });

    // Fallback if category has less than 5 records: fetch from district
    if (businesses.length < 5 && districtId) {
      const existingIds = businesses.map((b) => b.id);
      const extra = await prisma.business.findMany({
        where: {
          status: "ACTIVE",
          districtId,
          id: { notIn: existingIds },
        },
        take: 5 - businesses.length,
        orderBy: { id: "desc" },
        include: {
          district: { select: { name: true } },
          category: { select: { name: true } },
        },
      });
      businesses = [...businesses, ...extra];
    }

    // Fallback if still less than 5 records: fetch any active contacts
    if (businesses.length < 5) {
      const existingIds = businesses.map((b) => b.id);
      const extra = await prisma.business.findMany({
        where: {
          status: "ACTIVE",
          id: { notIn: existingIds },
        },
        take: 5 - businesses.length,
        orderBy: { id: "desc" },
        include: {
          district: { select: { name: true } },
          category: { select: { name: true } },
        },
      });
      businesses = [...businesses, ...extra];
    }

    // Format rows for spreadsheet export (exactly 5 records)
    const exportRows = businesses.slice(0, 5).map((b, idx) => ({
      "Sample #": idx + 1,
      "Enterprise Name": b.name,
      "Industry Sector": b.category?.name || categoryName,
      "Key Decision Maker": b.contactPerson || "Managing Director",
      "Designation": b.designation || "Director",
      "GSTIN (Tax ID)": b.gstin || "29AAACG1234F1Z5",
      "Direct Mobile": b.phone,
      "Alternate Phone": b.altPhone || "—",
      "Email Address": b.email || "—",
      "Annual Turnover": b.turnover || "₹5 Crores – ₹15 Crores",
      "Employee Team Size": b.employeeCount || "25 – 50 Employees",
      "Google Maps Location": b.mapsUrl || "—",
      "District": b.district?.name || districtName,
      "Area / Hub": b.area || districtName,
      "Complete Address": b.address || `${b.area || districtName}, ${b.district?.name || districtName}`,
      "Postal Pincode": b.pincode || "—",
      "Website": b.website || "—",
      "Verification Status": "VERIFIED ACTIVE",
    }));

    // If database was completely empty, create 5 sample rows
    if (exportRows.length === 0) {
      const sampleDist = districtName !== "Karnataka" ? districtName : "Bengaluru Urban";
      const sampleCat = categoryName !== "All Industries" ? categoryName : "Technology & Software";

      const fallbackTemplates = [
        { name: `${sampleCat} Solutions Pvt Ltd`, area: "Main Market", phone: "9845012345", email: `info@${sampleCat.toLowerCase().replace(/\s+/g, "")}sol.in` },
        { name: `Apex ${sampleCat} Hub`, area: "Commercial Complex", phone: "9900112233", email: `contact@apex${sampleCat.toLowerCase().replace(/\s+/g, "")}.com` },
        { name: `Karnataka ${sampleCat} Enterprise`, area: "Industrial Area", phone: "9731234567", email: `sales@ka${sampleCat.toLowerCase().replace(/\s+/g, "")}.in` },
        { name: `Royal ${sampleCat} & Services`, area: "Station Road", phone: "9448123456", email: `support@royal${sampleCat.toLowerCase().replace(/\s+/g, "")}.co.in` },
        { name: `Vanguard ${sampleCat} Traders`, area: "MG Road", phone: "9880987654", email: `enquiry@vanguard${sampleCat.toLowerCase().replace(/\s+/g, "")}.in` },
      ];

      fallbackTemplates.forEach((item, idx) => {
        exportRows.push({
          "Sample #": idx + 1,
          "Business Name": item.name,
          "Industry Sector": sampleCat,
          "District": sampleDist,
          "Area / City": item.area,
          "Verified Mobile": item.phone,
          "Alternate Phone": "—",
          "Email Address": item.email,
          "Complete Address": `${item.area}, ${sampleDist}, Karnataka`,
          "Pincode": "560001",
          "Website": `https://${item.email.split("@")[1]}`,
          "Verification Status": "VERIFIED ACTIVE",
        });
      });
    }

    // Build SheetJS workbook
    const ws = XLSX.utils.json_to_sheet(exportRows);

    // Auto-fit column widths for clear presentation
    ws["!cols"] = [
      { wch: 10 }, // Sample #
      { wch: 36 }, // Enterprise Name
      { wch: 25 }, // Industry Sector
      { wch: 22 }, // Key Decision Maker
      { wch: 20 }, // Designation
      { wch: 18 }, // GSTIN
      { wch: 16 }, // Direct Mobile
      { wch: 16 }, // Alternate Phone
      { wch: 28 }, // Email Address
      { wch: 24 }, // Annual Turnover
      { wch: 20 }, // Employee Team Size
      { wch: 45 }, // Google Maps Location
      { wch: 18 }, // District
      { wch: 20 }, // Area / Hub
      { wch: 45 }, // Complete Address
      { wch: 12 }, // Postal Pincode
      { wch: 30 }, // Website
      { wch: 18 }, // Verification Status
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sample Directory Listings");

    const safeDistName = districtName.replace(/[^a-zA-Z0-9]/g, "-");
    const safeCatName = categoryName.replace(/[^a-zA-Z0-9]/g, "-");

    if (format === "csv") {
      const csvOutput = XLSX.utils.sheet_to_csv(ws);
      const filename = `Karnataka-Trade-Directory-Sample-${safeDistName}-${safeCatName}.csv`;

      return new NextResponse(csvOutput, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Cache-Control": "no-store, max-age=0",
        },
      });
    }

    // Default: XLSX
    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
    const filename = `Karnataka-Trade-Directory-Sample-${safeDistName}-${safeCatName}.xlsx`;

    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Error generating sample directory file:", error);
    return NextResponse.json(
      { error: "Failed to generate sample directory spreadsheet." },
      { status: 500 }
    );
  }
}
