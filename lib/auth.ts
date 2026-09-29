import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import type { Role } from "@prisma/client";
import { prisma } from "./db";
import { ApiError } from "./api";
import { deviceLabel, getClientIp } from "./request";

export const SESSION_COOKIE = "kbd_session";
const TTL_MS = 7 * 24 * 3600 * 1000;
const MAX_DEVICES = 3; // oldest session is signed out when a 4th device logs in

export type SessionUser = { id: number; name: string; email: string; role: Role };

function secret(): string {
  const s = process.env.NEXTAUTH_SECRET;
  if (!s || s === "CHANGE_ME") {
    if (process.env.NODE_ENV === "production") throw new Error("NEXTAUTH_SECRET is not configured");
    return "dev-only-insecure-secret-change-me";
  }
  return s;
}

function hashToken(token: string) {
  return crypto.createHmac("sha256", secret()).update(token).digest("hex");
}

export const hashPassword = (p: string) => bcrypt.hash(p, 12);
export const verifyPassword = (p: string, hash: string) => bcrypt.compare(p, hash);
// used to keep login timing similar when the email does not exist
let dummyHash: string | null = null;
export function getDummyHash() {
  if (!dummyHash) dummyHash = bcrypt.hashSync("not-a-real-password", 12);
  return dummyHash;
}

export function safeNext(next: string | null | undefined, fallback = "/purchases") {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
  return next;
}

export async function createSession(userId: number, req: Request) {
  const token = crypto.randomBytes(32).toString("base64url");
  const ua = req.headers.get("user-agent") ?? "";
  const now = new Date();
  const expiresAt = new Date(now.getTime() + TTL_MS);

  const active = await prisma.userSession.findMany({
    where: { userId, status: "ACTIVE", expiresAt: { gt: now } },
    orderBy: { lastActiveAt: "desc" },
    select: { id: true },
  });
  const stale = active.slice(MAX_DEVICES - 1);
  if (stale.length) {
    await prisma.userSession.updateMany({
      where: { id: { in: stale.map((s) => s.id) } },
      data: { status: "REVOKED" },
    });
  }

  await prisma.userSession.create({
    data: {
      userId,
      tokenHash: hashToken(token),
      deviceLabel: deviceLabel(ua),
      userAgent: ua.slice(0, 500),
      ip: getClientIp(req.headers).slice(0, 64),
      lastActiveAt: now,
      expiresAt,
    },
  });

  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (token) {
    await prisma.userSession.updateMany({ where: { tokenHash: hashToken(token) }, data: { status: "REVOKED" } });
  }
  cookies().delete(SESSION_COOKIE);
}

export async function getSession(): Promise<{ sessionId: string; user: SessionUser } | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const s = await prisma.userSession.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });
  if (!s || s.status !== "ACTIVE" || s.expiresAt <= new Date() || s.user.status !== "ACTIVE") return null;
  if (Date.now() - s.lastActiveAt.getTime() > 5 * 60_000) {
    prisma.userSession.update({ where: { id: s.id }, data: { lastActiveAt: new Date() } }).catch(() => {});
  }
  return { sessionId: s.id, user: { id: s.user.id, name: s.user.name, email: s.user.email, role: s.user.role } };
}

/** For pages: redirect to login when not signed in. */
export async function requireUser(next = "/purchases") {
  const s = await getSession();
  if (!s) redirect(`/login?next=${encodeURIComponent(next)}`);
  return s;
}

export async function requireAdmin() {
  const s = await getSession();
  if (!s) redirect(`/login?next=${encodeURIComponent("/admin")}`);
  if (s.user.role !== "ADMIN") redirect("/");
  return s;
}

/** For API routes: throw clean JSON errors. */
export async function apiUser() {
  const s = await getSession();
  if (!s) throw new ApiError(401, "Your session has expired. Please log in again.");
  return s.user;
}

export async function apiAdmin() {
  const u = await apiUser();
  if (u.role !== "ADMIN") throw new ApiError(403, "You are not allowed to do this.");
  return u;
}
