import { ACCESS_TOKEN_COOKIE, takeCookie } from "utils";

export async function getMyLikedSongs(
  limit: number,
  accessToken?: string,
  cookies?: string | undefined
): Promise<SpotifyApi.PlaylistTrackResponse | null> {
  const res = await fetch(
    `https://api.spotify.com/v1/me/tracks?limit=${limit}&offset=0&market=from_token`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          accessToken ?? (takeCookie(ACCESS_TOKEN_COOKIE, cookies) || "")
        }`,
      },
    }
  );
  if (res.ok) {
    const data = (await res.json()) as SpotifyApi.PlaylistTrackResponse;
    return data;
  }
  return null;
}
