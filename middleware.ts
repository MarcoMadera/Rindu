import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { DEFAULT_LOCALE } from "utils";

export function middleware(request: NextRequest): NextResponse {
  const { nextUrl: url } = request;

  const nextLocale = request.cookies.get("NEXT_LOCALE")?.value;
  const isApiPage = url.pathname.startsWith("/api");

  if (!isApiPage) {
    url.searchParams.set("locale", nextLocale ?? DEFAULT_LOCALE);
  }

  return NextResponse.rewrite(url);
}
