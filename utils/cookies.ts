import { ServerApiContext } from "types/serverContext";
import { isServer } from "utils";

function getArrCookies(cookies: string[]): Record<string, string> {
  const cookiesObject: Record<string, string> = {};

  cookies.forEach((cookie) => {
    const [key] = cookie.split(";")[0].split("=");
    cookiesObject[key] = cookie;
  });
  return cookiesObject;
}

function getAllServerCookies(context: ServerApiContext) {
  const reqCookies = context.req.cookies;
  const modReqCookies = Object.entries(reqCookies).map(([key, value]) => {
    return `${key}=${value}`;
  });
  const setCookies = context.res.getHeader("Set-Cookie");
  const resCookies =
    setCookies && Array.isArray(setCookies) ? getArrCookies(setCookies) : {};
  const allCookiesObj = Object.assign(modReqCookies, resCookies);

  return Object.values(allCookiesObj);
}

function getExpires(age?: number) {
  const expireCookieDate = new Date();
  const maxAge = age ?? 60 * 60 * 24 * 30;
  expireCookieDate.setTime(expireCookieDate.getTime() + maxAge * 1000);
  return expireCookieDate.toUTCString();
}

const getCookie = (context: ServerApiContext, key: string) => {
  const allCookies = getAllServerCookies(context);
  const cookie = allCookies.find((val) => val.startsWith(`${key}=`));
  if (cookie) {
    const cookieParts = cookie.split(";");
    const cookieValue = cookieParts[0].split("=")[1];
    return cookieValue;
  }
  return null;
};

/**
 * Get the value of the cookie
 * @param cookieName The name of the cookie to get
 * @param context ServerApiContext
 * @returns value of the cookie string
 */
export function takeCookie(
  cookieName: string | undefined,
  context?: ServerApiContext
): string | null {
  if (!cookieName) return null;
  if (context && isServer()) {
    const cookie = getCookie(context, cookieName);
    return cookie;
  } else if (global.document) {
    const allCookies = `; ${document.cookie}`;
    const parts = allCookies.split(`; ${cookieName}=`);
    if (parts.length === 2) {
      const cookiesValue = parts.pop()?.split(";").shift();
      if (!cookiesValue) return null;

      return cookiesValue;
    }
  }
  return null;
}

/**
 * Create a cookie
 * @param {Object} params - The params to create a cookie
 * @param {string} params.name - the name of the cookie to set
 * @param {string} params.value - value
 * @param {number} params.age - the expire time in milliseconds string
 * @param {Object} params.context - ServerApiContext
 */
export function makeCookie({
  name,
  value,
  age,
  context,
}: {
  name: string;
  value: string;
  age?: number;
  context?: ServerApiContext;
}): void {
  const expires = getExpires(age);
  if (context) {
    const setCookies = context.res.getHeader("Set-Cookie");
    const cookies =
      setCookies && Array.isArray(setCookies) ? getArrCookies(setCookies) : {};
    const val = `${name}=${value}; Path=/; expires=${expires}; SameSite=Lax; Secure;`;
    context.res.setHeader("Set-Cookie", [...Object.values(cookies), val]);
  } else {
    document.cookie = `${name}=${value}; Expires=${expires}; Path=/; SameSite=lax; Secure;`;
  }
}

/**
 * Remove a cookie
 * @param cookieName the name of the cookie to remove
 */
export function eatCookie(cookieName: string): void {
  document.cookie = `${cookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax;`;
}
