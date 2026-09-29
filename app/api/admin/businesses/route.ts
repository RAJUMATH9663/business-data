import { handler, json, ApiError, isUniqueError } from "@/lib/api";
import { prisma } from "@/lib/db";
import { apiAdmin } from "@/lib/auth";
import { businessCreate, businessUpdate } from "@/lib/validators";
import { normalizePhone } from "@/lib/phone";
import { z } from "zod";

const nn = (v: string | undefined) => (v && v.trim() ? v.trim() : null);

export const POST = handler(async (req) => {
  await apiAdmin();
  const b = businessCreate.parse(await req.json());
  const phone = normalizePhone(b.phone);
  if (!phone) throw new ApiError(400, "Enter a valid 10-digit Indian phone number.");
  try {
    return json(
      await prisma.business.create({
        data: {
          districtId: b.districtId,
          categoryId: b.categoryId,
          name: b.name,
          phone,
          altPhone: normalizePhone(b.altPhone),
          email: nn(b.email),
          website: nn(b.website),
          address: nn(b.address),
          area: nn(b.area),
          pincode: nn(b.pincode),
          mapsUrl: nn(b.mapsUrl),
          status: b.status ?? "ACTIVE",
        },
      }),
    );
  } catch (e) {
    if (isUniqueError(e)) throw new ApiError(409, "This phone number already exists in the selected district and category.");
    throw e;
  }
});

export const PATCH = handler(async (req) => {
  await apiAdmin();
  const { id, ...b } = businessUpdate.parse(await req.json());
  const data: Record<string, unknown> = {};
  if (b.districtId !== undefined) data.districtId = b.districtId;
  if (b.categoryId !== undefined) data.categoryId = b.categoryId;
  if (b.name !== undefined) data.name = b.name;
  if (b.phone !== undefined) {
    const phone = normalizePhone(b.phone);
    if (!phone) throw new ApiError(400, "Enter a valid 10-digit Indian phone number.");
    data.phone = phone;
  }
  if (b.altPhone !== undefined) data.altPhone = normalizePhone(b.altPhone);
  for (const k of ["email", "website", "address", "area", "pincode", "mapsUrl"] as const) {
    if (b[k] !== undefined) data[k] = nn(b[k]);
  }
  if (b.status !== undefined) data.status = b.status;
  try {
    return json(await prisma.business.update({ where: { id }, data }));
  } catch (e) {
    if (isUniqueError(e)) throw new ApiError(409, "This phone number already exists in the selected district and category.");
    throw e;
  }
});

// Records that were already sold are disabled (soft delete) so customers keep what they paid for.
export const DELETE = handler(async (req) => {
  await apiAdmin();
  const { id } = z.object({ id: z.coerce.number().int() }).parse(await req.json());
  const sold = await prisma.purchaseContact.count({ where: { businessId: id } });
  if (sold > 0) {
    await prisma.business.update({ where: { id }, data: { status: "DISABLED" } });
    return json({ ok: true, softDeleted: true });
  }
  await prisma.business.delete({ where: { id } });
  return json({ ok: true, softDeleted: false });
});
