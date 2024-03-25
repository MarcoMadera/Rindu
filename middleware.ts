import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  DEFAULT_LOCALE,
  Locale,
  LOCALE_COOKIE,
  parseAcceptLanguage,
} from "utils";

export function middleware(request: NextRequest): NextResponse {
  const acceptLanguage = request.headers.get("Accept-Language");
  const userLocales = parseAcceptLanguage(acceptLanguage ?? "");
  const locale =
    userLocales.find((loc) => Object.values(Locale).includes(loc as Locale)) ??
    DEFAULT_LOCALE;
  const response = NextResponse.next();

  const localeCookie = request.cookies.get(LOCALE_COOKIE)?.value;
  response.cookies.set(LOCALE_COOKIE, localeCookie ?? locale, {
    secure: process.env.NODE_ENV !== "development",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });

  return response;
}
