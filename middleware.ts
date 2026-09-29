import { NextRequest, NextResponse } from "next/server";

const PROTECTED = ["/account", "/purchases", "/admin"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // CSRF defence for cookie-authenticated API calls: state-changing requests must come from our own origin.
  if (pathname.startsWith("/api/") && !["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    const origin = req.headers.get("origin");
    if (origin) {
      let ok = false;
      try {
        ok = new URL(origin).host === req.headers.get("host");
      } catch {
        ok = false;
      }
      if (!ok) return NextResponse.json({ error: "Request blocked." }, { status: 403 });
    } else if (req.headers.get("sec-fetch-site") === "cross-site") {
      return NextResponse.json({ error: "Request blocked." }, { status: 403 });
    }
  }

  // Cheap gate only; every page and API re-checks the session against the database.
  if (PROTECTED.some((p) => pathname === p || pathname.startsWith(p + "/")) && !req.cookies.get("kbd_session")) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/account/:path*", "/purchases/:path*", "/admin/:path*"],
};
