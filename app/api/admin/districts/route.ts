import { handler, json, ApiError, isUniqueError } from "@/lib/api";
import { prisma } from "@/lib/db";
import { apiAdmin } from "@/lib/auth";
import { districtCreate, districtUpdate } from "@/lib/validators";
import { slugify } from "@/lib/format";

export const POST = handler(async (req) => {
  await apiAdmin();
  const b = districtCreate.parse(await req.json());
  try {
    const d = await prisma.district.create({
      data: { name: b.name, slug: slugify(b.name), code: b.code, status: b.status ?? "ACTIVE", sortOrder: b.sortOrder ?? 999 },
    });
    return json(d);
  } catch (e) {
    if (isUniqueError(e)) throw new ApiError(409, "A district with this name or code already exists.");
    throw e;
  }
});

export const PATCH = handler(async (req) => {
  await apiAdmin();
  const { id, ...data } = districtUpdate.parse(await req.json());
  try {
    return json(await prisma.district.update({ where: { id }, data }));
  } catch (e) {
    if (isUniqueError(e)) throw new ApiError(409, "A district with this name or code already exists.");
    throw e;
  }
});
