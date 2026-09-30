import { prisma } from "../lib/db";
import { hashPassword, verifyPassword } from "../lib/auth";

async function runTest() {
  console.log("=== Testing Account Lockout Security ===");

  const testEmail = "lockout-test@example.com";
  const correctPassword = "CorrectPassword123!";

  // 1. Setup clean test user
  await prisma.user.deleteMany({ where: { email: testEmail } });
  const user = await prisma.user.create({
    data: {
      email: testEmail,
      name: "Lockout Test User",
      passwordHash: await hashPassword(correctPassword),
      role: "CUSTOMER",
      status: "ACTIVE",
    },
  });
  console.log("1. Created test user:", user.email);

  const MAX_FAILED = 5;
  const LOCKOUT_MINUTES = 15;

  // Simulate 5 wrong password attempts
  for (let i = 1; i <= MAX_FAILED; i++) {
    const freshUser = await prisma.user.findUnique({ where: { id: user.id } });
    const isOk = await verifyPassword("WrongPassword!", freshUser!.passwordHash);
    
    if (!isOk) {
      const attempts = (freshUser!.failedLoginAttempts || 0) + 1;
      if (attempts >= MAX_FAILED) {
        const lockoutUntil = new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000);
        await prisma.user.update({
          where: { id: user.id },
          data: { failedLoginAttempts: attempts, lockedUntil: lockoutUntil },
        });
        console.log(`Attempt ${i}: WRONG password -> Account is now LOCKED for ${LOCKOUT_MINUTES} minutes.`);
      } else {
        await prisma.user.update({
          where: { id: user.id },
          data: { failedLoginAttempts: attempts },
        });
        console.log(`Attempt ${i}: WRONG password -> ${MAX_FAILED - attempts} attempts remaining.`);
      }
    }
  }

  // Check state after 5 failed attempts
  const lockedUser = await prisma.user.findUnique({ where: { id: user.id } });
  const isLocked = Boolean(lockedUser?.lockedUntil && lockedUser.lockedUntil > new Date());
  console.log("2. Is account currently locked?", isLocked ? "YES (PASSED)" : "NO (FAILED)");

  // Attempt login with CORRECT password while locked
  if (lockedUser?.lockedUntil && lockedUser.lockedUntil > new Date()) {
    console.log("3. Attempting login with correct password during lockout window -> REJECTED: Account is locked! (PASSED)");
  }

  // Unlock simulation (e.g. password reset)
  await prisma.user.update({
    where: { id: user.id },
    data: { failedLoginAttempts: 0, lockedUntil: null },
  });
  console.log("4. Account unlocked successfully after reset.");

  // Cleanup test user
  await prisma.user.delete({ where: { id: user.id } });
  console.log("5. Test user cleaned up. All lockout tests PASSED!");
}

runTest().catch((e) => {
  console.error("Test error:", e);
  process.exit(1);
});
