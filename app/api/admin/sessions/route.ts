import { handler, json } from "@/lib/api";
import { prisma } from "@/lib/db";
import { apiAdmin } from "@/lib/auth";
import { z } from "zod";

export const PATCH = handler(async (req) => {
  await apiAdmin();
  const { id } = z.object({ id: z.string().min(1).max(36) }).parse(await req.json());
  await prisma.userSession.update({ where: { id }, data: { status: "REVOKED" } });
  return json({ ok: true });
});
