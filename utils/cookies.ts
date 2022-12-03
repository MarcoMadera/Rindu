import { isServer } from "./environment";

/**
 * Get the value of the cookie
 * @param cookieName The name of the cookie to get
 * @param cookiesJar must provide if the cookie is from server
 * @returns value of the cookie string
 */
export function takeCookie(
  cookieName: string | undefined,
  cookiesJar?: string | undefined
): string | null {
  const isServerSide = isServer();
  const allCookies = `; ${isServerSide ? cookiesJar || "" : document.cookie}`;
  const parts = allCookies.split(`; ${cookieName || ""}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
}

/**
 * Create a cookie
 * @param {Object} params - The params to create a cookie
 * @param {string} params.name - the name of the cookie to set
 * @param {string} params.value - value
 * @param {number} params.age - the expire time in milliseconds string
 */
export function makeCookie({
  name,
  value,
  age,
}: {
  name: string;
  value: string;
  age: number;
}): void {
  document.cookie = `${name}=${value}; max-age=${age}; Path=/; SameSite=lax; Secure;`;
}

/**
 * Remove a cookie
 * @param cookieName the name of the cookie to remove
 */
export function eatCookie(cookieName: string): void {
  document.cookie = `${cookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax;`;
}
