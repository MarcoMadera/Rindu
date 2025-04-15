import { LOCALE_COOKIE } from "./constants";
import { takeCookie } from "./cookies";
import { isLocale, Locale } from "./locale";
import { ServerApiContext } from "types/serverContext";

export function getValidCookieLocale(context: ServerApiContext): Locale | null {
  const localeHeader = context.req.headers["x-locale"]?.toString();
  const localeCookieValue = takeCookie(LOCALE_COOKIE, context);
  const localeCookie = localeCookieValue ?? localeHeader;
  if (localeCookie && isLocale(localeCookie)) return localeCookie;

  return null;
}
