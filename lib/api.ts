import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { rateLimit } from "./ratelimit";
import { getClientIp } from "./request";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const json = (data: unknown, status = 200) => NextResponse.json(data, { status });

export function limit(req: NextRequest | Request, name: string, max: number, windowMs: number, key?: string) {
  const id = key ?? getClientIp(req.headers);
  const r = rateLimit(`${name}:${id}`, max, windowMs);
  if (!r.ok) throw new ApiError(429, `Too many requests. Please try again in ${r.retryAfter} seconds.`);
}

export function isUniqueError(e: unknown) {
  return e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Ctx = { params: any };

/** Wraps a route handler: never leaks stack traces, maps known errors to clean JSON. */
export function handler(fn: (req: NextRequest, ctx: Ctx) => Promise<Response>) {
  return async (req: NextRequest, ctx: Ctx): Promise<Response> => {
    try {
      return await fn(req, ctx);
    } catch (e) {
      if (e instanceof ApiError) return json({ error: e.message }, e.status);
      if (e instanceof ZodError) return json({ error: e.issues[0]?.message ?? "Invalid input" }, 400);
      if (e instanceof SyntaxError) return json({ error: "Invalid request" }, 400);
      if (e instanceof Prisma.PrismaClientInitializationError) {
        console.error(e);
        return json({ error: "Service temporarily unavailable. Please try again shortly." }, 503);
      }
      console.error(e);
      return json({ error: "Something went wrong. Please try again." }, 500);
    }
  };
}
