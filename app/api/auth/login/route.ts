import { handler, json, limit, ApiError } from "@/lib/api";
import { prisma } from "@/lib/db";
import { createSession, getDummyHash, verifyPassword } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";

export const POST = handler(async (req) => {
  limit(req, "login-ip", 20, 15 * 60_000);
  const b = loginSchema.parse(await req.json());
  limit(req, "login-email", 8, 15 * 60_000, b.email);
  const user = await prisma.user.findUnique({ where: { email: b.email } });
  const ok = await verifyPassword(b.password, user ? user.passwordHash : getDummyHash());
  if (!user || !ok) throw new ApiError(401, "Invalid email or password.");
  if (user.status !== "ACTIVE") throw new ApiError(403, "This account has been suspended. Please contact support.");
  await createSession(user.id, req);
  return json({ ok: true, role: user.role });
});
