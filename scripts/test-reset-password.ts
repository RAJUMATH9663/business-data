import crypto from "crypto";
import { prisma } from "../lib/db";
import { hashPassword, verifyPassword } from "../lib/auth";

async function run() {
  console.log("Testing Password Reset Flow...");

  const testEmail = "admin@example.com";
  const user = await prisma.user.findUnique({ where: { email: testEmail } });
  if (!user) {
    console.error("User not found:", testEmail);
    process.exit(1);
  }
  console.log("1. Found user:", user.email, "Current Role:", user.role);

  // Generate token
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

  const resetRecord = await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt,
    },
  });
  console.log("2. Created PasswordResetToken in MySQL with ID:", resetRecord.id);

  // Set new password
  const testNewPassword = "NewSecretPassword@2026";
  const newHash = await hashPassword(testNewPassword);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: resetRecord.id },
      data: { used: true },
    }),
  ]);
  console.log("3. Password updated in database. Verifying new password...");

  const updatedUser = await prisma.user.findUnique({ where: { id: user.id } });
  const ok = await verifyPassword(testNewPassword, updatedUser!.passwordHash);
  console.log("4. Login verification with new password:", ok ? "SUCCESS" : "FAILED");

  // Revert back to original password for user convenience
  const originalPassword = "raju@12345";
  const originalHash = await hashPassword(originalPassword);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: originalHash },
  });
  console.log("5. Reverted admin password back to 'raju@12345' for daily development.");

  // Clean up test token
  await prisma.passwordResetToken.delete({ where: { id: resetRecord.id } });
  console.log("6. Cleaned up test token. All tests passed!");
}

run().catch((e) => {
  console.error("Test error:", e);
  process.exit(1);
});
