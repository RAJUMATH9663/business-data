import { handler, json, ApiError } from "@/lib/api";
import { prisma } from "@/lib/db";
import { apiAdmin } from "@/lib/auth";
import { z } from "zod";

export const PATCH = handler(async (req) => {
  const admin = await apiAdmin();
  const b = z.object({ id: z.coerce.number().int(), status: z.enum(["ACTIVE", "SUSPENDED"]) }).parse(await req.json());
  const target = await prisma.user.findUnique({ where: { id: b.id } });
  if (!target) throw new ApiError(404, "Customer not found");
  if (target.role === "ADMIN" || target.id === admin.id) throw new ApiError(400, "Admin accounts cannot be suspended here.");
  await prisma.user.update({ where: { id: b.id }, data: { status: b.status } });
  if (b.status === "SUSPENDED") await prisma.userSession.updateMany({ where: { userId: b.id }, data: { status: "REVOKED" } });
  return json({ ok: true });
});
