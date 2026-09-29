import { handler, json, ApiError, isUniqueError } from "@/lib/api";
import { prisma } from "@/lib/db";
import { apiAdmin } from "@/lib/auth";
import { categoryCreate, categoryUpdate } from "@/lib/validators";
import { slugify } from "@/lib/format";

export const POST = handler(async (req) => {
  await apiAdmin();
  const b = categoryCreate.parse(await req.json());
  try {
    return json(
      await prisma.category.create({
        data: { name: b.name, slug: slugify(b.name), icon: b.icon ?? "📁", status: b.status ?? "ACTIVE", sortOrder: b.sortOrder ?? 999 },
      }),
    );
  } catch (e) {
    if (isUniqueError(e)) throw new ApiError(409, "A category with this name already exists.");
    throw e;
  }
});

export const PATCH = handler(async (req) => {
  await apiAdmin();
  const { id, ...data } = categoryUpdate.parse(await req.json());
  try {
    return json(await prisma.category.update({ where: { id }, data }));
  } catch (e) {
    if (isUniqueError(e)) throw new ApiError(409, "A category with this name already exists.");
    throw e;
  }
});
