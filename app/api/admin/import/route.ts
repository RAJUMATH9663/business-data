import { handler, json, ApiError } from "@/lib/api";
import { prisma } from "@/lib/db";
import { apiAdmin } from "@/lib/auth";
import { analyze, ImportError, readRows } from "@/lib/importer";

const MAX_BYTES = 8 * 1024 * 1024;

export const POST = handler(async (req) => {
  await apiAdmin();
  const form = await req.formData();
  const action = form.get("action") === "import" ? "import" : "validate";
  const districtId = Number(form.get("districtId"));
  const categoryId = Number(form.get("categoryId"));
  const file = form.get("file");

  if (!Number.isInteger(districtId) || !Number.isInteger(categoryId)) throw new ApiError(400, "Select a district and a category.");
  if (!(file instanceof File)) throw new ApiError(400, "Choose an Excel file to upload.");
  if (!/\.(xlsx|xls|csv)$/i.test(file.name)) throw new ApiError(400, "Only .xlsx, .xls or .csv files are supported.");
  if (file.size > MAX_BYTES) throw new ApiError(400, "File is too large (max 8 MB).");

  const [district, category] = await Promise.all([
    prisma.district.findUnique({ where: { id: districtId } }),
    prisma.category.findUnique({ where: { id: categoryId } }),
  ]);
  if (!district || !category) throw new ApiError(404, "District or category not found.");

  let result;
  try {
    const rows = readRows(Buffer.from(await file.arrayBuffer()));
    result = await analyze(rows, async (phones) => {
      const found = await prisma.business.findMany({
        where: { districtId, categoryId, phone: { in: phones } },
        select: { phone: true },
      });
      return new Set(found.map((f) => f.phone));
    })();
  } catch (e) {
    if (e instanceof ImportError) throw new ApiError(400, e.message);
    throw e;
  }

  const summary = {
    total: result.total,
    valid: result.valid,
    duplicates: result.duplicatesInFile,
    invalid: result.invalid,
    newRecords: result.toInsert.length,
    existingToUpdate: result.toUpdate.length,
    invalidSamples: result.invalidSamples,
    duplicateSamples: result.duplicateSamples,
    warnings: result.warnings,
  };
  if (action === "validate") return json({ action, summary });

  let inserted = 0;
  for (let i = 0; i < result.toInsert.length; i += 500) {
    const chunk = result.toInsert.slice(i, i + 500);
    const r = await prisma.business.createMany({
      data: chunk.map((c) => ({ ...c, districtId, categoryId })),
      skipDuplicates: true,
    });
    inserted += r.count;
  }
  let updated = 0;
  for (let i = 0; i < result.toUpdate.length; i += 100) {
    const chunk = result.toUpdate.slice(i, i + 100);
    await prisma.$transaction(
      chunk.map((c) =>
        prisma.business.update({
          where: { districtId_categoryId_phone: { districtId, categoryId, phone: c.phone } },
          data: {
            name: c.name,
            altPhone: c.altPhone,
            email: c.email,
            website: c.website,
            address: c.address,
            area: c.area,
            pincode: c.pincode,
            mapsUrl: c.mapsUrl,
            status: "ACTIVE",
          },
        }),
      ),
    );
    updated += chunk.length;
  }
  const finalCount = await prisma.business.count({ where: { districtId, categoryId, status: "ACTIVE" } });
  return json({
    action,
    summary,
    imported: inserted,
    updated,
    finalCount,
    target: `${district.name} — ${category.name}`,
  });
});
