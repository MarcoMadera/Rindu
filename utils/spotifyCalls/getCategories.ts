import { ACCESS_TOKEN_COOKIE } from "utils/constants";
import { takeCookie } from "utils/cookies";

export async function getCategories(accessToken?: string, cookies?: string) {
  const res = await fetch(
    "https://api.spotify.com/v1/browse/categories?limit=50&offset=0&locale=es_MX",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          accessToken ? accessToken : takeCookie(ACCESS_TOKEN_COOKIE, cookies)
        }`,
      },
    }
  );
  if (res.ok) {
    const data = await res.json();
    return data.categories;
  }
  return null;
}
