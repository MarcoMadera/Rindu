import { ACCESS_TOKEN_COOKIE } from "utils/constants";
import { takeCookie } from "utils/cookies";

export async function getSingleCategoryInfo(
  category: string,
  accessToken?: string,
  cookies?: string
): Promise<SpotifyApi.SingleCategoryResponse | null> {
  const res = await fetch(
    `https://api.spotify.com/v1/browse/categories/${category}`,
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
    return data;
  }
  return null;
}
