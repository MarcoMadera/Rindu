import { ACCESS_TOKEN_COOKIE, takeCookie } from "utils";

export async function getCategories(
  country: string,
  limit?: number,
  accessToken?: string,
  cookies?: string
): Promise<SpotifyApi.PagingObject<SpotifyApi.CategoryObject> | null> {
  const res = await fetch(
    `https://api.spotify.com/v1/browse/categories?country=${country}&limit=${
      limit ?? 5
    }&market=from_token`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          accessToken
            ? accessToken
            : takeCookie(ACCESS_TOKEN_COOKIE, cookies) || ""
        }`,
      },
    }
  );

  if (res.ok) {
    const data = (await res.json()) as SpotifyApi.MultipleCategoriesResponse;
    return data.categories;
  }
  return null;
}
