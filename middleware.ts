import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest): NextResponse {
  const { nextUrl: url, geo } = request;
  const country = geo?.country || "MX";

  url.searchParams.set("country", country);

  return NextResponse.rewrite(url);
}
