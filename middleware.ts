import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  DEFAULT_LOCALE,
  Locale,
  LOCALE_COOKIE,
  parseAcceptLanguage,
} from "utils";

export function middleware(request: NextRequest): NextResponse | void {
  const acceptLanguage = request.headers.get("Accept-Language");
  const userLocales = parseAcceptLanguage(acceptLanguage ?? "");
  const locale =
    userLocales.find((loc) => Object.values(Locale).includes(loc as Locale)) ??
    DEFAULT_LOCALE;

  const localeCookie = request.cookies.get(LOCALE_COOKIE)?.value;
  const localeCookieValue = localeCookie ?? locale;
  if (!localeCookie) {
    // Have to redirect here to ensure cookie is available to root layout
    // issue https://github.com/vercel/next.js/issues/49442
    const response = NextResponse.redirect(request.url);
    response.cookies.set(LOCALE_COOKIE, localeCookieValue);
    return response;
  }
}
