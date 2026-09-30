import { handler, json, limit, ApiError } from "@/lib/api";
import { prisma } from "@/lib/db";
import { createSession, getDummyHash, verifyPassword } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

export const POST = handler(async (req) => {
  limit(req, "login-ip", 20, 15 * 60_000);
  const b = loginSchema.parse(await req.json());
  limit(req, "login-email", 12, 15 * 60_000, b.email);

  const user = await prisma.user.findUnique({ where: { email: b.email } });

  // If user does not exist, use dummy hash to prevent timing attacks
  if (!user) {
    await verifyPassword(b.password, getDummyHash());
    throw new ApiError(401, "Invalid email or password.");
  }

  // Check if account is suspended
  if (user.status !== "ACTIVE") {
    throw new ApiError(403, "This account has been suspended. Please contact support.");
  }

  // Check if account is currently locked
  const now = new Date();
  if (user.lockedUntil && user.lockedUntil > now) {
    const remainingMinutes = Math.ceil((user.lockedUntil.getTime() - now.getTime()) / 60_000);
    throw new ApiError(
      423,
      `Account locked due to 5 consecutive failed login attempts. Please try again in ${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""} or use "Forgot password?" to reset it immediately.`
    );
  }

  const ok = await verifyPassword(b.password, user.passwordHash);

  if (!ok) {
    const newAttempts = (user.failedLoginAttempts || 0) + 1;

    if (newAttempts >= MAX_FAILED_ATTEMPTS) {
      const lockoutUntil = new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000);
      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: newAttempts,
          lockedUntil: lockoutUntil,
        },
      });

      throw new ApiError(
        423,
        `Too many failed login attempts. Your account has been temporarily locked for ${LOCKOUT_MINUTES} minutes for security. You can reset your password to regain access immediately.`
      );
    } else {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: newAttempts,
        },
      });

      const remaining = MAX_FAILED_ATTEMPTS - newAttempts;
      throw new ApiError(
        401,
        `Invalid email or password. ${remaining} attempt${remaining > 1 ? "s" : ""} remaining before temporary account lockout.`
      );
    }
  }

  // Login successful: reset failed counter and clear lockout if any
  if (user.failedLoginAttempts > 0 || user.lockedUntil) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });
  }

  await createSession(user.id, req);
  return json({ ok: true, role: user.role });
});
