import { LOCALE_COOKIE } from "./constants";
import { takeCookie } from "./cookies";
import { isLocale, Locale } from "./locale";
import { ServerApiContext } from "types/serverContext";

export function getValidCookieLocale(context: ServerApiContext): Locale | null {
  const localeCookie = takeCookie(LOCALE_COOKIE, context);
  if (localeCookie && isLocale(localeCookie)) return localeCookie;

  return null;
}
