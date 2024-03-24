import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest): NextResponse {
  const { nextUrl: url, geo } = request;
  const language = request.cookies.get("language")?.value;
  const isApiPage = url.pathname.startsWith("/api");

  if (!isApiPage) {
    const country = language === "es" ? "MX" : geo?.country ?? "US";
    url.searchParams.set("country", country);
  }

  return NextResponse.rewrite(url);
}
