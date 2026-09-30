import crypto from "crypto";
import { handler, json, limit, ApiError } from "@/lib/api";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export const POST = handler(async (req) => {
  limit(req, "reset-pw-ip", 10, 15 * 60_000);

  const body = await req.json().catch(() => ({}));
  const token = typeof body.token === "string" ? body.token.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!token) {
    throw new ApiError(400, "Password reset token is missing.");
  }

  if (!password || password.length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters long.");
  }

  // Hash incoming raw token to look up in DB
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!record || record.used || record.expiresAt < new Date()) {
    throw new ApiError(400, "This password reset link is invalid or has expired. Please request a new one.");
  }

  if (record.user.status !== "ACTIVE") {
    throw new ApiError(403, "This account is inactive. Please contact support.");
  }

  // Hash new password using bcrypt (12 rounds)
  const newHash = await hashPassword(password);

  // Update password, mark token used, and revoke older sessions for safety
  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { passwordHash: newHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { used: true },
    }),
    prisma.userSession.updateMany({
      where: { userId: record.userId, status: "ACTIVE" },
      data: { status: "REVOKED" },
    }),
  ]);

  return json({
    ok: true,
    message: "Your password has been reset successfully! You can now log in.",
  });
});
