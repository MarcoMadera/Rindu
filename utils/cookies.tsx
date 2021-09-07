import { __isServer__ } from "./constants";

/**
 * Get the value of the cookie
 * @param cookieName The name of the cookie to get
 * @param cookieJar must provide if the cookie is from server
 * @returns value of the cookie string
 */
export function takeCookie(
  cookieName: string | undefined,
  cookieJar?: string
): string | undefined {
  const allCookies = `; ${__isServer__ ? cookieJar : document.cookie}`;
  const parts = allCookies.split(`; ${cookieName}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift();
  }
  return;
}

/**
 * Create a cookie
 * @param name the name of the cookie to set
 * @param value string value
 * @param age the expire time in miliseconds string
 */
export function makeCookie({
  name,
  value,
  age,
}: {
  name: string;
  value: string;
  age: number;
}): string {
  return `${name}=${value}; max-age=${age}; Path=/;"`;
}

/**
 * Remove a cookie
 * @param cookieName the name of the cookie to remove
 */
export function eatCookie(cookieName: string): void {
  document.cookie = `${cookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax;`;
}
