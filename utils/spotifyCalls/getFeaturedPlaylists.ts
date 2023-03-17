import { ACCESS_TOKEN_COOKIE, takeCookie } from "utils";

export async function getFeaturedPlaylists(
  country: string,
  limit: number,
  accessToken?: string,
  cookies?: string
): Promise<SpotifyApi.ListOfFeaturedPlaylistsResponse | null> {
  const res = await fetch(
    `https://api.spotify.com/v1/browse/featured-playlists?country=${country}&limit=${limit}&market=from_token`,
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
    const data =
      (await res.json()) as SpotifyApi.ListOfFeaturedPlaylistsResponse;
    return data;
  }
  return null;
}
