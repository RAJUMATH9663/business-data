import { handler, json, limit, ApiError } from "@/lib/api";
import { prisma } from "@/lib/db";
import { createSession, hashPassword } from "@/lib/auth";
import { registerSchema } from "@/lib/validators";

export const POST = handler(async (req) => {
  limit(req, "register", 8, 60 * 60_000);
  const b = registerSchema.parse(await req.json());
  const exists = await prisma.user.findUnique({ where: { email: b.email }, select: { id: true } });
  if (exists) throw new ApiError(409, "An account with this email already exists. Please log in.");
  const user = await prisma.user.create({
    data: { name: b.name, email: b.email, phone: b.phone || null, passwordHash: await hashPassword(b.password) },
  });
  await createSession(user.id, req);
  return json({ ok: true, role: user.role });
});
