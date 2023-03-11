import { ACCESS_TOKEN_COOKIE, takeCookie } from "utils";

export default async function getCategoryPlaylists(
  category: string,
  country?: string,
  accessToken?: string,
  cookies?: string
): Promise<SpotifyApi.CategoryPlaylistsResponse | null> {
  const res = await fetch(
    `https://api.spotify.com/v1/browse/categories/${category}/playlists?country=${
      country ?? "US"
    }`,
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
    const data = (await res.json()) as SpotifyApi.CategoryPlaylistsResponse;
    return data;
  }
  return null;
}
