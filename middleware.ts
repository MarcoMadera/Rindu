import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { takeCookie } from "utils";

export function middleware(request: NextRequest): NextResponse {
  const { nextUrl: url, geo } = request;
  const cookies = request.headers.get("cookie") || "";
  const language = takeCookie("language", cookies);
  if (language) {
    if (language === "es") {
      url.searchParams.set("country", "MX");
    }
    if (language === "en") {
      url.searchParams.set("country", "US");
    }
  } else {
    const country = geo?.country || "US";
    url.searchParams.set("country", country);
  }

  return NextResponse.rewrite(url);
}
