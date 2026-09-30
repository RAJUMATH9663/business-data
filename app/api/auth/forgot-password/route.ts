import crypto from "crypto";
import { handler, json, limit, ApiError } from "@/lib/api";
import { prisma } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";

export const POST = handler(async (req) => {
  limit(req, "forgot-pw-ip", 10, 15 * 60_000);

  const body = await req.json().catch(() => ({}));
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!email || !email.includes("@")) {
    throw new ApiError(400, "Please provide a valid email address.");
  }

  limit(req, "forgot-pw-email", 5, 15 * 60_000, email);

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, name: true, status: true },
  });

  let resetUrl: string | undefined;
  let emailSent = false;

  if (user && user.status === "ACTIVE") {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes validity

    // Invalidate existing unused tokens for this user
    await prisma.passwordResetToken.updateMany({
      where: { userId: user.id, used: false },
      data: { used: true },
    });

    // Save token in MySQL
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    resetUrl = `${baseUrl}/reset-password?token=${rawToken}`;

    // Try sending email if SMTP is configured
    emailSent = await sendPasswordResetEmail({
      to: user.email,
      userName: user.name,
      resetUrl,
    });

    // Log to terminal for easy testing
    console.log(`\n================ PASSWORD RESET LINK ================`);
    console.log(`User: ${user.email} (${user.name})`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log(`Email Sent: ${emailSent ? "YES (Dispatched to inbox)" : "NO (SMTP not configured in .env)"}`);
    console.log(`Valid for 30 minutes.`);
    console.log(`=====================================================\n`);
  }

  return json({
    ok: true,
    message: emailSent
      ? "A password reset link has been dispatched to your email address."
      : "If an account exists with this email address, password reset instructions have been generated.",
    emailSent,
    userExists: Boolean(user && user.status === "ACTIVE"),
    resetUrl: process.env.NODE_ENV !== "production" ? resetUrl : undefined,
  });
});
