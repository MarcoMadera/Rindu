import type { NextRequest } from "next/server";
import { NextResponse, userAgentFromString } from "next/server";

import {
  DEFAULT_LOCALE,
  isLocale,
  LOCALE_COOKIE,
  parseAcceptLanguage,
} from "utils";

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request: NextRequest): NextResponse | void {
  const isApiRoute = request.nextUrl.pathname.startsWith("/api");
  const isNextRoute = request.nextUrl.pathname.startsWith("/_next");
  const isPublicFile = PUBLIC_FILE.test(request.nextUrl.pathname);
  const userAgent = request.headers.get("User-Agent");
  if (!userAgent) return;
  const userAgentObject = userAgentFromString(userAgent);

  const ignoreMiddleware = [
    isNextRoute,
    isApiRoute,
    isPublicFile,
    userAgentObject.isBot,
    !userAgentObject.browser.name,
  ];

  if (ignoreMiddleware.some((condition) => condition)) return;

  const acceptLanguage = request.headers.get("Accept-Language");
  const userLocales = parseAcceptLanguage(acceptLanguage ?? "");
  const locale = userLocales.find(isLocale) ?? DEFAULT_LOCALE;

  const localeCookie = request.cookies.get(LOCALE_COOKIE)?.value;
  const localeCookieValue = localeCookie ?? locale;

  if (!localeCookie) {
    const rewriteResponse = NextResponse.rewrite(request.nextUrl, {
      request: {
        headers: new Headers({
          ...request.headers,
          "x-locale": localeCookieValue,
        }),
      },
    });
    rewriteResponse.cookies.set(LOCALE_COOKIE, localeCookieValue);
    return rewriteResponse;
  }
  return NextResponse.next();
}
